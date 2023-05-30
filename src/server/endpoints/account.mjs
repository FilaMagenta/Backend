import {authenticate, sendError, sendSuccess} from "../utils.mjs";
import {getUserData, updateUserMeta, UpdateAccountMetaError} from "../../woo/data.mjs";
import {AUTH_REQUIRES_ADMIN, MISSING_VALUE, UNKNOWN_META} from "../../errors.mjs";

/**
 * @async
 * @callback Endpoint
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @return {Promise<void>}
 */

/**
 * Provides the logic of the registration endpoint.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @return {Promise}
 */
export async function getAccountEndpoint(req, res) {
    return authenticate(req, res, async (dni, userId) => {
        const data = await getUserData(userId);
        sendSuccess(res, data);
    });
}

/**
 * Provides the logic of the account meta set endpoint.
 * @param {MetaType} metaType
 * @return {Endpoint}
 */
export function setAccountMetaEndpoint(metaType) {
    return async (req, res) => {
        return authenticate(req, res, async (dni, userId) => {
            const body = req.body;
            /** @type {?string} */ const value = body.value;
            if (value == null) return sendError(res, MISSING_VALUE);

            const result = await updateUserMeta(userId, metaType, value);
            if (result === UpdateAccountMetaError.OK)
                sendSuccess(res);
            else if (result === UpdateAccountMetaError.REQUIRES_ADMIN)
                sendError(res, AUTH_REQUIRES_ADMIN, 403);
            else
                sendError(res, UNKNOWN_META, 500)
        });
    }
}

/**
 * Provides the logic of the account meta get endpoint.
 * @param {MetaType} metaType
 * @return {Endpoint}
 */
export function getAccountMetaEndpoint(metaType) {
    return async (req, res) => {
        return authenticate(req, res, async (dni, userId) => {
            const body = req.body;
            /** @type {?string} */ const value = body.value;
            if (value == null) return sendError(res, MISSING_VALUE);

            const result = await getUserData(userId);
            // TODO
        });
    }
}
