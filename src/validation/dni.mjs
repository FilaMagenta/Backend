/**
 * Collects all the letters available for validating each DNI modulus.
 * @type {string}
 */
const dniLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';

/**
 * Obtains the letter a given DNI should have.
 * @param {string} dni
 * @return {string}
 */
function dniLetter(dni) {
    const numStr = dni.substring(0, 8)
    const num = parseInt(numStr);
    const mod = num % 23;
    return dniLetters[mod];
}

export default {
    /**
     * Checks whether the given DNI is valid or not.
     * @param {string} dni The DNI to check for.
     * @return {boolean} If the DNI is valid.
     */
    validate: (dni) => {
        return dni.length === 9 && dniLetter(dni) === dni[8];
    }
}