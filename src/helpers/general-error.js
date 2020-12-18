import { HTTP_STATUS } from '../config/constants';

class GeneralError extends Error {
    constructor() {
        super();

        if (this instanceof BadRequest) {
            this.message = HTTP_STATUS.BAD_REQUEST.message;
            this.code = HTTP_STATUS.BAD_REQUEST.code;
        } 
        if (this instanceof NotFound) {
            this.message = HTTP_STATUS.NOT_FOUND.message;
            this.code = HTTP_STATUS.NOT_FOUND.code;
        }
        if (this instanceof InternalError) {
            this.message = HTTP_STATUS.INTERNAL_ERROR.message;
            this.code = HTTP_STATUS.INTERNAL_ERROR.code;
        }
    }
}

class BadRequest extends GeneralError { }
class NotFound extends GeneralError { }
class InternalError extends GeneralError { }

export {
    GeneralError,
    BadRequest,
    NotFound,
    InternalError,
};
