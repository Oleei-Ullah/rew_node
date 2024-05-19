const notFoundHandler = (requestProperties, callback) => {
    console.log(requestProperties.parsedUrl);
    callback(404, {
        success: false,
        data: []
    })
}

export default notFoundHandler;