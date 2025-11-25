import { FS } from '../../../_shared/fs/fs';
import { getHttpBase, getResponse } from '../../../_shared/http/http';
import { LOG } from '../../../_shared/log/log';
import { substitute } from '../../../_shared/tools/tools';
import { generateID, sleepSync } from '../_shared/utils/utils';
import { REQUEST_PARAMS } from './../index.d';
import { getData } from '../endpoints/endpoints';
import { getGeoID, updateCoordCache } from '../endpoints/geo/geo';
import { COORD, FOUND_COORDS } from '../endpoints/geo/geo.d';
import {
    CIVIC_ISSUES_DATA,
    CIVIC_ISSUES_DATA_EXTENDED,
    CIVIC_ISSUE_EXTENDED_ITEM,
    CIVIC_ISSUE_ITEM,
    UPDATE_DATA,
} from './civic_issues.d';
import { FILE_ITEM } from '../endpoints/endpoints';

LOG.OK('API started');
export const getDataByAPI = (target: string, opts = {}) => {
    // LOG.INFO(`Fetching ${target} data from API...`);
    const data = getResponse(target, opts );
    if (data && data.content) {
        // LOG.OK(`Data fetched successfully from ${target}`);
        // LOG.DEBUG(data.content);
        return JSON.parse(data.content);
    } else {
        LOG.FAIL(`Failed to fetch data from ${target}`);
        return {};
    }
};

export const getTargetItems = (requestConfig: REQUEST_PARAMS): object => {
    // let maxItems: number = -1;
    // let offset = 0;
    let allData: any[] = [];
    for (const state of requestConfig.STATES) {
        const target = substitute(requestConfig.ENDPOINT, {
            PROVIDER: requestConfig.PROVIDER,
            STATE: state,
            LIMIT: requestConfig.LIMIT,
            // OFFSET: offset.toString(),
            OFFSET: requestConfig.OFFSET_START.toString(),
        });
        // LOG.INFO(`Fetching data from ${target}...`);
        const opts = { method: 'GET', timeout: '10.0' };
        const status = getHttpBase(target, opts);
        LOG.OK(`HTTP Status for ${target}: ${status.status}`);
        const data = getDataByAPI(target, opts) as any;
        // console.log(target);
        // console.log(data);
        const maxItems = data[requestConfig.MAX_ITEMS];
        const itemsByCategory = [];
        console.log(data)
        if(Object.keys(data).length === 0){
            LOG.FAIL('Problem with fetching issue data');
        }
        itemsByCategory.push(...data[requestConfig.PROPERTY_DATESETS]);
        const iterations = Math.ceil(
            maxItems / parseInt(requestConfig.LIMIT, 10)
        );
        for (let i = 1; i < iterations; i++) {
            const target2 = substitute(requestConfig.ENDPOINT, {
                PROVIDER: requestConfig.PROVIDER,
                STATE: state,
                LIMIT: requestConfig.LIMIT,
                OFFSET: i.toString(),
                // OFFSET: (offset * parseInt(requestConfig.LIMIT, 10)).toString(),
            });
            const data = getDataByAPI(target2) as any;
            const items = data[requestConfig.PROPERTY_DATESETS];
            itemsByCategory.push(...items);
            LOG.OK(
                `received data [${i + 1}/${iterations}] with ${items.length} items ...`
            );
        }
        // console.log('total items', itemsByCategory.length, 'maxItems', maxItems);
        // offset = 0;
        allData.push(...itemsByCategory);
        LOG.OK(`Total items for state ${state}: ${itemsByCategory.length}`);
    }
    console.log('all data items', allData.length);
    return {
        items: allData,
        total: allData.length,
    };
};

// todo: create repo folder

// const cateories: string[] = ['IN_PROCESS'];
const cateories: string[] = ['OPEN', 'CLOSED', 'NOT_RESPONSIBLE', 'IN_PROCESS'];
const ENDPOINT = `{PROVIDER}/findPageableReportsWithFilter?filteredStates={STATE}&flawReporterId=3&limit={LIMIT}&offset={OFFSET}`;

const REQUEST_CONFIG: REQUEST_PARAMS = {
    MAX_ITEMS: 'totalCnt',
    PROPERTY_DATESETS: 'reports',
    KEY_OFFSET: 'OFFSET',
    ENDPOINT,
    PROVIDER: 'https://mitgestalten.potsdam.de/backend/v1/flaw-reporter',
    STATES: cateories,
    // LIMIT: '3',
    OFFSET_START: 0,
    LIMIT: '100',
};

