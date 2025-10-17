/**
 * 🎯 A utility class for http handling
 * @module backend/_shared/HTTP/helper
 * @example getMockedResponse('curl -I -m 0.4 --silent https://www.domain.de/');
 * @version 0.0.1
 * @date 2025-09-19
 * @license MIT
 * @author Robert Willemelis <github.com/willi84>
 */

import { HTTPStatusBase, OPTS, PlainObject } from '../..';
import { LOG } from '../log/log';
import { MOCKED_RESPONSES_TYPE, MOCKED_URLS_TYPE } from './http.d';
import { _header } from './http.mocks';
import {
    HTTP_UNKNOWN,
    MOCKED_HTTP_STATUS,
    MOCKED_URLS,
} from './http.mocks_old';
/**
 * 🎯 reformat a response object to real response
 * @param {string} response ➡️ The mocked response.
 * @returns {string} 📤 The normalized mocked response.
 */
export const getRealResponse = (response: string): string => {
    const lines = response.split('\n');

    let newResponse = '';
    lines.forEach((line: string, index: number) => {
        if (index > 0) {
            newResponse += `${line.trim()}\r\n`;
        }
    });
    return newResponse;
};

/**
 * 🎯 reformat all response objects
 * @param {any} MOCKED_HTTP_STATUS ➡️ The mocked HTTP status object.
 * @returns {any} 📤 The normalized mocked responses.
 */
export const normalizeResponses = (
    MOCKED_HTTP_STATUS: MOCKED_RESPONSES_TYPE
) => {
    const MOCKED_RESPONSES: { [key: string]: any } = {};
    if (!MOCKED_HTTP_STATUS) {
        LOG.FAIL('no MOCKED_HTTP_STATUS found');
        return {};
    }
    const scenarios = Object.keys(MOCKED_HTTP_STATUS);
    scenarios.forEach((scenarioKey: string) => {
        const key = scenarioKey as keyof typeof MOCKED_HTTP_STATUS;
        const scenario = MOCKED_HTTP_STATUS[key];
        const steps = Object.keys(scenario);
        steps.forEach((stepKey: string) => {
            if (!MOCKED_RESPONSES[`${scenarioKey}`]) {
                MOCKED_RESPONSES[`${scenarioKey}`] = {};
            }
            const step = scenario[stepKey as keyof typeof scenario];
            MOCKED_RESPONSES[`${scenarioKey}`][`${stepKey}`] =
                getRealResponse(step);
        });
    });

    return MOCKED_RESPONSES;
};

/**
 * 🎯 extract url from curl comman
 * @request {string} request ➡️ The curl command string.
 * @returns {string} 📤 The extracted URL.
 */
export const getUrlID = (request: string): string => {
    // -m 0.4 --silent
    // const regexTimeout = /-m\s+(\d+(\.\d+)?)/;
    const url = request // remove curl params except url
        .replace(/curl/, '')
        .replace(/-H\s+"[^"]+"/g, '')
        .replace(/-H\s+'[^']+'/g, '')
        .replace(/-m\s*\d+(\.\d+)?/, '') // remove timeout value
        .replace(/\s+-{1,2}[a-z]+\s*/gi, '') // remove params with -x or --XX
        .replace(/^-{1,2}[a-z]+\s*/gi, '') // remove params with -x or --XX
        .replace('--silent', '')
        // .replace(regexTimeout, '')
        .replace(/"/g, '') // remove "
        .replace(/'/g, '') // remove '
        .trim();
    return url;
};

/** 🎯 get Response by url
 * @param {string} url ➡️ The request URL.
 * @param {MOCKED_RESPONSES_TYPE} RESPONSES ➡️ The mocked responses object.
 * @param {MOCKED_URLS_TYPE} URLS ➡️ The mocked URLs object.
 * @returns {string} 📤 The mocked response.
 */
export const getResponseByUrl = (
    url: string,
    RESPONSES: MOCKED_RESPONSES_TYPE,
    URLS: MOCKED_URLS_TYPE
): string => {
    let result = HTTP_UNKNOWN;
    for (const scenarioKey in RESPONSES) {
        const scenario = RESPONSES[scenarioKey];
        const scenarioItem = URLS[scenarioKey];
        if (scenarioItem) {
            for (const stepKey in scenarioItem) {
                if (scenarioItem[stepKey] === url) {
                    result = scenario[stepKey];
                }
            }
        }
    }
    return result;
};
export const getResponseByUrlNew = (
    url: string,
    content: string,
    opts: OPTS = {}
): string => {
    const HEADER = _header(url, opts);
    if (HEADER) {
        return HEADER + '\r\n\r\n' + (content ? `${content}\n` : '');
    } else {
        return 'HTTP_UNKNOWN';
    }
};

/**
 * 🎯 get Response by request url
 * @param {string} request ➡️ The curl command string.
 * @returns {string} 📤 The mocked response.
 */
export const getMockedResponse = (
    request: string,
    version = 1,
    content = ''
): string => {
    let result = '';
    const url = getUrlID(request);
    if (version === 1) {
        result = getResponseByUrl(url, MOCKED_RESPONSES, MOCKED_URLS);
    } else {
        const opts: PlainObject = request ? { request: request } : {};
        result = getResponseByUrlNew(url, content, opts);
    }
    return result;
};

// new mocking object
export const MOCKED_RESPONSES: MOCKED_URLS_TYPE =
    normalizeResponses(MOCKED_HTTP_STATUS);

export const kebap = (key: string): string => {
    const result = key
        .replace(/([A-Z])/g, '-$1')
        .replace(/^./, (str) => str.toUpperCase());
    return result;
};

export const getResponseFromObject = (curlObject: HTTPStatusBase): string => {
    if (!curlObject || Object.keys(curlObject).length === 0) {
        console.log(curlObject);
        return '';
    }
    let result: string = `\n`;
    let hasMain = false;
    const spaces = '        ';
    const listProtocol = [
        'protocol',
        'protocolversion',
        'status',
        'statusmessage',
    ];
    for (const key in curlObject) {
        if (listProtocol.indexOf(key.toLowerCase()) !== -1) {
            if (!hasMain) {
                result += `${spaces}${curlObject.protocol.toUpperCase()}/${curlObject.protocolVersion} ${curlObject.status} ${curlObject.statusMessage}\r\n`;
                hasMain = true;
            }
        } else {
            result += `${spaces}${kebap(key)}: ${curlObject[key]}\r\n`;
        }
    }
    return result + `${spaces}\n`;
};
