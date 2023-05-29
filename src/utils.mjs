import {dirname} from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs';
import path from 'path';

export const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @param {string} [startPath]
 * @returns {string}
 */
export const getRootFromNodeModules = (startPath = __dirname) => {

    //avoid loop if reached root path
    if (startPath === path.parse(startPath).root) return startPath;

    const isRoot = fs.existsSync(path.join(startPath, "node_modules"));
    if (isRoot) return startPath;

    return getRootFromNodeModules(path.dirname(startPath));
};
