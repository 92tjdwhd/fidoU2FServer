setResultOK = (result,typ,jwt,isAdminToken) => {
  let result_OK = {
    op: typ,
    status: 1200,
    msg: "Operation completed",
    result: {
      data: result
    },
    token :{
      jwt:jwt,
      isAdminToken:isAdminToken
    }
  };
  return result_OK;
};
setResultErr = (typ,status,msg)=>{
  let result_Err = {
    op: typ,
    status: status,
    msg: msg,
    result: {
      data: null
    }
  }
  return result_Err;
} 

const result_BAD_REQUEST = {
  op: "reg",
  status: 1400,
  msg: "The server did not understand the message",
  result: {
    data: null
  }
};

const result_NOT_FOUND = {
  op: "reg",
  status: 1404,
  msg: "Not Found",
  result: {
    data: null
  }
};

const result_Register_failded  = {
    op: "reg",
    status: 1405,
    msg: "Registration failed for an unknown reason.",
    result: {
      data: null
    }
  };

  const result_Authentication_failed  = {
    op: "auth",
    status: 1406,
    msg: "Authentication failed for an unknown reason.",
    result: {
      data: null
    }
  };
  const result_DeleteRegister_failed  = {
    op: "dReg",
    status: 1407,
    msg: "DeleteRegister failed for an unknown reason.",
    result: {
      data: null
    }
  };

  
  const result_Invalid_Token = {
    op: "token",
    status: 1460,
    msg: "Invalid Token ",
    result: {
      data: null
    }
  };

  const result_REGISTERED_USERID = {
    op: "reg",
    status: 1470,
    msg: "Already Registered UserID ",
    result: {
      data: null
    }
  };
  const result_REGISTERED_ADMIN = {
    op: "aReq",
    status: 1471,
    msg: "Already Registered Admin ",
    result: {
      data: null
    }
  };
const result_UNKNOWN_KEYID = {
  op: "reg",
  status: 1481,
  msg: "No registration for the given UserID and KeyID combination",
  result: {
    data: null
  }
};
const result_UNKNOWN_USERID = {
  op: "dReg",
  status: 1482,
  msg: "No registration for the given UserID ",
  result: {
    data: null
  }
};

const result_CHANNEL_BINDING_REFUSED = {
  op: "reg",
  status: 1490,
  msg: "missing or mismatched channel binding(s)",
  result: {
    data: null
  }
};

const result_Request_Invalid  = {
    op: "reg",
    status: 1491,
    msg: "The server refused to service the request because the request message nonce was unknown, expired or the server has previously serviced a message with the same nonce and user ID.",
    result: {
      data: null
    }
  };

const result_UNACCEPTABLE_AUTHENTICATOR = {
  op: "auth",
  status: 1492,
  msg: "The authenticator is not acceptable according to the server's policy",
  result: {
    data: null
  }
};

const result_REVOKED_AUTHENTICATOR = {
  op: "auth",
  status: 1493,
  msg: "The authenticator is considered revoked by the server",
  result: {
    data: null
  }
};

const result_Unacceptable_Content = {
    op: "auth",
    status: 1498,
    msg: "There was a problem with the contents of the message and the server was unwilling or unable to process it.",
    result: {
      data: null
    }
  };

const result_INTERNAL_SERVER_ERROR = {
  op: "reg",
  status: 1500,
  msg: "Internal Server Error",
  result: {
    data: null
  }
};

module.exports = {
  setResultOK,
  setResultErr,
  result_BAD_REQUEST,
  result_NOT_FOUND,
  result_UNKNOWN_KEYID,
  result_CHANNEL_BINDING_REFUSED,
  result_UNACCEPTABLE_AUTHENTICATOR,
  result_REVOKED_AUTHENTICATOR,
  result_INTERNAL_SERVER_ERROR,
  result_Request_Invalid,
  result_Register_failded,
  result_Authentication_failed,
  result_Unacceptable_Content,
  result_DeleteRegister_failed,
  result_UNKNOWN_USERID,
  result_REGISTERED_USERID,
  result_REGISTERED_ADMIN,
  result_Invalid_Token
};
