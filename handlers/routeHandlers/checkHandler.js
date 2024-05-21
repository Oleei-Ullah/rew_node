import usedEnvironment from "../../helpers/environments.js";
import utilities from "../../helpers/utilities.js";
import lib from "../../lib/data.js";
import tokenHandler from "./tokenHandler.js";

const checkHandler = {};

checkHandler.handler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    checkHandler._checks[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

//Another scaffolding for the methods under the checkHandler in _users
checkHandler._checks = {};

//post user in local database
checkHandler._checks.post = (requestProperties, callback) => {
  const protocol =
    typeof requestProperties?.body?.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties?.body?.protocol
      : null;

  const method =
    typeof requestProperties?.body?.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties?.body?.method
      : null;

  const timeoutSeconds =
    typeof requestProperties?.body?.timeoutSeconds === "number" &&
    requestProperties?.body?.timeoutSeconds % 1 === 0 &&
    requestProperties?.body?.timeoutSeconds >= 1 &&
    requestProperties?.body?.timeoutSeconds <= 5
      ? requestProperties?.body?.timeoutSeconds
      : null;

  const url =
    typeof requestProperties?.body?.url === "string" &&
    requestProperties?.body?.url.trim().length > 0
      ? requestProperties?.body?.url
      : null;

  const successCode =
    typeof requestProperties?.body.successCode === "object" &&
    requestProperties?.body?.successCode instanceof Array
      ? requestProperties?.body?.successCode
      : false;

  if (protocol && method && successCode && url && timeoutSeconds) {
    let token =
      typeof requestProperties.headerObject.token === "string"
        ? requestProperties.headerObject.token
        : null;
    lib.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        const userPhone = utilities.parseJSON(tokenData).phone;

        lib.read("users", userPhone, (err, userData) => {
          if (!err && userData) {
            const userObject = JSON.parse(
              JSON.stringify(utilities.parseJSON(userData))
            );

            tokenHandler._tokens.verify(token, userPhone, (isVerified) => {
              if (isVerified) {
                const userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];

                if (userChecks.length < usedEnvironment.maxChecks) {
                  const checkId = utilities.randomTokenGenerator(20);
                  const checkObject = {
                    id: checkId,
                    protocol,
                    userPhone,
                    url,
                    successCode,
                    method,
                    timeoutSeconds,
                  };

                  lib.create("checks", checkId, checkObject, (err) => {
                    if (!err) {
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);

                      lib.update("users", userPhone, userObject, (err) => {
                        if (!err) {
                          callback(200, {
                            success: true,
                            message:
                              "Successful checks and it's instance in user database.",
                          });
                        } else {
                          callback(500, {
                            Error: err,
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        Error: "Error in creating in checks.",
                      });
                    }
                  });
                } else {
                  callback(401, {
                    Error: "User has already reached max check limit.",
                  });
                }
              } else {
                callback(403, {
                  Error: "Authentication Failure. ",
                });
              }
            });
          } else {
            callback(403, {
              ErrorFromread: err,
            });
          }
        });
      } else {
        callback(403, {
          Error: err,
        });
      }
    });
  } else {
    callback(400, {
      error: "Checks input is invalid",
    });
  }
};

checkHandler._checks.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties?.query?.id === "string" &&
    requestProperties?.query?.id.trim().length == 20
      ? requestProperties?.query?.id
      : null;

  if (id) {
    lib.read("checks", id, (err, checksData) => {
      if (!err && checksData) {
        let token =
          typeof requestProperties.headerObject.token === "string"
            ? requestProperties.headerObject.token
            : null;

        const check = JSON.parse(
          JSON.stringify(utilities.parseJSON(checksData))
        );

        const phone = check.userPhone;

        tokenHandler._tokens.verify(token, phone, (validToken) => {
          if (validToken) {
            callback(200, {
              success: true,
              data: check,
            });
          } else {
            callback(400, {
              Error: "Authentication failed!!!",
            });
          }
        });
      } else {
        callback(400, { Error: err });
      }
    });
  } else {
    callback(404, {
      Error: "Invalid search of Checks to find the checkdata!",
    });
  }
};

