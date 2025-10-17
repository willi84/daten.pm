/**
 * Regular expressions for JSON keys and values.
 * These regex patterns are used to match keys and values in JSON objects.
 * They support keys with and without quotes, and values with different formats.
 * The patterns are designed to be flexible and accommodate various JSON structures.
 * https://datatracker.ietf.org/doc/html/rfc8259
 *
 * SQ = Single Quote
 * DQ = Double Quote
 * NQ = No Quote
 * AZ = Alphabetic characters (a-z, A-Z)
 */
export const B = `\\b`; // word boundary

// 1. 🔣 SINGLE CHARACTER

// 1a. not escaped
export const AT = `@`;
export const HASH = '#';
export const AND = '&';
export const COMMA = `,`;
export const UNDERSCORE = `_`;
export const DASH = `-`;
export const COLON = `:`;
export const SEMICOLON = `;`;
export const EXCLAMATION_MARK = `!`;
export const SQ = `'`;
export const DQ = `"`;
export const NQ = '';
// | % =  < >

// 1b. escaped
export const ESC = '\\'; // escape character
export const QUESTION_MARK_ESC = `${ESC}?`;
export const DOT_ESC = `${ESC}.`;
export const SPACE_ESC = `${ESC}s`;
export const ASTERIX_ESC = `${ESC}*`;
export const PLUS_ESC = `${ESC}+`;
export const DACH_ESC = `${ESC}^`; // otherwise begin of line
export const DOLLAR_ESC = `${ESC}$`; // otherwise end of line
export const SLASH_ESC = `${ESC}/`; // slash character
export const NEWLINE_ESC = `${ESC}n`; // new line character
export const BRACE_OPEN_ESC = `${ESC}{`; // open brace character
export const BRACE_CLOSE_ESC = `${ESC}}`; // close brace character
// export const DQ_ESC = `${ESC}"`; // TODO: tests
export const DQ_ESC = `${ESC}${ESC}"`; // TODO: tests
export const SQ_ESC = `${ESC}${ESC}'`; // TODO: tests
// export const SQ_ESC = `${ESC}'`; // TODO: tests

// 2. 🅰️ BASIC Characters
export const num = '[0-9]'; // 0-9
export const AZ = '[a-zA-Z]'; // a-z or A-Z
export const NUM = `\-?${num}+`; // 0-9

// exponential notion: 1e10, -2.5E-4
export const NUM_EXP = `\-?${num}+(?:\\.${num}+)?(?:[eE][+-]?${num}+)?`; // 0-9 with optional decimal and exponent
export const NUM_EXT = `\-?${num}+\\.${num}+`; // 0-9 or _ or : or -

// 3. 🧱 SET of different characters
export const CHAR_NDQ = `[^${DQ}]`; // all characters except double quotes
export const CHAR_NSQ = `[^${SQ}]`; // all characters except single quotes
// # non-quoted keys
export const CHAR_KEY_NQ_FIRST = `(?:${AZ}|${UNDERSCORE}|${DOLLAR_ESC})`;
export const CHAR_KEY_NQ_OTHER = `(?:${AZ}|${NUM}|${UNDERSCORE}|${DOLLAR_ESC})`;

// const regex = /(?:[a-zA-Z]+(?![0-9])|-?\d+\.\d+|-?\d+)/;
// TODO: testen
export const TRUE = `true|TRUE|True`;
export const FALSE = `false|FALSE|False`;
export const NULL = `null|NULL|Null`;

export const CHAR_VALUE_NQ = `(?:\-?[0-9]+\\.[0-9]+|\-?[0-9]+|[a-zA-Z]+)(?!\\.|\\,[0-9]+|\\:[0-9]+)`; // non-space characters for values without quotes
// export const CHAR_VALUE_NQ = `(?<=\:?\s+)(?:${NUM}|${NUM_EXT}|${TRUE}|${FALSE}|${NULL})`; // non-space characters for values without quotes

