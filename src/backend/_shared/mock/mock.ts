import { CurlItem } from '../../index.d';
import { getSLD } from '../http/http';
import { LOG } from '../log/log';
import { SCENARIOS } from './mock.config';
import { FLAKY_SCENARIO, MOCK_ITEM, RETRY_DATA } from './mock.d';

const MAX_RETRIES = 3;

/**
 * 🎯 create mocked data sets
 * @param {number} num ➡️ number of data-sets to create
 * @param {number} [start] ➡️ optional offset to start from (default: 1)
 * @returns {MOCK_ITEM[]} 📤 array of mocked data-sets
 */
export const createMockData = (num: number, start: number = 1): MOCK_ITEM[] => {
    const mockData = [];
    for (let i = 0; i < num; i++) {
        const id = start + i;
        mockData.push({ id, name: `Project ${id}` });
    }
    return mockData;
};

/**
 * 🎯 get specified url parameter
 * @param {string} href ➡️ full url
 * @param {string} name ➡️ parameter name
 * @param {string} type ➡️ type of parameter (string|number|boolean)
 * @returns {any} 📤 value of parameter or null/NaN
 */
export const getGETParameter = (
    href: string,
    name: string,
    type: string
): any => {
    if (typeof window === 'undefined') {
        return type === 'number' ? NaN : null;
    }
    const url = new URL(encodeURI(href)); // Fallback-Base für relative URLs
    const value = url.searchParams.get(name); // string | null
    switch (type) {
        case 'number':
            return parseInt(value || '');
        case 'boolean':
            return value === 'true';
        default:
            return value;
    }
};

export const isFlaky = (
    url: string,
    scenario: string,
    flakyScenario: FLAKY_SCENARIO,
    retrycounts: RETRY_DATA
) => {
    const currentPage = getGETParameter(url, 'page', 'number');
    const pageItem = flakyScenario[currentPage - 1];
    const currentRetry = retrycounts[scenario][currentPage] || 0;

    const beFlaky = pageItem
        ? pageItem[currentRetry]
            ? pageItem[currentRetry] === 1
            : false
        : false;
    if (beFlaky && currentRetry < MAX_RETRIES) {
        retrycounts[scenario][currentPage]++;
    } else {
        console.log(`Reset retry count for ${scenario} on page ${currentPage}`);
        LOG.WARN(`Max retries reached for ${scenario} on page ${currentPage}`);
    }
    return beFlaky;
};

export const mockGetResponse = (
    url: string,
    RETRY_COUNTS: RETRY_DATA = {}
): CurlItem => {
    const total = 9;
    const totalPages = 5;
    // projects?per_page=${perPage}&page=${nextPage}
    const page: number = getGETParameter(url, 'page', 'number') || 1; // default page 1
    const perPage = getGETParameter(url, 'per_page', 'number');
    const scenario = getSLD(url); // gitlab.<scenario>.com
    if (!RETRY_COUNTS[scenario]) {
        RETRY_COUNTS[scenario] = {};
    }
    if (!RETRY_COUNTS[scenario][page]) {
        RETRY_COUNTS[scenario][page] = 0;
    }
    if (scenario === 'empty') {
        return {
            content: '[]',
            header: { status: '0' },
            status: '200',
            success: true,
            time: 100,
        } as CurlItem;
    } else if (scenario === 'no-content') {
        return {
            content: '',
            header: { status: '200', 'x-total': 0, 'x-total-pages': 1 },
            status: '200',
            success: true,
            time: 100,
        } as CurlItem;
    } else if (scenario === 'no-x-header') {
        return {
            content: JSON.stringify([{ id: 1, name: 'foo' }]),
            header: { status: '200' },
            status: '200',
            success: true,
            time: 100,
        } as CurlItem;
    }
    // let flakyScenario: FLAKY_SCENARIO = [];
    const flakyScenario: FLAKY_SCENARIO = SCENARIOS[scenario] || [];
    let beFlaky = isFlaky(url, scenario, flakyScenario, RETRY_COUNTS);
    // const maxValue = perPage * page;
    const nextPage = page + 1;
    // const offset = perPage * (page - 1) + 1;
    const startValue = (page - 1) * perPage + 1;
    const mockData = createMockData(
        startValue + perPage - 1 > total ? total - startValue + 1 : perPage,
        // maxValue < total ? maxValue : total,
        // offset
        startValue
    );
    const finalData = beFlaky ? [mockData[0]] : mockData;
    return {
        content: JSON.stringify(finalData),
        header: {
            xTotalPages: `${Math.ceil(total / perPage)}`,
            xTotal: `${total}`,
            xNextPage: `${nextPage < totalPages ? nextPage : ''}`,
        },
        status: '200',
        success: true,
        time: 100,
    } as CurlItem;
};
