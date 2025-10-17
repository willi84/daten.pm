import { CASE, EQUAL, PLACEHOLDER, SPACES, TYPE, VALUE } from '../item.config';
import { SIMILIARITY, SIMPLE_VALUE } from '../item.d';

export const isSimpleValue = (value: any): value is SIMPLE_VALUE => {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        value === null ||
        value === undefined
    );
};
export const isComplexValue = (value: any): boolean => {
    return typeof value === 'object' && value !== null;
};
export const isCheckPlaceholder = (
    expected: string,
    input: string,
    type: string
): boolean => {
    switch (type) {
        case 'string':
            const regStr = expected.replace(`{${type}}`, '[^\\s]+');
            const regex = new RegExp(`^${regStr}$`);
            return regex.test(input);
        case 'number':
            const regNumStr = expected.replace(`{${type}}`, '\\d+');
            const regexNum = new RegExp(`^${regNumStr}$`);
            return regexNum.test(input);
        case 'boolean':
            const regBoolStr = expected.replace(`{${type}}`, '(true|false)');
            const regexBool = new RegExp(`^${regBoolStr}$`);
            return regexBool.test(input);
    }
    return false;
};
export const isMatchingWord = (expected: string, input: string): boolean => {
    const hasPlaceholder = isPlaceholder(expected);
    if (hasPlaceholder) {
        const type = hasPlaceholder;
        return isCheckPlaceholder(expected, input, type);
    }
    return input === expected;
};

// isString is deprecated, use isStr; typeguard
export const isStr = (input: unknown): input is string => {
    return typeof input === 'string';
};

export const isBothString = (input: unknown, expected: unknown): boolean => {
    return isStr(input) && isStr(expected);
};
export const isBothSimpleValue = (input: any, expected: any) => {
    return isSimpleValue(input) && isSimpleValue(expected);
};
export const isBothComplexValue = (input: any, expected: any) => {
    return isComplexValue(input) && isComplexValue(expected);
};
export const isOneString = (input: any, expected: any) => {
    const typeInput = typeof input;
    const typeExpected = typeof expected;
    const hasDifferentTypes = typeInput !== typeExpected;
    const hasOneString = typeInput === 'string' || typeExpected === 'string';
    return hasDifferentTypes && hasOneString;
};

export const isCongruentValue = (strValue: string, othValue: any): boolean => {
    const expected = strValue.toLowerCase().trim();
    const input = `${othValue}`.toLowerCase().trim();
    return expected === input;
};

export const isCongruent = (strValue: any, value2: any): SIMILIARITY => {
    let type: SIMILIARITY = null;
    if (strValue === value2) {
        type = EQUAL;
    } else if (isBothString(strValue, value2)) {
        const lower1 = strValue.toLowerCase();
        const lower2 = value2.toLowerCase();
        if (strValue.trim() == value2.trim()) {
            type = SPACES;
        } else if (lower1 === lower2) {
            type = CASE;
        } else if (lower1.trim() === lower2.trim()) {
            type = VALUE;
        }
    } else if (isStr(strValue)) {
        // if (typeof strValue === 'string') {
        const hasPlaceholder = isPlaceholder(strValue);
        if (hasPlaceholder && hasPlaceholder === typeof value2) {
            type = PLACEHOLDER;
        } else if (isCongruentValue(strValue, value2)) {
            type = TYPE;
        }
    } else if (isStr(value2)) {
        const hasPlaceholder = isPlaceholder(value2);
        if (hasPlaceholder && hasPlaceholder === typeof strValue) {
            type = PLACEHOLDER;
        } else if (isCongruentValue(value2, strValue)) {
            type = TYPE;
        }
    }
    return type as SIMILIARITY;
};
export const isPlaceholder = (value: string): string | null => {
    if (typeof value !== 'string') {
        return null;
    }
    const hasPlaceholder = value.match(/{(string|number|boolean)}/);
    return hasPlaceholder ? hasPlaceholder[1] : null;
};
