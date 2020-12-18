class GeneralError extends Error {
    constructor(message, code = 200, ...params) {
        super(...params);
        this.message = message;
        this.code = code;
    }
}

export default GeneralError;
