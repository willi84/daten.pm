import { CurlItem, HTTPStatusBase } from '../../index.d';
import { colors } from '../colors';
import { getResponse } from '../http/http';
import { colorize, LOG } from '../log/log';

const MAX_RETRIES = 3;

export type ProjectResult = {
    items: any[];
    _log: LOG;
    // logs: LogItem[];
};
export const getHeaderValue = (
    header: HTTPStatusBase,
    key: string,
    defaultValue?: string
): number => {
    return parseInt(header[key] || defaultValue || '-1', 10);
};

export const getAllProjects = (
    endpoint: string,
    token: string,
    maxPage: number = -1,
    perPage: number = 100,
    _log: LOG = new LOG()
): ProjectResult => {
    let nextPage = 1;
    let maxRetry = 0; // 3
    const items: any[] = [];
    // https://gitlab.opencode.de/api/v4/projects?page=2&per_page=100
    const cmd = `projects?per_page=${perPage}&page=${nextPage}`;
    const TARGET = `${endpoint}/${cmd}`;
    const result: CurlItem = getResponse(`${TARGET}`, { token });
    const header = result?.header as HTTPStatusBase;
    const totalPages = getHeaderValue(header, 'xTotalPages');
    const totalItems = getHeaderValue(header, 'xTotal', '0');
    nextPage = getHeaderValue(header, 'xNextPage', '1');

    const IDS: number[] = [];
    const telemetry = {
        TARGET,
        perPage,
        maxPage,
        maxAvailablePages: totalPages,
        maxAvailableItems: totalItems,
        maxRetry,
        MAX_RETRIES,
    };
    const xItems = Object.keys(header)
        .map((key) => key.startsWith('x') === true)
        .filter((item) => item === true);
    const hasXItems = xItems.length > 0; // && xTotal > 0;
    let error: string = '';
    if (hasXItems === false) {
        error = `No xTotal or xTotalPages header found in response`;
    }
    const maxPages = maxPage < 0 ? totalPages : maxPage;
    if (result?.content === '') {
        error = `Empty content received from response`;
    }
    if (maxPages < 1) {
        error = `Invalid maxPages value`;
    }
    if (error !== '') {
        _log.WARN(error, telemetry);
        return { items, _log };
    } else {
        _log.DEBUG(`Max pages: ${maxPages}`);
        const projects = JSON.parse(result?.content || '[]');
        _log.OK(
            `[${nextPage}/${maxPages}][${colorize(result.time + 'ms', colors.BgBlack, colors.FgYellow)}] received ${projects.length} items from ${TARGET}`
        );
        const isFlaky = projects.length !== perPage;
        if (isFlaky) {
            nextPage--;
            maxRetry++;
        } else {
            for (const project of projects) {
                if (!IDS.includes(project.id)) {
                    IDS.push(project.id);
                    items.push(project);
                }
            }
        }
        // finalResult.push(...projects);
        if (nextPage > 0) {
            _log.DEBUG(`Next page: ${nextPage}`);
            for (let i = nextPage; i <= maxPages && i <= maxPages; i++) {
                // pageI = i;
                nextPage = i;
                if (nextPage > maxPages || nextPage === 0) {
                    _log.WARN(`No more items found for ${TARGET} on page ${i}`);
                    break;
                }
                const nextCmd = `projects?per_page=${perPage}&page=${nextPage}`;
                const nextTarget = `${endpoint}/${nextCmd}`;
                const nextResult = getResponse(`${nextTarget}`, { token });
                if (nextResult && nextResult.content) {
                    const nextProjects = JSON.parse(nextResult.content || '[]');
                    const time = nextResult.time ? nextResult.time : 0;
                    _log.OK(
                        `[${nextPage}/${maxPages}] [${time}ms] received ${nextProjects.length} items`,
                        telemetry
                    );

                    // TODO: wird nicht als Ergebnis
                    // _log.OK(
                    //     `[${nextPage}/${maxPages}] [${nextResult.time}ms] received ${nextProjects.length} item from ${nextTarget}`
                    // );
                    const isLastIteration = i === maxPage;
                    const isValid =
                        nextProjects.length + items.length !== totalItems;
                    const isFlaky = isLastIteration
                        ? isValid
                        : nextProjects.length !== perPage;
                    if (isFlaky) {
                        if (maxRetry < MAX_RETRIES) {
                            i--;
                            _log.WARN(
                                `Flaky response on page ${nextPage}, retrying...`,
                                telemetry
                            );
                            maxRetry++;
                        } else {
                            _log.FAIL(
                                `Max retries reached for ${nextTarget} on page ${nextPage}, stopping...`
                            );
                            return { items, _log };
                        }
                    } else {
                        for (const nextProject of nextProjects) {
                            if (!IDS.includes(nextProject.id)) {
                                IDS.push(nextProject.id);
                                items.push(nextProject);
                            }
                        }
                    }

                    // finalResult.push(...nextProjects);
                } else {
                    _log.WARN(
                        `No more items found for ${nextTarget} on page ${nextPage}`
                    );
                    break;
                }
            }
        }
    }
    return { items, _log };
};