export const getCivicIssuesData = (
    foundCoords: FOUND_COORDS,
    cache = true
): UPDATE_DATA => {
    // try{
    const ISSUES_FILE: FILE_ITEM = {
        key: 'civic_issues',
        path: `src/_data/raw/civic_issues.json`,
    };
    const data: CIVIC_ISSUES_DATA = getData(ISSUES_FILE, REQUEST_CONFIG, cache);
    FS.writeFile(`src/_data/debug.json`, data, 'replace', true);
    const items = data.items;
    const finalFile = `src/_data/repos/civic_issues.json`;
    const finalFile2 = `src/_data/repos/civic_issues_2.json`;
    const finalFileFinal = `src/_data/repos/civic_issues_final.json`;
    // const coordFile = `src/_data/coords_cache.json`;
    // console.log(items);
    const result: { items: any[] } = {
        items: [],
        // total: data.total,
    };

    // reset foundCoords counting
    for (const key of Object.keys(foundCoords)) {
        foundCoords[key].count = 0;
    }

    const loadFresh = cache === true ? !FS.hasFile(finalFile) : true;
    if (loadFresh) {
        let requestedCnt = 0;
        for (let i = 0; i < items.length; i++) {
            const item: CIVIC_ISSUE_ITEM = items[i];
            if ((requestedCnt + 1) % 50 === 0) {
                LOG.INFO(`Warte 3 Sekunden nach ${requestedCnt + 1} Items...`);
                sleepSync(3000);
                requestedCnt += 1; // to avoid double wait on next found
            }
            // const coordinate = item.coordinate;
            const coord: COORD = item.coordinate;
            const id = getGeoID(coord);
            const updateResult = updateCoordCache(coord, foundCoords);
            if (updateResult.request > 0) {
                requestedCnt += updateResult.request;
            }
            const current = `[${i + 1}/${items.length}|${requestedCnt}]`;
            if (updateResult.state === 'found') {
                LOG.OK(`🕵🏻 ${current} coord found ${id}`);
            } else if (updateResult.state === 'not_found') {
                LOG.FAIL(`🕵🏻 ${current} coord NOT found ${id}`);
            } else if (updateResult.state === 'cached') {
                LOG.INFO(`🚀 ${current} Skipping dup ${id}`);
            }
            const address = foundCoords[`${id}`].address;
            let streetID = null;
            let streetName = null;
            if (address && address.address) {
                streetName = address.address.road || null;
                streetID = streetName ? generateID(streetName, 'street') : null;
            } else {
                // item.streetID = null;
            }
            const allIDS = result.items.map((it) => it.id);
            if (allIDS.includes(item.id)) {
                LOG.WARN(`Duplicate issue ID found: ${item.id}, skipping...`);
                continue;
            } else {
                const finalData: CIVIC_ISSUE_EXTENDED_ITEM = {
                    ...item,
                    address,
                    streetID,
                    streetName,
                    // streetID: address && address.address
                };
                result.items.push(finalData);
            }
        }
        FS.writeFile(finalFile, result, 'replace', true);
        // FS.writeFile(coordFile, foundCoords, 'replace', true);
    } else {
        LOG.INFO(`Civic issues data already exists: ${finalFile},skip fetch.`);
    }
    return { issues: result, coords: foundCoords };
    // if (!FS.hasFile(finalFileFinal)) {
    //     const finalData = FS.readFile(finalFile);
    //     const dataItems = JSON.parse(finalData as string);
    //     // console.log(dataItems.items[0]);
    //     const finalResult = {
    //         items: [],
    //     };
    //     // dataItems.items = dataItems.items || [];
    //     const max = dataItems.items.length;
    //     for (const item of dataItems.items) {
    //         const address = item.address;
    //         let streetID = null;
    //         let streetName = null;
    //         if (address && address.address) {
    //             streetName = address.address.road || null;
    //             // console.log('street name:', streetName);
    //             streetID = streetName ? generateID(streetName) : null;
    //             // if (streetID) {
    //             //     item.streetID = streetID.id;
    //             // } else {
    //             //     item.streetID = null;
    //             // }
    //         } else {
    //             item.streetID = null;
    //         }
    //         LOG.OK(`Processing item ${finalResult.items.length + 1}/${max}`);
    //         finalResult.items.push({ ...item, streetID, streetName });
    //         FS.writeFile(finalFileFinal, finalResult, 'replace', true);
    //     }
    //     return finalResult;
    // } else {
    //     LOG.INFO(`data of civic issues already exists: ${finalFileFinal}, skip fetch.`);
    //     const finalData = FS.readFile(finalFileFinal);
    //     const dataItems = JSON.parse(finalData as string);
    //     return dataItems;
    // }
};
// check

// https://mitgestalten.potsdam.de/backend/v1/flaw-reporter/findPageableReportsWithFilter?filteredStates=CLOSED&filteredStates=OPEN&filteredStates=IN_PROCESS&filteredStates=NOT_RESPONSIBLE&flawReporterId=3&limit=9&offset=0&searchText=
// totalCnt
