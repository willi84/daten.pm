import { CurlItem, HTTPStatusBase, NumericString, OPTS } from '../../index.d';
import {
    DOMAIN_200,
    DOMAIN_301,
    DOMAIN_301_2,
    DOMAIN_404,
    DOMAIN_500,
    DOMAIN_UNKNOWN,
    FORWARDS,
    STATUSCODES,
} from './http.config';
import { getMockedResponse, getResponseFromObject } from './http.helper';
import { PROTOCOL_STATUS } from './http.mocks.d';
import * as cmd from '../cmd/cmd';
import { $MOCK_VALUE } from './http.d';
import { getHostname } from './http';
// TODO: umschreiben
export const setProtocolStatus = (statusCode: number): PROTOCOL_STATUS => {
    const statusMessage: string = STATUSCODES[`${statusCode}`].text;
    const status: NumericString = `${statusCode}` as NumericString;
    return {
        protocol: 'http',
        protocolVersion: '1.1',
        status,
        statusMessage,
    };
};

// export const getNextUrl = (url: string, statusCode: number): string => {
export const getNextUrl = (
    url: string
): { url: string; statusCode: number } => {
    if (!url) return { url, statusCode: 0 };
    const urlID = getHostname(url);
    const item = FORWARDS[urlID];
    let statusCode = item ? item.status : 0;
    const order = item ? item.order : [];
    const index = order.indexOf(url);
    const indexMax = order.length - 1;
    if (index > -1) {
        if (index === indexMax) {
            // last item
            console.log(statusCode)
            return { url, statusCode };
            // return url;
        } else {
            const nextIndex = index + 1;
            const nextUrl = order[nextIndex];
            if (nextUrl) {
                console.log(statusCode, url, nextUrl)
                return { url: nextUrl, statusCode: 301 };
            }
        }
    }
    return { url, statusCode };
};

export const _httpItem = (
    url: string,
    content?: string,
    newStatusCode?: number,
    fullResponse = false
): HTTPStatusBase | CurlItem => {
    const urlItem = getNextUrl(url);
    const statusCode = newStatusCode || urlItem.statusCode;
    const customPart: any = custom[statusCode] || {};
    const location = urlItem.url;
    if (location && statusCode === 301) {
        customPart.location = location; // TODO
    }
    const status = setProtocolStatus(statusCode);
    let fullItem: any = {};
    if (fullResponse) {
        // if (content) {
        fullItem.content = content ? `${content}` : ''; // force trim
        fullItem.success = statusCode > 0 && statusCode < 400;
        fullItem.time = 23; // mock time
        fullItem.status = status.status;
        // }
    }
    const item: HTTPStatusBase = {
        ...status,
        ...customPart,
        ...base,
    };
    return fullResponse ? { header: item, ...fullItem } : item;
};

const base = {
    contentType: 'text/html; charset=UTF-8',
    connection: 'keep-alive',
    server: 'nginx/1.14.1',
    date: 'Fri, 29 Mar 2024 21:28:51 GMT',
};
const validBase = {
    xFrameOptions: 'SAMEORIGIN',
    strictTransportSecurity: 'max-age=31536000;',
    referrerPolicy: 'no-referrer-when-downgrade',
};
const custom: { [key: number]: any } = {
    200: {
        contentLength: '76980',
        lastModified: 'Mon, 18 Mar 2024 08:34:52 GMT',
        etag: '"65f7fcac-12cb4"',
        acceptRanges: 'bytes',
        ...validBase,
    },
    301: {
        contentLength: '185',
        // location: `https://www.${domain}/`,
        ...validBase,
    },
    404: {
        contentLength: '41739',
        etag: '"6595577a-a30b"',
    },
    500: {
        contentLength: '0',
    },
};

export const getRESPONSE = (domain: string, statusCode?: number): string => {
    const item = _httpItem(domain, undefined, statusCode);
    return getResponseFromObject(item);
};

export const DOMAIN_STATUS: { [key: string]: number } = {
    [DOMAIN_200]: 200,
    [DOMAIN_301]: 301,
    [DOMAIN_301_2]: 301,
    [DOMAIN_404]: 404,
    [DOMAIN_500]: 500,
    [DOMAIN_UNKNOWN]: 0,
};

export const spyOnCommand = (
    result: $MOCK_VALUE = undefined,
    version: number = 1
) => {
    return jest
        .spyOn(cmd, 'command')
        .mockImplementation((curl: string): string => {
            if (version === 1) {
                return result !== undefined
                    ? result
                    : getMockedResponse(curl, version);
            } else {
                console.log(curl);
                return getMockedResponse(
                    curl,
                    version,
                    result !== undefined ? result : ''
                );
            }
        });
};

export const hasTimeout = (curl: string | undefined): boolean => {
    if (!curl) return false;
    const timeout = curl.match(/-m\s+(\d+\.\d+?)/);
    if (timeout && parseFloat(timeout[1]) < 0.01) {
        return true;
    }
    return false;
};
// export const getNextUrl = (url: string): string => {

export const _header = (domain: string, opts: OPTS = {}): string => {
    if (!hasTimeout(opts?.request)) {
        return getRESPONSE(domain);
    }
    return getRESPONSE(domain, 0);
};
export const _response = (
    domain: string,
    statusCode: number,
    content: string
): string => {
    const mockResult = `${getRESPONSE(domain, statusCode)}

                        ${content}`; // force trim
    return mockResult;
};
