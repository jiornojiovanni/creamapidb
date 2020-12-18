import { GeneralError } from '../helpers/general-error';
import { HTTP_STATUS } from '../config/constants';

const middleware = (err, req, res, next) => {
    if (err instanceof GeneralError) {
        return res.status(err.code).json({
          status: 'error',
          message: err.message
        });
      }
    
      return res.status(HTTP_STATUS.INTERNAL_ERROR.code).json({
        status: 'error',
        message: HTTP_STATUS.INTERNAL_ERROR.message,
      });
};

export default middleware;