export const CHAR_KEY_ALL_NSQ = `(?:${SQ_ESC}|${CHAR_NSQ})`; // non-space characters for keys without quotes
export const CHAR_KEY_ALL_NDQ = `(?:${DQ_ESC}|${CHAR_NDQ})`; // non-space characters for keys without quotes
export const CHAR_START = `${NEWLINE_ESC}|${BRACE_OPEN_ESC}|${COMMA}`;

// 4. 🔗 TERM

// 4a. building blocks
// TODO: testen

export const SEPERATE = `${SPACE_ESC}*:${SPACE_ESC}*`; // space before and after colon
export const START_BASIC = `[${CHAR_START}]+${SPACE_ESC}*`;
export const SINGLE_LINE_COMMENT = `\\s*\\/\\/[^\\n]*`; // single line comment regex

export const KEY_NQ = `${CHAR_KEY_NQ_FIRST}${CHAR_KEY_NQ_OTHER}*`; // key without quotes regex
export const KEY_DQ = `${CHAR_KEY_ALL_NDQ}+`; // key dwithout quotes regex
export const KEY_SQ = `${CHAR_KEY_ALL_NSQ}+`; // key without quotes regex

export const VALUE_NQ = `${CHAR_VALUE_NQ}`; // not empty
// export const VALUE_NQ = `${CHAR_VALUE_NQ}`; // not empty
export const VALUE_SQ = `${CHAR_KEY_ALL_NSQ}*`;
export const VALUE_DQ = `${CHAR_KEY_ALL_NDQ}*`;

// 4b. usable terms
export const KEY_IN_DQ = `${DQ}${KEY_DQ}${DQ}`;
export const KEY_IN_SQ = `${SQ}${KEY_SQ}${SQ}`;
export const KEY_IN_NQ = `${KEY_NQ}`;

// ((?<![0-9]*)(?:[a-zA-Z]+(?![0-9]*))|(?:-?\d+\.\d+)|(?:-?\d+))
// export const VALUE_IN_NQ = `${NUM_STRICT}|${AZ_STRICT}`; // value without quotes regex
export const VALUE_IN_NQ = `${B}${VALUE_NQ}${B}`; // value without quotes regex
export const VALUE_IN_DQ = `${DQ}${VALUE_DQ}${DQ}`;
export const VALUE_IN_SQ = `${SQ}${VALUE_SQ}${SQ}`;

// 4c. combined terms
export const KEY_ALL = `${KEY_IN_DQ}|${KEY_IN_SQ}|${KEY_IN_NQ}`; // key regex with all types of quotes
export const START_HAS_KEYS = `[${CHAR_START}]+${SPACE_ESC}*(?=(${KEY_ALL})(${SEPERATE}))`; // START of property followed by KEYS
// export const START_HAS_KEYS = `[${CHAR_START}]+${SPACE_ESC}*(?=(${KEY_ALL})(${SEPERATE}))`; // START of property followed by KEYS

export const HAS_START_KEY_DQ = `(?<=${START_HAS_KEYS})(${KEY_IN_DQ})(?=${SEPERATE})`;
export const HAS_START_KEY_SQ = `(?<=${START_HAS_KEYS})(${KEY_IN_SQ})(?=${SEPERATE})`;
export const HAS_START_KEY_NQ = `(?<=${START_HAS_KEYS})(${KEY_IN_NQ})(?=${SEPERATE})`;
export const HAS_START_KEY_ALL = `(?<=${START_HAS_KEYS})(${KEY_ALL})(?=${SEPERATE})`;

// TODO: testen
export const HAS_KEY_START = `${START_HAS_KEYS}(?:${KEY_ALL})`; // key regex with all types of quotes and start of line

export const HAS_KEY_VALUE_DQ = `${HAS_KEY_START}${SEPERATE}${VALUE_IN_DQ},*`; // DQ value
export const HAS_KEY_VALUE_SQ = `${HAS_KEY_START}${SEPERATE}${VALUE_IN_SQ},*`; // SQ value
export const HAS_KEY_VALUE_NQ = `${HAS_KEY_START}${SEPERATE}${VALUE_IN_NQ},*`; // NQ value

