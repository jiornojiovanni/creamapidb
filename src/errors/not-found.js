import GeneralError from './general-error';
import { HTTP_STATUS } from '../config/constants';

class NotFound extends GeneralError {
    constructor(params) {
        super(...params);
        this.message = HTTP_STATUS.NOT_FOUND.message;
        this.code = HTTP_STATUS.NOT_FOUND.code;
    }
}

export default NotFound;
