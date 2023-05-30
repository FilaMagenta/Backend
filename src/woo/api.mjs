import pkg from '@woocommerce/woocommerce-rest-api';

const WooCommerceRestApi = pkg.default;

import secrets from '../secrets.mjs';

/** @type {WooCommerceRestApi} */
const api = new WooCommerceRestApi({
    url: await secrets.get('woo.server'),
    consumerKey: await secrets.get('woo.consumer_key'),
    consumerSecret: await secrets.get('woo.consumer_secret'),
    version: "wc/v3"
});

export default api;

/**
 * @typedef {Object} ApiResponseList
 * @property {number} status
 * @property {string} statusText
 * @property {Map<string, string>} headers
 * @property {Object} config
 * @property {Object[]} data
 */

/**
 * Performs a get request on a desired page.
 * @param {string} endpoint
 * @param {number} page
 * @param {number} per_page
 * @return {Promise<ApiResponseList>}
 */
async function getPage(endpoint, page = 1, per_page = 10) {
    return await api.get(endpoint, {per_page, page})
}

/**
 * Runs a GET request on an endpoint supporting multiple pages.
 * @param {string} endpoint
 * @return {Promise<Object[]>}
 */
export async function multiGet(endpoint) {
    const list = [];
    /** @type {ApiResponseList} */
    let result;
    let page = 1;
    do {
         result = await getPage(endpoint, page++);
         for (const item of result.data) list.push(item);
    } while (parseInt(result.headers['w-wp-totalpages']) > page)
    return list;
}
