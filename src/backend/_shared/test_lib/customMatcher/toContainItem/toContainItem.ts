import {
    COMPARE_STATE,
    ITEM,
    MatchItem,
    CustomMatchStatus,
    ValueItem,
    FoundItem,
} from './../../../item/item.d';
import {
    matcherHint,
    printReceived,
    printExpected,
    printDiffOrStringify,
    RECEIVED_COLOR,
    // } = this.utils;
} from 'jest-matcher-utils';

import { CompareState } from './../../../item/item.config';
import { getAllProps } from './../../../item/props/props';
import {
    evaluateItemAccuracy,
    getTotalAccuracy,
} from './../../../item/accuracy/accuracy';
import { formatPlaceholder } from './../../../format/format';
import { expect } from '@jest/globals';

// Level 1: exact match
// Level 2: no case and missing spaces
// level 3: partial match

export const compareItem = (
    expectedItem: ITEM,
    receivedItem: ITEM
): ValueItem[] => {
    const values: ValueItem[] = [];
    const allKeys: string[] = getAllProps(expectedItem, receivedItem);
    for (const key of allKeys) {
        const expected = expectedItem[key];
        const received = receivedItem[key];
        let accuracy = 0;
        let state: COMPARE_STATE = CompareState.EQUAL;
        if (
            expected === received &&
            (received === undefined || received === null)
        ) {
            state = CompareState.EQUAL;
            accuracy = 100;
        } else if (expected === undefined || expected === null) {
            state = CompareState.EXTRA;
        } else if (received === undefined || received === null) {
            state = CompareState.MISS;
        } else {
            const result = evaluateItemAccuracy(received, expected);
            // TODO: check placeholder
            if (result === 100) {
                state = CompareState.EQUAL;
            } else if (result >= 50) {
                state = CompareState.CONGRUENT;
            } else {
                state = CompareState.DIFF;
            }
            accuracy = result;
        }
        values.push({ key, expected, received, state, accuracy });
    }
    return values;
};
const processData = (receivedItem: any, expected: any, index: number) => {
    const values = compareItem(expected, receivedItem);
    let fullAccuracy = values.map((c) => c.accuracy);
    const accuracy = getTotalAccuracy(fullAccuracy);
    let state = getMatchingState(values);
    return {
        index,
        values,
        accuracy,
        state,
    };
};

export const getMatchingData = (
    receivedItems: ITEM[],
    expectedItem: ITEM
): CustomMatchStatus => {
    const matchingItems: MatchItem[] = [];
    let isValid = false;
    const diff = [];
    // let finalState = CompareState.EQUAL;
    if (!isValid) {
        const len = receivedItems.length;
        let i = 0;
        for (const receivedItem of receivedItems) {
            const newItem = processData(receivedItem, expectedItem, i);
            matchingItems.push(newItem);
            i += 1;
        }
        if (i !== len) {
            console.warn(
                `receivedItems length changed during processing: before=${len}, after=${i}`
            );
        }
    }
    // sort matchingItems by accuracy
    const result = matchingItems.sort((a, b) => b.accuracy - a.accuracy); ///.filter((mi) => mi.accuracy > 0);
    const finalResult = [];
    for (const r of result) {
        if (r.accuracy === 100) {
            isValid = true;
            finalResult.push(r);
            // break;
        } else {
            if (!isValid) {
                for (const v of r.values) {
                    if (v.state === r.state && v.state !== CompareState.EQUAL) {
                        diff.push({
                            ...v,
                            index: r.index,
                            accuracy: v.accuracy,
                        });
                        finalResult.push(r);
                        // finalState = r.state;
                        // break; // accuracy > 50
                    }
                }
                // diff.push(...r.values.filter((v) => v.state !== CompareState.EQUAL));
            }
        }
    }
    // isValid = diff.length === 0; //  result.filter((mi) => mi.accuracy === 100).length > 0;
    return {
        expected: expectedItem,
        received: receivedItems,
        found: finalResult.slice(0, 5), // max 5 items
        // found: finalResult, // max 5 items
        pass: isValid,
    };
};
export const getMatchingState = (
    valueItems: MatchItem[] | ValueItem[]
): COMPARE_STATE => {
    let state = CompareState.EQUAL;
    const status = valueItems
        .map((v) => v.state)
        .filter((s) => s !== CompareState.EQUAL);
    if (status.length === 0) {
        state = CompareState.EQUAL;
    } else if (status.length === 1) {
        state = status[0];
    } else {
        state = CompareState.MIXED;
    }
    return state;
};
export const getMatchesStats = (matches: FoundItem[]): string => {
    const sortedMatches = matches.sort((a, b) => b.accuracy - a.accuracy);
    let result = `🎯 matches: ${sortedMatches.length}`;
    for (const match of sortedMatches) {
        result += `\n        - index=${match.index} (${match.accuracy}%)`;
    }
    return `\n${result}\n`;
};

