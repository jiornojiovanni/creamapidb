import GeneralError from './general-error';
import { HTTP_STATUS } from '../config/constants';

class BadRequest extends GeneralError {
    constructor() {
        super();
        this.message = HTTP_STATUS.BAD_REQUEST.message;
        this.code = HTTP_STATUS.BAD_REQUEST.code;
    }
}

export default BadRequest;
