import GeneralError from './general-error';
import { HTTP_STATUS } from '../config/constants';

class InternalError extends GeneralError {
    constructor() {
        super();
        this.message = HTTP_STATUS.INTERNAL_ERROR.message;
        this.code = HTTP_STATUS.INTERNAL_ERROR.code;
    }
}

export default InternalError;
