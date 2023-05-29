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
    INVALID_DNI: new Error(3, 'The DNI passed is not valid.')
}
