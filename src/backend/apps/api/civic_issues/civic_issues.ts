import { FS } from '../../../_shared/fs/fs';
import { getResponse } from '../../../_shared/http/http';
import { LOG } from '../../../_shared/log/log';
import { substitue } from '../../../_shared/tools/tools';
import { REQUEST_PARAMS } from './../index.d';

LOG.OK('API started');
export const getDataByAPI = (target: string) => {
    // LOG.INFO(`Fetching ${target} data from API...`);
    const data = getResponse(target);
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
        const target = substitue(requestConfig.ENDPOINT, {
            PROVIDER: requestConfig.PROVIDER,
            STATE: state,
            LIMIT: requestConfig.LIMIT,
            // OFFSET: offset.toString(),
            OFFSET: requestConfig.OFFSET_START.toString(),
        });
        // LOG.INFO(`Fetching data from ${target}...`);
        const data = getDataByAPI(target) as any;
        const maxItems = data[requestConfig.MAX_ITEMS];
        const itemsByCategory = [];
        itemsByCategory.push(...data[requestConfig.PROPERTY_DATESETS]);
        const iterations = Math.ceil(
            maxItems / parseInt(requestConfig.LIMIT, 10)
        );
        for (let i = 1; i < iterations; i++) {
            const target2 = substitue(requestConfig.ENDPOINT, {
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
export const getData = (
    key: string,
    requestConfig: REQUEST_PARAMS,
    cache: boolean
): object => {
    const file = `src/_data/raw/${key}.json`;
    const hasFile = FS.hasFile(file);
    const getFresh = cache === false ? true : hasFile === true ? false : true;

    if (getFresh) {
        LOG.INFO(`Fetching fresh data for ${key}...`);
        const data: any = getTargetItems(requestConfig);
        FS.writeFile(file, data, 'replace', true);
        return data as object;
    } else {
        LOG.INFO(`Loading cached data for ${key} from ${file}...`);
        const cachedData = FS.readFile(file) as string;
        // return cachedData as object;
        return JSON.parse(cachedData) as any;
    }
};
// todo: create repo folder

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

const sleepSync = (ms: number) => {
    const end = Date.now() + ms;
    while (Date.now() < end) {
        // blockiert aktiv
    }
};

export const getCivicIssuesData = () => {
    // try{
    const data = getData('civic_issues', REQUEST_CONFIG, true);
    const items = data.items;
    const finalFile = `src/_data/repos/civic_issues.json`;
    const coordFile = `src/_data/repos/coords_cache.json`;
    // console.log(items);
    const result: { items: any[] } = {
        items: [],
        // total: data.total,
    };
    const hasCachedCoord = FS.hasFile(coordFile);
    // console.log('total civic issues', result.total);
    const foundCoords: any = hasCachedCoord
        ? FS.readFile(coordFile) as object
        : {};

    const API = `https://nominatim.politik.de/nominatim/reverse?addressdetails=1&format=json&lat={LAT}&lon={LON}`;
    if (!FS.hasFile(finalFile)) {
        let requestedCnt = 0;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if ((requestedCnt + 1) % 50 === 0) {
                LOG.INFO(`Warte 3 Sekunden nach ${requestedCnt + 1} Items...`);
                sleepSync(3000);
                requestedCnt += 1; // to avoid double wait on next found
            }
            let details;
            const coordinate = item.coordinate;
            const id = `${coordinate.latitude}-${coordinate.longitude}`;
            if (!foundCoords[`${id}`]) {
                details = getResponse(
                    substitue(API, {
                        LAT: item.coordinate.latitude,
                        LON: item.coordinate.longitude,
                    })
                );
                const cnt = details.content;
                if (details.status !== '200') {
                    LOG.FAIL(
                        `Failed to fetch coord data for item ${item.id} at ${id}: ${details.status}`
                    );
                    console.log('response details');
                    console.log(details);
                    // continue;
                }
                const addressNew = cnt ? JSON.parse(cnt) : {};
                foundCoords[`${id}`] = {
                    id,
                    address: addressNew,
                    count: 1,
                };
                requestedCnt += 1;
                LOG.OK(`🕵🏻 [${i + 1}/${items.length}|${requestedCnt}] coord found ${id}`);
            } else {
                LOG.INFO(`🚀 [${i + 1}/${items.length}] Skipping dup ${id}`);
                if (!hasCachedCoord) {
                    foundCoords[`${id}`].count += 1;
                }
                // details = foundCoords[`${item.coordinate.latitude}-${item.coordinate.longitude}`];
            }
            // console.log(details);
            const address = foundCoords[`${id}`].address;
            const finalData: any = {
                ...item,
                address,
            };
            result.items.push(finalData);
        }
        FS.writeFile(finalFile, result, 'replace', true);
        FS.writeFile(coordFile, foundCoords, 'replace', true);
    } else {
        LOG.INFO(`Civic issues data already exists: ${finalFile},skip fetch.`);
    }
    // } catch (error: any) {s
    //     LOG.FAIL('Error fetching civic issues data:', error);
    // }
};
// check

// https://mitgestalten.potsdam.de/backend/v1/flaw-reporter/findPageableReportsWithFilter?filteredStates=CLOSED&filteredStates=OPEN&filteredStates=IN_PROCESS&filteredStates=NOT_RESPONSIBLE&flawReporterId=3&limit=9&offset=0&searchText=
// totalCnt
