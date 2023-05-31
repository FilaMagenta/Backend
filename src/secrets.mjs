import fs from 'fs/promises';
import path from "path";

import {__dirname} from "./utils.mjs";

const propertiesFile = path.join(__dirname, '..', 'local.properties');

/**
 * Checks whether the given path exists or not.
 * @param {string} file The path of the file to check.
 * @return {Promise<boolean>}
 */
function checkFileExists(file) {
    return fs.access(file, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false)
}

/**
 * Checks for the file that secrets should be fetched from. Uses the PROPERTIES_FILE environment variable if defined.
 * @return {Promise<string>}
 */
async function getPropertiesFile() {
    const envPropertiesFile = process.env.PROPERTIES_FILE;
    if (envPropertiesFile == null || !(await checkFileExists(envPropertiesFile))) {
        if (!(await checkFileExists(propertiesFile)))
            throw new Error('There\'s no local.properties file.');
        return propertiesFile;
    }
    return envPropertiesFile;
}

/**
 * Reads the contents of the secrets file.
 * @return {Promise<Map<string, string>>}
 */
async function read() {
    /** @type {Map<string, string>} */
    const result = new Map();
    try {
        const contents = await fs.readFile(await getPropertiesFile());
        const lines = contents.toString().split('\n');
        for (const line of lines) {
            if (line.startsWith('#')) continue;
            if (line.trim().length <= 0) continue;

            const pair = line.split('=')
            const key = pair[0];
            const value = pair.slice(1).join('=');
            result.set(key, value);
        }
    } catch (e) {
    }
    return result;
}

export default {
    /**
     * Reads the preference at the given key.
     * @param {string} key
     * @return {Promise<string>}
     */
    get: async (key) => {
        const envKey = key.replaceAll('.', '_').toUpperCase();
        return (await read()).get(key) ?? process.env[envKey];
    }
}
