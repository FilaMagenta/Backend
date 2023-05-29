import errors from "../errors.mjs";
import {verify} from '../validation/tokens.mjs';

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

/**
 * @async
 * @callback LogicBlock
 * @template Return
 * @param {string} dni
 * @param {number} userId
 * @return {Promise<Return>}
 */

/**
 * Fetches the authorization parameters passed through the request, and verifies them. If anything is wrong, an error
 * response is sent, otherwise the logic argument is executed.
 * @template Block
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {LogicBlock<Block>} logic
 * @return {Promise<void>}
 */
export async function authenticate(req, res, logic) {
    /** @type {?string} */
    const authHeader = req.header('Authorization');

    if (authHeader == null) return sendError(res, errors.AUTH_MISSING_HEADER);
    if (!authHeader.startsWith('Bearer ')) return sendError(res, errors.AUTH_INVALID_METHOD);

    try {
        const token = authHeader.substring(7); // Cut the "Bearer " prefix
        const decoded = await verify(token);
        const expires = decoded.exp;
        const now = Date.now() / 1000;
        if (expires < now) return sendError(res, errors.AUTH_TOKEN_EXPIRED);
        /** @type {{dni:?string,id:?number}} */ const data = decoded.data;
        if (data.dni == null || data.id == null) return sendError(res, errors.AUTH_TOKEN_INVALID);
        console.info('Getting token data');

        // Token is valid
        await logic(data.dni, data.id);
    } catch (e) {
        sendError(res, errors.UNKNOWN_ACCOUNT, 500, e);
    }
}
