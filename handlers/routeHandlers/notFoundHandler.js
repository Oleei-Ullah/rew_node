const notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        success: false,
        data: []
    })
}

export default notFoundHandler;