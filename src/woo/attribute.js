
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

import {get, post} from "./api.mjs";

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
        const id = AttributeIdsCache.get(this.name);
        if (id != null) return id;
        const category = await getAttribute(this);
        if (category == null) return null;
        AttributeIdsCache.set(this.name, category.id);
        return category.id;
    }
}

export const ATTRIBUTE_SECTION = new Attribute('section');

/**
 * All the attributes required by the backend.
 * @type {Attribute[]}
 */
export const Attributes = [ATTRIBUTE_SECTION];

/**
 * Fetches a list of all the attributes available in the server.
 * @return {Promise<WooAttribute[]>}
 */
export async function getAttributes() {
    const result = await get('products/attributes');
    return result.data;
}

/**
 * Fetches a attribute from the server.
 * @param {Attribute} attribute
 * @return {Promise<?WooAttribute>}
 */
export async function getAttribute(attribute) {
    const result = await get('products/attributes', {slug: attribute.name, per_page: 1});
    /** @type {WooAttribute[]} */
    const list = result.data;
    if (list.length <= 0) return null;
    return list[0];
}

/**
 * Creates a new attribute.
 * @param {Attribute} attribute
 * @return {Promise<ApiResponse>}
 */
export async function newAttribute(attribute) {
    return await post('products/attributes', await attribute.getWooAttribute());
}
