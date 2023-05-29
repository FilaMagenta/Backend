
import express from 'express';

import loginEndpoint from './endpoints/login.mjs';

/**
 * Starts the webserver on the given port.
 * @param {number} port The port to run the server on.
 */
export function start(port = 3000) {
    const app = express();

    app.use(express.json());

    app.post('/v1/auth/login', loginEndpoint);

    app.get('*', (req, res) => {
        res.send('Hello world!');
    });

    app.listen(port, () => {
        console.info(`Webserver running on http://localhost:${port}`);
    });
}