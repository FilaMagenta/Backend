import pkg from '@woocommerce/woocommerce-rest-api';

const WooCommerceRestApi = pkg.default;

import secrets from '../secrets.mjs';
import {getCategories, newCategory, Categories} from "./category.js";

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
 * Performs a GET request on the Woo API.
 * @param {string} endpoint
 * @param {Object} params
 * @return {Promise<ApiResponseList>}
 */
export async function get(endpoint, params = {}) {
    return await api.get(endpoint, params)
}

/**
 * Performs a POST request on the Woo API.
 * @param {string} endpoint
 * @param {Object} data
 * @param {Object} params
 * @return {Promise}
 */
export async function post(endpoint, data = {}, params = {}) {
    return await api.post(endpoint, data, params)
}

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

/**
 * Initializes the target WooCommerce installation. Creating all the categories and background necessary.
 * @return {Promise<void>}
 */
export async function initApi() {
    const categories = await getCategories();
    console.info('Categories:', categories);
    console.info('Initializing Woo API...');
    for (const category of Categories) {
        // Check if the category already exists
        const existingCategory = categories.find((cat) => cat.name === category.name);
        if (existingCategory != null) continue;
        // If it doesn't exist, create
        console.info(`Creating category #${category.name}...`);
        const result = await newCategory(category);
        console.info(`Create result:`, result);
    }
    console.info('All categories ready!');
}
