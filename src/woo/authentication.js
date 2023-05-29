
import UserNotFoundError from "../errors/UserNotFoundError.js";

import api from './api.mjs';

export default {
    /**
     * Tries to log in with the given credentials.
     * @param {string} dni The DNI of the user.
     * @param {string} password The user's password
     * @return {Promise<void>}
     * @throws {UserNotFoundError} If there's no user associated with the given DNI.
     */
    login: async (dni, password) => {
        const result = await api.get('customers', {per_page: 10})
        /** @type {Object[]} */
        const {data} = result;
        if (data.length <= 0) throw new UserNotFoundError(`Could not find an user with the DNI ${dni}.`);
        console.log('len =', data.length, 'data:', data)
        console.log('Users: ', data.map((el) => el['username']));
        const user = data[0];
        console.info("user", user)
    }
}
