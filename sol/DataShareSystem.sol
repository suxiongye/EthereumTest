pragma solidity 0.4.10;

contract DataShareSystem{
    
    //注册合约地址
    DataRegister public drc;
    
    //一级Type合约地址
    DataType1 public dt1;
    
    //请求合约地址
    Request public req;
    
    //数据请求合约(数据提供者维护)地址
    address public DRAddress;
    
    //数据详情合约地址
    address public DPAddress;
    
    //请求者=>请求者合约地址
    mapping(address => address) public req_reqAddr;
    
    
    address[] public requester;
    
   
    modifier onlyOwner(bytes32 dataName){
        if(msg.sender != drc.getProvider(dataName)) throw;
        _;
    }
    
    
    function DataShareSystem(){
        drc = new DataRegister();
        dt1 = new DataType1();
    
    }
    
    /** 注册新数据 */
    function dataRegister(bytes32 dataName,bytes32 introductionName,string introductionValue,bytes32 level1,bytes32 level2){
        
        drc.register(dataName,introductionName,introductionValue,msg.sender);
        dt1.addType(dataName,level1,level2);
        DPAddress = drc.getDPAddress(dataName); 
        
    }
    
    /** 数据提供者添加新请求者 */
    function addNewRequester(bytes32 dataName,address requesterAddress) onlyOwner(dataName){
        DRAddress = drc.getDRAddress(dataName);
        DataRequester drec = DataRequester(DRAddress);
        drec.addRequester(requesterAddress);
        
    }
    
    /** 数据提供者像请求者授权 */
    function changeAccess(bytes32 dataName,address requesterAddress,uint index) onlyOwner(dataName){
        address DRAddress = drc.getDRAddress(dataName);
        DataRequester drec = DataRequester(DRAddress);
        drec.setAuthority(requesterAddress,index);
        
        req = Request(req_reqAddr[requesterAddress]);
        req.changeStatus(dataName,index);
        
    }
    
    /** 充值 */
    function Recharge(uint amount) payable returns(bool flag){
        if(!msg.sender.send(amount)) throw;
        flag = true;
        
    }
    
    /** 修改数据介绍 */
    function modifyIntroduction(bytes32 dataName,bytes32 introName,string introValue) onlyOwner(dataName) {
        address DataProfileAddress = drc.getDPAddress(dataName);
        DataProfile dp = DataProfile(DataProfileAddress);
        dp.updateIntroduction(introName,introValue);
    }
    
   
    
    /** 请求数据 */
    function requestData(bytes32 dataName){
         if(requester.length == 0){
             req = new Request(msg.sender,dataName,drc);
             req_reqAddr[msg.sender] = req;
             req.request(dataName);
             requester.push(msg.sender);
             return;
        }

        for(uint i = 0 ; i < requester.length ; i++){
            if(msg.sender == requester[i]){
                req = Request(req_reqAddr[msg.sender]);
                req.request(dataName);
                return;
            }
        }
        req = new Request(msg.sender,dataName,drc);
        req_reqAddr[msg.sender] = req;
        req.request(dataName);
        requester.push(msg.sender);
//        requester_requestList[msg.sender] = req;
//        requester.push(msg.sender);
    }


}



contract DataRegister{

   /**
    * 数据注册合约
    *
    *
    */

   //数据 => 提供者地址
   mapping(bytes32 => address) public data_provide;

   mapping(bytes32 => address) public DPAddress;

   mapping(bytes32 => address) public DRAddress;
   //mapping(bytes32 => address) public DTAddress;
   //mapping(bytes32 => mapping(address => address)) public DAAddress;

   bytes32[] public dataNameArray;
   uint public dnaLength;


   bool isExist = false;


   /** 注册 */
   function register(bytes32 dataName,bytes32 introductionName,string introductionValue,address provider){
       data_provide[dataName] = provider;
       DataProfile dataProfile = new DataProfile(dataName);
       DPAddress[dataName] = dataProfile;
       dataProfile.addIntroduction(introductionName,introductionValue);
       if (dataNameArray.length == 0){
           dataNameArray.push(dataName);
           dnaLength = dataNameArray.length;
       } else {
           for (uint i=0;i<dataNameArray.length;i++){
               if(dataNameArray[i] == dataName){
                   isExist = true;
                   break;
               }
           }

           if(isExist == false){

           dataNameArray.push(dataName);
           dnaLength = dataNameArray.length;
           }
       }


       DataRequester dataRequester = new DataRequester(dataName);
       DRAddress[dataName] = dataRequester;


   }

   function getDRAddress(bytes32 dataName) returns(address drec){
       drec = DRAddress[dataName];
   }

   function getDPAddress(bytes32 dataName) returns(address dp){
       dp = DPAddress[dataName];
   }

   function getProvider(bytes32 dataName) returns(address providerAddr){
       providerAddr = data_provide[dataName];
   }



}

