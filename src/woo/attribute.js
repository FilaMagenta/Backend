
/** @typedef {object} WooAttribute
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 * @property {string} type
 * @property {string} order_by
 * @property {boolean} has_archives
 * @property {object} _links
 * @property {object[]} _links.self
 * @property {string} _links.self.href
 * @property {object[]} _links.collection
 * @property {string} _links.collection.href
 */

import {get, multiGet, post} from "./api.mjs";

/**
 * Caches the ID of each attribute according to their name.
 * @type {Map<string, number>}}
 */
const AttributeIdsCache = new Map();

class Attribute {
    /**
     * Creates a new Attribute
     * @param {string} name
     */
    constructor(name) {
        this.name = name;
    }

    /** @type {string} */
    name;

    /**
     * Creates a new WooCategory object from this.
     * @return {WooAttribute}
     */
    async getWooAttribute() {
        return { id: await this.getId(), slug: this.name, name: this.name }
    }

    /**
     * Fetches the id of this category.
     * @return {Promise<number|null>} The id of the category, may be null if the category doesn't exist.
     */
    async getId() {
        console.log('Getting id of', this.name);
        const id = AttributeIdsCache.get(this.name);
        if (id != null) return id;
        console.log('Fetching', this.name, 'attribute from server...');
        const value = await getAttribute(this);
        console.log('Get attribute:', value);
        if (value == null) return null;
        AttributeIdsCache.set(this.name, value.id);
        return value.id;
    }
}

export const ATTRIBUTE_SECTION = new Attribute('section');
export const ATTRIBUTE_TABLE = new Attribute('table');

/**
 * All the attributes required by the backend.
 * @type {Attribute[]}
 */
export const Attributes = [ATTRIBUTE_SECTION, ATTRIBUTE_TABLE];

/**
 * Fetches a list of all the attributes available in the server.
 * @return {Promise<WooAttribute[]>}
 */
export async function getAttributes() {
    const result = await get('products/attributes');
    return result.data;
}

/**
 * Fetches an attribute from the server.
 * @param {Attribute} attribute
 * @return {Promise<?WooAttribute>}
 */
export async function getAttribute(attribute) {
    /** @type {WooAttribute[]} */
    const list = await multiGet('products/attributes');
    console.log('getAttribute:', list);
    console.log('length:', list.length);
    if (list.length <= 0) return null;
    console.log('Finding with name ===', attribute.name);
    return list.find(item => item.name === attribute.name);
}

/**
 * Creates a new attribute.
 * @param {Attribute} attribute
 * @return {Promise<ApiResponse>}
 */
export async function newAttribute(attribute) {
    return await post('products/attributes', await attribute.getWooAttribute());
}
