import utilities from "../../helpers/utilities.js";
import lib from "../../lib/data.js";

//handler scaffolding
const tokenHandler = {};

tokenHandler.handler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    tokenHandler._tokens[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      Error: `Request method '${requestProperties.method}' is not allowed!`,
    });
  }
};

//another scaffolding
tokenHandler._tokens = {};

//posting the tokens
tokenHandler._tokens.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.length == 11
      ? requestProperties.body.phone
      : null;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.length > 0
      ? requestProperties.body.password
      : null;

  if (phone && password) {
    lib.read("users", phone, (err, userData) => {
      if (!err && userData) {
        const user = utilities.parseJSON(userData);
        const hashPassword = utilities.hash(password);
        if (hashPassword === user.password) {
          const tokenId = utilities.randomTokenGenerator(20);

          let tokenObject = {
            id: tokenId,
            phone,
            expires: Date.now() + 60 * 60 * 1000,
          };
          lib.create("tokens", tokenId, tokenObject, (err) => {
            if (!err) {
              callback(200, { success: "token created", token: tokenObject });
            } else {
              callback(400, err);
            }
          });
        } else {
          callback(404, { Error: "Password doesnt match" });
        }
      } else {
        callback(404, {
          Error: "Invalid users. User isnot available in database!!",
        });
      }
    });
  } else {
    callback(404, { Error: "Invalid credentials!" });
  }
};

//getting the tokens data
tokenHandler._tokens.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties?.query?.id === "string" &&
    requestProperties?.query?.id.trim().length == 20
      ? requestProperties?.query?.id
      : null;

  if (id) {
    lib.read("tokens", id, (err, tokenData) => {
      const tokenDataObj = utilities.parseJSON(tokenData);
      if (!err && tokenData) {
        callback(200, tokenDataObj);
      } else {
        callback(404, {
          Error: "Requested tokenData cannot found in database!!",
        });
      }
    });
  } else {
    callback(404, {
      Error: "Invalid search of id to find the tokenData!",
    });
  }
};

//updating the token expire tiem...
tokenHandler._tokens.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties?.body?.id === "string" &&
    requestProperties?.body?.id.trim().length == 20
      ? requestProperties?.body?.id
      : null;

  const extend =
    typeof requestProperties?.body?.extend === "boolean"
      ? requestProperties?.body?.extend
      : null;

  if (id && extend) {
    lib.read("tokens", id, (err, data) => {
      if (!err && data) {
        const tokenData = JSON.parse(JSON.stringify(utilities.parseJSON(data)));

        if (tokenData.expires > Date.now()) {
          tokenData.expires = Date.now() + 60 * 60 * 1000;
          lib.update("tokens", id, tokenData, (err) => {
            if (!err) {
              callback(200, {
                success: true,
                message: "Token expiration time extended!",
              });
            } else {
              callback(400, {
                Error: "Couldn't updated the token data finish.",
              });
            }
          });
        } else {
          callback(400, {
            Error: "Token has already been expired",
          });
        }
      } else {
        callback(400, {
          Error: "Invalid user. User isnot available in database!",
        });
      }
    });
  } else {
    callback(400, {
      Error: "Error in invalid request with probable null id or extends time!",
    });
  }
};

//deleteing the tokendata

tokenHandler._tokens.delete = (requestProperties, callback) => {
    const id =
      typeof requestProperties?.query?.id === "string" &&
      requestProperties?.query?.id.trim().length == 20
        ? requestProperties?.query?.id
        : null;

    if (id) {
      lib.read("tokens", id, (err, tokenData) => {
        if (!err && tokenData) {
          lib.delete('tokens', id, (err) => {
            if(!err) {
              callback(200, {success: "Token data deleted successfully"})
            } else {
              callback(400, {Error: "Token data couldn't delete final"})
            }
          })
        } else {
          callback(404, {
            Error: "Requested user cannot found to delete!",
          });
        }
      });
    } else {
      callback(404, {
        Error: "Invalid search of user to delete from the database",
      });
    }
  };

export default tokenHandler;
