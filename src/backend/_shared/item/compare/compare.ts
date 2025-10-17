import { PlainObject } from '../../..';
import { evaluateStringAccuracy } from '../accuracy/accuracy';
import { isCongruent, isOneString, isStr } from '../is/is';
import {
    CONGRUENT,
    CONGRUENT_VALUE,
    DIFF,
    EQUAL,
    EXACT,
    NEARLY,
    PARTIAL,
} from './../item.config';
import { PROPS, ITEM, PropertyCheck, SIMPLE_VALUE } from './../item.d';

export const comparePropNames = (
    expectedItem: PlainObject,
    receivedItem: PlainObject
): PropertyCheck => {
    const propsExpected: PROPS = Object.keys(expectedItem);
    const propsReceived: PROPS = Object.keys(receivedItem);

    const missing: PROPS = [];
    const extra: PROPS = [];
    const different: PROPS = [];
    const same: PROPS = [];
    for (const key of propsExpected) {
        if (receivedItem[key] === undefined) {
            missing.push(key);
        } else if (
            JSON.stringify(expectedItem[key]) ===
            JSON.stringify(receivedItem[key])
        ) {
            same.push(key);
        } else {
            different.push(key);
        }
    }
    for (const key of propsReceived) {
        if (expectedItem[key] === undefined) {
            extra.push(key);
        }
    }

    const status = [...missing, ...extra, ...different].length === 0;

    return { missing, extra, same, different, status };
};

export const compareProperties = (
    expectedItem: ITEM,
    receivedItem: ITEM
): PropertyCheck => {
    const propsExpected: PROPS = Object.keys(expectedItem);
    const propsReceived: PROPS = Object.keys(receivedItem);

    const missing: PROPS = [];
    const extra: PROPS = [];
    const different: PROPS = [];
    const same: PROPS = [];
    for (const key of propsExpected) {
        if (receivedItem[key] === undefined) {
            missing.push(key);
        } else if (expectedItem[key] !== receivedItem[key]) {
            if (!different.includes(key)) {
                different.push(key); // avoid duplicates in different
            }
        } else if (expectedItem[key] === receivedItem[key]) {
            same.push(key);
        }
    }
    for (const key of propsReceived) {
        if (expectedItem[key] === undefined) {
            extra.push(key);
        }
    }

    const status = [...missing, ...extra, ...different].length === 0;

    return { missing, extra, different, same, status };
};
export const compareObject = (
    receivedItem: ITEM,
    expectedItem: ITEM,
    keys2check?: PROPS
): boolean => {
    // check specific part of item
    const receivedKeys = keys2check ? keys2check : Object.keys(receivedItem);
    const expectedKeys = Object.keys(expectedItem);

    if (receivedKeys.length !== expectedKeys.length) {
        return false;
    }

    for (const key of receivedKeys) {
        if (receivedItem[key] !== expectedItem[key]) {
            return false;
        }
    }

    return true;
};

// TODO: noch gebraucht?
export const compareSimpleValues = (
    input: SIMPLE_VALUE,
    expected: SIMPLE_VALUE
) => {
    if (input === expected) {
        return { level: EXACT, status: EQUAL, accuracy: 100 };
    } else if (isStr(input) && isStr(expected)) {
        const inputStr = input.trim().toLowerCase();
        const expectedStr = expected.trim().toLowerCase();
        if (inputStr === expectedStr) {
            return {
                level: NEARLY,
                status: CONGRUENT,
                accuracy: CONGRUENT_VALUE,
            };
        }
        // partial match
        const accuracy = evaluateStringAccuracy(inputStr, expectedStr);
        if (accuracy === 100) {
            return { level: PARTIAL, status: CONGRUENT, accuracy: 100 };
        }
        return { level: PARTIAL, status: DIFF, accuracy };
    } else if (isOneString(input, expected)) {
        const isCongrently = isCongruent(input, expected);
        if (isCongrently) {
            return {
                level: NEARLY,
                status: CONGRUENT,
                accuracy: CONGRUENT_VALUE,
            };
        }
    } else {
        return { level: PARTIAL, status: DIFF, accuracy: 0 };
    }
};
