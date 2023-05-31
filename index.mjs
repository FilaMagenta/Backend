import {start as startServer} from './src/server/server.mjs';
import {initApi} from "./src/woo/api.mjs";

initApi().then(() => {
    startServer();
})
