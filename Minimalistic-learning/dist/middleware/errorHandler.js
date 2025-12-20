import { z } from 'zod';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
export const errorHandler = (err, _req, res, _next) => {
    if (err instanceof z.ZodError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Validation failed',
            errors: err.errors,
        });
    }
    if (err instanceof Error) {
        const status = err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
        return res.status(status).json({
            message: err.message || getReasonPhrase(status)
        });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
    });
};
export default errorHandler;
