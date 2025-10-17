import { LOW_STR } from './../../../index.d';
import {
    isBothSimpleValue,
    isBothString,
    isComplexValue,
    isCongruent,
    isMatchingWord,
    isOneString,
    isPlaceholder,
} from '../is/is';
import { getAllProps } from '../props/props';
import { ACCURACY, INDEX, MATCHES, WordItem } from './accuracy.d';

/**
 * 🎯 calculate the average accuracy from an array of accuracy numbers
 * @param {MATCHES} found ➡️ array of accuracy numbers
 * @returns {ACCURACY} 📤 average accuracy (0-100) rounded to one decimal
 */
export const getTotalAccuracy = (found: MATCHES): ACCURACY => {
    if (found.length === 0) return 0;
    const sum = found.reduce((a, b) => a + b, 0);
    const result = sum / found.length;
    return Math.round(result * 10) / 10; // one decimal
};

/**
 * 🎯 compare two strings char by char and return the number of matching chars
 * @param {string} input ➡️ string to check
 * @param {string} expected ➡️ string to compare with
 * @returns {ACCURACY} 📤 percentage of matching characters (0-100)
 */
export const getCharAccuracy = (input: string, expected: string): ACCURACY => {
    const found: MATCHES = [];
    const len = expected.length;
    for (let i = 0; i < len; i++) {
        if (input[i] === expected[i]) {
            found.push(100);
        } else if (input[i]?.toLowerCase() === expected[i]?.toLowerCase()) {
            found.push(50);
        } else {
            found.push(0);
        }
    }
    if (input.length > len) {
        const diff = input.length - len;
        for (let i = 0; i < diff; i++) {
            found.push(0);
        }
    }
    return getTotalAccuracy(found);
};

// TODO: testen
export const splitWords = (str: string): string[] => {
    return str.split(/\s+/).filter((w) => w.length > 0);
};

/**
 *
 * @param input
 * @param expected
 * @returns
 */
export const getWordAccuracy = (input: string, expected: string): ACCURACY => {
    const wordsInput = splitWords(input);
    const wordsInputLC: LOW_STR[] = splitWords(input.toLowerCase());
    const wordExpectedLC: LOW_STR = expected.toLowerCase();
    const indexWord: INDEX = wordsInput.indexOf(expected);
    const indexLowerWord: INDEX = wordsInputLC.indexOf(wordExpectedLC);
    if (indexWord !== -1) {
        return 100;
    } else if (indexLowerWord !== -1) {
        const inputWord = wordsInput[indexLowerWord];
        return getCharAccuracy(inputWord, expected);
    } else {
        // check placeholder
        let hasPlaceholder = false;
        for (const wordInput of wordsInput) {
            if (isMatchingWord(expected, wordInput)) {
                hasPlaceholder = true;
                // break;
            }
        }
        return hasPlaceholder ? 100 : 0;
    }

    // TODO: correct word but multiple spaces should be congruent
};

export const getAnalyzeItems = (input: string): WordItem[] => {
    const wordsInput = splitWords(input);
    const items = wordsInput.map((word, index) => {
        return {
            word,
            lowerWord: word.toLowerCase(),
            index,
            found: false,
            accuracy: -1,
        };
    });
    return items;
};
export const updateItem = (
    expectedItem: WordItem,
    inputItem: WordItem,
    accuracy: number
) => {
    expectedItem.found = true;
    expectedItem.accuracy = accuracy;
    inputItem.found = true;
    inputItem.accuracy = accuracy;
};
/**
 * 🎯 evaluate the accuracy of two WordItems and update their found and accuracy properties
 * @param inputItem {WordItem} ➡️ item to check
 * @param expected {WordItem} ➡️ item to compare with
 * @return {void}
 */
