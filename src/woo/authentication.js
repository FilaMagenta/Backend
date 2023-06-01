import api, {multiGet} from './api.mjs';
import {MetaTypes, UpdateAccountMetaError, updateUserMeta} from "./data.mjs";
import {hashPassword, verifyPassword} from "../validation/passwords.js";

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
    PASSWORD_STORAGE: 3,
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
    NO_PASSWORD: () => { return new AuxError(2) },
    WRONG_PASSWORD: () => { return new AuxError(3) },
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
            // FIXME: Do not get a list of customers, search for the customer with the given DNI
            /** @type {UserData[]} */
            const result = await multiGet('customers', { role: 'all' })
            for (const obj of result) {
                if (obj.username === dni) {
                    // Found the user, now verify the password
                    const hash = obj.meta_data.find((meta) => meta.key === 'password_hash')?.value;
                    if (hash == null)
                        return LoginError.NO_PASSWORD();
                    if (await verifyPassword(password, hash) === true)
                        return LoginError.OK(obj);
                    return LoginError.WRONG_PASSWORD();
                }
            }
            return LoginError.USER_NOT_FOUND();
        } catch (err) {
            console.error(err);
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
            const registerResult = await api.post(
                'customers',
                {username: dni, email, first_name: name, last_name: surname, password}
            )
            const {/** @type {UserData} */ data} = registerResult;
            const userId = data.id;
            const hashedPassword = await hashPassword(password);
            const result = await updateUserMeta(userId, MetaTypes.PASSWORD_HASH, hashedPassword);
            if (result === UpdateAccountMetaError.OK)
                return RegistrationError.OK;
            return RegistrationError.PASSWORD_STORAGE;
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
