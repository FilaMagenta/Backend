import mssql from 'mssql';
import secrets from "../secrets.mjs";

export class Database {
    /**
     * Instantiates a new database object.
     * @param {string} server
     * @param {number} port
     * @param {string} database
     * @param {string} username
     * @param {string} password
     */
    constructor(server, port, database, username, password) {
        this.server = server;
        this.port = port;
        this.database = database;
        this.username = username;
        this.password = password;
    }

    /** @type {string} */ server;
    /** @type {number} */ port;
    /** @type {string} */ database;
    /** @type {string} */ username;
    /** @type {string} */ password;
    /** @type {string} */ schema;

    /** @type {?ConnectionPool} */ db;

    /**
     * @callback UseLogic
     * @template Result
     * @async
     * @param {Database} db
     * @return {Promise<Result>}
     */

    /**
     * @typedef {Object} SQLQueryResult
     * @template RowType
     * @property {RowType[][]} recordsets
     * @property {RowType[]} recordset
     * @property {Object} output
     * @property {number[]} rowsAffected
     */

    /** @typedef {?string[]} SelectColumns */
    /** @typedef {?([key:string,value:string]|string)[]} SelectWhere */

    /**
     * Runs a SELECT query on the database.
     * @template RowType
     * @param {string} table The name of the table to select from.
     * @param {?{columns:SelectColumns,where:SelectWhere,limit?:number}} options
     * @return {Promise<SQLQueryResult<RowType>>}
     */
    select(table, options = null) {
        const {columns, where, limit} = options;
        const selector = columns == null || columns.length <= 0 ? '*' : columns.join(', ');
        const whereStr = where == null || where.length <= 0 ? '' :
            ` WHERE ` + where.map((entry) => {
                if (typeof entry === 'string') return entry;
                const [k,v] = entry;
                return `${k}='${v}'`
            }).join(', ');
        const limitStr = limit == null || limit <= 0 ? '' : ` LIMIT ${limit}`;
        return this.db.query(`SELECT ${selector} FROM ${table}${whereStr}${limitStr}`);
    }

    /**
     * Runs one or more queries to the database.
     * @template Result
     * @param {UseLogic<Result>} block
     * @return {Promise<Result>}
     */
    async use(block) {
        try {
            this.db = await mssql.connect({
                user: this.username,
                password: this.password,
                database: this.database,
                server: this.server,
                pool: {
                    max: 10,
                    min: 0,
                    idleTimeoutMillis: 30000
                },
                options: {
                    encrypt: false, // for azure
                    trustServerCertificate: false // change to true for local dev / self-signed certs
                }
            });
            return await block(this);
        } finally {
            await this.db?.close();
        }
    }
}

/** @type {?Database} */
let database;

export async function initDatabase() {
    console.info('Initializing MSSQL database...');
    database = new Database(
        await secrets.get('mssql.server'),
        parseInt(await secrets.get('mssql.port')),
        await secrets.get('mssql.database'),
        await secrets.get('mssql.username'),
        await secrets.get('mssql.password'),
    );
    console.info('Checking if tables are available...');
    await database.use(async (db) => {
        /** @type {SQLQueryResult} */
        const transactions = await db.select('tbApuntesSocios');
        console.log(transactions.recordset.length, 'transactions available.');
    })
}
