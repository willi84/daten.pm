import { FS } from '../../_shared/fs/fs';
import { getHttpStatusValue } from '../../_shared/http/http';
import { LOG } from '../../_shared/log/log';
import * as https from 'https';
import { HEALTH_CHECK, TEST_URL } from './checks/check';

const argv = process.argv;
const fastCheck = argv.includes('--fast') || argv.includes('-f');

const TEST_CONNECTION_URLS: string[] = [
    'https://github.com',
    'https://www.google.com/',
    'https://www.wikipedia.org/',
    // 'https://developer.mozilla.org/',
    // 'https://www.mozilla.org/',
    // 'https://www.cloudflare.com',
    // 'https://www.npmjs.com/',
];

export const checkInternetConnection = async (
    domain: string,
    timeoutMs = 600
): Promise<boolean> => {
    return new Promise((resolve) => {
        const req = https.get(domain, (res: any) => {
            resolve(res.statusCode === 200);
        });

        req.on('error', () => {
            resolve(false);
        });

        // Timeout: wenn keine Antwort in timeoutMs, abbrechen
        req.setTimeout(timeoutMs, () => {
            req.destroy();
            resolve(false);
        });
    });
};
export const resolveDNS = (
    domain: string,
    timeoutMs = 600
): Promise<boolean> => {
    return checkInternetConnection(domain, timeoutMs);
    // console.log('DNS check', domain, hasDNS);
};
// const hasDNS = resolveDNS('https://github.com', 600);
// if (hasDNS) {
//     LOG.OK('✅ DNS resolution worksx');
// } else {
//     LOG.FAIL('❌ DNS resolution failed');
// }

// check for _site folder and html files
// check for internet connection (random url from list)
// check for dev server connection (localhost:8080, localhost:3000)

export const hasHTMLFiles = (path: string): HEALTH_CHECK[] => {
    const checks: HEALTH_CHECK[] = [];
    // has _site folder
    let hasSiteFolder = FS.exists(path);
    if (hasSiteFolder) {
        checks.push({
            name: '_site-folder',
            result: true,
            message: `✅ _site folder exists`,
        });
        const htmlFiles = FS.list(path).filter((file) =>
            file.endsWith('.html')
        );
        if (htmlFiles.length > 0) {
            checks.push({
                name: 'html-files',
                result: true,
                message: `✅ _site contains HTML files (${htmlFiles.length})`,
            });
        } else {
            checks.push({
                name: 'html-files',
                result: false,
                message: `❌ _site does not contain any HTML files`,
            });
        }
    } else {
        checks.push({
            name: '_site-folder',
            result: false,
            message: `❌ _site folder does not exist`,
        });
        checks.push({
            name: 'html-files',
            result: false,
            message: `❌ _site does not contain any HTML files`,
        });
    }
    return checks;
};

// valid for github copilot
const hasInternetConnection = (testUrls: string[]): HEALTH_CHECK[] => {
    const checks: HEALTH_CHECK[] = [];
    const randomIndex = Math.floor(Math.random() * testUrls.length);
    const url = testUrls[randomIndex];
    const httpStatus: string = getHttpStatusValue(url);
    const httpValue = parseInt(httpStatus, 10);
    const name = 'internet-connection';
    let message = `❌ ${url} is not reachable (status: ${httpStatus})`;
    const result = httpValue >= 200 && httpValue < 400 ? true : false;
    if (result === true) {
        message = `🌐 ${url} is reachable (status: ${httpStatus})`;
    }
    checks.push({ name, result, message });
    return checks;
};

export const hasDevelopmentServerConnection = (
    urls: TEST_URL[]
): HEALTH_CHECK[] => {
    const checks: HEALTH_CHECK[] = [];
    urls.forEach((item: TEST_URL) => {
        const url = item.url;
        const httpStatus: string = getHttpStatusValue(url);
        const httpValue = parseInt(httpStatus, 10);
        const name = item.name;
        const result = httpValue >= 200 && httpValue < 400 ? true : false;
        let message = `❌ ${url} [${name}] is not reachable (status: ${httpStatus})`;
        if (result === true) {
            message = `🖥️ ${url} [${name}] is reachable (status: ${httpStatus})`;
        }
        checks.push({ name, result, message });
    });
    return checks;
};

const TEST_URLS: TEST_URL[] = [
    { url: 'http://localhost:8080', name: 'dev-server [eleventy]' },
    { url: 'http://localhost:3000/healthz', name: 'dev-server [vite]' },
];
const CHECKS: HEALTH_CHECK[] = [];
CHECKS.push(...hasHTMLFiles('./_site'));
if (!fastCheck) {
    CHECKS.push(...hasInternetConnection(TEST_CONNECTION_URLS));
    CHECKS.push(...hasDevelopmentServerConnection(TEST_URLS));
} else {
    LOG.WARN('⚡ Fast check enabled, skipping internet & dev server checks');
}

const hasFailures = CHECKS.flat().filter((check) => check.result === false);
if (hasFailures.length > 0) {
    LOG.FAIL(`Healthcheck failed: ${hasFailures.length} issue(s) found`);
    hasFailures.forEach((check) => {
        LOG.FAIL(check.message);
    });
} else {
    const all = CHECKS.flat().length;
    LOG.OK(`☘️💚 Healthcheck passed: All checks are good! [${all}/${all}]`);
    // console.log(CHECKS)
}

// TODO: check for github.com
// TODO: chck for configs
// TODO: check for processes
// recreted json, timestamps
