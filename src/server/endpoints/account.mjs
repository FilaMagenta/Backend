import {authenticate, sendSuccess} from "../utils.mjs";
import {getUserData} from "../../woo/data.mjs";

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
