import {authenticate, sendError, sendSuccess} from "../utils.mjs";
import {getUserData, updateUserMeta} from "../../woo/data.mjs";
import {MISSING_VALUE} from "../../errors.mjs";

/**
 * @async
 * @callback Endpoint
 * @param {import('express').Request} req
 * @param {import('express').Response} res
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

            await updateUserMeta(userId, metaType, value);
            sendSuccess(res);
        });
    }
}
