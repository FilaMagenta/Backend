import {start as startServer} from './src/server/server.mjs';
import {initApi} from "./src/woo/api.mjs";
import {initDatabase} from "./src/database/database.js";

initApi().then(async () => {
    await initDatabase();

    startServer();
})
