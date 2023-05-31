import {authenticate, sendSuccess} from "../utils.mjs";
import {getEvents} from "../../woo/events.js";

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
