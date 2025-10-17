import { log } from 'console';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import { LOG } from '../../backend/_shared/log/log';
// import { getCallerInfo } from '../../backend/_shared/log/log';
const { safeParam } = require('../filters/safeParam.filter.js');

const MACRO_REL_PATH = 'frontend/templates/_setup/macros/component.macro.njk';

type RenderOpts = {
    macroRelPath?: string;
    searchPaths?: string[];
    includeCurrentDir?: boolean; // adds __dirname for co-located tests
};

// normalize to keep assertions stable
const normalizeHtml = (html: string): string => {
    if (!html) return '';
    return html
        .replace(/\r\n/g, '\n')
        .replace(/\s+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/>\s+</g, '><')
        .trim();
};
// keep types minimal to avoid extra deps
type CallSite = {
    getFileName(): string | null;
    getLineNumber(): number | null;
    getColumnNumber(): number | null;
    getFunctionName(): string | null;
};

export type CallerInfo = {
    file: string;
    relFile: string;
    line: number;
    column: number;
    functionName: string;
};

export type CallerOptions = {
    // skip frames from these absolute file paths (e.g. your render utils)
    skipFiles?: string[];
    // additional frames to skip after filtering
    depth?: number; // default: 0 (first external frame)
    // base for rel paths
    projectRoot?: string; // default: process.cwd()
};

export const getCallerInfo = (opts: CallerOptions = {}): CallerInfo | null => {
    const { skipFiles = [], depth = 0, projectRoot = process.cwd() } = opts;

    const oldPrepare = Error.prepareStackTrace;
    Error.prepareStackTrace = (_err, stack) => stack;

    const err = new Error();
    // exclude this helper from the stack
    Error.captureStackTrace(err, getCallerInfo);

    const stack = (err.stack as unknown as CallSite[]) || [];

    // restore immediately
    Error.prepareStackTrace = oldPrepare;

    // find first frame that is not in skipFiles and has a filename
    const frames = stack.filter((s) => !!s.getFileName());
    const filtered = frames.filter((s) => {
        const f = s.getFileName();
        if (!f) return false;
        return !skipFiles.some((skip) => f === skip);
    });

    const site = filtered[depth];
    if (!site) return null;

    const file = site.getFileName()!;
    const line = site.getLineNumber() ?? 0;
    const column = site.getColumnNumber() ?? 0;
    const functionName = site.getFunctionName() ?? 'anonymous';
    const relFile = path.relative(projectRoot, file).replace(/\\/g, '/');

    return { file, relFile, line, column, functionName };
};

const createEnv = (opts: RenderOpts = {}): nunjucks.Environment => {
    const {
        macroRelPath, // not used here, but you can pass it around in your test
        includeCurrentDir = true,
        searchPaths = [
            path.join(process.cwd(), 'src'), // your project src
            path.join(process.cwd(), 'src/frontend'), // components/templates
        ],
    } = opts;

    const roots = includeCurrentDir ? [...searchPaths, __dirname] : searchPaths;
    return new nunjucks.Environment(
        new nunjucks.FileSystemLoader(roots, { noCache: true }),
        {
            autoescape: true,
            // throwOnUndefined: true //<== dont use too strict
        }
    ).addFilter('safeParam', safeParam);
};
export const renderString = async (snippetNjk: string, opts: RenderOpts = {}) => {
    const env = createEnv(opts);
    const macroRelPath = opts.macroRelPath ?? MACRO_REL_PATH;

    const tpl = `{% from '${macroRelPath}' import component %}\n${snippetNjk}`;
    return new Promise<string>((resolve, reject) => {
        env.renderString(tpl, {}, (err, out) => {
            // if (err) {
            //     console.log(tpl);
            //     console.log(params);
            //     console.log('ERR:', err);
            // }
            return err ? reject(err) : resolve(normalizeHtml(out ?? ''));
        });
    });
};

// A) render arbitrary NJK snippet that calls the macro (we auto-import the macro for you)
export const renderComponent = async (
    snippetNjk: string,
    params: Record<string, unknown> = {},
    opts: RenderOpts = {}
): Promise<string> => {
    const env = createEnv(opts);
    const macroRelPath = opts.macroRelPath ?? MACRO_REL_PATH;

    const tpl = `{% from '${macroRelPath}' import component %}\n${snippetNjk}`;

    const caller = getCallerInfo({
        skipFiles: [__filename], // skip this file so we get the *external* caller
        projectRoot: process.cwd(),
    });
    const fileParts = caller?.file ? caller.file.split('/') : [];
    const fileName = fileParts[fileParts.length - 1] || 'unknown'; // crude way to get component name from path
    const nameParts = fileName.split('.');
    const componentName = nameParts[0] || 'unknown';
    const componentType = nameParts[1] || 'unknown';
    const id = `${caller?.relFile}:${caller?.line}`;
    LOG.DEBUG('renderComponent called from:', {
        id,
        filePath: `${caller?.relFile}`,
        fileName: `${fileName}`,
        component: `${componentName}`,
        type: `${componentType}`,
        line: `${caller?.line}`,
        template: `${snippetNjk}`,
        // template: `{% raw %}${snippetNjk}{% endraw %}`,
        params,
    });
    console.log(caller);

    return new Promise<string>((resolve, reject) => {
        env.renderString(tpl, { params }, (err, out) => {
            if (err) {
                console.log(tpl);
                console.log(params);
                console.log('ERR:', err);
            }
            return err ? reject(err) : resolve(normalizeHtml(out ?? ''));
        });
    });
};
