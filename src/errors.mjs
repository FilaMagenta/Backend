export class Error {
    /**
     * Instantiates a new error class.
     * @param {number} code The error code.
     * @param {string} message The message to display with the error.
     */
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }

    /** @type {number} */
    code;
    /** @type {string} */
    message;
}

export default {
    MISSING_DNI: new Error(1, 'The request is missing the required `dni` parameter in the body.'),
    MISSING_PASSWORD: new Error(2, 'The request is missing the required `password` parameter in the body.'),
    MISSING_EMAIL: new Error(3, 'The request is missing the required `email` parameter in the body.'),
    MISSING_NAME: new Error(4, 'The request is missing the required `name` parameter in the body.'),
    MISSING_SURNAME: new Error(5, 'The request is missing the required `surname` parameter in the body.'),

    INVALID_DNI: new Error(20, 'The DNI passed is not valid.'),

    USER_ALREADY_EXISTS: new Error(30, 'An user with the given DNI already exists.'),
    EMAIL_ALREADY_EXISTS: new Error(31, 'An user with the given email already exists.'),

    UNKNOWN_REGISTER: new Error(1000, 'An unknown error occurred while trying to register.'),
}
