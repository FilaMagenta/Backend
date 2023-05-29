import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from "path";
import {getRootFromNodeModules} from "../utils.mjs";

/** In how many days does the token expire. */
const TOKEN_EXPIRATION_DAYS = 15;

async function readPrivateKey() {
    const privateKeyFile = path.join(getRootFromNodeModules(), 'keys', 'private.key');
    return await fs.readFile(privateKeyFile);
}

async function readPublicKey() {
    const privateKeyFile = path.join(getRootFromNodeModules(), 'keys', 'public.key');
    return await fs.readFile(privateKeyFile);
}

/**
 * Signs some data using jsonwebtoken. Expires in 15 days by default.
 * @param {Object} data The data to sign
 * @param {number} expiresIn The amount of days until the token expires.
 * @return {Promise<string>}
 */
export async function sign(data, expiresIn = TOKEN_EXPIRATION_DAYS) {
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * expiresIn),
        data
    }, await readPrivateKey(), { algorithm: 'RS256' });
}

/**
 * @typedef {Object} VerifyResult
 * @property {number} exp
 * @property {number} iat
 * @property {Object} data
 */

/**
 * Verifies that a token is valid.
 * @param {string} token The token to verify.
 * @return {Promise<VerifyResult>} The decoded data for token.
 */
export async function verify(token) {
    return jwt.verify(token, await readPublicKey(), { algorithm: 'RS256' })
}
