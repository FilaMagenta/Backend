import errors from '../../errors.mjs';
import {sendError} from "../utils.mjs";
import dniValidator from '../../validation/dni.mjs';
import authentication from "../../woo/authentication.js";

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

    await authentication.login(dni, password)

    res.json({success: true});
}
