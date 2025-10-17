import {
    createMockData,
    isFlaky,
    getGETParameter,
    mockGetResponse,
} from './mock';

describe('✅ createMockData()', () => {
    it('should return 0 data-sets', () => {
        const result = createMockData(0);
        expect(result).toEqual([]);
    });
    it('should return 1 data-set', () => {
        const result = createMockData(1);
        expect(result).toEqual([{ id: 1, name: 'Project 1' }]);
    });
    it('should return 5 data-sets', () => {
        const result = createMockData(5);
        expect(result).toEqual([
            { id: 1, name: 'Project 1' },
            { id: 2, name: 'Project 2' },
            { id: 3, name: 'Project 3' },
            { id: 4, name: 'Project 4' },
            { id: 5, name: 'Project 5' },
        ]);
    });
    it('should return 5 data-sets with offset', () => {
        const result = createMockData(4, 3);
        expect(result).toEqual([
            { id: 3, name: 'Project 3' },
            { id: 4, name: 'Project 4' },
            { id: 5, name: 'Project 5' },
            { id: 6, name: 'Project 6' },
        ]);
    });
});
describe('✅ getGETParameter()', () => {
    const URL = 'https://example.com/page';
    it('should return null for non-existing parameter', () => {
        const url = `${URL}?param1=value1&param2=value2`;
        const result = getGETParameter(url, 'param3', 'string');
        expect(result).toBeNull();
    });
    it('should return value for existing parameter', () => {
        const url = `${URL}?param1=value1&param2=value2`;
        const result = getGETParameter(url, 'param1', 'string');
        expect(result).toBe('value1');
    });
    it('should return parsed number for numeric parameter', () => {
        const url = `${URL}?param1=123&param2=value2`;
        const result = getGETParameter(url, 'param1', 'number');
        expect(result).toBe(123);
    });
    it('should return true/false parameter', () => {
        const url = `${URL}?param1=false&param2=value2`;
        const result = getGETParameter(url, 'param1', 'boolean');
        expect(result).toEqual(false);
    });
    it('should return true/false parameter', () => {
        const url = `${URL}?param1=true&param2=value2`;
        const result = getGETParameter(url, 'param1', 'boolean');
        expect(result).toEqual(true);
    });
    it('should return NaN for non-numeric parameter', () => {
        const url = `${URL}?param1=abc&param2=value2`;
        const result = getGETParameter(url, 'param1', 'number');
        expect(result).toBeNaN();
    });
    it('should return NaN for missing numeric parameter', () => {
        const url = `${URL}?param2=value2`;
        const result = getGETParameter(url, 'param1', 'number');
        expect(result).toBeNaN();
    });
    it('should return null for missing string parameter', () => {
        const url = `${URL}?param2=null`;
        const result = getGETParameter(url, 'param1', 'number');
        expect(result).toBeNaN();
    });
    it('should fail when no window', () => {
        const oldWindow = window;
        // @ts-ignore
        delete global.window;
        const url = `${URL}?param2=22`;
        const result = getGETParameter(url, 'param1', 'number');
        expect(result).toBeNaN();
        global.window = oldWindow;
    });
    it('should fail when no window', () => {
        const oldWindow = window;
        // @ts-ignore
        delete global.window;
        const url = `${URL}?param2=22`;
        const result = getGETParameter(url, 'param1', 'boolean');
        expect(result).toEqual(null);
        global.window = oldWindow;
    });
});

