// comments are in english
// this file is the plugin entry that ESLint loads via `plugins: { 'jsdoc-emoji': jsdocEmoji }`

import { customJSDocFormat } from './rules/jsdoc-format/jsdoc-format';

export const rules = {
    'robertz-jsdoc-format': customJSDocFormat,
};
