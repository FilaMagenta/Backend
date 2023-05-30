
import express from 'express';

import loginEndpoint from './endpoints/login.mjs';
import registerEndpoint from './endpoints/register.mjs';
import {getAccountEndpoint, setAccountMetaEndpoint} from './endpoints/account.mjs';
import {MetaTypes} from '../woo/data.mjs';
import {sendError} from "./utils.mjs";
import {UNKNOWN_ENDPOINT} from "../errors.mjs";

/**
 * Starts the webserver on the given port.
 * @param {number} port The port to run the server on.
 */
export function start(port = 3000) {
    const app = express();

    app.use(express.json());

    app.post('/v1/auth/login', loginEndpoint);
    app.post('/v1/auth/register', registerEndpoint);

    app.get('/v1/account', getAccountEndpoint);

    app.post('/v1/account/meta/birthday', setAccountMetaEndpoint(MetaTypes.BIRTHDAY));
    app.post('/v1/account/meta/whites_wheel/locked', setAccountMetaEndpoint(MetaTypes.WHITES_WHEEL_LOCKED));
    app.post('/v1/account/meta/whites_wheel/number', setAccountMetaEndpoint(MetaTypes.WHITES_WHEEL_NUMBER));
    app.post('/v1/account/meta/blacks_wheel/locked', setAccountMetaEndpoint(MetaTypes.BLACKS_WHEEL_LOCKED));
    app.post('/v1/account/meta/blacks_wheel/number', setAccountMetaEndpoint(MetaTypes.BLACKS_WHEEL_NUMBER));

    app.get('*', (req, res) => {
        sendError(res, UNKNOWN_ENDPOINT, 404);
    });

    app.listen(port, () => {
        console.info(`Webserver running on http://localhost:${port}`);
    });
}