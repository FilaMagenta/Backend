/**
 * Sends an Error to the response.
 * @param {import('express').Response} res
 * @param {import('../errors.mjs').Error} error
 * @param {number} status
 * @param {?} extra Some extra data to log. Optional
 */
export function sendError(res, error, status = 400, extra = null) {
    res.status(status).json({success: false, error_code: error.code, error_message: error.message, extra});
}

/**
 * Sends a successful value to the response.
 * @param {import('express').Response} res
 * @param {?Object} data Some optional data to append
 * @param {number} status
 */
export function sendSuccess(res, data, status = 200) {
    res.status(status).json({success: true, data});
}
