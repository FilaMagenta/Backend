
class Transaction {
    /**
     * Instantiates a new Transaction instance.
     * @param {number} id
     * @param {number} userId
     * @param {Date} date
     * @param {string} description
     * @param {number} units
     * @param {number} ppu Price Per Unit
     * @param {number} total
     */
    constructor(id, userId, date, description, units, ppu, total) {
        this.id = id;
        this.userId = userId;
        this.date = date;
        this.description = description;
        this.units = units;
        this.ppu = ppu;
        this.total = total;
    }

    /** @type {number} */ id;
    /** @type {number} */ userId;
    /** @type {Date} */ date;
    /** @type {string} */ description;
    /** @type {number} */ units;
    /** @type {number} */ ppu;
    /** @type {number} */ total;
}

/**
 * @typedef {Object} DatabaseTransaction
 * @property {number} idApunte
 * @property {number} idSocio
 * @property {Date} Fecha
 * @property {string} Concepto
 * @property {number} Unidades
 * @property {number} Precio
 * @property {number} DtoPP
 * @property {number} Importe
 * @property {string} Tipo
 * @property {number} idTitApunte
 * @property {number} idArticulo
 * @property {number} Remesado
 * @property {Date} FechaCobroRemesa
 * @property {number} EntregaCta
 * @property {number} OtrosGastos
 * @property {string} ObsOtrosGastos
 */

/**
 *
 * @return {Promise<void>}
 */
export async function getTransactions() {

}
