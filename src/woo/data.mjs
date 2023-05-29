import api from "./api.mjs";

/** @typedef {object} UserData
 * @property {number} id
 * @property {string} date_created
 * @property {string} date_created_gmt
 * @property {string} date_modified
 * @property {string} date_modified_gmt
 * @property {string} email
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} role
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
 * @property {object[]} meta_data
 * @property {number} meta_data.id
 * @property {string} meta_data.key
 * @property {string} meta_data.value
 * @property {object} _links
 * @property {object[]} _links.self
 * @property {string} _links.self.href
 * @property {object[]} _links.collection
 * @property {string} _links.collection.href
 */

/**
 *
 * @param {number} userId
 * @return {Promise<UserData>}
 */
export async function getUserData(userId) {
    const user = await api.get(`customers/${userId}`);
    return user.data;
}