describe('✅ getFlakyOnPage()', () => {
    const FN = isFlaky;
    const URL = 'https://example.com/api/projects';
    it('should return false when 1st item is not flaky', () => {
        const flakyItems = {
            test1: {
                2: 2, // page 2 is flaky, max 2 retries
            },
        };
        const result = FN(`${URL}?page=1`, 'test1', [[0], [1, 0]], flakyItems);
        // const result = FN(false, `${URL}?page=2`, 2, 'test1', flakyItems);
        expect(result).toEqual(false);
    });
    it('should return true when 2nd item is flaky', () => {
        const flakyItems = {
            test1: {
                2: 0, // page 2 is flaky, max 2 retries
            },
        };
        const result = FN(`${URL}?page=2`, 'test1', [[0], [1, 0]], flakyItems);
        // const result = FN(false, `${URL}?page=2`, 2, 'test1', flakyItems);
        expect(result).toEqual(true);
    });
    it('should return false when 2nd item is flaky but retried', () => {
        const flakyItems = {
            test1: {
                2: 1, // page 2 is flaky, max 2 retries
            },
        };
        const result = FN(`${URL}?page=2`, 'test1', [[0], [1, 0]], flakyItems);
        // const result = FN(false, `${URL}?page=2`, 2, 'test1', flakyItems);
        expect(result).toEqual(false);
    });
});
describe('mockGetResponse()', () => {
    // const token = 'dummyToken';
    describe('normal scenario', () => {
        const PROJECT_URL = 'https://example.com/api/projects';
        it('should return mock data with correct structure for page 1', () => {
            const endpoint = `${PROJECT_URL}?page=1&per_page=2`;
            const result = mockGetResponse(endpoint);
            const EXPECTED_DATA = [
                { id: 1, name: 'Project 1' },
                { id: 2, name: 'Project 2' },
            ];
            const EXPECTED = {
                content: JSON.stringify(EXPECTED_DATA),
                header: {
                    xTotalPages: '5',
                    xTotal: '9',
                    xNextPage: '2',
                },
                status: '200',
                success: true,
                time: 100,
            };
            expect(result).toEqual(EXPECTED);
        });
        it('should return mock data with correct structure for page 2', () => {
            const endpoint = `${PROJECT_URL}?page=2&per_page=2`;
            const result = mockGetResponse(endpoint);
            const EXPECTED_DATA = [
                { id: 3, name: 'Project 3' },
                { id: 4, name: 'Project 4' },
            ];
            const EXPECTED = {
                content: JSON.stringify(EXPECTED_DATA),
                header: {
                    xTotalPages: '5',
                    xTotal: '9',
                    xNextPage: '3',
                },
                status: '200',
                success: true,
                time: 100,
            };
            expect(result).toEqual(EXPECTED);
        });
        it('should return mock data with correct structure for page 5', () => {
            const endpoint = `${PROJECT_URL}?page=5&per_page=2`;
            const result = mockGetResponse(endpoint);
            const EXPECTED_DATA = [
                { id: 9, name: 'Project 9' },
                // { id: 10, name: 'Project 10' },
            ];
            const EXPECTED = {
                content: JSON.stringify(EXPECTED_DATA),
                header: {
                    xTotalPages: '5',
                    xTotal: '9',
                    xNextPage: '',
                },
                status: '200',
                success: true,
                time: 100,
            };
            expect(result).toEqual(EXPECTED);
        });
    });
    describe('flaky scenario', () => {
        const PROJECT_URL = 'https://gitlab.flaky_0_1_0.com/api/projects';
        it('should return flaky data for page 2 just 1 item', () => {
            const endpoint = `${PROJECT_URL}?page=2&per_page=2`;
            const result = mockGetResponse(endpoint);
            const EXPECTED_DATA = [{ id: 3, name: 'Project 3' }];
            const EXPECTED = {
                content: JSON.stringify(EXPECTED_DATA),
                header: {
                    xTotalPages: '5',
                    xTotal: '9',
                    xNextPage: '3',
                },
                status: '200',
                success: true,
                time: 100,
            };
            expect(result).toEqual(EXPECTED);
        });
        it('should return normal data for page 2 after retry', () => {
            const endpoint = `${PROJECT_URL}?page=2&per_page=2`;
            const MOCK_RETRY_COUNTS = {};
            // first call to be flaky
            mockGetResponse(endpoint, MOCK_RETRY_COUNTS);
            // second call should return normal data
            const result = mockGetResponse(endpoint, MOCK_RETRY_COUNTS);
            const EXPECTED_DATA = [
                { id: 3, name: 'Project 3' },
                { id: 4, name: 'Project 4' },
            ];
            const EXPECTED = {
                content: JSON.stringify(EXPECTED_DATA),
                header: {
                    xTotalPages: '5',
                    xTotal: '9',
                    xNextPage: '3',
                },
                status: '200',
                success: true,
                time: 100,
            };
            expect(result).toEqual(EXPECTED);
        });
        it('should call url without page return first page', () => {
            const endpoint = `${PROJECT_URL}?per_page=2`;
            const result = mockGetResponse(endpoint);
            const EXPECTED_DATA = [
                { id: 1, name: 'Project 1' },
                { id: 2, name: 'Project 2' },
            ];
            const EXPECTED = {
                content: JSON.stringify(EXPECTED_DATA),
                header: {
                    xTotalPages: '5',
                    xTotal: '9',
                    xNextPage: '2',
                },
                status: '200',
                success: true,
                time: 100,
            };
            expect(result).toEqual(EXPECTED);
        });
    });
});
