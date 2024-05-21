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

//get the user from local database.
checkHandler._checks.get = (requestProperties, callback) => {
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
        lib.read("users", phone, (err, stringUser) => {
          //MAKING THE Object type data form string type data and clone this in user variable with (JSON.parse(JOSN.stringify(object))) mehtod....
          const user = JSON.parse(
            JSON.stringify(utilities.parseJSON(stringUser))
          );
          delete user.password;
          if (!err && user) {
            callback(200, user);
          } else {
            callback(404, {
              Error: "Requested user cannot found in database!!",
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
      Error: "Invalid search of user to find the data!",
    });
  }
};

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

  const token = requestProperties.headerObject.token;
  if (protocol && method && successCode && url && timeoutSeconds) {
    lib.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        const userPhone = utilities.parseJSON(tokenData).phone;

        lib.read("users", userPhone, (err3, userData) => {
            console.log('helo', userPhone);
          if (!err3 & userData) {
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

                if (userChecks.length <= usedEnvironment.maxChecks) {
                  const checkId = utilities.randomTokenGenerator(20);
                  const checkObject = {
                    id: checkId,
                    protocol,
                    userPhone,
                    url,
                    successCode,
                    method,
                    timeoutSeconds
                  };

                  lib.create('checks', checkId, (err) => {
                    if(!err) {
                        userObject.checks = userChecks;
                        userObject.checks.push = checkId;

                        lib.update('users', userPhone, (err) => {
                            if(!err) {
                                callback(200, {
                                    success: true,
                                    message: "Successful checks and it's instance in user database."
                                })
                            } else {
                                callback(500, {
                                    Error: "Error in updating the user data.!"
                                })
                            }
                        })
                    } else {
                        callback(500, {
                            Error: 'Error in creating in checks.'
                        })
                    }
                  })
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
            callback(200, {
              ErrorFromuserRead: err3
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

// updateing the user in database
checkHandler._checks.put = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties?.body?.firstName === "string" &&
    requestProperties?.body?.firstName.trim().length > 0
      ? requestProperties?.body?.firstName
      : null;

  const lastName =
    typeof requestProperties?.body?.lastName === "string" &&
    requestProperties?.body?.lastName.trim().length > 0
      ? requestProperties?.body?.lastName
      : null;

  const phone =
    typeof requestProperties?.body?.phone === "string" &&
    requestProperties?.body?.phone.trim().length == 11
      ? requestProperties?.body?.phone
      : null;

  const password =
    typeof requestProperties?.body?.password === "string" &&
    requestProperties?.body?.password.trim().length > 0
      ? requestProperties?.body?.password
      : null;

  if (phone) {
    if (firstName || lastName || password) {
      let token =
        typeof requestProperties.headerObject.token === "string"
          ? requestProperties.headerObject.token
          : null;

      tokenHandler._tokens.verify(token, phone, (verified) => {
        if (verified) {
          lib.read("users", phone, (err, uData) => {
            if (!err && uData) {
              const user = JSON.parse(
                JSON.stringify(utilities.parseJSON(uData))
              );
              if (firstName) {
                user.firstName = firstName;
              }

              if (lastName) {
                user.lastName = lastName;
              }

              if (password) {
                user.password = utilities.hash(password);
              }

              lib.update("users", phone, user, (err) => {
                if (!err) {
                  callback(200, {
                    success: true,
                    message: "User updated succesfully",
                  });
                } else {
                  callback(400, { Error: "Couldn't updated the user finish." });
                }
              });
            } else {
              callback(400, {
                Error: "Invalid user. User isnot available in database!",
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
    callback(400, {
      Error: "Error in invalid identifier with the user phone number!",
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
