pragma solidity ^0.4.0;
/**
 * the data object contain detail 
 */
contract DataObject{
    /**
     * The type contain level1, level2 and address
     */
    struct DataType{
        bytes32 type_level1;
        bytes32 type_level2;
        address type_address;
    }
    
    //The type detail array
    DataType[] public dataTypes;
    
    //The type number
    uint public typeNum;
    
    //The data name(unique)
    bytes32 public dataName;
    
    string public introduction;
    
    address public provider;
    
    address dataAuth;
    
    /**
     *  init the data object
     */
    function DataObject(bytes32 daNa, string intro, address pro, address dAuth){
        dataName = daNa;
        introduction = intro;
        provider = pro;
        dataAuth = dAuth;
    }
    
    /**
     * set the data type
     */
    function setDataType(bytes32 t1, bytes32 t2, address td){
        //only the management contract can use this function
        if(msg.sender != dataAuth) return;
        //check if type exist
        for(uint i = 0; i < typeNum; i++){
            if(dataTypes[i].type_level1 == t1 && dataTypes[i].type_level2 == t2){
                return;
            }
        }
        //if not exist, push in type array
        dataTypes.push(DataType(t1,t2,td));
        typeNum++;
    }
}

/**
 * The type object storage the related dataset
 */
contract TypeObject{
    bytes32 public typeName;
    address[] public dataSets;
    uint public dataNum;
    
    address creator;
    
    function TypeObject(bytes32 tyNa){
        typeName = tyNa;
        creator = msg.sender;
    }
    
    /**
     * add data set
     */
    function addDataSet(address dataSet){
        if(msg.sender != creator) return;
        
        //check if the address exist
        for(uint i = 0; i < dataNum; i++){
            if(dataSet == dataSets[i]){
                return;
            }
        }
        dataSets.push(dataSet);
        dataNum++;
    }
}

/**
 * management the types
 */
contract TypeManagement{
    address nullAddress;
    address creator;
    
    //Save the types of type_level1=>type_level2=>type_object
    mapping(bytes32 => mapping(bytes32 => address)) public types;
    
    function TypeManagement(){
        creator = msg.sender;
    }
    
    //add the type
    function addType(bytes32 type_level1, bytes32 type_level2){
        if(!isTypeExist(type_level1, type_level2)){
            types[type_level1][type_level2] = new TypeObject(type_level2);
        }
    }
    
    //if the type exist, return ture, else return false
    function isTypeExist(bytes32 type_level1, bytes32 type_level2) returns(bool){
        return types[type_level1][type_level2]!=nullAddress;
    }
    
    //add data to type
    function addDataToType(bytes32 type_level1, bytes32 type_level2, address dataAddress){
        if(msg.sender != creator) return;
        //if the type not exsit, create it
        if(!isTypeExist(type_level1, type_level2)){
            addType(type_level1, type_level2);
        }
        //get the type object
        TypeObject typeObject = (TypeObject)(types[type_level1][type_level2]);
        //add to type
        typeObject.addDataSet(dataAddress);
    }
}

/**
 * register the dataset and storage the all data list
 */
contract DataRegister{
    address initAddress;
    //storage the data name set
    mapping(bytes32 => address) public dataSets;
    //storage the data name set
    bytes32[] public dataNames;
    uint public dataNum;
    
    address creator;
    
    function DataRegister(){
        creator = msg.sender;
    }
    
    //Auth verification
    modifier checkAuth(){
        if(msg.sender != creator) return;
        _;
    }
    /**
     * register data, return the new data object address
     */
    function addData(bytes32 daNa, string intro, address provider) checkAuth() returns(address){
        //if not exist
        if(dataSets[daNa] == initAddress){
            dataSets[daNa] = new DataObject(daNa, intro, provider, msg.sender);
            dataNames.push(daNa);
            dataNum++;
            return dataSets[daNa];
        }
        return initAddress;
    }
    
    /**
     * check if the dataName is exist, if exist, return true, else return false
     */
    function isDataNameExist(bytes32 dataName) returns(bool){
        return dataSets[dataName] != initAddress;
    }
    
    /**
     * Get the data by index(start at 0)
     */
    function getDataByIndex(uint index) returns(address){
        if(index >= dataNum) return initAddress;
        return dataSets[dataNames[index]];
    }
}

/**
 * Record the data permission list of requester
 */
