import api from "./api.mjs";

/**
 * @typedef {'administrator','editor','author','contributor','subscriber','customer','shop_manager'} UserRole
 */

/**
 * @typedef {Object} MetaData
 * @property {number} id
 * @property {string} key
 * @property {string} value
 */

/** @typedef {object} UserData
 * @property {number} id
 * @property {string} date_created
 * @property {string} date_created_gmt
 * @property {string} date_modified
 * @property {string} date_modified_gmt
 * @property {string} email
 * @property {string} first_name
 * @property {string} last_name
 * @property {UserRole} role
 * @property {string} username
 * @property {object} billing
 * @property {string} billing.first_name
 * @property {string} billing.last_name
 * @property {string} billing.company
 * @property {string} billing.address_1
 * @property {string} billing.address_2
 * @property {string} billing.city
 * @property {string} billing.state
 * @property {string} billing.postcode
 * @property {string} billing.country
 * @property {string} billing.email
 * @property {string} billing.phone
 * @property {object} shipping
 * @property {string} shipping.first_name
 * @property {string} shipping.last_name
 * @property {string} shipping.company
 * @property {string} shipping.address_1
 * @property {string} shipping.address_2
 * @property {string} shipping.city
 * @property {string} shipping.state
 * @property {string} shipping.postcode
 * @property {string} shipping.country
 * @property {boolean} is_paying_customer
 * @property {string} avatar_url
 * @property {MetaData[]} meta_data
 * @property {object} _links
 * @property {object[]} _links.self
 * @property {string} _links.self.href
 * @property {object[]} _links.collection
 * @property {string} _links.collection.href
 */

class MetaType {
    /**
     * @param {number} id
     * @param {string} key
     * @param {boolean} requiresAdmin If true, only admins will be able to update this meta type.
     * @param {?string} defaultValue The default value to return if the meta type is not set.
     */
    constructor(id, key, requiresAdmin = false, defaultValue = null) {
        this.id = id;
        this.key = key;
        this.requiresAdmin = requiresAdmin;
        this.defaultValue = defaultValue;
    }

    /** @type {number} */ id;
    /** @type {string} */ key;
    /** @type {boolean} */ requiresAdmin;
    /** @type {string} */ defaultValue;
}

export const MetaTypes = {
    BIRTHDAY: new MetaType(1000, 'birthday'),
    WHITES_WHEEL_LOCKED: new MetaType(1001, 'whites_wheel_locked', true, 'true'),
    WHITES_WHEEL_NUMBER: new MetaType(1002, 'whites_wheel_number', true),
    BLACKS_WHEEL_LOCKED: new MetaType(1003, 'blacks_wheel_locked', true, 'true'),
    BLACKS_WHEEL_NUMBER: new MetaType(1004, 'blacks_wheel_number', true),
}

/**
 *
 * @param {number} userId
 * @return {Promise<UserData>}
 */
export async function getUserData(userId) {
    const user = await api.get(`customers/${userId}`);
    /** @type {UserData} */ const data = user.data;

    /** @type {MetaData[]} */ const metaData = data.meta_data ?? [];
    const metaTypes = Object.entries(MetaTypes);
    for (const [_, metaType] of metaTypes) {
        // Append default value just for MetaType with default
        if (metaType.defaultValue == null) continue;

        // Set default value if not already set
        const existingIndex = metaData.findIndex((item) => item.key === metaType.key);
        if (existingIndex < 0) metaData.push({id: metaType.id, key: metaType.key, value: metaType.defaultValue});
    }
    data.meta_data = metaData;

    return data;
}

/**
 * Checks whether a user is administrator.
 * @param {UserData|number} data If `UserData` is passed, it's checked from it. Otherwise, a user id is required, which
 * is used for fetching that user's data.
 * @return {?boolean} May return null of invalid data is passed.
 */
export async function isAdmin(data) {
    if (data.hasOwnProperty('role'))
        return data.role === 'administrator';
    if (typeof data === 'number')
        return (await getUserData(data)).role === 'administrator';
    return null;
}

export const UpdateAccountMetaError = {
    OK: 0,
    REQUIRES_ADMIN: 1
};

/**
 * Updates the metadata for the given user.
 * @param {number} userId
 * @param {MetaData[]} meta
 * @return {Promise<void>}
 */
export async function setUserMeta(userId, meta) {
    await api.post(`customers/${userId}`, {meta_data: meta})
}

/**
 * Updates the metadata value of the given MetaType for the desired user.
 * @param {number} userId
 * @param {MetaType} meta
 * @param {string} value
 * @return {Promise<number>}
 */
export async function updateUserMeta(userId, meta, value) {
    const user = await getUserData(userId);
    const userAdmin = await isAdmin(user);
    if (meta.requiresAdmin && userAdmin !== true)
        return UpdateAccountMetaError.REQUIRES_ADMIN;
    const metadata = user.meta_data;
    const metaIndex = metadata.findIndex((entry) => { return entry.key === meta.key });
    metadata[metaIndex] = { id: meta.id, key: meta.key, value };

    await setUserMeta(userId, metadata);

    return UpdateAccountMetaError.OK
}
