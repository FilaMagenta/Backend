import {get, post} from './api.mjs';

/** @typedef {object} WooCategory
 * @property {?number} id
 * @property {string} name
 * @property {?string} slug
 * @property {?number} parent
 * @property {?string} description
 * @property {?string} display
 * @property {?object} image
 * @property {number} image.id
 * @property {string} image.date_created
 * @property {string} image.date_created_gmt
 * @property {string} image.date_modified
 * @property {string} image.date_modified_gmt
 * @property {string} image.src
 * @property {string} image.name
 * @property {string} image.alt
 * @property {?number} menu_order
 * @property {?number} count
 * @property {object} _links
 * @property {object[]} _links.self
 * @property {string} _links.self.href
 * @property {object[]} _links.collection
 * @property {string} _links.collection.href
 */

/**
 * Caches the ID of each category according to their name.
 * @type {Map<string, number>}}
 */
const CategoryIdsCache = new Map();

class Category {
    /**
     * @param {string} name Category name.
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * Category name.
     * @type {string}
     */
    name;

    /**
     * Creates a new WooCategory object from this.
     * @return {WooCategory}
     */
    async getWooCategory() {
        return { id: await this.getId(), slug: this.name, name: this.name }
    }

    /**
     * Fetches the id of this category.
     * @return {Promise<number|null>} The id of the category, may be null if the category doesn't exist.
     */
    async getId() {
        const id = CategoryIdsCache.get(this.name);
        if (id != null) return id;
        const category = await getCategory(this);
        if (category == null) return null;
        CategoryIdsCache.set(this.name, category.id);
        return category.id;
    }
}

export const CATEGORY_EVENTS = new Category('events');
export const CATEGORY_MEETINGS = new Category('meetings');

/**
 * All the categories required by the backend.
 * @type {Category[]}
 */
export const Categories = [CATEGORY_EVENTS, CATEGORY_MEETINGS];

/**
 * Fetches a list of all the categories available in the server.
 * @return {Promise<WooCategory[]>}
 */
export async function getCategories() {
    const result = await get('products/categories');
    return result.data;
}

/**
 * Fetches a category from the server.
 * @param {Category} category
 * @return {Promise<?WooCategory>}
 */
export async function getCategory(category) {
    const categoriesResult = await get('products/categories', {slug: category.name, per_page: 1});
    /** @type {WooCategory[]} */
    const categories = categoriesResult.data;
    if (categories.length <= 0) return null;
    return categories[0];
}

/**
 * Creates a new category.
 * @param {Category} category
 * @return {Promise<ApiResponse>}
 */
export async function newCategory(category) {
    return await post('products/categories', await category.getWooCategory());
}
