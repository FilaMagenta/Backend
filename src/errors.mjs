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

export const MISSING_DNI = new Error(1, 'The request is missing the required `dni` parameter in the body.');
export const MISSING_PASSWORD = new Error(2, 'The request is missing the required `password` parameter in the body.');
export const MISSING_EMAIL = new Error(3, 'The request is missing the required `email` parameter in the body.');
export const MISSING_NAME = new Error(4, 'The request is missing the required `name` parameter in the body.');
export const MISSING_SURNAME = new Error(5, 'The request is missing the required `surname` parameter in the body.');
export const MISSING_VALUE = new Error(5, 'The request is missing the required `value` parameter in the body.');
export const MISSING_DESCRIPTION = new Error(6, 'The request is missing the required `description` parameter in the body.');
export const MISSING_STOCK = new Error(6, 'The request is missing the required `stock` parameter in the body.');

export const INVALID_DNI = new Error(20, 'The DNI passed is not valid.');

export const USER_ALREADY_EXISTS = new Error(30, 'An user with the given DNI already exists.');
export const EMAIL_ALREADY_EXISTS = new Error(31, 'An user with the given email already exists.');

export const USER_NOT_FOUND = new Error(40, 'Could not find any user with the given DNI');

export const AUTH_MISSING_HEADER = new Error(50, 'The request is missing an authentication header.');
export const AUTH_INVALID_METHOD = new Error(51, 'Using a non-supported authentication method.');
export const AUTH_TOKEN_EXPIRED = new Error(52, 'The token you are using has expired.');
export const AUTH_TOKEN_INVALID = new Error(53, 'The token you are using is not valid.');
export const AUTH_REQUIRES_ADMIN = new Error(54, 'The operation requested requires you to be an administrator.');
export const AUTH_NO_PASSWORD = new Error(55, 'Your account doesn\'t have an associated password. You can\'t log in.');
export const AUTH_WRONG_PASSWORD = new Error(56, 'Wrong password.');
export const AUTH_FORBIDDEN = new Error(57, 'You are not authorized to do this.');

export const UNKNOWN_REGISTER = new Error(1000, 'An unknown error occurred while trying to register.');
export const UNKNOWN_LOGIN = new Error(1001, 'An unknown error occurred while trying to login.');
export const UNKNOWN_ACCOUNT = new Error(1002, 'An unknown error occurred while trying to get your account\'s data. Token might be invalid');
export const UNKNOWN_META = new Error(1003, 'An unknown error occurred while trying to update your account\'s meta.')
export const UNKNOWN_EVENT_NEW = new Error(1004, 'An unknown error occurred while trying to create a new event.')

export const UNKNOWN_ENDPOINT = new Error(9999, 'Unknown endpoint');


export default {
    MISSING_DNI,
    MISSING_PASSWORD,
    MISSING_EMAIL,
    MISSING_NAME,
    MISSING_SURNAME,
    MISSING_VALUE,
    MISSING_DESCRIPTION,
    MISSING_STOCK,

    INVALID_DNI,

    USER_ALREADY_EXISTS,
    EMAIL_ALREADY_EXISTS,

    USER_NOT_FOUND,

    AUTH_MISSING_HEADER,
    AUTH_INVALID_METHOD,
    AUTH_TOKEN_EXPIRED,
    AUTH_TOKEN_INVALID,
    AUTH_REQUIRES_ADMIN,
    AUTH_NO_PASSWORD,
    AUTH_WRONG_PASSWORD,
    AUTH_FORBIDDEN,

    UNKNOWN_REGISTER,
    UNKNOWN_LOGIN,
    UNKNOWN_ACCOUNT,
    UNKNOWN_META,

    UNKNOWN_ENDPOINT
}
