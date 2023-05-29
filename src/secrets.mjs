import fs from 'fs/promises';
import path from "path";

import {__dirname} from "./utils.mjs";

const propertiesFile = path.join(__dirname, '..', 'local.properties');

/**
 * Reads the contents of the secrets file.
 * @return {Promise<Map<string, string>>}
 */
async function read() {
    const contents = await fs.readFile(propertiesFile);
    const lines = contents.toString().split('\n');
    /** @type {Map<string, string>} */
    const result = new Map();
    for (const line of lines) {
        const pair = line.split('=')
        const key = pair[0];
        const value = pair.slice(1).join('=');
        result.set(key, value);
    }
    return result;
}

export default {
    /**
     * Reads the preference at the given key.
     * @param {string} key
     * @return {Promise<string>}
     */
    get: async (key) => (await read()).get(key)
}
