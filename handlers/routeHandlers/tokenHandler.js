import utilities from "../../helpers/utilities.js";
import lib from "../../lib/data.js";

//handler scaffolding
const tokenHandler = {};



tokenHandler.handler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1) {
        tokenHandler._tokens[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {Error: `Request method '${requestProperties.method}' is not allowed!`})
    }

}

//another scaffolding
tokenHandler._tokens = {};

tokenHandler._tokens.post = (requestProperties, callback) => {
    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.length == 11 ? requestProperties.body.phone : null;

    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.length > 0 ? requestProperties.body.password : null;

    if(phone && password) {
        lib.read('users', phone, (err, userData) => {
            if(!err && userData) {
                const user = utilities.parseJSON(userData);
                const hashPassword = utilities.hash(password);
                if(hashPassword === user.password){
                    const tokenId = utilities.randomTokenGenerator(20);

                    let tokenObject = {
                        id: tokenId,
                        phone,
                        expires: Date.now() + (60 * 60 * 1000)
                    };
                    lib.create('tokens', tokenId, tokenObject, (err) => {
                        if(!err) {
                            callback(200, {success: "token created"})
                        } else {
                            callback(400, err)
                        }
                    })
                } else {
                    callback(404, {Error: 'Password doesnt match'})
                }
            } else {
                callback(404, {Error: 'Invalid users. User isnot available in database!!'})
            }
        })
    } else {
        callback(404, {Error: 'Invalid credentials!'})
    }

}

export default tokenHandler;