contract DataAccessObject{
    enum accessType{Init, Pending, Reject, Confirm}
    
    //storage the request => permission
    mapping(address => accessType) public accessList;
    address[] public requesterList;
    uint public requesterNum;
    accessType initAccessType;
    
    //The data owner
    address public provider;
    //Only management contract can edit
    address dataManagement;
    
    function DataAccessObject(address pro, address dataM){
        provider = pro;
        dataManagement = dataM;
    }
    
    modifier isDataManagement(){
        if(msg.sender != dataManagement) return;
        _;
    }
    
    /**
     * Check if the request in list
     */
    function isRequestExist(address requester) returns(bool){
         return accessList[requester] != initAccessType;
     }
     
     /**
      * Check if the request is confirm
      */
      function isRequestConfirm(address requester) returns(bool){
          return accessList[requester] == accessType.Confirm;
      }
      /**
      * Check if the request is reject
      */
      function isRequestReject(address requester) returns(bool){
          return accessList[requester] == accessType.Reject;
      }
      
    /**
     * Add request to list
     */
    function addRequest(address requester) isDataManagement returns(bool){
        //if exist, won't edit
        if(isRequestExist(requester)) return false;
        accessList[requester] = accessType.Pending;
        //add to requester list
        requesterList.push(requester);
        requesterNum++;
        return true;
    }
    
    /**
     * Confirm the request
     */
    function confirmRequest(address requester) isDataManagement returns(bool){
        //if not exist, return
        if(!isRequestExist(requester)) return false;
        accessList[requester] = accessType.Confirm;
        return true;
    }
    
    /**
     * Reject the request
     */
    function rejectRequest(address requester) isDataManagement returns(bool){
         //if not exist, return
        if(!isRequestExist(requester)) return false;
        accessList[requester] = accessType.Reject;
        return true;
    }
}

/**
 * Access Management Contract
 */
contract AccessManagement{
   //Storage the list of data name to access object
   mapping(bytes32 => address) public dataAccessList;
   //Storage the provider to data name list
   mapping(address => bytes32[]) public provideDataList;
   //Storage the provider to data number
   mapping(address => uint) public provideNum;
   
   //Storage the requester to data name list
   mapping(address => bytes32[]) public requestDataList;
   //Storage the requester to data number
   mapping(address => uint) public requestNum;
   
   address initAddress;
   
   /**
    * Return true if the data access object already exist
    */
    function isDataAccessExist(bytes32 dataName) returns(bool){
        return dataAccessList[dataName]!=initAddress;
    }
    
    /**
     * Check if the data name exist in request list
     */
    function isRequestDataNameExist(address requester, bytes32 daNa) returns(bool){
        //search the list
        for(uint i = 0; i < requestNum[requester]; i++){
            if(requestDataList[requester][i] == daNa) return true;
        }
        return false;
    }
   /**
    * Create data access object
    */
    function createDataAccess(bytes32 dataName, address provider) returns(bool){
        if(isDataAccessExist(dataName)) return false;
        //create the data access object
        dataAccessList[dataName] = new DataAccessObject(provider, msg.sender);
        provideDataList[provider].push(dataName);
        provideNum[provider]++;
        return true;
    }
    
    /**
     * Add data name to reqeust list
     */
     function requestDataAccess(bytes32 dataName, address requester) returns(bool){
         //if teh data name exist in request list
         if(isRequestDataNameExist(requester, dataName)) return false;
         requestDataList[requester].push(dataName);
         requestNum[requester]++;
         return true;
     }
}
/**
 * Save the nickname of user address
 */
contract UserRegister{
    address initAddress;
    bytes32 initBytes32;
    
    //storage the relationship between address to name
    mapping(address => bytes32) public addressToName;
    mapping(bytes32 => address) public nameToAddress;
    
    /**
     * add user to list, if success, return true, else return false
     */
    function addUser(address userAddress, bytes32 userName) returns(bool){
        //if the name and address are not set, add to the list
        if(nameToAddress[userName] == initAddress && addressToName[userAddress] == initBytes32){
            nameToAddress[userName] = userAddress;
            addressToName[userAddress] = userName;
            return true;
        }
        return false;
    }
    
    /**
     * if the name has be used, return ture, else return false
     */
     function isNameExist(bytes32 name) returns(bool){
         return nameToAddress[name] != initAddress;
     }
     
     /**
      * if the address has be used, return ture, else return false
      */
     function isAddressExist(address adr) returns(bool){
         return addressToName[adr] != initBytes32;
     }
}

