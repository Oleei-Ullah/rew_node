const sampleHandler = (requestProperties, callback) => {
    callback(200, {
        success: true,
        data: [
            {name: "abdullah", age: 20},
            {name: "abdullah", age: 20},
            {name: "abdullah", age: 20},
        ]
    })
}

export default sampleHandler;