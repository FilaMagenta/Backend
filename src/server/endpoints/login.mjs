import errors from '../../errors.mjs';
import {sendError, sendSuccess} from "../utils.mjs";
import dniValidator from '../../validation/dni.mjs';
import {sign} from '../../validation/tokens.mjs';
import authentication from "../../woo/authentication.js";

const {login, LoginError} = authentication;

/**
 * Provides the logic of the login endpoint.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export default async function (req, res) {
    const body = req.body;
    /** @type {?string} */ const dni = body['dni'];
    /** @type {?string} */ const password = body['password'];

    // Check that the DNI has been passed
    if (dni == null)
        return sendError(res, errors.MISSING_DNI);
    // Check that the password has been passed
    if (password == null)
        return sendError(res, errors.MISSING_PASSWORD);
    // Check that the DNI format is correct
    if (!dniValidator.validate(dni))
        return sendError(res, errors.INVALID_DNI)

    const result = await login(dni, password);
    if (result === LoginError.OK) {
        // Generate a new token for the user
        const result = await sign({dni});

        return sendSuccess(res, {token: result});
    }
    if (result === LoginError.USER_NOT_FOUND) return sendError(res, errors.USER_NOT_FOUND);

    return sendError(res, errors.UNKNOWN_REGISTER, 500, result);
}
