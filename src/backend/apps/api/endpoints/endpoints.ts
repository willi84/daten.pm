import { FS } from '../../../_shared/fs/fs';
import { LOG } from '../../../_shared/log/log';
import { getTargetItems } from '../civic_issues/civic_issues';
import { REQUEST_PARAMS } from '../index.d';
import { FILE_ITEM } from './endpoints.d';
import { FOUND_COORDS } from './geo/geo';

export const getFreshData = (requestConfig: REQUEST_PARAMS): object => {
    LOG.INFO(`Fetching fresh data from API...`);
    const data: any = getTargetItems(requestConfig);
    return data as object;
};

/**
 * 🎯 get Data fresh or from cache
 * @param {FILE_ITEM} targetFile ➡️ The target file item.
 * @param {REQUEST_PARAMS} requestConfig ➡️ The request configuration.
 * @param {boolean} cache ➡️ Whether to use cache or fetch fresh data.
 * @returns {object} 📤 The data object.
 */
export const getData = (
    // key: string,
    targetFile: FILE_ITEM,
    requestConfig: REQUEST_PARAMS,
    cache: boolean
): object => {
    const key = targetFile.key;
    const file = targetFile.path;
    // const file = `src/_data/raw/${key}.json`;
    const hasFile = FS.hasFile(file);
    const getFresh = cache === false ? true : hasFile === true ? false : true;

    if (getFresh) {
        LOG.INFO(`Fetching fresh data for ${key}...`);
        const data: any = getFreshData(requestConfig);
        // const data: any = getTargetItems(requestConfig);
        FS.writeFile(file, data, 'replace', true);
        return data as object;
    } else {
        LOG.INFO(`Loading cached data for ${key} from ${file}...`);
        const cachedData = FS.readFile(file) as string;
        // return cachedData as object;
        return typeof cachedData === 'string'
            ? (JSON.parse(cachedData) as any)
            : (cachedData as any);
    }
};
export const getDataFromfile = (FILE: FILE_ITEM, _default = {}): object => {
    const coordFile = FILE.path;
    const hasCachedCoord = FS.hasFile(coordFile);
    const foundCoords: FOUND_COORDS = hasCachedCoord
        ? (FS.readFile(coordFile) as FOUND_COORDS)
        : _default;
    const origin = hasCachedCoord ? '🗃️ cached' : '⭐ empty';
    LOG.OK(`[${origin}] Load data from ${FILE.key}`);
    return foundCoords;
};
export const saveDataTofile = (FILE: FILE_ITEM, data: object): void => {
    const coordFile = FILE.path;
    const oldData = FS.hasFile(coordFile)
        ? (FS.readFile(coordFile) as object)
        : {};
    if (JSON.stringify(oldData) === JSON.stringify(data)) {
        LOG.OK(`ℹ️ No changes detected for ${FILE.key}, skip save.`);
        return;
    } else {
        FS.writeFile(coordFile, data, 'replace', true);
        LOG.OK(`💾 Save data to ${FILE.key}`);
    }
};

