import { CurlItem, PlainObject } from '../../../../index.d';
import * as cmd from '../../../../_shared/cmd/cmd';
import { getResponseFromObject } from '../../../../_shared/http/http.helper';
/**
 * 🎯 Converts a name into an ID by normalizing characters and replacing non-alphanumeric characters.
 * @param {string} value ➡️ The input string to be converted into an ID.
 * @returns {string} 📤 The generated ID.
 */
export const generateID = (value: string, type = ''): string => {
    let result = value.toLowerCase();
    result = result.replace(/ä/g, 'ae');
    result = result.replace(/ö/g, 'oe');
    result = result.replace(/ü/g, 'ue');
    result = result.replace(/ß/g, 'ss');
    result = result.replace(/[^a-z0-9]/g, '_');
    result = result.replace(/_+/g, '_');
    result = result.replace(/^_/, '');
    result = result.replace(/_$/, '');
    if(type === 'street'){
        result = result.replace('strasse','str');
    }
    return result;
};

/**
 * 🎯 mock the resonse of a command.
 * @param {string} content ➡️ The content to return. Default is 'NO_RESULT'.
 * @param {string} status ➡️ The status code to return. Default is '500'.
 * @returns {string} 📤 Get the expected response.
 */
export const spyOnCMD = (
    content: string = 'NO_RESULT',
    status: string = '500'
) => {
    return jest.spyOn(cmd, 'command').mockImplementation((): string => {
        const response = {
            header: {
                protocol: 'http',
                protocolVersion: '1.1',
                status,
                statusMessage: 'OK',
                date: 'Mon, 24 Nov 2025 14:47:26 GMT',
                server: 'Apache',
                contentLocation: 'reverse.php',
                vary: 'negotiate',
                tcn: 'choice',
                xFrameOptions: 'SAMEORIGIN',
                xPoweredBy: 'PHP/7.1.33',
                accessControlAllowOrigin: '*',
                accessControlAllowMethods: 'OPTIONS,GET',
                contentLength: '29',
                contentType: 'application/json; charset=UTF-8',
            },
            content,
            status,
            success: true,
            time: 244,
        };
        const result = getResponseFromObject(response, content);
        return result;
    });
};
/**
 * 🎯 get an object from the response content
 * @param {CurlItem} response ➡️ The curl response item.
 * @returns {PlainObject} 📤 The parsed object.
 */
export const getObject = (response: CurlItem): PlainObject => {
    const cnt = response.content;
    const result = cnt ? JSON.parse(cnt) : {};
    return result;
};

/**
 * 🎯 let the process sleep
 * @param {number} ms ➡️ The time to sleep in milliseconds.
 */
export const sleepSync = (ms: number) => {
    const end = Date.now() + ms;
    while (Date.now() < end) {
        // blockiert aktiv
    }
};
