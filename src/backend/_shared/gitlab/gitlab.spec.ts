import { HTTPStatusBase } from '../..';
import { getAllProjects, getHeaderValue } from '../gitlab/gitlab';
import * as http from '../http/http';
import { mockGetResponse } from '../mock/mock';
// import { toContainItems } from '../test/customMatcher/toContainItem/toContainItem';
// import { expect } from '@jest/globals';
// expect.extend({ toContainItem });

// mock data for multiple pages

const PROJECT_LIST_1_9 = [
    { id: 1, name: 'Project 1' },
    { id: 2, name: 'Project 2' },
    { id: 3, name: 'Project 3' },
    { id: 4, name: 'Project 4' },
    { id: 5, name: 'Project 5' },
    { id: 6, name: 'Project 6' },
    { id: 7, name: 'Project 7' },
    { id: 8, name: 'Project 8' },
    { id: 9, name: 'Project 9' },
];
// const PROJECT_LIST_1_8 = [
//     { id: 1, name: 'Project 1' },
//     { id: 2, name: 'Project 2' },
//     { id: 3, name: 'Project 3' },
//     { id: 4, name: 'Project 4' },
//     { id: 5, name: 'Project 5' },
//     { id: 7, name: 'Project 7' },
//     { id: 8, name: 'Project 8' },
//     { id: 9, name: 'Project 9' },
// ];
const PROJECT_LIST_EMPTY: any[] = [];

