import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Creates a hash from a plaintext password.
 * @param {string} password
 * @return {Promise<string>}
 */
export async function hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifies that a stored hash matches a password to test.
 * @param {string} password
 * @param {string} hash
 * @return {Promise<boolean>}
 */
export async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}
