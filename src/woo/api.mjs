import pkg from '@woocommerce/woocommerce-rest-api';

const WooCommerceRestApi = pkg.default;

import secrets from '../secrets.mjs';
import {getCategories, newCategory, Categories} from "./category.js";
import {Attributes, getAttributes, newAttribute} from "./attribute.js";

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
 * @typedef {Object} ApiResponse
 * @property {number} status
 * @property {string} statusText
 * @property {Map<string, string>} headers
 * @property {Object} config
 * @property {Object|Object[]} data
 */

/**
 * Performs a GET request on the Woo API.
 * @param {string} endpoint
 * @param {Object} params
 * @return {Promise<ApiResponse>}
 */
export async function get(endpoint, params = {}) {
    let attempts = 0;
    while (attempts < 5) {
        try {
            return await api.get(endpoint, params)
        } catch (err) {
            if (err?.code === 'ECONNRESET') {
                // Ignore ECONNRESET errors
            } else
                throw err;
        }
        attempts++;
    }
}

/**
 * Performs a POST request on the Woo API.
 * @param {string} endpoint
 * @param {Object} data
 * @param {Object} params
 * @return {Promise<ApiResponse>}
 */
export async function post(endpoint, data = {}, params = {}) {
    let attempts = 0;
    while (attempts < 5) {
        try {
            return await api.post(endpoint, data, params)
        } catch (err) {
            if (err?.code === 'ECONNRESET') {
                // Ignore ECONNRESET errors
            } else
                throw err;
        }
        attempts++;
    }
}

/**
 * Performs a PUT request on the Woo API.
 * @param {string} endpoint
 * @param {Object} data
 * @param {Object} params
 * @return {Promise<ApiResponse>}
 */
export async function put(endpoint, data = {}, params = {}) {
    let attempts = 0;
    while (attempts < 5) {
        try {
            return await api.put(endpoint, data, params)
        } catch (err) {
            if (err?.code === 'ECONNRESET') {
                // Ignore ECONNRESET errors
            } else
                throw err;
        }
        attempts++;
    }
}

/**
 * Performs a get request on a desired page.
 * @param {string} endpoint
 * @param {Object} options
 * @param {number} page
 * @param {number} per_page
 * @return {Promise<ApiResponseList>}
 */
async function getPage(endpoint, options, page = 1, per_page = 10) {
    options['per_page'] = per_page;
    options['page'] = page;
    return await get(endpoint, options)
}

/**
 * Runs a GET request on an endpoint supporting multiple pages.
 * @param {string} endpoint
 * @param {Object} options
 * @return {Promise<Object[]>}
 */
export async function multiGet(endpoint, options = {}) {
    const list = [];
    /** @type {ApiResponseList} */
    let result;
    let page = 1;
    do {
         result = await getPage(endpoint, options, page++);
         for (const item of result.data) list.push(item);
    } while (parseInt(result.headers['w-wp-totalpages']) > page)
    return list;
}

/**
 * Initializes the target WooCommerce installation. Creating all the categories and background necessary.
 * @return {Promise<void>}
 */
export async function initApi() {
    console.info('Initializing Woo API...');

    console.info('Preparing categories...');
    const categories = await getCategories();
    for (const category of Categories) {
        // Check if the category already exists
        const existingCategory = categories.find((cat) => cat.name === category.name);
        if (existingCategory != null) continue;
        // If it doesn't exist, create
        console.info(`  Creating category #${category.name}...`);
        const result = await newCategory(category);
        console.info(`  Create result:`, result);
    }
    console.info('  All categories ready!');

    console.info('Preparing attributes...');
    const attributes = await getAttributes();
    for (const attribute of Attributes) {
        // Check if already exists
        const existing = attributes.find((item) => item.name === attribute.name);
        if (existing != null) continue;
        // If it doesn't exist, create
        console.info(`  Creating attribute #${attribute.name}...`);
        const result = await newAttribute(attribute);
        console.info(`  Create result (${result.status}):`, result.statusText);
    }
    console.info('  All attributes ready!');
}