// export const makeFailMsg = (exp: any, rec: Array<any>, accuracy: number) => {
export const makeFailMsg = (exp: any, foundItems: FoundItem[]) => {
    const rec = foundItems.map((fi) => fi.value);
    const topRec = rec[0];
    const isObj = typeof rec === 'object' && rec !== null;
    const keys = topRec && isObj ? Object.keys(topRec) : [];
    const newRec = formatPlaceholder(exp, topRec);
    const diff = printDiffOrStringify(
        exp, // „Erwartet: hat foo“
        newRec, // „Erhalten: hat bar“
        'Expected',
        'Received',
        true
        // this.expand ?? false
    );
    return `
${matcherHint('.toContainItems', 'object')}

Expected object has different values then received (${foundItems[0]?.accuracy}%)
${getMatchesStats(foundItems)}
${keys.length ? `🔑 Keys: ${RECEIVED_COLOR(keys.join(', '))}\n` : ''}
diff:
${diff}`;
};

const makePassMsg = (exp: any, rec: any) => {
    const isObj = typeof rec === 'object' && rec !== null;
    const val = isObj ? (rec as any).foo : undefined;
    const keys = isObj ? Object.keys(rec as Record<string, unknown>) : [];
    return (
        `${matcherHint('.not.toContainItems', 'object')}\n\n` +
        `Expected object NOT to have own property ${printExpected(exp)}, but it does.\n\n` +
        `Value at "foo": ${printReceived(val)}\n` +
        (keys.length ? `Keys: ${RECEIVED_COLOR(keys.join(', '))}\n` : '')
    );
};
export const getFoundItems = (result: CustomMatchStatus): FoundItem[] => {
    return result.found.map((fi) => ({
        index: fi.index,
        accuracy: fi.accuracy,
        value: result.received[fi.index],
        state: fi.state,
    }));
};

export const toContainItems = (
    receivedItems: ITEM[],
    expectedItem: ITEM
): jest.CustomMatcherResult => {
    const result = getMatchingData(receivedItems, expectedItem);
    // console.log(result.received)
    if (result.found.length > 1) {
        console.log(result);
    }
    const foundItem: MatchItem | null =
        result.found && result.found.length > 0 ? result.found[0] : null;
    const foundItems: FoundItem[] = getFoundItems(result);
    const received: Array<any> = foundItem ? foundItems : []; // null
    const expected = expectedItem;
    const msg = result.pass
        ? makePassMsg(expected, received)
        : makeFailMsg(expected, received);
    return {
        message: () => msg,

        pass: result.pass,
    };
};

// TODO: placeholder
// TODO: CASE-sensitive
// TODO: CASE >50%

// level 1: exact match
// level 2: no case and missing spaces and wrong type (string/number/boolean)
// level 3: partial match
// level 4: different
// src/testing/matchers/hasFoo.ts

expect.extend({ toContainItems });
