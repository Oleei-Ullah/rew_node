const userHandler = {};

userHandler.handler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requestProperties.method) > -1) {
        userHandler._users[requestProperties.method](requestProperties, callback)
    } else {
        callback(405)
    }
}

//Another scaffolding for the methods under the userhandler in _users
userHandler._users = {};

userHandler._users.get = (requestProperties, callback) => {
    callback(200, {name: 'ullah'});
}

userHandler._users.post = (requestProperties, callback) => {
    callback(200, {name: 'postullah'});
}

userHandler._users.put = (requestProperties, callback) => {
    callback(200, {name: 'pullah'});
}

userHandler._users.delete = (requestProperties, callback) => {
    callback(200, {name: 'dullah'});
}

export default userHandler