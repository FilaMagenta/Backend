import {authenticate, sendError, sendSuccess} from "../utils.mjs";
import {getEvents, newEvent} from "../../woo/events.js";
import {isAdmin} from "../../woo/data.mjs";
import errors, {AUTH_FORBIDDEN, UNKNOWN_EVENT_NEW} from "../../errors.mjs";

/**
 * Provides the logic of the events' endpoint.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function eventsEndpoint (req, res) {
    return authenticate(req, res, async (dni, userId) => {
        const data = await getEvents();
        sendSuccess(res, data);
    });
}

/**
 * Provides the logic of the event creation endpoint.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function newEventEndpoint (req, res) {
    return authenticate(req, res, async (dni, userId) => {
        const isUserAdmin = await isAdmin(userId);
        if (isUserAdmin !== true) return sendError(res, AUTH_FORBIDDEN);

        const body = req.body;
        /** @type {?string} */ const name = body.name;
        /** @type {boolean} */ const visible = body.visible ?? true;
        /** @type {?string} */ const description = body.description;
        /** @type {?number} */ const stock = body.stock;
        /**
         * If null or empty, the event is considered to be free.
         * @type {?EventPrice[]}
         */ const prices = body.prices;
        /** @type {?string} */ const until = body.until;
        /** @type {?string} */ const date = body.date;

        if (name == null) return sendError(res, errors.MISSING_NAME);
        if (description == null) return sendError(res, errors.MISSING_DESCRIPTION);
        if (stock == null) return sendError(res, errors.MISSING_STOCK);

        try {
            const productId = await newEvent(name, visible, description, stock, prices, until, date);
            if (productId == null) {
                console.error('Could not create product.');
                return sendError(res, UNKNOWN_EVENT_NEW, 500);
            }

            console.info('Created event', productId, 'successfully.');
            sendSuccess(res);
        } catch (err) {
            console.error('Could not create new event. Error:', err);
            return sendError(res, UNKNOWN_EVENT_NEW, 500, err);
        }
    });
}

// TODO: Event visibility change endpoint
