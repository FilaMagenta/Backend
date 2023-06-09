import authentication from '../../woo/authentication.js'
import {sendError} from "../utils.mjs";
import dniValidator from '../../validation/dni.mjs';
import errors from '../../errors.mjs';

const {register, RegistrationError} = authentication;

/**
 * Provides the logic of the registration endpoint.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export default async function (req, res) {
    const body = req.body;
    /** @type {?string} */ const dni = body['dni'];
    /** @type {?string} */ const password = body['password'];
    /** @type {?string} */ const email = body['email'];
    /** @type {?string} */ const name = body['name'];
    /** @type {?string} */ const surname = body['surname'];

    if (dni == null) return sendError(res, errors.MISSING_DNI);
    if (password == null) return sendError(res, errors.MISSING_PASSWORD);
    if (email == null) return sendError(res, errors.MISSING_EMAIL);
    if (name == null) return sendError(res, errors.MISSING_NAME);
    if (surname == null) return sendError(res, errors.MISSING_SURNAME);

    // Check that the DNI format is correct
    if (!dniValidator.validate(dni)) return sendError(res, errors.INVALID_DNI)

    const result = await register(dni, password, email, name, surname);
    if (result === RegistrationError.OK) return res.json({success: true});
    if (result === RegistrationError.USERNAME_ALREADY_EXISTS) return sendError(res, errors.USER_ALREADY_EXISTS);
    if (result === RegistrationError.EMAIL_ALREADY_EXISTS) return sendError(res, errors.EMAIL_ALREADY_EXISTS);

    return sendError(res, errors.UNKNOWN_REGISTER, 500, result);
}
