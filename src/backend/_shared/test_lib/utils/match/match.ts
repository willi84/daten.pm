/**
 * simple function to test a regex against an input string
 * @param regexStr string representing the regex to test
 * @param input  string to test against the regex
 * @returns boolean indicating if the input matches the regex
 */
export const testRegex = (regexStr: string, input: string): boolean => {
    const regex = new RegExp(`${regexStr}`, 'g');
    const result: boolean = regex.test(input);
    return result;
};
/**
 * check if the input matches the regex exactly adding ^ and $ to the regex
 * @param regexStr string representing the regex to test
 * @param input string to test against the regex
 * @returns boolean indicating if the input matches the regex exactly
 */
export const exactMatch = (regexStr: string, input: string): boolean => {
    const prefix = regexStr.startsWith('^') ? '' : '^'; // add ^ if not already present
    const hasDollar = regexStr.endsWith('$') ? '' : '$'; // add $ if not already present
    const finalRegexStr = `${prefix}${regexStr}${hasDollar}`; // construct the final regex string
    const regex = new RegExp(`${finalRegexStr}`, '');
    const result: boolean = regex.test(input);
    return result;
};

/**
 * check if the input matches the regex exactly, but allows multiple characters
 * @param regexStr Regular expression string to match against input
 * @param input string to test against the regex
 * @returns boolean indicating if the input matches the regex exactly
 */
export const matchAll = (regexStr: string, input: string): boolean => {
    const quantifier = regexStr.match(/[*|+|?]$/) ? '' : '+'; // detect quantifier
    const regex = new RegExp(`^${regexStr}${quantifier}$`);
    const result: boolean = regex.test(input);
    return result;
};

/**
 * Check if the input string has a match for the regex.
 * @param regexStr Regular expression string to match against input
 * @param input Input string to search for matches
 * @returns boolean True if a match is found, false otherwise
 */
export const hasMatch = (regexStr: string, input: string): boolean => {
    const regex = new RegExp(regexStr, '');
    const match = input.match(regex);
    if (match && match.length > 0) {
        return true; // match found
    }
    return false; // no match found
};

/**
 * Get the fully matching term.
 * @param regexStr Regular expression string to match against input
 * @param input Input string to search for matches
 * @returns string|null The first match found, or null if no match is found
 */
export const get1stMatch = (regexStr: string, input: string): string | null => {
    const regex = new RegExp(regexStr, 'g');
    const match = input.match(regex);
    if (match && match.length > 0) {
        return match[0]; // return the first match
    }
    return null; // no match found
};

/**
 * Get all matches for the regex in the input string.
 * @param regexStr Regular expression string to match against input
 * @param input Input string to search for matches
 * @returns string[] Array of all matches found, or an empty array if no matches are found
 */
export const getAllMatches = (regexStr: string, input: string): string[] => {
    const regex = new RegExp(regexStr);
    const match = input.match(regex);
    if (match && match?.length > 0) {
        return match?.filter((m) => m !== undefined);
    }
    return [];
};
