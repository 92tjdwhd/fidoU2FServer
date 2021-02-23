const  RESULT_OK = {status:1200,msg:"Operation completed"}
const  BAD_REQUEST = {status:1400,msg:"The server did not understand the message"};
const  NOT_FOUND = {status:1404,msg:"Not Found"};
const  REGISTER_FAILDED = {status:1405,msg:"Registration failed for an unknown reason."};
const  AUTHENTICATION_FAILDED = {status:1406,msg:"Authentication failed for an unknown reason."};
const  DELETEREGISTER_FAILDED = {status:1407,msg:"DeleteRegister failed for an unknown reason."};
const  CREATE_FAILDED = {status:1408,msg:"Create failed for an unknown reason."};

const  NOT_REGISTERED_ADMIN = {status:1410,msg:"Not Registered Admin"}
const  NOT_REGISTERED_EDIT_ADMIN = {status:1411,msg:"Not Registered EditAdmin"}

const  INCORRECT_PASSWORD = {status:1420,msg:"The password is incorrect."}
const  ACCOUNT_LOCKOUT = {status:1421,msg:"Lock your account with more than the number of times"}

const  ERROR_LICENSE = {status:1450,msg:"License Error"};
const  EXPIRED_LICENSE = {status:1451,msg:"expired License "};
const  NOT_BEFORE_LICENSE_ERROR = {status:1452,msg:"No active license"};
const  UNAVAILABLE_LICENSE = {status:1453,msg:"Unavailable license."};
const  No_LICENSE = {status:1454,msg:"Not to exist license."};

const  ERROR_TOKEN = {status:1460,msg:"JsonWebTokenError"};
const  NO_PERMISSION = {status:1461,msg:"You are not allowed to access this page"}
const  INVALID_PASSWORD = {status:1463,msg:"Invalid password."}
const  EXPIRED_TOKEN = {status:1464,msg:"expired Token "};
const  NOT_BEFORE_ERROR = {status:1465,msg:"jwt not active"};

const  REGISTERED_USERID = {status:1470,msg: "Already Registered UserID"};
const  REGISTERED_ADMIN = {status:1471,msg:"Already Registered Admin "};
const  UNKNOWN_KEYID = {status:1481,msg:"No registration for the given UserID and KeyID combination"};
const  UNKNOWN_USERID = {status:1482,msg: "No registration for the given UserID "};

const  CHANNEL_BINDING_REFUSED = {status:1490,msg:"missing or mismatched channel binding(s)"};
const  REQUEST_INVALID = {status:1491,msg:"The server refused to service the request because the request message nonce was unknown, expired or the server has previously serviced a message with the same nonce and user ID."};
const  UNACCEPTABLE_AUTHENTICATOR = {status:1492,msg:"The authenticator is not acceptable according to the server's policy"};
const  REVOKED_AUTHENTICATOR = {status:1493,msg:"The authenticator is considered revoked by the server"};
const  UNACCEPTABLE_CONTENT = {status:1498,msg:"There was a problem with the contents of the message and the server was unwilling or unable to process it."};

const  INTERNAL_SERVER_ERROR = {status:1500,msg:"Internal Server Error"};


module.exports ={RESULT_OK,BAD_REQUEST,NOT_FOUND,REGISTER_FAILDED,AUTHENTICATION_FAILDED,DELETEREGISTER_FAILDED,
    NOT_REGISTERED_ADMIN,
    INVALID_PASSWORD,
    NO_PERMISSION,
    REGISTERED_USERID,
    REGISTERED_ADMIN,
    UNKNOWN_KEYID,
    UNKNOWN_USERID,
    CHANNEL_BINDING_REFUSED,
    REQUEST_INVALID,
    UNACCEPTABLE_AUTHENTICATOR,
    REVOKED_AUTHENTICATOR,
    UNACCEPTABLE_CONTENT,
    CREATE_FAILDED,
    INTERNAL_SERVER_ERROR,
    NOT_REGISTERED_EDIT_ADMIN,
    INCORRECT_PASSWORD,
    ACCOUNT_LOCKOUT,
    ERROR_TOKEN,
    EXPIRED_TOKEN,
    NOT_BEFORE_ERROR,
    ERROR_LICENSE,
    EXPIRED_LICENSE,
    NOT_BEFORE_LICENSE_ERROR,
    UNAVAILABLE_LICENSE,
    No_LICENSE
}

