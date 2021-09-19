const ClientError = require('../../exceptions/ClientError');
const { failResponse, errorResponse } = require('../../utils/responses');

class ErrorHandler {
    handle(request, h) {
        const { response } = request;
        if (response instanceof ClientError) {
            return failResponse(h, response);
        } if (response instanceof Error) {
            const { statusCode, payload } = response.output;
            switch (statusCode) {
                case 500:
                    console.log(response);
                    return errorResponse(h);
                default:
                    return h.response(payload).code(statusCode);
            }
        }

        return response.continue || response;
    }
}

module.exports = ErrorHandler;
