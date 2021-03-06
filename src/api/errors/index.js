const ErrorHandler = require('./handler');

module.exports = {
    name: 'errors',
    version: '1.0.0',
    register: async (server) => {
        const errorHandler = new ErrorHandler();
        server.ext('onPreResponse', errorHandler.handle);
    },
};
