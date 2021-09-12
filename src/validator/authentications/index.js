const InvariantError = require('../../exceptions/InvariantError');
const {
    PostAuthenticationPayloadSchema,
    ModifyAuthenticationPayloadSchema
} = require('./schema');

const AuthenticationsValidator = {
    validatePostAuthenticationPayload: (payload) => {
        const validationResult = PostAuthenticationPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validatePutAuthenticationPayload: (payload) => {
        const validationResult = ModifyAuthenticationPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validateDeleteAuthenticationPayload: (payload) => {
        const validationResult = ModifyAuthenticationPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = AuthenticationsValidator;
