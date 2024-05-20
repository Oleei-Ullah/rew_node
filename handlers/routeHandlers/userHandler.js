import utilities from "../../helpers/utilities.js";
import lib from "../../lib/data.js";

const userHandler = {};

userHandler.handler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    userHandler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

//Another scaffolding for the methods under the userhandler in _users
userHandler._users = {};

userHandler._users.get = (requestProperties, callback) => {
  const phone =
    typeof requestProperties?.query?.phone === "string" &&
    requestProperties?.query?.phone.trim().length == 11
      ? requestProperties?.query?.phone
      : null;

  if (phone) {
    lib.read("users", phone, (err, stringUser) => {
      //MAKING THE Object type data form string type data and clone this in user variable with (JSON.parse(JOSN.stringify(object))) mehtod....
      const user = JSON.parse(JSON.stringify(utilities.parseJSON(stringUser)));
      delete user.password;
      if (!err && user) {
        callback(200, user);
      } else {
        callback(404, {
          Error: "Requested user cannot found",
        });
      }
    });
  } else {
    callback(404, {
      Error: "Requested user cannot found",
    });
  }
};

userHandler._users.post = (requestProperties, callback) => {
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

  const tosAgreement =
    typeof requestProperties?.body.tosAgreement === "boolean"
      ? requestProperties?.body?.tosAgreement
      : null;

  if (firstName && lastName && phone && password && tosAgreement) {
    lib.read("users", "phone", (err, user) => {
      if (err) {
        let userObject = {
          firstName,
          lastName,
          phone,
          password: utilities.hash(password),
          tosAgreement,
        };

        lib.create("users", phone, userObject, (err) => {
          if (!err) {
            callback(200, {
              success: true,
              message: "User created succesfully!",
            });
          } else {
            callback(500, {
              sueccess: false,
              error: err.message,
            });
          }
        });
      } else {
        callback(500, {
          Error: "Error in server side creating the user.",
        });
      }
    });
  } else {
    callback(400, {
      error: "user input is invalid",
    });
  }
};

userHandler._users.put = (requestProperties, callback) => {
  callback(200, { name: "pullah" });
};

userHandler._users.delete = (requestProperties, callback) => {
  callback(200, { name: "dullah" });
};

export default userHandler;