contract DataShareManagement{
    UserRegister userRegister;
    DataRegister dataRegister;
    TypeManagement typeManagement;
    AccessManagement accessManagement;
    address initAddress;
    
    function DataShareManagement(){
        userRegister = new UserRegister();
        dataRegister = new DataRegister();
        typeManagement = new TypeManagement();
        accessManagement = new AccessManagement();
    }
    
    //User related function
    /**
     * register user, if success, return true, else return false
     */
    function registerUser(bytes32 userName) returns(bool){
        return userRegister.addUser(msg.sender, userName);
    }
     /**
     * if the name has be used, return ture, else return false
     */
    function isUserNameExist(bytes32 userName) returns(bool){
        return userRegister.isNameExist(userName);
    }
    /**
      * if the address has be used, return ture, else return false
      */
     function isUserAddressExist(address adr) returns(bool){
         return userRegister.isAddressExist(adr);
     }
     
     /**
      * Get the user name by address
      */
     function getUserNameByAddress(address adr) returns(bytes32){
         return userRegister.addressToName(adr);
     }
     
     /**
      * Get the user address by name
      */
     function getUserAddressByName(bytes32 userName) returns(address){
         return userRegister.nameToAddress(userName);
     }
     
     //Data regeister relate
     /**
      * create data and return the data object address
      */
     function createData(bytes32 daNa, string intro) returns(address){
         //create data object
         address dataObject = dataRegister.addData(daNa, intro, msg.sender);
         if(dataObject == initAddress) return;
         //init the access control
         accessManagement.createDataAccess(daNa, msg.sender);
         //return the dsata address
         return dataObject;
     }
     
     /**
      * check if the data name exist, if exist, return true, else return false
      */
     function isDataNameExist(bytes32 daNa) returns(bool){
         return dataRegister.isDataNameExist(daNa);
     }
     
     /**
      * add type to data
      */
     function addTypeToData(bytes32 type_level1, bytes32 type_level2, bytes32 dataName){
          DataObject dataObject = (DataObject)(dataRegister.dataSets(dataName));
          //check if the sender is the data provider
          if(msg.sender != dataObject.provider()){
              return;
          }
          //add data to type
          typeManagement.addDataToType(type_level1, type_level2, dataObject);
          //add type to data
          dataObject.setDataType(type_level1, type_level2, typeManagement.types(type_level1,type_level2));
     }
     
     //Data Search relate
     /**
      * Return the number of all data
      */
      function getDataNum() returns(uint){
          return dataRegister.dataNum();
      }
      
      /**
       * Return the data object by index
       */
      function getDataAddressByIndex(uint index) returns(address){
          if(index >= getDataNum()) return;
          return dataRegister.getDataByIndex(index);
      }
      
      /**
       * Get the data address by name
       */
      function getDataAddressByDataName(bytes32 dataName) returns(address){
          return dataRegister.dataSets(dataName);
      }
      
      /**
       * Get data name by index
       */
       function getDataNameByIndex(uint index) returns(bytes32){
           if(index >= getDataNum()) return;
           return dataRegister.dataNames(index);
       }
       
       /**
        * Get type address by type_level1, type_level2
        */
        function getTypeAddressByName(bytes32 type_level1, bytes32 type_level2)returns(address){
            return typeManagement.types(type_level1, type_level2);
        }
        
        /**
         * Return the type is exist or not
         */
         function isTypeExist(bytes32 type_level1, bytes32 type_level2)returns(bool){
             return typeManagement.isTypeExist(type_level1, type_level2);
         }
         
         //Access Control relate functions
         /**
          * Return the data access object
          */
          function getDataAccessByName(bytes32 dataName) returns(address){
              return accessManagement.dataAccessList(dataName);
          }
          /**
           * Get the provider data number by provider address
           */
          function getDataNumByProvider(address provider) returns(uint){
              return accessManagement.provideNum(provider);
          }
          
          /**
           * Get the provide data name by index
           */
          function getProvideDataNameByIndex(address provider, uint index) returns(bytes32){
              return accessManagement.provideDataList(provider,index);
          }
          
          /**
           * Get the request data number by provider 
           */
          function getDataNumByRequester(address requester) returns(uint){
              return accessManagement.requestNum(requester);
          }
          /**
           * Get the request data name by index
           */
          function getRequestDataNameByIndex(address requester, uint index) returns(bytes32){
              return accessManagement.requestDataList(requester, index);
          }
          
          /**
           * Request the data by name
           */
          function requestData(bytes32 dataName) returns(bool){
              if(!isDataNameExist(dataName)) return false;
              //Add to request data list
              accessManagement.requestDataAccess(dataName, msg.sender);
              DataAccessObject accessObject = (DataAccessObject)(getDataAccessByName(dataName));
              if(accessObject.addRequest(msg.sender)) return true;
              else return false;
          }
          
          /**
           * Reject the data by name
           */
          function rejectData(bytes32 dataName, address requester) returns(bool){
              if(!isDataNameExist(dataName)) return false;
              DataAccessObject accessObject = (DataAccessObject)(getDataAccessByName(dataName));
              //if the sender not the data provider
              if(msg.sender != accessObject.provider()) return false;
              return accessObject.rejectRequest(requester);
              
          }
          /**
           * Confirm the data by name
           */
          function confirmData(bytes32 dataName, address requester) returns(bool){
              if(!isDataNameExist(dataName)) return false;
              DataAccessObject accessObject = (DataAccessObject)(getDataAccessByName(dataName));
              //if the sender not the data provider
              if(msg.sender != accessObject.provider()) return false;
              return accessObject.confirmRequest(requester);
          }
          
}

