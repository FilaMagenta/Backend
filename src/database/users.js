/**
 * This file provides some utility functions for relating database users (tbSocios) with Woo users.
 * @file users.js
 */

/**
 * Gets the idSocio of a Woo user. Requires that the database is being used (open).
 * @param {import('./database.js').Database} database
 * @param {UserData} user
 * @return {Promise<?number>} The id, or null if not found.
 */
export async function getIdSocio(database, user) {
    const dni = user.username;
    const result = await database.select('tbSocios', {columns: ['idSocio'], where: [['Dni', dni]], limit: 1});
    const users = result.recordset;
    if (users.length <= 0) return null;
    return users[0].idSocio;
}