contract DataProfile  {

   /**
    * 数据详情合约
    * 数据详情的增删改查
    *
    */

    mapping(bytes32 => string) public introductions;
    bytes32[] public introName;
    uint public introNameLength;
    DataRegister dr;
    bytes32 dataName;



    function DataProfile(bytes32 name){
        dr = DataRegister(msg.sender);
        dataName = name;

    }



    function addIntroduction(bytes32 introductionName,string introductionValue){
        introductions[introductionName] = introductionValue;
        introName.push(introductionName);
        introNameLength = introName.length;
    }

    function getIntroduction(bytes32 introductionName) returns(string introValue){
        introValue = introductions[introductionName];
    }

    function updateIntroduction(bytes32 introductionName,string introductionValue) {
        introductions[introductionName] = introductionValue;
    }

    function deleteIntroduction(bytes32 introductionName)  {
    	if(introName.length ==0) throw;

        for(uint i=0;i<introName.length;i++){
            if(introName[i] == introductionName){
                for(uint j=i;j<introName.length;j++){
                    introName[j] = introName[j+1];
                    delete introName[introName.length-1];
                    delete introductions[introductionName];
                    introNameLength = introName.length;
                    return;
                }
            }
            throw;
        }
    }

}

contract DataRequester  {

   /**
    * 数据请求者合约
    * 数据提供者对请求者的相关操作
    *
    */
   enum AuthorityType {Nothing,OnlyRead,Download}
   AuthorityType constant defaultAuthorityType = AuthorityType.Nothing;


   mapping(address => uint) public dataRequester;
   DataRegister public dr;
   address public providerAddress;
   bytes32 public dataName;

   function DataRequester(bytes32 name){
       dr = DataRegister(msg.sender);
       providerAddress = dr.getProvider(name);
       dataName = name;
   }



   function addRequester(address requester)  {
       dataRequester[requester] = 0;
   }

   function setAuthority(address requester,uint index)  {
      dataRequester[requester] = index;
   }

}

contract DataType1 {

    /**
     * 数据一级Type合约
     * 数据Type相关操作
     *
     */
    bytes32[] public type1;
    bytes32[] public type2;

    DataType2 public dt2;



    mapping(bytes32 => mapping(bytes32 => address)) public DT2Address;

    function addType(bytes32 dataName,bytes32 level1,bytes32 level2){
    	if(type1.length == 0){
            type1.push(level1);
            dt2 = new DataType2();
            DT2Address[level1][level2] = dt2;
            dt2.addType2(level2,dataName);
            return;
        }

        for(uint i = 0;i < type1.length;i++){
            if(type1[i] == level1){
            	if(type2.length == 0){
                    dt2 = new DataType2();
                    dt2.addType2(level2,dataName);
                    DT2Address[level1][level2] = dt2;
                    type2.push(level2);
                    return;
                }

                for(uint j = 0 ; j < type2.length ; j++){
                    if(type2[j] == level2){
                    dt2 = DataType2(DT2Address[level1][level2]);
                    dt2.addType2(level2,dataName);
                    return;
                    }
                }
            dt2 = new DataType2();
            dt2.addType2(level2,dataName);
            DT2Address[level1][level2] = dt2;
            type2.push(level2);
            return;
            }
        }
        type1.push(level1);
        dt2 = new DataType2();
        DT2Address[level1][level2] = dt2;
        dt2.addType2(level2,dataName);
    }



}

contract DataType2 {


    bytes32[] public dataSet;
    mapping(bytes32 => bytes32[]) public DT2_Data;

    function addType2(bytes32 level2,bytes32 dataName){
       dataSet.push(dataName);
       DT2_Data[level2] = dataSet;

    }



}

contract Request{

    /**
     * 数据请求合约
     *
     *
     */
    mapping(bytes32 => uint) public requestStatus;
    bytes32[] public data;
    uint public dataLength;

    address requester;
    bytes32 dataName;
    DataRegister dr;

    function Request(address request,bytes32 name,address drec){
        dr = DataRegister(drec);
        requester = request;
        dataName = name;
    }



    function request(bytes32 dataName){
    	 if(data.length == 0){
            requestStatus[dataName] = 0;
            data.push(dataName);
            dataLength = data.length;
            return;
         }

        for(uint i = 0 ; i < data.length ; i++){
            if(data[i] == dataName) throw;
        }
        requestStatus[dataName] = 0;
        data.push(dataName);
        dataLength = data.length;
    }
    
    
    function changeStatus(bytes32 dataName,uint index)  {
        requestStatus[dataName] = index;
    }
    
    
    
}




