import * as mock from 'mock-fs';
import { FILE_ITEM } from './endpoints.d';
import { REQUEST_PARAMS } from '../index.d';
import { FS } from '../../../_shared/fs/fs';
import * as ep from './endpoints';
import { getData } from './endpoints';
import { spyOnCMD } from '../_shared/utils/utils';

describe('getData()', () => {
    beforeEach(() => {
        mock.restore();
        mock({
            raw: {
                'test_data.json': '{ xxx: 99 }',
            },
        });
    });
    afterEach(() => {
        mock.restore();
        jest.clearAllMocks();
        // readline.cursorTo(process.stdout, 0);
    });
    const FN = getData;
    const cateories: string[] = ['OPEN', 'CLOSED', 'NOT_RESPONSIBLE', 'IN_PROCESS'];
    const ENDPOINT = `{PROVIDER}/findPageableReportsWithFilter?filteredStates={STATE}&flawReporterId=3&limit={LIMIT}&offset={OFFSET}`;

    const REQUEST_CONFIG: REQUEST_PARAMS = {
        MAX_ITEMS: 'totalCnt',
        PROPERTY_DATESETS: 'reports',
        KEY_OFFSET: 'OFFSET',
        ENDPOINT,
        PROVIDER: 'https://FAKE.potsdam.de/backend/v1/flaw-reporter',
        // PROVIDER: 'https://mitgestalten.potsdam.de/backend/v1/flaw-reporter',
        STATES: cateories,
        // LIMIT: '3',
        OFFSET_START: 0,
        LIMIT: '100',
    };

    const testFile: FILE_ITEM = {
        key: 'test_data',
        path: 'raw/test_data.json',
    };
    let spy: jest.SpyInstance;
    beforeEach(() => {
        spy = jest.spyOn(ep, 'getFreshData').mockReturnValue({ xxx: 2 });
    });
    afterEach(() => {
        spy.mockRestore();
    });
    describe('cache=false', () => {
        const CACHE = false;
        it('should fetch new data correctly', () => {
            const requestConfig: REQUEST_PARAMS = REQUEST_CONFIG;
            // Ensure the test file does not exist before the test
            if (FS.hasFile(testFile.path)) {
                FS.removeFile(testFile.path);
            }
            expect(FS.hasFile(testFile.path)).toBe(false);
            const data1 = FN(testFile, requestConfig, CACHE);
            expect(data1).toEqual({ xxx: 2 });
            expect(FS.hasFile(testFile.path)).toBe(true);
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should not fetch cached data', () => {
            const requestConfig: REQUEST_PARAMS = REQUEST_CONFIG;
            const data1 = FN(testFile, requestConfig, CACHE);
            expect(FS.hasFile(testFile.path)).toBe(true);
            expect(data1).toEqual({ xxx: 2 });
            expect(FS.hasFile(testFile.path)).toBe(true);
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });
    describe('cache=true', () => {
        const CACHE = true;
        it('should fetch new data correctly', () => {
            const requestConfig: REQUEST_PARAMS = REQUEST_CONFIG;
            // Ensure the test file does not exist before the test
            if (FS.hasFile(testFile.path)) {
                FS.removeFile(testFile.path);
            }
            expect(FS.hasFile(testFile.path)).toBe(false);
            const data1 = FN(testFile, requestConfig, CACHE);
            expect(data1).toEqual({ xxx: 2 });
            expect(FS.hasFile(testFile.path)).toBe(true);
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it('should fetch cached data correctly', () => {
            const requestConfig: REQUEST_PARAMS = REQUEST_CONFIG;
            const data1 = FN(testFile, requestConfig, CACHE);
            expect(FS.hasFile(testFile.path)).toBe(true);
            expect(data1).toEqual({ xxx: 99 });
            expect(FS.hasFile(testFile.path)).toBe(true);
            expect(spy).toHaveBeenCalledTimes(0);
        });
    });
});
