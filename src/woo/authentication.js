import UserNotFoundError from "../errors/UserNotFoundError.js";
import api from './api.mjs';

/**
 * @typedef {Object} AuthenticationError
 * @property {string} code
 * @property {string} message
 * @property {Object} data
 */

const RegistrationError = {
    OK: 0,
    USERNAME_ALREADY_EXISTS: 1,
    EMAIL_ALREADY_EXISTS: 2,
    UNKNOWN: (err) => { return {code: 255, err} }
};

class AuxError {
    constructor(code, data = null) {
        this.code = code;
        this.data = data;
    }

    /** @type {number} */
    code;

    data;
}

const LoginError = {
    OK: (user) => { return new AuxError(0, user) },
    USER_NOT_FOUND: () => { return new AuxError(1) },
    UNKNOWN: (err) => { return new AuxError(255, err) }
};

export default {
    RegistrationError,
    LoginError,
    /**
     * Tries to log in with the given credentials.
     * @param {string} dni The DNI of the user.
     * @param {string} password The user's password
     * @return {Promise<void>}
     * @throws {UserNotFoundError} If there's no user associated with the given DNI.
     * @returns {Promise<AuxError>}
     */
    login: async (dni, password) => {
        try {
            const result = await api.get('customers', {per_page: 10})
            /** @type {Object[]} */ const {data} = result;
            if (data.length <= 0) return LoginError.USER_NOT_FOUND();
            console.log('len =', data.length, 'data:', data)
            console.log('Users: ', data.map((el) => el['username']));
            const user = data[0];
            console.info("user", user)

            return LoginError.OK(user);
        } catch (err) {
            return LoginError.UNKNOWN(err);
        }
    },
    /**
     * Tries to register a new user in the database.
     * @param {string} dni
     * @param {string} password
     * @param {string} email
     * @param {string} name
     * @param {string} surname
     * @returns {Promise<RegistrationError|{code:number,err}>}
     */
    register: async (dni, password, email, name, surname) => {
        try {
            await api.post(
                'customers',
                {username: dni, email, first_name: name, last_name: surname, password}
            )
            return RegistrationError.OK;
        } catch (e) {
            /** @type {AuthenticationError} */ const data = e.response.data;
            switch (data.code) {
                case 'registration-error-username-exists':
                    return RegistrationError.USERNAME_ALREADY_EXISTS;
                case 'registration-error-email-exists':
                    return RegistrationError.EMAIL_ALREADY_EXISTS;
                default:
                    return RegistrationError.UNKNOWN(data)
            }
        }
    }
}