// updateing the user in database
checkHandler._checks.put = (requestProperties, callback) => {
  const protocol =
    typeof requestProperties?.body?.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties?.body?.protocol
      : null;

  const method =
    typeof requestProperties?.body?.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties?.body?.method
      : null;

  const timeoutSeconds =
    typeof requestProperties?.body?.timeoutSeconds === "number" &&
    requestProperties?.body?.timeoutSeconds % 1 === 0 &&
    requestProperties?.body?.timeoutSeconds >= 1 &&
    requestProperties?.body?.timeoutSeconds <= 5
      ? requestProperties?.body?.timeoutSeconds
      : null;

  const url =
    typeof requestProperties?.body?.url === "string" &&
    requestProperties?.body?.url.trim().length > 0
      ? requestProperties?.body?.url
      : null;

  const successCode =
    typeof requestProperties?.body.successCode === "object" &&
    requestProperties?.body?.successCode instanceof Array
      ? requestProperties?.body?.successCode
      : false;

  const id =
    typeof requestProperties?.body?.id === "string" &&
    requestProperties?.body?.id.trim().length == 20
      ? requestProperties?.body?.id
      : null;

  if (id) {
    lib.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        const checkObject = JSON.parse(
          JSON.stringify(utilities.parseJSON(checkData))
        );
        const phone = checkObject.userPhone;

        if (protocol || method || successCode || url || timeoutSeconds) {
          let token =
            typeof requestProperties.headerObject.token === "string"
              ? requestProperties.headerObject.token
              : null;

          tokenHandler._tokens.verify(token, phone, (validToken) => {
            if (validToken) {
              if (protocol) {
                checkObject.protocol = protocol;
              }

              if (successCode) {
                checkObject.successCode = successCode;
              }

              if (url) {
                checkObject.url = url;
              }

              if (method) {
                checkObject.method = method;
              }

              if (timeoutSeconds) {
                checkObject.timeoutSeconds = timeoutSeconds;
              }

              lib.update("checks", id, checkObject, (err) => {
                if (!err) {
                  callback(200, {
                    success: true,
                    data: checkObject,
                    message: "Check updated succesfully",
                  });
                } else {
                  callback(400, {
                    Error: "Couldn't updated the Check finish.",
                  });
                }
              });
            } else {
              callback(400, {
                Error: "Authentication failed!!!",
              });
            }
          });
        } else {
          callback(400, { Error: "No data to update" });
        }
      } else {
        callback(403, { Error: "Couldn't read the check data" });
      }
    });
  } else {
    callback(400, {
      Error: "Error in invalid identifier with the CHECK ID!",
    });
  }
};

//delete method in database with nodejs
checkHandler._checks.delete = (requestProperties, callback) => {
  const phone =
    typeof requestProperties?.query?.phone === "string" &&
    requestProperties?.query?.phone.trim().length == 11
      ? requestProperties?.query?.phone
      : null;

  if (phone) {
    let token =
      typeof requestProperties.headerObject.token === "string"
        ? requestProperties.headerObject.token
        : null;

    tokenHandler._tokens.verify(token, phone, (verified) => {
      if (verified) {
        lib.read("users", phone, (err, userData) => {
          if (!err && userData) {
            lib.delete("users", phone, (err) => {
              if (!err) {
                callback(200, { success: "User deleted successfully" });
              } else {
                callback(400, { Error: "user couldn't delete final" });
              }
            });
          } else {
            callback(404, {
              Error: "Requested user cannot found to delete!",
            });
          }
        });
      } else {
        callback(400, {
          Error: "Authentication failed!!!",
        });
      }
    });
  } else {
    callback(404, {
      Error: "Invalid search of user to delete from the database",
    });
  }
};

export default checkHandler;
