import {
    isBothComplexValue,
    isBothSimpleValue,
    isPlaceholder,
    isStr,
} from './../item/is/is';
import { getAllProps } from './../item/props/props';

export const formatPlaceholder = (expected: any, received: any) => {
    let changedReceived = received;
    if (isBothSimpleValue(expected, received)) {
        if (isStr(expected) && isPlaceholder(expected)) {
            const hasPlaceholder = isPlaceholder(expected);
            if (hasPlaceholder && hasPlaceholder === typeof received) {
                changedReceived = expected;
            }
        }
    } else if (isBothComplexValue(expected, received)) {
        const allKeys = getAllProps(expected, received);
        const newObj: any = {};
        for (const key of allKeys) {
            newObj[key] = formatPlaceholder(expected[key], received[key]);
        }
        changedReceived = newObj;
    }
    return changedReceived;
};

export const formatOutput = (input: string) => {
    const reg: RegExp = /\n([\s]+)([^\s|\n])/;
    const lines = input.split('\n');
    const spaces: number = input.match(reg)?.[1].length ?? 0;

    lines.forEach((line: string, index: number) => {
        if (line.trim().length === 0) {
            lines[index] = ''; //
        } else {
            const reg = /^([\s]+)/;
            const curSpaces: number = line.match(reg)?.[1].length ?? 0;
            if (curSpaces) {
                const newSpaces = Math.max(0, curSpaces - spaces);
                lines[index] = line.replace(reg, ' '.repeat(newSpaces));
            } else {
                return line; // no leading spaces
            }
        }
    });
    return lines.join('\n');
};
