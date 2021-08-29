const ClientError = require('../../exceptions/ClientError');
const { failResponse, errorResponse } = require('../../utils/responses');

class ErrorHandler {
    handle(request, h) {
        const { response } = request;

        if (response instanceof ClientError) {
            return failResponse(h, response);
        } if (response instanceof Error) {
            console.log(response);
            return errorResponse(h);
        }

        return response.continue || response;
    }
}

module.exports = ErrorHandler;
