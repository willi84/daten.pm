import { FS } from '../../_shared/fs/fs';
import { generateID } from './_shared/utils/utils';
import { getCivicIssuesData } from './civic_issues/civic_issues';
import { COORD, FOUND_COORDS } from './endpoints/geo/geo.d';
import { getReverseGeoData } from './endpoints/geo/geo';
import { FILE_ITEM, getDataFromfile, saveDataTofile } from './endpoints/endpoints';
import { LOG } from '../../_shared/log/log';
import { getUDPProjects } from './endpoints/udp/udp';

export const getStreets = () => {
    const result: any = {};
    const data = FS.readFile('src/_data/streets_raw.json') as any;
    for (const item of data) {
        // console.log(
        //     `${item.strn} => ${makeStreetID(item.strn)}`
        // );
        const streetID = generateID(item.strn);
        if (!result[streetID]) {
            result[streetID] = {
                strn: item.strn,
                id: streetID,
                synonyms: [item.strn],
                // plz: item.plz,
                // ort: item.ort,
                // count: 0,
            };
        }
    }
    FS.writeFile('src/_data/streets.json', {
        data: Object.values(result),
    });
    // console.log(result);
    return result;
};
const getMain = (cache = true) => {
    const streets = getStreets();
    // console.log(streets);

    const allData: any = {};
    // const coordFile = `src/_data/coords_cache.json`;
    // const hasCachedCoord = FS.hasFile(coordFile);
    // // console.log('total civic issues', result.total);
    // const foundCoords: FOUND_COORDS = hasCachedCoord
    //     ? (FS.readFile(coordFile) as FOUND_COORDS)
    //     : {};
    const FILE_COORD: FILE_ITEM = {
        key: 'coords_cache',
        path: `src/_data/coords_cache.json`,
    };
    const foundCoords = getDataFromfile(FILE_COORD, {}) as FOUND_COORDS;

    const result = getCivicIssuesData(foundCoords, cache);
    const civicIssue: any = result.issues;
    saveDataTofile(FILE_COORD, foundCoords);
    // FS.writeFile(FILE_COORD.path, foundCoords, 'replace', true); // TODO: testen ob updated
    // console.log(civicIssue.items[0]);
    for (const streetKey of Object.keys(streets)) {
        allData[streetKey] = {
            dataSet: ['streets'],
            streetID: streets[streetKey].id,
            streetName: streets[streetKey].strn,
        };
    }
    for (const item of civicIssue.items) {
        // console.log(item);
        const streetID = item.streetID;
        const streetName = item.streetName;
        const streetItem = streets[streetID];
        if (streetID && streetName) {
            if (!allData[streetID]) {
                LOG.WARN(`Missing street in allData: ${streetID} | ${streetName}`);
                console.log('missing street?', streetID, streetName);
                allData[streetID] = {
                    dataSet: ['streets'],
                    streetID,
                    streetName,
                };
            }
            if (!allData[streetID].dataSet.includes('civic_issues')) {
                allData[streetID].dataSet.push('civic_issues');
            }
        } else {
            // allData[streetID] = {
            //     dataSet: ['streets'],
            //     streetID,
            //     streetName,
            // };
        }
        if (streetItem) {
            if (!streetItem.synonyms.includes(streetName)) {
                streetItem.synonyms.push(streetName);
            }
        }
        // console.log(streetID, streetName);
    }
    FS.writeFile('src/_data/repos/all.json', allData);
    FS.writeFile('src/_data/streets.json', streets);
};

// const coord: COORD = {
//     // latitude: 1,
//     // longitude: 3,
//     latitude: 52.3864838069137,
//     longitude: 13.0633286473943,
// };
// const details = getReverseGeoData(coord);
// console.log(details);

getMain(false);
const udpData = getUDPProjects();
FS.writeFile('src/_data/udp.json', udpData, 'replace', true);
