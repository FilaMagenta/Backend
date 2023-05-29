import pkg from '@woocommerce/woocommerce-rest-api';

const WooCommerceRestApi = pkg.default;

import secrets from '../secrets.mjs';

/** @type {WooCommerceRestApi} */
export default new WooCommerceRestApi({
    url: await secrets.get('woo.server'),
    consumerKey: await secrets.get('woo.consumer_key'),
    consumerSecret: await secrets.get('woo.consumer_secret'),
    version: "wc/v3"
});