describe('getHeaderValue()', () => {
    const FN = getHeaderValue;
    it('should return header value as number', () => {
        const header = {
            'x-total': '42',
            'x-total-pages': '5',
            'x-next-page': '2',
        } as unknown as HTTPStatusBase;
        expect(FN(header, 'x-total', '0')).toBe(42);
        expect(FN(header, 'x-total')).toBe(42);
        expect(FN(header, 'x-total-pages', '1')).toBe(5);
        expect(FN(header, 'x-next-page', '1')).toBe(2);
        expect(FN(header, 'x-missing', '7')).toBe(7); // default value
        expect(FN(header, 'x-missing')).toBe(-1); // default value
        expect(FN(header, 'x-invalid', 'NaN')).toBeNaN(); // default value
    });
});
describe('getAllProjects()', () => {
    let responseSpy: jest.SpyInstance;
    let MOCK_RETRY_COUNTS = {};
    // mock the getResponse function
    beforeEach(() => {
        jest.clearAllMocks();
        responseSpy = jest
            .spyOn(http, 'getResponse')
            .mockImplementation((url) =>
                mockGetResponse(url, MOCK_RETRY_COUNTS)
            );
    });
    afterEach(() => {
        responseSpy.mockRestore();
        MOCK_RETRY_COUNTS = {};
    });
    describe('exceptional cases', () => {
        it('should return 0 items when no maxPage', () => {
            const endpoint = 'https://gitlab.example.com/api/v4';
            const result = getAllProjects(endpoint, 'dummy', 0, 5); // 0 maxPage
            expect(responseSpy).toHaveBeenCalledTimes(1);
            expect(result.items.length).toBe(0);
            expect(result.items).toEqual(PROJECT_LIST_EMPTY);
            expect(result._log.items).toContainItems({
                message: 'Invalid maxPages value',
                type: 'WARN',
                time: '{number}',
                telemetry: {
                    TARGET: `${endpoint}/projects?per_page=5&page=1`,
                    maxAvailableItems: 9,
                    maxAvailablePages: 2,
                    maxPage: 0,
                    perPage: 5,
                    maxRetry: 0,
                    MAX_RETRIES: 3,
                },
            });
        });
        it('should return 0 items when no xTotalPage', () => {
            const endpoint = 'https://gitlab.no-content.com/api/v4';
            const result = getAllProjects(endpoint, 'dummy', 1, 5); // 0 maxPage
            expect(responseSpy).toHaveBeenCalledTimes(1);
            expect(result.items.length).toBe(0);
            expect(result.items).toEqual(PROJECT_LIST_EMPTY);
            expect(result._log.items).toContainItems({
                message: 'Empty content received from response',
                type: 'WARN',
                time: '{number}',
                telemetry: {
                    TARGET: `${endpoint}/projects?per_page=5&page=1`,
                    maxAvailableItems: 0,
                    maxAvailablePages: -1,
                    maxPage: 1,
                    perPage: 5,
                    maxRetry: 0,
                    MAX_RETRIES: 3,
                },
            });
        });
        it('should return 0 items when no maxPage', () => {
            const endpoint = 'https://gitlab.no-x-header.com/api/v4';
            const result = getAllProjects(endpoint, 'dummy', 1, 5); // 0 maxPage
            expect(responseSpy).toHaveBeenCalledTimes(1);
            expect(result.items.length).toBe(0);
            expect(result.items).toEqual(PROJECT_LIST_EMPTY);
            expect(result._log.items).toContainItems({
                message: 'No xTotal or xTotalPages header found in response',
                type: 'WARN',
                time: '{number}',
                telemetry: {
                    TARGET: `${endpoint}/projects?per_page=5&page=1`,
                    maxAvailableItems: 0,
                    maxAvailablePages: -1,
                    maxPage: 1,
                    perPage: 5,
                    maxRetry: 0,
                    MAX_RETRIES: 3,
                },
            });
        });
        it('should return empty when missing header information', () => {
            const endpoint = 'https://gitlab.empty.com/api/v4';
            const result = getAllProjects(endpoint, 'dummy', 2, 5); // checken ob zu wenig zurück: 2 statt 5
            expect(responseSpy).toHaveBeenCalledTimes(1);
            expect(result.items.length).toBe(0);
            expect(result.items).toEqual(PROJECT_LIST_EMPTY);
        });
    });
    describe('normal cases', () => {
        it('should fetch all projects from GitLab', () => {
            const endpoint = 'https://gitlab.example.com/api/v4';
            const result = getAllProjects(endpoint, 'dummy', 2, 5); // checken ob zu wenig zurück: 2 statt 5
            console.log(result._log.items);
            expect(responseSpy).toHaveBeenCalledTimes(2);
            expect(result.items.length).toBe(9);
            expect(result.items).toEqual(PROJECT_LIST_1_9);
            expect(result._log.items).toContainItems({
                message: `[2/2] [100ms] received 4 items`,
                // message: `[2/2] [{number}ms] received 4 items from ${endpoint}/projects?per_page=5&page=2`,
                type: 'OK',
                time: '{number}',
                telemetry: {
                    TARGET: `${endpoint}/projects?per_page=5&page=1`,
                    maxAvailableItems: 9,
                    maxAvailablePages: 2,
                    maxPage: 2,
                    perPage: 5,
                    maxRetry: 0,
                    MAX_RETRIES: 3,
                },
            });
        });
        xit('should fetch all projects from GitLab even if page is wrong', () => {
            const endpoint = 'https://gitlab.example.com/api/v4';
            const result = getAllProjects(endpoint, 'dummy', 3, 5); // checken ob zu wenig zurück: 2 statt 5
            console.log(result._log.items);
            expect(responseSpy).toHaveBeenCalledTimes(3);
            expect(result.items.length).toBe(9);
            expect(result.items).toEqual(PROJECT_LIST_1_9);
        });
    });
    describe('flaky cases', () => {
        it('should fetch all projects from GitLab when last is flaky', () => {
            const endpoint = 'https://gitlab.flaky_0_0_1.com/api/v4';
            const result = getAllProjects(endpoint, 'dummy', 3, 3); // checken ob zu wenig zurück: 2 statt 5
            expect(responseSpy).toHaveBeenCalledTimes(4);
            console.log(result._log.items);
            expect(result.items.length).toBe(9);
            expect(result.items).toEqual(PROJECT_LIST_1_9);

            // TODO: check which step was flaky
            // expect(result._log.items).toContainItems({
            //     message: `Flaky response on page 2, retrying... [0/3]`,
            //     type: 'WARN',
            //     time: expect.any(Number),
            //     // telemetry: {
            //     //     nextTarget:
            //     //         'https://gitlab.flaky2.com/api/v4/projects?per_page=3&page=3',
            //     //     nextPage: 3,
            //     //     retry: 0,
            //     //     maxRetry: 3,
            //     // },
            // });
        });
        it('should fetch all projects from GitLab when 2nd is flaky', () => {
            const endpoint = 'https://gitlab.flaky_0_1_0.com/api/v4';
            const result = getAllProjects(endpoint, 'dummy', 2, 5); // checken ob zu wenig zurück: 2 statt 5
            // TODO: kein log of max-retry
            expect(result._log.items).not.toContainItems({
                message: `Max retries reached for flaky_0_1_0 on page 2`,
                type: 'WARN',
                time: expect.any(Number),
                telemetry: expect.objectContaining({}),
            });
            expect(responseSpy).toHaveBeenCalledTimes(3);
            expect(result.items.length).toEqual(9);
            expect(result.items).toEqual(PROJECT_LIST_1_9);
        });
        it('test: dupp:should fetch all projects from GitLab when 2nd is flaky', () => {
            const endpoint = 'https://gitlab.flaky_0_1_0.com/api/v4';
            const result = getAllProjects(endpoint, 'dummy', 2, 5); // checken ob zu wenig zurück: 2 statt 5
            expect(responseSpy).toHaveBeenCalledTimes(3);
            expect(result.items.length).toBe(9);
            expect(result.items).toEqual(PROJECT_LIST_1_9);
        });
        it('should fetch all projects from GitLab when last is flaky', () => {
            const endpoint = 'https://gitlab.flaky_1_0_0.com/api/v4';
            const result = getAllProjects(endpoint, 'dummy', 3, 3); // checken ob zu wenig zurück: 2 statt 5
            expect(responseSpy).toHaveBeenCalledTimes(4);
            expect(result.items.length).toBe(9);
            expect(result.items).toEqual(PROJECT_LIST_1_9);
        });
        it('should fetch no projects from GitLab when one round reached max-retry', () => {
            const endpoint = 'https://gitlab.flaky_4_0_0.com/api/v4';
            const result = getAllProjects(endpoint, 'dummy', 3, 3); // checken ob zu wenig zurück: 2 statt 5
            expect(responseSpy).toHaveBeenCalledTimes(4);
            expect(result.items.length).toBe(0);
            expect(result.items).toEqual(PROJECT_LIST_EMPTY);
        });
        it('should fetch all projects from GitLab even if it needs a re-try (flaky)', () => {
            const endpoint = 'https://gitlab.flaky_2_0_0.com/api/v4';
            const result = getAllProjects(endpoint, 'dummy', 3, 3); // checken ob zu wenig zurück: 2 statt 5
            expect(responseSpy).toHaveBeenCalledTimes(5);
            expect(result.items.length).toBe(9);
            expect(result.items).toEqual(PROJECT_LIST_1_9);
        });
        it('should fetch all projects from GitLab even if it needs 2 times a re-try (flaky)', () => {
            const endpoint = 'https://gitlab.flaky_2_0_1.com/api/v4';
            const result = getAllProjects(endpoint, 'dummy', 3, 3); // checken ob zu wenig zurück: 2 statt 5
            expect(responseSpy).toHaveBeenCalledTimes(6);
            expect(result.items.length).toBe(9);
            expect(result.items).toEqual(PROJECT_LIST_1_9);
            // console.log(result._log.items);
            expect(result._log.items).toContainItems({
                // TODO: multiple placeholder also withing []
                // TODO: received 3 items vs. undefined items
                // message: `[3/3] [100ms] received 3 items`,
                message: `[3/3] [100ms] received {number} items`,
                // message: `[3/3] [100ms] received {number} items from {string}`,
                // message: `[3/3] [100ms] received 3 items from ${endpoint}/projects?per_page=3&page=3`,
                type: 'OK',
                time: '{number}',
                telemetry: {
                    // foo: 23,
                    TARGET: `${endpoint}/projects?per_page=3&page=1`,
                    maxAvailableItems: 9,
                    maxAvailablePages: 3,
                    maxPage: 3,
                    perPage: 3,
                    maxRetry: 0,
                    MAX_RETRIES: 3,
                },
            });
            expect(result._log.items).toContainItems({
                message: 'Flaky response on page 1, retrying...',
                type: 'WARN',
                time: '{number}',
                telemetry: {
                    // TODO: undefined
                    // nextTarget: `${endpoint}/projects?per_page=3&page=1`,
                    // nextPage: 1,
                    // retry: 1,
                    maxRetry: 0,
                    MAX_RETRIES: 3,
                    TARGET: `${endpoint}/projects?per_page=3&page=1`,
                    maxAvailableItems: 9,
                    maxAvailablePages: 3,
                    maxPage: 3,
                    perPage: 3,
                },
            });
            expect(result._log.items).toContainItems({
                message: 'Flaky response on page 3, retrying...',
                type: 'WARN',
                time: '{number}',
                telemetry: {
                    maxRetry: 0,
                    MAX_RETRIES: 3,
                    TARGET: `${endpoint}/projects?per_page=3&page=1`,
                    maxAvailableItems: 9,
                    maxAvailablePages: 3,
                    maxPage: 3,
                    perPage: 3,
                },
            });
        });
    });
});
