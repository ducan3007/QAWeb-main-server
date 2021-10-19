const response = (success, code = 400, message = 'valid', data) => {
    return {
        success,
        code,
        message,
        data
    }
}
module.exports = responseHandler = {
    response
}