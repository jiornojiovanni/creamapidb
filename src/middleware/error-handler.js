import GeneralError from '../errors/general-error';
import { HTTP_STATUS } from '../config/constants';

const middleware = (err, req, res, next) => {
    if (err instanceof GeneralError) {
        next();
        return res.status(err.code).json({
            status: err.code,
            message: err.message,
        });
    }

    return res.status(HTTP_STATUS.INTERNAL_ERROR.code).json({
        status: HTTP_STATUS.INTERNAL_ERROR.code,
        message: HTTP_STATUS.INTERNAL_ERROR.message,
    });
};

export default middleware;
