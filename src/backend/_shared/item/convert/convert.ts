/**
 * 🎯 A utility class for converting values
 * @module backend/_shared/item/CONVERT
 * @example round(12.34567, 2);
 * @version 0.0.1
 * @date 2025-09-19
 * @license MIT
 * @author Robert Willemelis <github.com/willi84>
 */
import {
    SINGLE_LINE_COMMENT,
    HAS_KEY_VALUE_DQ,
    HAS_KEY_VALUE_NQ,
    HAS_KEY_VALUE_SQ,
    REPLACE_KEY_SQ_START,
    REPLACE_KEY_NQ_START,
    GET_VALUE_SQ_AFTER_KEY_DQ_START,
    GET_VALUE_SQ_AFTER_KEY_SQ_START,
    GET_VALUE_SQ_AFTER_KEY_NQ_START,
    START_BASIC,
} from './../../regex/regex';
import { JSON_FIX, NUM } from './../convert/convert.d';
import { KEY_VALUE } from './../../../index.d';

/**
 * 🎯 replace regex in string
 * @param {string} regex ➡️ The regex pattern to match.
 * @param {string} input ➡️ The input string to perform the replacement on.
 * @param {string} [newValue] ➡️ The new value to replace the matched pattern with (default is an empty string).
 * @returns {string} 📤 The modified string after replacements.
 */
export const replace = (
    regex: string,
    input: string,
    newValue?: string
): string => {
    const regexObj = new RegExp(regex, 'g');
    return input.replace(regexObj, newValue || '');
};

/**
 * 🎯 round number to specfific decimnals
 * @param {NUM} value ➡️ The number to round.
 * @param {number} decimal ➡️ The number of decimal places to round to (default is 0).
 * @returns {number} 📤 The rounded number.
 */
export const round = (value: NUM, decimal = 0): number => {
    value = typeof value === 'string' ? parseFloat(value) : value;
    const factor = Math.pow(10, decimal);
    let result = Math.round(value * factor) / factor;
    return result;
};

/**
 * 🎯 round value to a string
 * @param {NUM} value ➡️ The number to round.
 * @param {number} decimal ➡️ The number of decimal places to round to.
 * @returns {string} 📤 The rounded number as a string.
 */
export const roundToString = (value: NUM, decimal: number): string => {
    value = typeof value === 'string' ? parseFloat(value) : value;
    const result = round(value, decimal);
    return result.toFixed(decimal);
};

/*
 * 🎯 remove comments from json-like string
 * @todo improve regex for comments
 * @todo check inline/minified jsons
 * @param {string} input ➡️ The input string containing comments.
 * @returns {string} 📤 The string with comments removed.
 */
export const removeComments = (input: string): string => {
    let json = input;

    // remove single line comments after properties
    json = replace(`(?<=${HAS_KEY_VALUE_NQ})(${SINGLE_LINE_COMMENT})`, json);
    json = replace(`(?<=${HAS_KEY_VALUE_DQ})(${SINGLE_LINE_COMMENT})`, json);
    json = replace(`(?<=${HAS_KEY_VALUE_SQ})(${SINGLE_LINE_COMMENT})`, json);

    // remove single line comments on empty lines
    json = replace(`(?<=${START_BASIC})(${SINGLE_LINE_COMMENT})`, json);

    // remove empty lines
    json = json.replace(/(\n\s*\n)/g, '\n');
    return json;
};

/**
 * 🎯 wrap key with quotes
 * @param {string} input ➡️ The input string containing keys.
 * @returns {string} 📤 The string with keys wrapped in double quotes.
 */
export const addQuotesToKeys = (input: string): string => {
    // Add quotes to keys in a JSON-like string
    let json = input;

    json = replace(`${REPLACE_KEY_SQ_START}`, json, '"$1"'); // replace "key": with
    json = replace(`${REPLACE_KEY_NQ_START}`, json, '"$1"'); // replace "key": with
    return json;
};

/**
 * 🎯 wrap values into double quotes
 * @param {string} input ➡️ The input string containing values.
 * @returns {string} 📤 The string with values wrapped in double quotes.
 */
export const addDoubleQuotesToValues = (input: string): string => {
    // Add double quotes to values in a JSON-like string

    let json = input;

    // REPLACE_KEY_SQ_START
    json = replace(`${GET_VALUE_SQ_AFTER_KEY_DQ_START}`, json, '"$1"');
    json = replace(`${GET_VALUE_SQ_AFTER_KEY_SQ_START}`, json, '"$1"');
    json = replace(`${GET_VALUE_SQ_AFTER_KEY_NQ_START}`, json, '"$1"');
    return json;
};

/**
 * 🎯 convert string to JSON
 * @param {string} input ➡️ The input string to convert.
 * @param {boolean} [noFix] ➡️ Whether to skip fixing the string before parsing (default is false).
 * @returns {JSON_FIX} 📤 An object containing the parsed data, validity status, and any error message.
 */
export const strToJSON = (input: string, noFix = false): JSON_FIX => {
    let isValid = true;
    let str = input;
    if (!noFix) {
        str = addQuotesToKeys(str);
        str = addDoubleQuotesToValues(str);
        str = removeComments(str);
    }
    let json: any;
    let errMessage = '';
    try {
        json = JSON.parse(str);
    } catch (e: any) {
        const errorMessage = e.message;
        isValid = false;
        errMessage = errorMessage;
        json = input;
    }
    const result: { data: any; isValid: boolean; error?: string } = {
        data: json,
        isValid: isValid,
    };
    if (!isValid) {
        result.error = errMessage; // add error to result
    }
    return result;
};

/**
 * 🎯 convert the number to a string
 * @param {number} value ➡️ The number to convert.
 * @returns {string} 📤 The formatted number as a string with dots if needed.
 */
export const convertNumber2String = (value: number): string => {
    return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
};

/**
 * 🎯 Splits a line into a key and value based on the first occurrence of either
 * a colon or space.
 * @todo stabilize more the content for spaces/newlines
 * @param {string} line ➡️ The line to split.
 * @returns {object} 📤 An object containing the key and value.
 */
export const convert2KeyValue = (line: string): KEY_VALUE => {
    const matchesColon = line.match(/^([^\s]+)\:\s(.*)/); // KEY: value
    const matchesSpace = line.match(/^([^\s]+)\s(.*)/); // KEY value
    let key = '';
    let value = '';
    if (matchesColon && matchesColon[2]) {
        key = matchesColon[1];
        value = matchesColon[2];
    } else if (matchesSpace && matchesSpace[2]) {
        key = matchesSpace[1];
        value = matchesSpace[2];
    }
    return {
        key: key,
        value: value,
    };
};

/**
 * 🎯 transform a key to camelCase
 * @param {string} key ➡️ The key to transform.
 * @returns {string} 📤 The transformed key in camelCase.
 */
export const convertKey2CamelCase = (key: string): string => {
    let newKey = key.toLowerCase().trim();
    if (newKey.indexOf('-') !== -1) {
        const parts = newKey.split('-');
        let finalKey = '';
        parts.forEach((part: string, index: number) => {
            if (index === 0) {
                finalKey = part;
            } else {
                finalKey += part.charAt(0).toUpperCase() + part.slice(1);
            }
        });
        newKey = finalKey;
    }
    return newKey;
};