export const evaluateWordAccuracy = (
    inputItem: WordItem,
    expected: WordItem
): void => {
    if (!inputItem.found && !expected.found) {
        const acc = getCharAccuracy(inputItem.word, expected.word);
        if (inputItem.word === expected.word) {
            // same word on same position
            updateItem(expected, inputItem, acc);
        } else if (inputItem.lowerWord === expected.lowerWord) {
            // same word on same position but different case
            updateItem(expected, inputItem, acc);
        } else if (isMatchingWord(expected.word, inputItem.word)) {
            updateItem(expected, inputItem, 100);
            // break;
        } else if (acc >= 75 && acc < 100) {
            updateItem(expected, inputItem, acc);
        } else {
            // console.log(inputItem.word, expected.word, acc);
        }
        // console.log(inputItem)
    }
};

/**
 * 🎯 evaluate the accuracy of two strings by comparing their words
 * @param input {string} ➡️ string to check
 * @param expected {string} ➡️ string to compare with
 * @returns {ACCURACY} 📤 percentage of matching words (0-100)
 */
export const evaluateStringAccuracy = (
    input: string,
    expected: string
): ACCURACY => {
    if (input === expected) {
        return 100;
    } else {
        const itemsExpected = getAnalyzeItems(expected);
        const itemsInput = getAnalyzeItems(input);

        // get wordByWord
        for (const itemExpected of itemsExpected) {
            const itemInput = itemsInput[itemExpected.index];
            if (itemInput) {
                evaluateWordAccuracy(itemInput, itemExpected);
            }
        }
        // iterate through not found input items
        for (const itemInput of itemsInput) {
            if (!itemInput.found) {
                // not found yet
                for (const itemExpected of itemsExpected) {
                    if (!itemExpected.found) {
                        evaluateWordAccuracy(itemExpected, itemInput);
                    }
                }
            }
        }

        // get all accuracy
        const found = itemsExpected.map((i: any) => {
            if (i?.accuracy !== -1) {
                return i?.accuracy;
            } else {
                return 0;
            }
        });
        // substract accuarcy if length of input and expected is different
        if (found.length < itemsInput.length) {
            const diff = Math.abs(found.length - itemsInput.length);
            for (let i = 0; i < diff; i++) {
                found.push(0);
            }
        }

        // adjust accuracy for placeholders or spaces
        let result = getTotalAccuracy(found);
        if (result === 100 && input !== expected) {
            if (isPlaceholder(expected)) {
                // result = 100; // TODO: longer placeholders
            } else {
                result = getCharAccuracy(input, expected);
            }
        }
        return result;
    }
};
// TODO: tests
export const evaluateCongruent = (input: any, expected: any): ACCURACY => {
    const isCongruently = isCongruent(input, expected);
    const hasPlaceholder =
        typeof expected === 'string' &&
        isPlaceholder(expected) &&
        isPlaceholder(expected) === typeof input;
    return isCongruently ? (hasPlaceholder ? 100 : 50) : 0;
};
export const evaluateSimpleItem = (input: any, expected: any): number => {
    if (isBothString(input, expected)) {
        return evaluateStringAccuracy(input, expected);
    } else if (input === expected) {
        // also number
        return 100;
    } else if (isOneString(input, expected)) {
        return evaluateCongruent(input, expected);
    }
    return 0; // different simple values
};

export const evaluateItemAccuracy = (input: any, expected: any): number => {
    const found: number[] = [];
    if (isComplexValue(input) && isComplexValue(expected)) {
        if (JSON.stringify(input) === JSON.stringify(expected)) {
            found.push(100);
        } else {
            const foundSub: number[] = [];
            for (const key of getAllProps(input, expected)) {
                const inputVal = input[key];
                const expectVal = expected[key];
                if (isBothSimpleValue(inputVal, expectVal)) {
                    foundSub.push(evaluateSimpleItem(inputVal, expectVal));
                } else {
                    // complex value
                    foundSub.push(evaluateItemAccuracy(inputVal, expectVal));
                }
            }
            found.push(getTotalAccuracy(foundSub));
        }
        // return getTotalAccuracy(found);
    } else if (isBothSimpleValue(input, expected)) {
        found.push(evaluateSimpleItem(input, expected));
    } else {
        // mixed types
        found.push(0);
    }
    return getTotalAccuracy(found);
};
