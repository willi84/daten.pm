// 3rd-party imports
import markdownIt from 'markdown-it';
// import { renderString } from './src/setup/utils/render-compontent.ts'; // kept as TS import as in your setup
// project config (JS file is fine to import)
// import config from './project.config.js';
import { config } from './project.config.ts';
import { LOG } from './src/backend/_shared/log/log';
const { EleventyRenderPlugin } = require("@11ty/eleventy");
// console.log(config)

// .eleventy.config.ts
console.log('[11ty] ts-config loaded');

// filters (kept as JS imports as in your setup)
import { svgFilter } from './src/setup/filters/svg.filter.js';
import { routeFilter } from './src/setup/filters/route.filter.js';
import { prettyDateFilter } from './src/setup/filters/prettyDate.filter.js';
import { mergeFilter } from './src/setup/filters/merge.filter.js';
import { dateTimeFilter } from './src/setup/filters/dateTime.filter.js';
import { isLinkFilter } from './src/setup/filters/isLink.filter.js';
import { containsFilter } from './src/setup/filters/contains.filter.js';
import { allValuesFilter } from './src/setup/filters/allValues.filter.js';
import { filterByProp } from './src/setup/filters/filterByProp.filter.js';
import { translateFilter } from './src/setup/filters/translate.filter.js';
import { lenFilter } from './src/setup/filters/len.filter.js';
import { safeParam } from './src/setup/filters/safeParam.filter.js';
import { safeParamIf } from './src/setup/filters/safeParamIf.filter.js';

// shortcodes (JS)
import {
    viteScriptTag,
    viteLegacyScriptTag,
    viteLinkStylesheetTags
} from './src/setup/shortcodes/vite.shortcode.js';

// const renderString = require('./src/setup/utils/render-compontent.ts'); // left commented as in original

// local constants taken from project config
const templateEngine = config.TEMPLATE_ENGINE;
const pathPrefix = config.PATH_PREFIX;

// minimal typing to keep TS happy without external Eleventy types
type EleventyConfig = any;

// export default arrow function (ESM)
const eleventyConfigFn = (eleventyConfig: EleventyConfig) => {

eleventyConfig.on('eleventy.after', async () => {
    // Run me after the build ends
    LOG.OK('✅  Eleventy build finished');
  });
    eleventyConfig.on('eleventy.error', (error: any) => {
        LOG.FAIL('❌  Eleventy error:', error.message);
    });
    // eleventyConfig.addPassthroughCopy({ static: '.' });

    // eleventyConfig.addWatchTarget('./items');
    eleventyConfig.addWatchTarget('./src/frontend/');

    // static asset paths
    config.STATIC_ASSETS.forEach((asset: string) => {
        eleventyConfig.addPassthroughCopy(asset);
    });

    // configure markdown-it and disable whitespace-as-code indicator
    const configuredMdLibrary = markdownIt({ html: true }).disable('code');
    eleventyConfig.setLibrary('md', configuredMdLibrary);

    // expose project config globally to nunjucks
    eleventyConfig.addNunjucksGlobal('config', config);

    // nunjucks filters
    eleventyConfig.addNunjucksFilter('route', routeFilter);
    eleventyConfig.addNunjucksFilter('prettyDate', prettyDateFilter);
    eleventyConfig.addNunjucksFilter('merge', mergeFilter);
    eleventyConfig.addNunjucksFilter('svg', svgFilter);
    eleventyConfig.addNunjucksFilter('dateTime', dateTimeFilter);
    eleventyConfig.addNunjucksFilter('is_link', isLinkFilter);
    eleventyConfig.addNunjucksFilter('contains', containsFilter);
    eleventyConfig.addNunjucksFilter('allValues', allValuesFilter);
    eleventyConfig.addNunjucksFilter('filterByProp', filterByProp);
    eleventyConfig.addNunjucksFilter('translate', translateFilter);
    eleventyConfig.addNunjucksFilter('len', lenFilter);
    eleventyConfig.addNunjucksFilter('safeParam', safeParam);
    eleventyConfig.addNunjucksFilter('safeParamIf', safeParamIf);

    // vite shortcodes
    eleventyConfig.addNunjucksAsyncShortcode('viteScriptTag', viteScriptTag);
    eleventyConfig.addNunjucksAsyncShortcode('viteLegacyScriptTag', viteLegacyScriptTag);
    eleventyConfig.addNunjucksAsyncShortcode('viteLinkStylesheetTags', viteLinkStylesheetTags);

    // eleventyConfig.setBrowserSyncConfig({
    //     port: 8080,
    //     open: false,
    //     ui: false,
    //     ghostMode: false,
    //     notify: true, // zeigt BrowserSync-Banner
    //     logLevel: 'debug' // mehr Logs
    // });
    eleventyConfig.addPlugin(EleventyRenderPlugin);

    // console.log(Object.keys(eleventyConfig));
    // console.log(eleventyConfig.handlebarsHelpers.renderFile);
    // 👇 debugging: effektive Dirs anzeigen
    const dirs = {
        input: config.INPUT_CONTENT,
        output: config.OUTPUT_DIR,
        includes: config.INCLUDES,
        layouts: config.LAYOUTS,
        data: config.DATA_DIR
    };
    console.log('[11ty] dirs', dirs);

    // eleventyConfig.on('eleventy.config', (cfg: unknown) => {
    //     // this is the same "localConfig" object Eleventy merges
    //     console.log('[11ty] on(eleventy.config) localConfig', cfg);
    //     console.log('======================')
    //     console.log(cfg.config.nunjucksAsyncShortcodes.renderFile)
    // });
    // console.log(eleventyConfig)

    // eleventyConfig.addNunjucksAsyncShortcode(
    //     'renderFileAbs',
    //     async (engine: string, filePath: string, data: Record<string, unknown> = {}) => {
    //         // delegiere an das vom Plugin registrierte renderFile,
    //         // aber gib den projektrelativen Pfad rein (so wie du ihn im Template schreibst)
    //         // @ts-ignore access the shortcode via the JS functions registry
    //         return eleventyConfig.liquidShortcodes.renderFile(engine, filePath, data);
    //     }
    // );

    return {
        templateFormats: ['md', templateEngine, 'html'],
        pathPrefix,
        markdownTemplateEngine: templateEngine,
        htmlTemplateEngine: templateEngine,
        dataTemplateEngine: templateEngine,
        passthroughFileCopy: true,
        dir: {
            input: config.INPUT_CONTENT,
            output: config.OUTPUT_DIR,
            layouts: config.LAYOUTS,
            includes: config.INCLUDES,
            // includes: config.INCLUDES,
            data: config.DATA_DIR
        }
    };
};

export default eleventyConfigFn;