// TODO: `[^\\s|^\\n|^\\r|^:|^'|^"]*`;
// export const CHAR_KEY_DQ = `(?:${AZ}|${NUM}|${UNDERSCORE}|${DOLLAR})`;
// export const CHAR_KEY_ALL_NSQ = `(?:${CHAR_NSQ}|${SQ_ESC})`; // non-space characters for keys without quotes

// -------------- 🚀 productive regexes -------------------
// has key

// 5. ✂️ extract strings
export const GET_KEY_SQ = `(?:${SQ})(${KEY_SQ})(?:${SQ})`; // key within single quotes regex
export const GET_KEY_DQ = `(?:${DQ})(${KEY_DQ})(?:${DQ})`; // key within double quotes regex
export const GET_KEY_NQ = `(${KEY_NQ})`; // key without

export const GET_VALUE_SQ = `(?:${SQ})(${VALUE_SQ})(?:${SQ})`;
export const GET_VALUE_DQ = `(?:${DQ})(${VALUE_DQ})(?:${DQ})`;
export const GET_VALUE_NQ = `(?<=:\s*)${VALUE_NQ}${B}`; // value without quotes regex
// export const GET_VALUE_NQ = `(?:${NUM_EXT}|-?[0-9]+|true|null|false)`;

// START followed by non newline, comma, esc character

// 6. 💫 replace

// matches the full term but not include the quotes for $1
export const REPLACE_KEY_SQ_START = `(?<=${START_BASIC})${GET_KEY_SQ}(?=${SEPERATE})`; // key within single quotes regex
export const REPLACE_KEY_DQ_START = `(?<=${START_BASIC})(?:${DQ})(${KEY_DQ})(?:${DQ})(?=${SEPERATE})`; // key within double quotes regex
export const REPLACE_KEY_NQ_START = `(?<=${START_BASIC})(${KEY_NQ})(?=${SEPERATE})`; // key without

export const GET_VALUE_SQ_AFTER_KEY_DQ_START = `(?<=${START_BASIC}${KEY_IN_DQ}${SEPERATE})${GET_VALUE_SQ}`;
export const GET_VALUE_SQ_AFTER_KEY_SQ_START = `(?<=${START_BASIC}${KEY_IN_SQ}${SEPERATE})${GET_VALUE_SQ}`;
export const GET_VALUE_SQ_AFTER_KEY_NQ_START = `(?<=${START_BASIC}${KEY_IN_NQ}${SEPERATE})${GET_VALUE_SQ}`;

export const KEY_IN_ALL = `(?:${KEY_IN_DQ}|${KEY_IN_SQ}|${KEY_IN_NQ})`; // key regex with all types of quotes

export const GET_ITEM_SQ = `(${START_BASIC}${KEY_IN_ALL}${SEPERATE}${VALUE_IN_SQ})`; // key within single quotes regex
export const GET_ITEM_DQ = `(${START_BASIC}${KEY_IN_ALL}${SEPERATE}${VALUE_IN_DQ})`; // key within single quotes regex
export const GET_ITEM_NQ = `(${START_BASIC}${KEY_IN_ALL}${SEPERATE}${VALUE_IN_NQ})`; // key within single quotes regex

export const GET_ITEM_NQ_SQ = `(${START_BASIC}${KEY_IN_NQ}${SEPERATE}${VALUE_IN_SQ})`; // key within single quotes regex
export const GET_ITEM_NQ_DQ = `(${START_BASIC}${KEY_IN_NQ}${SEPERATE}${VALUE_IN_DQ})`; // key within single quotes regex
export const GET_ITEM_NQ_NQ = `(${START_BASIC}${KEY_IN_NQ}${SEPERATE}${VALUE_IN_NQ})`; // key within single quotes regex

export const GET_KEY_VALUE_NQ = `(${START_BASIC}${KEY_IN_NQ}${SEPERATE}${GET_VALUE_NQ})`; // key within single quotes regex
export const GET_KEY_VALUE_SQ = `(${START_BASIC}${KEY_IN_NQ}${SEPERATE}${GET_VALUE_SQ})`; // key within single quotes regex
export const GET_KEY_VALUE_DQ = `(${START_BASIC}${KEY_IN_NQ}${SEPERATE}${GET_VALUE_DQ})`; // key within single quotes regex
