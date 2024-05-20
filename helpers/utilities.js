import crypto from "crypto";
import usedEnvironment from "./environments.js";

const utilities = {};

//Json parser
utilities.parseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch {
    output = typeof jsonString;
  }
  return output;
};

//hasing the password..

utilities.hash = (passString) => {
  let hashPass;
  if (typeof passString === "string" && passString.length > 0) {
    hashPass = crypto
      .createHmac("sha256", usedEnvironment.secretKey)
      .update(passString)
      .digest("hex");

    return hashPass;
  } else {
    return false;
  }
};

//random token generator...

utilities.randomTokenGenerator = (expectedTokenLength) => {
  let token = "";
  const charSetToMakeToken = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  if (typeof expectedTokenLength === "number") {
    for (let i = 1; i <= expectedTokenLength; i++) {
      token += charSetToMakeToken.charAt(
        Math.floor(Math.random() * charSetToMakeToken.length)
      );
    }
    return token;
  } else {
    return false;
  }
};

export default utilities;
