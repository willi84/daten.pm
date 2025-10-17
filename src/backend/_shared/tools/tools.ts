/**
 * 🎯 A utility class for mixed functionality
 * @module backend/_shared/TOOLS
 * @example detectType(3.2);
 * @version 0.0.1
 * @date 2025-09-19
 * @license MIT
 * @author Robert Willemelis <github.com/willi84>
 */

import { DOM, DOMS } from './tools.d';
const NUM_VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ','];

/**
 * 🎯 detect value type from a string
 * @param {string} rawValue ➡️ The raw string value to analyze.
 * @returns {string} 📤 type inside the string
 */
export const detectTypeFromString = (rawValue: string): string => {
    const value = rawValue.toLowerCase().trim();
    const booleans = ['true', 'false'];
    let isBoolean = false;
    booleans.forEach((bool: string) => {
        if (bool === value.toLowerCase().trim()) {
            isBoolean = true;
        }
    });
    // check if value just consists of those
    let testValue = value;
    NUM_VALUES.forEach((num: string) => {
        testValue = replaceAll(testValue, num, '');
    });
    const isNumber = testValue.trim() === '';
    if (isNumber) {
        return 'number';
    }
    if (isBoolean) {
        return 'boolean';
    } else {
        return 'string';
    }
    // TODO: Array, urls, number, object
};

/**
 * 🎯 detect type of the value
 * @param {any} value ➡️ The value to analyze.
 * @returns {string} 📤 type of the value
 */
export const detectType = (value: any) => {
    const isArray = Array.isArray(value);
    const isObject = typeof value === 'object' && !isArray;
    if (isObject) {
        return 'object';
    } else if (isArray) {
        return 'array';
    } else {
        return typeof value;
    }
};

/**
 * 🎯 replace all occurrences of a substring in a string
 * @param {string} input ➡️ The original string.
 * @param {string} search ➡️ The substring to search for.
 * @param {string} replacement ➡️ The substring to replace with.
 * @returns {string} 📤 The modified string with all occurrences replaced.
 */
export const replaceAll = (
    input: string,
    search: string,
    replacement: string
): string => {
    return input.split(search).join(replacement);
};

/**
 * 🎯 Merging items together
 * @param {any} target ➡️ item to merge into
 * @param {any} source ➡️ item to merge from
 * @returns {any} 📤 merged item
 */
export const deepMerge = (target: any, source: any): any => {
    if (target === null || target === undefined) return clone(source);
    if (source === null || source === undefined) return clone(target);

    if (typeof target !== 'object' || typeof source !== 'object') {
        return clone(source);
    }

    const merged: any = Array.isArray(target) ? [...target] : { ...target };

    for (const key of Object.keys(source)) {
        const srcVal = source[key];
        const tgtVal = target[key];

        if (isObject(srcVal) && isObject(tgtVal)) {
            merged[key] = deepMerge(tgtVal, srcVal);
        } else {
            merged[key] = clone(srcVal);
        }
    }

    return merged;
};

/**
 * 🎯 detect if value is an object
 * @param {any} val ➡️ The value to check.
 * @returns {boolean} 📤 true if the value is an object, false otherwise.
 */
export const isObject = (val: any): val is Record<string, any> =>
    val !== null && typeof val === 'object' && !Array.isArray(val);

/**
 * 🎯 clone an object
 * @param {any} val ➡️ value to clone
 * @returns {any} 📤 cloned value
 */
export const clone = (val: any): any => {
    return val !== undefined && typeof val === 'object'
        ? JSON.parse(JSON.stringify(val))
        : val;
};

/**
 * 🎯 shorthand to select a dom element
 * @param {string} query ➡️ query selector
 * @param {DOM} [target] ➡️ target to search in, default: document
 * @returns {DOM} 📤 found dom element
 */
export const select = (query: string, target?: DOM): DOM => {
    const base = target || document;
    return base?.querySelector(query) as DOM;
};

/**
 * 🎯 shorthand to select multiple dom elements
 * @param {string} query ➡️ query selector
 * @param {DOM} [target] ➡️ target to search in, default: document
 * @returns {DOMS} 📤 found dom elements
 */
export const selectAll = (query: string, target?: DOM): DOMS => {
    const base = target || document;
    return base?.querySelectorAll(query) as DOMS;
};

/**
 * 🎯 substitute placeholders in a string with values from an object
 * @param {string} str ➡️ The string containing placeholders.
 * @param {{ [key: string]: string }} replacements ➡️ An object with key-value pairs for replacements.
 * @returns {string} 📤 The modified string with placeholders replaced.
 */
export const substitue = (
    str: string,
    replacements: { [key: string]: string }
): string => {
    return Object.keys(replacements).reduce((acc, key) => {
        const value = replacements[key];
        return acc.replace(new RegExp(`{${key}}`, 'g'), value);
    }, str);
};

/** 🎯 get the value of a flag, prioritizing newValue over currentValue
 * @param {any} newValue ➡️ The new value to consider.
 * @param {any} currentValue ➡️ The current value to fall back on if newValue is undefined.
 * @returns {any} 📤 The selected value based on the priority.
 */
export const getFlagValue = (newValue: any, currentValue: any): any => {
    if (newValue === undefined) {
        return currentValue;
    } else {
        return newValue;
    }
};
