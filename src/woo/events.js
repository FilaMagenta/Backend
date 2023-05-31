/** @typedef {object} Event
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 * @property {string} permalink
 * @property {string} date_created
 * @property {string} date_created_gmt
 * @property {string} date_modified
 * @property {string} date_modified_gmt
 * @property {string} type
 * @property {string} status
 * @property {boolean} featured
 * @property {string} catalog_visibility
 * @property {string} description
 * @property {string} short_description
 * @property {string} sku
 * @property {string} price
 * @property {string} regular_price
 * @property {string} sale_price
 * @property {null} date_on_sale_from
 * @property {null} date_on_sale_from_gmt
 * @property {null} date_on_sale_to
 * @property {null} date_on_sale_to_gmt
 * @property {string} price_html
 * @property {boolean} on_sale
 * @property {boolean} purchasable
 * @property {number} total_sales
 * @property {boolean} virtual
 * @property {boolean} downloadable
 * @property {[]} downloads
 * @property {number} download_limit
 * @property {number} download_expiry
 * @property {string} external_url
 * @property {string} button_text
 * @property {string} tax_status
 * @property {string} tax_class
 * @property {boolean} manage_stock
 * @property {null} stock_quantity
 * @property {string} stock_status
 * @property {string} backorders
 * @property {boolean} backorders_allowed
 * @property {boolean} backordered
 * @property {boolean} sold_individually
 * @property {string} weight
 * @property {object} dimensions
 * @property {string} dimensions.length
 * @property {string} dimensions.width
 * @property {string} dimensions.height
 * @property {boolean} shipping_required
 * @property {boolean} shipping_taxable
 * @property {string} shipping_class
 * @property {number} shipping_class_id
 * @property {boolean} reviews_allowed
 * @property {string} average_rating
 * @property {number} rating_count
 * @property {number[]} related_ids
 * @property {[]} upsell_ids
 * @property {[]} cross_sell_ids
 * @property {number} parent_id
 * @property {string} purchase_note
 * @property {object[]} categories
 * @property {number} categories.id
 * @property {string} categories.name
 * @property {string} categories.slug
 * @property {[]} tags
 * @property {object[]} images
 * @property {number} images.id
 * @property {string} images.date_created
 * @property {string} images.date_created_gmt
 * @property {string} images.date_modified
 * @property {string} images.date_modified_gmt
 * @property {string} images.src
 * @property {string} images.name
 * @property {string} images.alt
 * @property {[]} attributes
 * @property {[]} default_attributes
 * @property {[]} variations
 * @property {[]} grouped_products
 * @property {number} menu_order
 * @property {[]} meta_data
 * @property {object} _links
 * @property {object[]} _links.self
 * @property {string} _links.self.href
 * @property {object[]} _links.collection
 * @property {string} _links.collection.href
 */


import {get, post} from "./api.mjs";
import {CATEGORY_EVENTS} from "./category.js";
import {ATTRIBUTE_SECTION} from "./attribute.js";

/**
 * Fetches all the events available in the server.
 * @return {Promise<Event[]>}
 */
export async function getEvents() {
    const eventsCategory = await CATEGORY_EVENTS.getId();
    const result = await get('products', {category: eventsCategory})
    return result.data;
}

/**
 * @typedef {Object} EventPrice
 * @property {UserSection} section
 * @property {number} price
 */

/**
 *
 * @param {string} name The name of the event.
 * @param {boolean} visible Whether the event should be visible to normal users. Events are always visible for admins.
 * @param {string} description The description of the event.
 * @param {number} stock The amount of stock the event has.
 * @param {?EventPrice[]} prices A list of prices for the event. If null or empty, the event is free.
 * @return {Promise<?number>}
 */
export async function newEvent(name, visible, description, stock, prices) {
    const isFree = prices == null || prices.length <= 0;
    const attribute = await ATTRIBUTE_SECTION.getWooAttribute();

    // Create product
    const product = {
        name,
        visible,
        description,
        manage_stock: true,
        stock_quantity: stock,
        categories: [
            await CATEGORY_EVENTS.getWooCategory(),
        ],
        attributes: isFree ? [] : [
            {
                id: attribute.id,
                visible: true,
                position: 0,
                variation: true,
                options: prices.map((price) => price.section)
            }
        ],
        virtual: true,
        shipping_required: false,
        type: isFree ? 'simple' : 'variable'
    };
    if (isFree) product.regular_price = 0;
    console.log('Creating product:', product);
    const createResult = await post('products', product);
    if (createResult.status < 200 || createResult.status >= 300) return null;
    const productId = createResult.data.id;

    // Set price if any
    if (!isFree) {
        // There are prices, create variations
        console.log(`Creating ${prices.length} variants for #${productId}`);
        for (let c = 0; c < prices.length; c++) {
            const price = prices[c];
            const variation = {
                // description: 'Section',
                regular_price: price.price,
                // purchasable: true,
                // virtual: true,
                attributes: [
                    { id: attribute.id, option: price.section }
                ],
                // sku: `${productId}-section-${price.section}`
            }
            console.log(`Creating variation for section`, price.section, '- Variation:', variation);
            const variationCreateResult = await post(`products/${productId}/variations`, variation);
            if (variationCreateResult.status < 200 || variationCreateResult.status >= 300)
                console.error('Could not create variation for price:', price, '- Product ID:', productId);
            console.log(`  Result:`, variationCreateResult);
        }
    }

    return productId;
}
