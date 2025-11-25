import { getResponse } from '../../../../_shared/http/http';
import { LOG } from '../../../../_shared/log/log';
import { substitute } from '../../../../_shared/tools/tools';
import { REVERSE_GEOCODE_API } from './geo.config';
import {
    ADDRESS,
    ADDRESS_ITEM,
    COORD,
    FOUND_COORDS,
    GEO_ID,
    UPDATE_COORD_RESULT,
} from './geo.d';

/**
 * 🎯 get the details to a geo position
 * @param {COOR} coord ➡️ The coordinate with latitude and longitude.
 * @returns {ADDRESS_ITEM} 📤 The address item with details.
 */
export const getReverseGeoData = (coord: COORD): ADDRESS_ITEM => {
    const details = getResponse(
        substitute(REVERSE_GEOCODE_API, {
            LAT: coord.latitude,
            LON: coord.longitude,
        }),
        { ua: ' -A "daten.pm/1.0 (+https://daten.pm; contact@example.com)" ' }
    );
    const cnt = details.content;
    const address = cnt ? JSON.parse(cnt) : {};
    const hasLatLon = address.lat !== undefined && address.lon !== undefined;
    if (details.status !== '200' || !hasLatLon || address.error) {
        LOG.FAIL(
            `Failed to fetch coord data for item ${JSON.stringify(coord)}: ${details.status}`
        );
        LOG.DEBUG(JSON.stringify(details));
        return { id: '-1', address: null, count: 1 };
        // continue;
    }
    const id = getGeoID(coord);
    return { id, address: address as ADDRESS, count: 1 };
};
/**
 * 🎯 get an ID from coords
 * @param {COOR} coord ➡️ The coordinate with latitude and longitude.
 * @returns {string} 📤 The geo ID.
 */
export const getGeoID = (coord: COORD): GEO_ID => {
    return `${coord.latitude}-${coord.longitude}`;
};

/**
 * 🎯 update foundCoords with new item
 * @param {COORD} coord ➡️ The coordinate with latitude and longitude.
 * @param {FOUND_COORDS} foundCoords ➡️ The found coords cache.
 * @returns {UPDATE_COORD_RESULT} 📤 The update result.
 */
export const updateCoordCache = (
    coord: COORD, // TODO: type
    foundCoords: FOUND_COORDS
): UPDATE_COORD_RESULT => {
    const id = getGeoID(coord);
    if (!foundCoords[`${id}`]) {
        const addressItem = getReverseGeoData(coord);
        const isFail = addressItem.id === '-1';
        if (!foundCoords[addressItem.id]) {
            foundCoords[`${addressItem.id}`] = {
                ...addressItem,
            };
        }
        const state = isFail ? 'not_found' : 'found';
        return { state, request: 1 };
    } else {
        foundCoords[`${id}`].count += 1;
        return { state: 'cached', request: 0 };
    }
};
