
import {ATTRIBUTE_TABLE} from "./attribute.js";
import {get, post, put} from "./api.mjs";

/**
 * Fetches a list of all the tables created for the event.
 * @param {Event} event
 * @return {Promise<string[]>} The names of all the tables available.
 */
export async function getEventTables(event) {
    console.log(`Getting the id of the table attribute...`);
    const tableAttributeId = await ATTRIBUTE_TABLE.getId();
    if (tableAttributeId == null) throw Error('Could not find the table attribute');
    console.log('Table attribute id:', tableAttributeId);
    console.log(`Getting tables for event ${event.id}`);
    try {
        const request = await get(`products/${event.id}/variations`);
        return request.data
            .filter((data) => data.attributes.find(attr => attr.name === ATTRIBUTE_TABLE.name) != null)
            .map(data => data.attributes)
            .map(/** @type {{id:number,name:string,option:string}[]} */ attrs => attrs.flatMap(attr => attr.option))
            .flatMap(entry => entry);
    } catch (err) {
        // There are no tables
        return [];
    }
}

/**
 * Creates a new table in the event given. Assigns as responsible the user that is creating the table.
 * @param {Event} event
 * @param {UserData} userData
 * @return {?string} `null` if the table already exists, the table name otherwise.
 */
export async function createTable(event, userData) {
    const tableAttributeId = await ATTRIBUTE_TABLE.getId();
    if (tableAttributeId == null) throw Error('Could not find the table attribute');

    const tableName = `${userData.first_name} ${userData.last_name}`;

    const tables = await getEventTables(event);
    console.log('Tables:', tables);
    if (tables.includes(tableName)) {
        return null;
    }
    tables.push(tableName);

    const newAttributes = event.attributes;
    newAttributes.push(
        {
            id: tableAttributeId,
            visible: true,
            position: 1,
            variation: true,
            options: tables
        }
    )
    console.log('Updating event attributes:', newAttributes);
    const putVariationResult = await put(`products/${event.id}`, {attributes: newAttributes})
    if (putVariationResult.status < 200 || putVariationResult.status >= 300)
        console.error('Could not add table variation for event', event.id);

    const variation = {
        attributes: [
            { id: tableAttributeId, option: tableName }
        ],
    };
    console.log(`Creating table for event`, event.id, '- Variation:', variation);
    const variationCreateResult = await post(`products/${event.id}/variations`, variation);
    if (variationCreateResult.status < 200 || variationCreateResult.status >= 300)
        console.error('Could not create table for event', event.id);
    console.log(`  Result:`, variationCreateResult);

    return tableName;
}
