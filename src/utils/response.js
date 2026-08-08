export function sendSuccess(res, statusCode, data) {
    return res.status(statusCode).json({
        success: true,
        data,
    });
}

export function sendError(res, statusCode, message) {
    return res.status(statusCode).json({
        success: false,
        error: {
           code,
           message
       }
    });
}
