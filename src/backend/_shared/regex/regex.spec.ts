import {
    exactMatch,
    get1stMatch,
    getAllMatches,
    hasMatch,
    matchAll,
    testRegex,
} from './../test_lib/utils/match/match';
import {
    AT,
    AZ,
    BRACE_CLOSE_ESC,
    BRACE_OPEN_ESC,
    COLON,
    COMMA,
    DASH,
    DOT_ESC,
    DQ_ESC,
    ESC,
    NEWLINE_ESC,
    NUM,
    NUM_EXT,
    SLASH_ESC,
    SPACE_ESC,
    SQ_ESC,
    UNDERSCORE,
    DOLLAR_ESC,
    CHAR_KEY_NQ_FIRST,
    CHAR_KEY_NQ_OTHER,
    CHAR_NDQ,
    CHAR_NSQ,
    GET_KEY_NQ,
    GET_KEY_SQ,
    GET_KEY_DQ,
    VALUE_IN_NQ,
    VALUE_IN_DQ,
    KEY_IN_NQ,
    KEY_IN_SQ,
    KEY_IN_DQ,
    VALUE_IN_SQ,
    GET_VALUE_SQ,
    GET_VALUE_DQ,
    GET_VALUE_NQ,
    SEPERATE,
    START_HAS_KEYS,
    HAS_START_KEY_ALL,
    CHAR_START,
    KEY_ALL,
    HAS_START_KEY_DQ,
    HAS_START_KEY_SQ,
    HAS_START_KEY_NQ,
    REPLACE_KEY_SQ_START,
    REPLACE_KEY_DQ_START,
    REPLACE_KEY_NQ_START,
    HASH,
    AND,
    SEMICOLON,
    QUESTION_MARK_ESC,
    EXCLAMATION_MARK,
    SQ,
    DQ,
    ASTERIX_ESC,
    PLUS_ESC,
    DACH_ESC,
    CHAR_VALUE_NQ,
    CHAR_KEY_ALL_NSQ,
    CHAR_KEY_ALL_NDQ,
    START_BASIC,
    KEY_NQ,
    KEY_SQ,
    KEY_DQ,
    VALUE_NQ,
    VALUE_SQ,
    VALUE_DQ,
    GET_VALUE_SQ_AFTER_KEY_DQ_START,
    GET_VALUE_SQ_AFTER_KEY_SQ_START,
    GET_VALUE_SQ_AFTER_KEY_NQ_START,
    GET_ITEM_SQ,
    GET_ITEM_DQ,
    GET_ITEM_NQ,
    GET_ITEM_NQ_SQ,
    GET_ITEM_NQ_DQ,
    GET_ITEM_NQ_NQ,
    NUM_EXP,
    SINGLE_LINE_COMMENT,
    HAS_KEY_START,
    HAS_KEY_VALUE_DQ,
    NQ,
    HAS_KEY_VALUE_SQ,
    HAS_KEY_VALUE_NQ,
} from './regex';

const NEWLINE = '\n'; // new line
const BRACE_OPEN = '{'; // open brace
const BRACE_CLOSE = '}'; // close
const SPACE = ' ';
const SPACES = '    ';

describe('✅ 1. 🔣 SINGLE CHARACTER', () => {
    describe('1a. not escaped', () => {
        it('exact match of @ char', () => {
            const regex = AT;
            expect(exactMatch(regex, '@')).toEqual(true);
            expect(exactMatch(regex, '@x')).toEqual(false); // avoid falsepositive
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of # char', () => {
            const regex = HASH;
            expect(exactMatch(regex, '#')).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of & char', () => {
            const regex = AND;
            expect(exactMatch(regex, '&')).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of COMMA char', () => {
            const regex = COMMA;
            expect(exactMatch(regex, ',')).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of UNDERSCORE char', () => {
            const regex = UNDERSCORE;
            expect(exactMatch(regex, '_')).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of DASH char', () => {
            const regex = DASH;
            expect(exactMatch(regex, '-')).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of COLON char', () => {
            const regex = COLON;
            expect(exactMatch(regex, ':')).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of SEMICOLON char', () => {
            const regex = SEMICOLON;
            expect(exactMatch(regex, ';')).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of EXCLAMATION_MARK char', () => {
            const regex = EXCLAMATION_MARK;
            expect(exactMatch(regex, '!')).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of SINGLE QUOTE char', () => {
            const regex = SQ;
            expect(exactMatch(regex, `'`)).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of DOUBLE QUOTE char', () => {
            const regex = DQ;
            expect(exactMatch(regex, '"')).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
    });
    describe('1.b escaped', () => {
        it('exact match of ESCAPE char', () => {
            const regex = `\\${ESC}`;
            expect(exactMatch(regex, '\\')).toEqual(true);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, 'A')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of QUESTION_MARK char', () => {
            const regex = QUESTION_MARK_ESC;
            expect(exactMatch(regex, '?')).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of DOT char', () => {
            const regex = DOT_ESC;
            expect(exactMatch(regex, '.')).toEqual(true);
            expect(exactMatch(regex, ',')).toEqual(false);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of SPACE char', () => {
            const regex = SPACE_ESC;
            expect(exactMatch(regex, ' ')).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of ASTERIX char', () => {
            const regex = ASTERIX_ESC;
            expect(exactMatch(regex, '*')).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of PLUS char', () => {
            const regex = PLUS_ESC;
            expect(exactMatch(regex, '+')).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of DACH char', () => {
            const regex = DACH_ESC;
            expect(exactMatch(regex, '^')).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of DOLLAR char', () => {
            const regex = DOLLAR_ESC;
            expect(exactMatch(regex, '$')).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of SLASH char', () => {
            const regex = SLASH_ESC;
            expect(exactMatch(regex, '/')).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of NEWLINE char', () => {
            const regex = NEWLINE_ESC;
            expect(exactMatch(regex, '\n')).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of BRACE_OPEN char', () => {
            const regex = BRACE_OPEN_ESC;
            expect(exactMatch(regex, '{')).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of BRACE_CLOSE char', () => {
            const regex = BRACE_CLOSE_ESC;
            expect(exactMatch(regex, '}')).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of DQ char', () => {
            const regex = DQ_ESC;
            expect(exactMatch(regex, `"`)).toEqual(false);
            expect(exactMatch(regex, `\"`)).toEqual(false);
            expect(exactMatch(regex, `\\"`)).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
        it('exact match of SQ char', () => {
            const regex = SQ_ESC;
            expect(exactMatch(regex, `'`)).toEqual(false);
            expect(exactMatch(regex, `\'`)).toEqual(false);
            expect(exactMatch(regex, `\\'`)).toEqual(true);
            expect(exactMatch(regex, 'a')).toEqual(false);
            expect(exactMatch(regex, '3')).toEqual(false);
            expect(exactMatch(regex, '')).toEqual(false); // no empty
        });
    });
});
describe('✅ 2. 🅰️ BASIC Characters', () => {
    describe('[a-zA-Z]', () => {
        const regex = AZ;
        it('has valid chars', () => {
            expect(matchAll(regex, 'abcAD')).toEqual(true);
        });
        it('has invalid chars', () => {
            expect(matchAll(regex, '123')).toEqual(false);
            expect(matchAll(regex, 'abcAD* _-A$')).toEqual(false);
        });
        it('is invalid [cross-check]', () => {
            expect(matchAll(regex, 'abc12')).toEqual(false); // avoid false positive
            expect(matchAll(regex, '')).toEqual(false); // no empty
        });
    });
    describe('[0-9]', () => {
        const regex = NUM;
        it('has valid number', () => {
            expect(matchAll(regex, '123')).toEqual(true);
            expect(matchAll(regex, '-123')).toEqual(true);
        });
        it('has invalid number', () => {
            expect(matchAll(regex, 'abcAD')).toEqual(false);
            expect(matchAll(regex, 'abcAD* _-A$')).toEqual(false);
            expect(matchAll(regex, '123.12')).toEqual(false);
            expect(matchAll(regex, '-123.12')).toEqual(false); //correct float
            expect(matchAll(regex, '-123,12')).toEqual(false);
        });
        it('is invalid [cross-check]', () => {
            expect(matchAll(regex, 'abc12')).toEqual(false); // avoid false positive
            expect(matchAll(regex, '')).toEqual(false); // no empty
        });
    });
    describe('[-0-9].[0-9]', () => {
        const regex = NUM_EXT;
        it('has valid number', () => {
            expect(matchAll(regex, '123.12')).toEqual(true);
            expect(matchAll(regex, '-123.12')).toEqual(true); //correct float
        });
        it('has invalid number', () => {
            expect(matchAll(regex, 'abcAD')).toEqual(false);
            expect(matchAll(regex, '123')).toEqual(false);
            expect(matchAll(regex, '-123,12')).toEqual(false);
            expect(matchAll(regex, 'abcAD* _-A$')).toEqual(false);
        });
        it('is invalid [cross-check]', () => {
            expect(matchAll(regex, 'abc12')).toEqual(false); // avoid false positive
            expect(matchAll(regex, '')).toEqual(false); // no empty
        });
    });
    describe('[-0-9]e', () => {
        const regex = NUM_EXP;
        it('has valid number', () => {
            expect(matchAll(regex, '123')).toEqual(true);
            expect(matchAll(regex, '-123')).toEqual(true);
            expect(matchAll(regex, '123.12')).toEqual(true);
            expect(matchAll(regex, '-123.12')).toEqual(true); //correct float
            expect(matchAll(regex, '123e10')).toEqual(true);
            expect(matchAll(regex, '123E10')).toEqual(true);
            expect(matchAll(regex, '-123e10')).toEqual(true);
            expect(matchAll(regex, '-123E10')).toEqual(true);
            expect(matchAll(regex, '123e-10')).toEqual(true);
            expect(matchAll(regex, '123E-10')).toEqual(true);
            expect(matchAll(regex, '-123e-10')).toEqual(true);
            expect(matchAll(regex, '-123E-10')).toEqual(true);
            expect(matchAll(regex, '123e+10')).toEqual(true);
            expect(matchAll(regex, '123E+10')).toEqual(true);
            expect(matchAll(regex, '-123e+10')).toEqual(true);
            expect(matchAll(regex, '-123E+10')).toEqual(true);
        });
        it('has invalid number', () => {
            expect(matchAll(regex, 'abcAD')).toEqual(false);
            expect(matchAll(regex, '-123,12')).toEqual(false);
            expect(matchAll(regex, 'abcAD* _-A$')).toEqual(false);
        });
        it('is invalid [cross-check]', () => {
            expect(matchAll(regex, 'abc12e3')).toEqual(false); // avoid false positive
            expect(matchAll(regex, '')).toEqual(false); // no empty
        });
    });
});
describe('3. 🧱 SET of different characters', () => {
    it('match all char which are not double quoted', () => {
        const regex = CHAR_NDQ;
        expect(matchAll(regex, `$a3'`)).toEqual(true);
        expect(matchAll(regex, `$a3"`)).toEqual(false);
        expect(matchAll(regex, ``)).toEqual(false);
    });
    it('match all char which are not single quoted', () => {
        const regex = CHAR_NSQ;
        expect(matchAll(regex, `$a3'`)).toEqual(false);
        expect(matchAll(regex, `$a3"`)).toEqual(true);
        expect(matchAll(regex, ``)).toEqual(false);
    });
    it('should match first char of a non quoted json key', () => {
        const regex = CHAR_KEY_NQ_FIRST;
        expect(exactMatch(regex, 'a')).toEqual(true);
        expect(exactMatch(regex, 'A')).toEqual(true);
        expect(exactMatch(regex, '_')).toEqual(true);
        expect(exactMatch(regex, '$')).toEqual(true);
        expect(exactMatch(regex, '3')).toEqual(false);
        expect(exactMatch(regex, '-')).toEqual(false);
        expect(exactMatch(regex, ':')).toEqual(false);
    });
    it('should match other char of a non quoted json key', () => {
        const regex = CHAR_KEY_NQ_OTHER;
        expect(exactMatch(regex, 'a')).toEqual(true);
        expect(exactMatch(regex, 'A')).toEqual(true);
        expect(exactMatch(regex, '_')).toEqual(true);
        expect(exactMatch(regex, '$')).toEqual(true);
        expect(exactMatch(regex, '3')).toEqual(true);
        expect(exactMatch(regex, '-')).toEqual(false);
        expect(exactMatch(regex, ':')).toEqual(false);
    });
    it('should match first char of a non quoted json key', () => {
        const regex = CHAR_KEY_NQ_FIRST;
        expect(exactMatch(regex, 'a')).toEqual(true);
        expect(exactMatch(regex, 'A')).toEqual(true);
        expect(exactMatch(regex, '_')).toEqual(true);
        expect(exactMatch(regex, '$')).toEqual(true);
        expect(exactMatch(regex, '3')).toEqual(false);
        expect(exactMatch(regex, '-')).toEqual(false);
        expect(exactMatch(regex, ':')).toEqual(false);
    });
    it('should match other char of a non quoted json key', () => {
        const regex = CHAR_KEY_NQ_OTHER;
        expect(exactMatch(regex, 'a')).toEqual(true);
        expect(exactMatch(regex, 'A')).toEqual(true);
        expect(exactMatch(regex, '_')).toEqual(true);
        expect(exactMatch(regex, '$')).toEqual(true);
        expect(exactMatch(regex, '3')).toEqual(true);
        expect(exactMatch(regex, '-')).toEqual(false);
        expect(exactMatch(regex, ':')).toEqual(false);
    });
    it('should match chars of a non quoted value', () => {
        const regex = CHAR_VALUE_NQ;
        expect(exactMatch(regex, 'TRUE')).toEqual(true);
        expect(exactMatch(regex, 'False')).toEqual(true);
        expect(exactMatch(regex, 'null')).toEqual(true);
        expect(exactMatch(regex, 'aBc')).toEqual(true); // false positive
        expect(exactMatch(regex, '123')).toEqual(true);
        expect(exactMatch(regex, '12.3')).toEqual(true);
        expect(exactMatch(regex, '-12.3')).toEqual(true);
        expect(exactMatch(regex, 'aBc123')).toEqual(false);
        expect(exactMatch(regex, '-12.3A')).toEqual(false);
        expect(exactMatch(regex, 'a_3$')).toEqual(false);
    });
    it('should match chars of a single quoted key', () => {
        const regex = CHAR_KEY_ALL_NSQ;
        expect(matchAll(regex, 'aBc')).toEqual(true);
        expect(matchAll(regex, '123')).toEqual(true);
        expect(matchAll(regex, '12.3')).toEqual(true);
        expect(matchAll(regex, '12:3')).toEqual(true);
        expect(matchAll(regex, `12\\'3`)).toEqual(true);
        expect(matchAll(regex, `12\'3`)).toEqual(false);
        expect(matchAll(regex, `'12\\'3'`)).toEqual(false);
        expect(matchAll(regex, `'12\'3'`)).toEqual(false);
        expect(matchAll(regex, `12"3$`)).toEqual(true);
    });
    it('should match chars of a double quoted key', () => {
        const regex = CHAR_KEY_ALL_NDQ;
        expect(matchAll(regex, 'aBc')).toEqual(true);
        expect(matchAll(regex, '123')).toEqual(true);
        expect(matchAll(regex, '12.3')).toEqual(true);
        expect(matchAll(regex, '12:3')).toEqual(true);
        expect(matchAll(regex, `12\\"3`)).toEqual(true);
        expect(matchAll(regex, `12\"3`)).toEqual(false);
        expect(matchAll(regex, `"12\\"3"`)).toEqual(false);
        expect(matchAll(regex, `"12\"3"`)).toEqual(false);
        expect(matchAll(regex, `12'3$`)).toEqual(true);
    });
    it('should match chars of CHAR_START ', () => {
        const regex = CHAR_START;
        expect(exactMatch(regex, NEWLINE)).toEqual(true);
        expect(exactMatch(regex, COMMA)).toEqual(true);
        expect(exactMatch(regex, BRACE_OPEN)).toEqual(true);
        expect(exactMatch(regex, BRACE_CLOSE)).toEqual(false);
    });
});
describe('4. 🔗 TERMS', () => {
    describe('4a. building blocks', () => {
        it('should match a SEPERATE', () => {
            const regex = SEPERATE;
            expect(hasMatch(regex, ':')).toEqual(true);
            expect(hasMatch(regex, ' : ')).toEqual(true);
            expect(hasMatch(regex, ' :')).toEqual(true);
            expect(hasMatch(regex, ': ')).toEqual(true);
            expect(hasMatch(regex, 'a:')).toEqual(true);
            expect(hasMatch(regex, ':a')).toEqual(true);
            expect(hasMatch(regex, 'a:b')).toEqual(true);
            expect(hasMatch(regex, '')).toEqual(false); // no empty
        });
        it('should match a START BASIC term', () => {
            const regex = START_BASIC;
            expect(exactMatch(regex, `\n${SPACES}`)).toEqual(true);
            expect(exactMatch(regex, `,${SPACES}`)).toEqual(true);
            expect(exactMatch(regex, `{${SPACE}`)).toEqual(true);
            expect(exactMatch(regex, `${SPACES}`)).toEqual(false);
        });
        it('should match a SINGLE_LINE_COMMENT', () => {
            const regex = SINGLE_LINE_COMMENT;
            const COMMENT = `// this is //:a comment`;
            expect(exactMatch(regex, `\n ${COMMENT}`)).toEqual(true);
            expect(exactMatch(regex, `${COMMENT}`)).toEqual(true);
            expect(exactMatch(regex, `, ${COMMENT}`)).toEqual(false); // not include ,
        });
        describe('KEY_', () => {
            it('should match a KEY_NQ', () => {
                const regex = KEY_NQ;
                expect(exactMatch(regex, `abc123`)).toEqual(true);
                expect(exactMatch(regex, `$12ab`)).toEqual(true);
                expect(exactMatch(regex, `_abc123`)).toEqual(true);
                expect(exactMatch(regex, `4abc`)).toEqual(false);
                expect(exactMatch(regex, `a':"b`)).toEqual(false);
                expect(exactMatch(regex, ``)).toEqual(false);
            });
            it('should match a KEY_SQ', () => {
                const regex = KEY_SQ;
                expect(exactMatch(regex, `abc123`)).toEqual(true);
                expect(exactMatch(regex, `$12ab`)).toEqual(true);
                expect(exactMatch(regex, `_abc123`)).toEqual(true);
                expect(exactMatch(regex, `4abc`)).toEqual(true);
                expect(exactMatch(regex, `a':"b`)).toEqual(false);
                expect(exactMatch(regex, `a\\':"b`)).toEqual(true);
                expect(exactMatch(regex, ``)).toEqual(false);
            });
            it('should match a KEY_DQ', () => {
                const regex = KEY_DQ;
                expect(exactMatch(regex, `abc123`)).toEqual(true);
                expect(exactMatch(regex, `$12ab`)).toEqual(true);
                expect(exactMatch(regex, `_abc123`)).toEqual(true);
                expect(exactMatch(regex, `4abc`)).toEqual(true);
                expect(exactMatch(regex, `a':"b`)).toEqual(false);
                expect(exactMatch(regex, `a\\":'b`)).toEqual(true);
                expect(exactMatch(regex, ``)).toEqual(false);
            });
        });
        describe('VALUE_', () => {
            it('should match a VALUE_NQ', () => {
                const regex = VALUE_NQ;
                expect(exactMatch(regex, `true`)).toEqual(true);
                expect(exactMatch(regex, `false`)).toEqual(true);
                expect(exactMatch(regex, `null`)).toEqual(true);
                expect(exactMatch(regex, `ab`)).toEqual(true); // false positive
                expect(exactMatch(regex, `123`)).toEqual(true);
                expect(exactMatch(regex, `123.12`)).toEqual(true);
                expect(exactMatch(regex, `-123.12`)).toEqual(true);
                expect(exactMatch(regex, `abc123`)).toEqual(false);
                expect(exactMatch(regex, `$12ab`)).toEqual(false); // TODO
                expect(exactMatch(regex, `_abc123`)).toEqual(false);
                expect(exactMatch(regex, `4abc`)).toEqual(false);
                expect(exactMatch(regex, `a':"b`)).toEqual(false);
                expect(exactMatch(regex, ``)).toEqual(false);
            });
            it('should match a VALUE_SQ', () => {
                const regex = VALUE_SQ;
                expect(exactMatch(regex, `true`)).toEqual(true);
                expect(exactMatch(regex, `123`)).toEqual(true);
                expect(exactMatch(regex, `123.12`)).toEqual(true);
                expect(exactMatch(regex, `-123.12`)).toEqual(true);
                expect(exactMatch(regex, `abc123`)).toEqual(true);
                expect(exactMatch(regex, `$12ab`)).toEqual(true);
                expect(exactMatch(regex, `_abc123`)).toEqual(true);
                expect(exactMatch(regex, `4abc`)).toEqual(true);
                expect(exactMatch(regex, `a':"b`)).toEqual(false);
                expect(exactMatch(regex, `a\\':"b`)).toEqual(true);
                expect(exactMatch(regex, ``)).toEqual(true);
            });
            it('should match a VALUE_DQ', () => {
                const regex = VALUE_DQ;
                expect(exactMatch(regex, `true`)).toEqual(true);
                expect(exactMatch(regex, `123`)).toEqual(true);
                expect(exactMatch(regex, `123.12`)).toEqual(true);
                expect(exactMatch(regex, `-123.12`)).toEqual(true);
                expect(exactMatch(regex, `abc123`)).toEqual(true);
                expect(exactMatch(regex, `$12ab`)).toEqual(true);
                expect(exactMatch(regex, `_abc123`)).toEqual(true);
                expect(exactMatch(regex, `4abc`)).toEqual(true);
                expect(exactMatch(regex, `a':"b`)).toEqual(false);
                expect(exactMatch(regex, `a\\":'b`)).toEqual(true);
                expect(exactMatch(regex, ``)).toEqual(true);
            });
        });
    });
    describe('4b. usable terms', () => {
        describe('KEY_IN_*', () => {
            it('should match different keys', () => {
                const regex = KEY_IN_NQ;
                expect(matchAll(regex, 'abc123_')).toEqual(true);
                expect(matchAll(regex, 'abc123_')).toEqual(true);
                expect(matchAll(regex, '$abc123_')).toEqual(true);
                expect(matchAll(regex, 'abc123:12')).toEqual(false);
                expect(matchAll(regex, 'abc123.12')).toEqual(false);
                expect(matchAll(regex, 'abc123_12')).toEqual(true);
                expect(matchAll(regex, 'ab cd')).toEqual(false);
            });
            it('should have a double quoted json key', () => {
                const regex = KEY_IN_DQ;
                const Q = DQ;
                expect(testRegex(regex, `${Q}$x1_${Q}`)).toEqual(true);
                expect(testRegex(regex, `${Q}$x1_${SQ}`)).toEqual(false);
                expect(testRegex(regex, `${SQ}$x1_${SQ}`)).toEqual(false);
                expect(testRegex(regex, `${Q}${Q}`)).toEqual(false); // no empty key
                expect(testRegex(regex, `${Q}x23.12_:${Q}`)).toEqual(true);
                expect(testRegex(regex, `${Q}${SQ}${SQ}:${Q}`)).toEqual(true); // "''"
                expect(testRegex(regex, `${Q}ab cd${Q}`)).toEqual(true); // no empty

                expect(testRegex(regex, `${Q}${SQ_ESC}${Q}:3`)).toEqual(true); // "'":3 is a valid key
                expect(testRegex(regex, `${Q}${DQ_ESC}${Q}:3`)).toEqual(true); // "\\\"":3 is a valid key
            });
            it('should have a single quoted json key', () => {
                const regex = KEY_IN_SQ;
                const Q = SQ;
                expect(testRegex(regex, `${Q}$x1_${Q}`)).toEqual(true);
                expect(testRegex(regex, `${Q}$x1_${DQ}`)).toEqual(false);
                expect(testRegex(regex, `${DQ}$x1_${DQ}`)).toEqual(false);
                expect(testRegex(regex, `${Q}${Q}`)).toEqual(false); // no empty key
                expect(testRegex(regex, `${Q}x23.12_:${Q}`)).toEqual(true);
                expect(testRegex(regex, `${Q}${DQ}${DQ}:${Q}`)).toEqual(true); // '""'
                expect(testRegex(regex, `${Q}ab cd${Q}`)).toEqual(true); // no empty

                expect(testRegex(regex, `${Q}${SQ_ESC}${Q}:3`)).toEqual(true); // '\\\'':3 is a valid key
                expect(testRegex(regex, `${Q}${DQ_ESC}${Q}:3`)).toEqual(true); // '"':3 is a valid key
            });
        });
        describe('VALUE_IN_*', () => {
            it('should have a non quoted json VALUE', () => {
                const regex = VALUE_IN_NQ;
                expect(getAllMatches(regex, 'abc')).toEqual(['abc']); // false positive
                expect(getAllMatches(regex, 'true')).toEqual(['true']);
                expect(getAllMatches(regex, 'false')).toEqual(['false']);
                expect(getAllMatches(regex, 'null')).toEqual(['null']);
                expect(getAllMatches(regex, '123')).toEqual(['123']);
                expect(getAllMatches(regex, 'abc123')).toEqual([]);
                expect(getAllMatches(regex, 'abc_')).toEqual([]);
                expect(getAllMatches(regex, '$abc123')).toEqual([]);
                expect(getAllMatches(regex, 'abc123:12')).toEqual(['12']); // TODO
                expect(getAllMatches(regex, 'abc12g:hi')).toEqual(['hi']); // TODO false positive
                expect(getAllMatches(regex, 'abc123.12')).toEqual(['12']); // TODO
                expect(getAllMatches(regex, '123.12')).toEqual(['123.12']);
                expect(getAllMatches(regex, '_foo')).toEqual([]);
                expect(getAllMatches(regex, 'abc123_12')).toEqual([]);
                expect(getAllMatches(regex, 'ab cd')).toEqual(['ab']); // false positive
            });
            it('should have a double quoted json VALUE', () => {
                const regex = VALUE_IN_DQ;
                const Q = DQ;
                expect(testRegex(regex, `${Q}$x1_${Q}`)).toEqual(true);
                expect(testRegex(regex, `${Q}$x1_${SQ}`)).toEqual(false);
                expect(testRegex(regex, `${SQ}$x1_${SQ}`)).toEqual(false);
                expect(testRegex(regex, `${Q}${Q}`)).toEqual(true); // no empty VALUE
                expect(testRegex(regex, `${Q}x23.12_:${Q}`)).toEqual(true);
                expect(testRegex(regex, `${Q}${SQ}${SQ}:${Q}`)).toEqual(true); // "''"
                expect(testRegex(regex, `${Q}ab cd${Q}`)).toEqual(true); // no empty

                expect(testRegex(regex, `${Q}${SQ_ESC}${Q}:3`)).toEqual(true); // "'":3 is a valid VALUE
                expect(testRegex(regex, `${Q}${DQ_ESC}${Q}:3`)).toEqual(true); // "\\\"":3 is a valid VALUE
            });
            it('should have a single quoted json VALUE', () => {
                const regex = VALUE_IN_SQ;
                const Q = SQ;
                expect(testRegex(regex, `${Q}$x1_${Q}`)).toEqual(true);
                expect(testRegex(regex, `${Q}$x1_${DQ}`)).toEqual(false);
                expect(testRegex(regex, `${DQ}$x1_${DQ}`)).toEqual(false);
                expect(testRegex(regex, `${Q}${Q}`)).toEqual(true); // no empty VALUE
                expect(testRegex(regex, `${Q}x23.12_:${Q}`)).toEqual(true);
                expect(testRegex(regex, `${Q}${DQ}${DQ}:${Q}`)).toEqual(true); // '""'
                expect(testRegex(regex, `${Q}ab cd${Q}`)).toEqual(true); // no empty

                expect(testRegex(regex, `${Q}${SQ_ESC}${Q}:3`)).toEqual(true); // '\\\'':3 is a valid VALUE
                expect(testRegex(regex, `${Q}${DQ_ESC}${Q}:3`)).toEqual(true); // '"':3 is a valid VALUE
            });
        });
    });
    describe('4c. combined terms', () => {
        describe('START with KEY(S)', () => {
            const fn = get1stMatch;
            it('should match all key types', () => {
                const regex = KEY_ALL;
                expect(fn(regex, 'a2')).toEqual('a2');
                expect(fn(regex, `${DQ}a2${DQ}`)).toEqual(`${DQ}a2${DQ}`);
                expect(fn(regex, `${SQ}a2${SQ}`)).toEqual(`${SQ}a2${SQ}`);
                expect(fn(regex, '2:')).toEqual(null);
            });
            describe('START_HAS_KEYS', () => {
                const regex = START_HAS_KEYS;
                it('should not match a JSON with wrong format', () => {
                    const S = NEWLINE;
                    expect(fn(regex, `${S}x`)).toEqual(null);
                    expect(fn(regex, `${S}${COLON}`)).toEqual(null);
                    expect(fn(regex, `${S}""${COLON}`)).toEqual(null);
                    expect(fn(regex, `${S}''${COLON}`)).toEqual(null);
                });
                it('should match a JSON start with NEWLINE', () => {
                    const S = NEWLINE;
                    expect(fn(regex, `${S}x${COLON}`)).toEqual(`${S}`);
                    expect(fn(regex, `${S}  x${COLON}`)).toEqual(`${S}  `);
                    expect(fn(regex, `${S}"x"${COLON}`)).toEqual(`${S}`);
                    expect(fn(regex, `${S}"x:y"${COLON}`)).toEqual(`${S}`);
                });
                it('should match a JSON start with COMMA', () => {
                    const S = COMMA;
                    expect(fn(regex, `${S}x`)).toEqual(null);
                    expect(fn(regex, `${S}x${COLON}`)).toEqual(`${S}`);
                    expect(fn(regex, `${S}  x${COLON}`)).toEqual(`${S}  `);
                    expect(fn(regex, `${S}"x"${COLON}`)).toEqual(`${S}`);
                    expect(fn(regex, `${S}"x:y"${COLON}`)).toEqual(`${S}`);
                });
                it('should match a JSON start with BRACE_OPEN', () => {
                    const S = BRACE_OPEN;
                    expect(fn(regex, `${S}x`)).toEqual(null);
                    expect(fn(regex, `${S}x${COLON}`)).toEqual(`${S}`);
                    expect(fn(regex, `${S}  x${COLON}`)).toEqual(`${S}  `);
                    expect(fn(regex, `${S}"x"${COLON}`)).toEqual(`${S}`);
                    expect(fn(regex, `${S}"x:y"${COLON}`)).toEqual(`${S}`);
                });
                it('should not match a JSON start with wrong char', () => {
                    const S = BRACE_CLOSE;
                    expect(fn(regex, `${S}x`)).toEqual(null);
                    expect(fn(regex, `${S}x${COLON}`)).toEqual(null);
                    expect(fn(regex, `${S}  x${COLON}`)).toEqual(null);
                    expect(fn(regex, `${S}"x"${COLON}`)).toEqual(null);
                    expect(fn(regex, `${S}"x:y"${COLON}`)).toEqual(null);
                });
            });
            describe('START_KEY_DQ', () => {
                const regex = HAS_START_KEY_DQ;
                const NL = NEWLINE;
                it('should match a JSON start with a double quote key', () => {
                    const Q = DQ;
                    const KEY = `${Q}a2:4${Q}`;
                    const result = `${KEY}`;
                    expect(fn(regex, `${KEY}:`)).toEqual(null);
                    expect(fn(regex, `${NL}${KEY}:`)).toEqual(result);
                    expect(fn(regex, `${NL}${KEY}: `)).toEqual(result);
                    expect(fn(regex, `${NL}${KEY}:3`)).toEqual(result);
                    expect(fn(regex, `${NL}${KEY}:3 `)).toEqual(result);
                    expect(fn(regex, `${NL}${KEY}:3`)).toEqual(result);
                });
                it('should NOT match a JSON start with a single quote key', () => {
                    const Q = SQ;
                    const KEY = `${Q}a2:4${Q}`;
                    expect(fn(regex, `${KEY}:`)).toEqual(null);
                    expect(fn(regex, `${NL}${KEY}: `)).toEqual(null);
                    expect(fn(regex, `${NL}${KEY}:3 `)).toEqual(null);
                });
                it('should match a JSON start with a non quoted key', () => {
                    const KEY = `a2_4`;
                    expect(fn(regex, `${KEY}:`)).toEqual(null);
                    expect(fn(regex, `${NL}${KEY}: `)).toEqual(null);
                    expect(fn(regex, `${NL}${KEY}:3 `)).toEqual(null);
                });
            });
            describe('START_KEY_SQ', () => {
                const regex = HAS_START_KEY_SQ;
                const NL = NEWLINE;
                it('should match a JSON start with a single quote key', () => {
                    const Q = SQ;
                    const KEY = `${Q}a2:4${Q}`;
                    const result = `${KEY}`;
                    expect(fn(regex, `${KEY}:`)).toEqual(null);
                    expect(fn(regex, `${NL}${KEY}:`)).toEqual(result);
                    expect(fn(regex, `${NL}${KEY}: `)).toEqual(result);
                    expect(fn(regex, `${NL}${KEY}:3`)).toEqual(result);
                    expect(fn(regex, `${NL}${KEY}:3 `)).toEqual(result);
                    expect(fn(regex, `${NL}${KEY}:3`)).toEqual(result);
                });
                it('should NOT match a JSON start with a double quote key', () => {
                    const Q = DQ;
                    const KEY = `${Q}a2:4${Q}`;
                    expect(fn(regex, `${KEY}:`)).toEqual(null);
                    expect(fn(regex, `${NL}${KEY}: `)).toEqual(null);
                    expect(fn(regex, `${NL}${KEY}:3 `)).toEqual(null);
                });
                it('should match a JSON start with a non quoted key', () => {
                    const KEY = `a2_4`;
                    expect(fn(regex, `${KEY}:`)).toEqual(null);
                    expect(fn(regex, `${NL}${KEY}: `)).toEqual(null);
                    expect(fn(regex, `${NL}${KEY}:3 `)).toEqual(null);
                });
            });
            describe('START_KEY_NQ', () => {
                const regex = HAS_START_KEY_NQ;
                const NL = NEWLINE;
                it('should match a JSON start with no quote key', () => {
                    const Q = '';
                    const KEY = `${Q}a2_4${Q}`;
                    const result = `${KEY}`;
                    expect(fn(regex, `${KEY}:`)).toEqual(null);
                    expect(fn(regex, `${NL}${KEY}:`)).toEqual(result);
                    expect(fn(regex, `${NL}${KEY}: `)).toEqual(result);
                    expect(fn(regex, `${NL}${KEY}:3`)).toEqual(result);
                    expect(fn(regex, `${NL}${KEY}:3 `)).toEqual(result);
                    expect(fn(regex, `${NL}${KEY}:3`)).toEqual(result);
                });
                it('should NOT match a JSON start with a double quote key', () => {
                    const Q = DQ;
                    const KEY = `${Q}a2:4${Q}`;
                    expect(fn(regex, `${KEY}:`)).toEqual(null);
                    expect(fn(regex, `${NL}${KEY}: `)).toEqual(null);
                    expect(fn(regex, `${NL}${KEY}:3 `)).toEqual(null);
                });
                it('should NOT match a JSON start with a single quote key', () => {
                    const Q = SQ;
                    const KEY = `${Q}a2:4${Q}`;
                    expect(fn(regex, `${KEY}:`)).toEqual(null);
                    expect(fn(regex, `${NL}${KEY}: `)).toEqual(null);
                    expect(fn(regex, `${NL}${KEY}:3 `)).toEqual(null);
                });
            });
            describe('START_KEY_ALL', () => {
                const regex = HAS_START_KEY_ALL;
                const NL = NEWLINE;
                it('should match a JSON start with different quoted keys', () => {
                    const KEY = `x`;
                    expect(fn(regex, `${NL}${KEY}:3`)).toEqual(`${KEY}`);
                    expect(fn(regex, `${NL}"${KEY}":3`)).toEqual(`"${KEY}"`);
                    expect(fn(regex, `${NL}'${KEY}':3`)).toEqual(`'${KEY}'`);
                });
            });
        });
        describe('START with KEY after', () => {
            it('should match a JSON start with a double quoted key', () => {
                const regex = HAS_KEY_START;
                const Q = DQ;
                const KEY = `${Q}a2:4${Q}`;
                expect(get1stMatch(regex, `, ${KEY}:`)).toEqual(`, ${KEY}`);
                expect(get1stMatch(regex, `{ ${KEY}:`)).toEqual(`{ ${KEY}`);
                expect(get1stMatch(regex, `\n ${KEY}:`)).toEqual(`\n ${KEY}`);
                expect(get1stMatch(regex, ` ${KEY}:`)).toEqual(null);
            });
            it('should match a JSON start with a single quoted key', () => {
                const regex = HAS_KEY_START;
                const Q = SQ;
                const KEY = `${Q}a2:4${Q}`;
                expect(get1stMatch(regex, `, ${KEY}:`)).toEqual(`, ${KEY}`);
                expect(get1stMatch(regex, `{ ${KEY}:`)).toEqual(`{ ${KEY}`);
                expect(get1stMatch(regex, `\n ${KEY}:`)).toEqual(`\n ${KEY}`);
                expect(get1stMatch(regex, ` ${KEY}:`)).toEqual(null);
            });
            it('should match a JSON start with a single quoted key', () => {
                const regex = HAS_KEY_START;
                const Q = '';
                const KEY = `${Q}a24${Q}`;
                expect(get1stMatch(regex, `, ${KEY}:`)).toEqual(`, ${KEY}`);
                expect(get1stMatch(regex, `{ ${KEY}:`)).toEqual(`{ ${KEY}`);
                expect(get1stMatch(regex, `\n ${KEY}:`)).toEqual(`\n ${KEY}`);
                expect(get1stMatch(regex, ` ${KEY}:`)).toEqual(null);
            });
        });
        describe('START with KEY/VALUE after', () => {
            describe('double quoted value', () => {
                const regex = HAS_KEY_VALUE_DQ;
                const Q = DQ;
                it('should match with a double quoted key', () => {
                    const V = `${DQ}a2:4${DQ}:${Q}3${Q}`;
                    expect(get1stMatch(regex, `, ${V}`)).toEqual(`, ${V}`);
                    expect(get1stMatch(regex, `{ ${V}`)).toEqual(`{ ${V}`);
                    expect(get1stMatch(regex, `\n ${V}`)).toEqual(`\n ${V}`);
                    expect(get1stMatch(regex, ` ${V}`)).toEqual(null);
                });
                it('should match with a single quoted key', () => {
                    const V = `${SQ}a2:4${SQ}:${Q}3${Q}`;
                    expect(get1stMatch(regex, `, ${V}`)).toEqual(`, ${V}`);
                    expect(get1stMatch(regex, `{ ${V}`)).toEqual(`{ ${V}`);
                    expect(get1stMatch(regex, `\n ${V}`)).toEqual(`\n ${V}`);
                    expect(get1stMatch(regex, ` ${V}`)).toEqual(null);
                });
                it('should match none quoted key', () => {
                    const V = `${NQ}a24${NQ}:${Q}3${Q}`;
                    expect(get1stMatch(regex, `, ${V}`)).toEqual(`, ${V}`);
                    expect(get1stMatch(regex, `{ ${V}`)).toEqual(`{ ${V}`);
                    expect(get1stMatch(regex, `\n ${V}`)).toEqual(`\n ${V}`);
                    expect(get1stMatch(regex, ` ${V}`)).toEqual(null);
                });
            });
            describe('single quoted value', () => {
                const regex = HAS_KEY_VALUE_SQ;
                const Q = SQ;
                it('should match with a double quoted key', () => {
                    const V = `${DQ}a2:4${DQ}:${Q}3${Q}`;
                    expect(get1stMatch(regex, `, ${V}`)).toEqual(`, ${V}`);
                    expect(get1stMatch(regex, `{ ${V}`)).toEqual(`{ ${V}`);
                    expect(get1stMatch(regex, `\n ${V}`)).toEqual(`\n ${V}`);
                    expect(get1stMatch(regex, ` ${V}`)).toEqual(null);
                });
                it('should match with a single quoted key', () => {
                    const V = `${SQ}a2:4${SQ}:${Q}3${Q}`;
                    expect(get1stMatch(regex, `, ${V}`)).toEqual(`, ${V}`);
                    expect(get1stMatch(regex, `{ ${V}`)).toEqual(`{ ${V}`);
                    expect(get1stMatch(regex, `\n ${V}`)).toEqual(`\n ${V}`);
                    expect(get1stMatch(regex, ` ${V}`)).toEqual(null);
                });
                it('should match none quoted key', () => {
                    const V = `${NQ}a24${NQ}:${Q}3${Q}`;
                    expect(get1stMatch(regex, `, ${V}`)).toEqual(`, ${V}`);
                    expect(get1stMatch(regex, `{ ${V}`)).toEqual(`{ ${V}`);
                    expect(get1stMatch(regex, `\n ${V}`)).toEqual(`\n ${V}`);
                    expect(get1stMatch(regex, ` ${V}`)).toEqual(null);
                });
            });
            describe('none quoted value', () => {
                const regex = HAS_KEY_VALUE_NQ;
                const Q = NQ;
                it('should match with a double quoted key', () => {
                    const V = `${DQ}a2:4${DQ}:${Q}3${Q}`;
                    expect(get1stMatch(regex, `, ${V}`)).toEqual(`, ${V}`);
                    expect(get1stMatch(regex, `{ ${V}`)).toEqual(`{ ${V}`);
                    expect(get1stMatch(regex, `\n ${V}`)).toEqual(`\n ${V}`);
                    expect(get1stMatch(regex, ` ${V}`)).toEqual(null);
                });
                it('should match with a single quoted key', () => {
                    const V = `${SQ}a2:4${SQ}:${Q}3${Q}`;
                    expect(get1stMatch(regex, `, ${V}`)).toEqual(`, ${V}`);
                    expect(get1stMatch(regex, `{ ${V}`)).toEqual(`{ ${V}`);
                    expect(get1stMatch(regex, `\n ${V}`)).toEqual(`\n ${V}`);
                    expect(get1stMatch(regex, ` ${V}`)).toEqual(null);
                });
                it('should match none quoted key', () => {
                    const V = `${NQ}a24${NQ}:${Q}3${Q}`;
                    expect(get1stMatch(regex, `, ${V}`)).toEqual(`, ${V}`);
                    expect(get1stMatch(regex, `{ ${V}`)).toEqual(`{ ${V}`);
                    expect(get1stMatch(regex, `\n ${V}`)).toEqual(`\n ${V}`);
                    expect(get1stMatch(regex, ` ${V}`)).toEqual(null);
                });
            });
        });
    });
});

describe('5. ✂️ extract strings', () => {
    describe('GET_KEY_*', () => {
        it('should extract a single quoted key', () => {
            const regex = GET_KEY_SQ;
            expect(getAllMatches(regex, `'abc12'`)[1]).toEqual('abc12');
            expect(getAllMatches(regex, `'ab:c12_@-'`)[1]).toEqual('ab:c12_@-');
            expect(getAllMatches(regex, `"ab:c12_@-"`)).toEqual([]);
            expect(getAllMatches(regex, `'ab cd'`)[1]).toEqual('ab cd');
        });
        it('should extract a double quoted key', () => {
            const regex = GET_KEY_DQ;
            expect(getAllMatches(regex, `"abc12"`)[1]).toEqual('abc12');
            expect(getAllMatches(regex, `"ab:c12_@-"`)[1]).toEqual('ab:c12_@-');
            expect(getAllMatches(regex, `'ab:c12_@-'`)).toEqual([]);
            expect(getAllMatches(regex, `"ab cd"`)[1]).toEqual('ab cd');
        });
        it('should extract a non quoted key', () => {
            const regex = GET_KEY_NQ;
            expect(getAllMatches(regex, `abc123: foo`)[1]).toEqual('abc123');
            expect(getAllMatches(regex, 'ab:c')[1]).toEqual('ab');
            expect(getAllMatches(regex, `"ab:c12_@-"`)[1]).toEqual('ab');
            expect(getAllMatches(regex, `'ab:c12_@-'`)[1]).toEqual('ab');
            expect(getAllMatches(regex, `ab cd`)[1]).toEqual('ab');
        });
    });
    describe('GET_VALUE_*', () => {
        // matches[1] is extracted value, important to test on it
        it('should extract a single quoted VALUE', () => {
            const regex = GET_VALUE_SQ;
            expect(getAllMatches(regex, `'abc12'`)[1]).toEqual('abc12');
            expect(getAllMatches(regex, `'ab:c12_@-'`)[1]).toEqual('ab:c12_@-');
            expect(getAllMatches(regex, `"ab:c12_@-"`)).toEqual([]);
            expect(getAllMatches(regex, `'ab cd'`)[1]).toEqual('ab cd');
            expect(getAllMatches(regex, `''`)[1]).toEqual('');
        });
        it('should extract a double quoted VALUE', () => {
            const regex = GET_VALUE_DQ;
            expect(getAllMatches(regex, `"abc12"`)[1]).toEqual('abc12');
            expect(getAllMatches(regex, `"abc12"`)[1]).toEqual('abc12');
            expect(getAllMatches(regex, `"ab:c12_@-"`)[1]).toEqual('ab:c12_@-');
            expect(getAllMatches(regex, `'ab:c12_@-'`)).toEqual([]);
            expect(getAllMatches(regex, `"ab cd"`)[1]).toEqual('ab cd');
            expect(getAllMatches(regex, `""`)).toEqual([`""`, '']);
        });
        it('should extract a non quoted VALUE', () => {
            const regex = GET_VALUE_NQ;

            expect(getAllMatches(regex, `true`)).toEqual([]);
            expect(getAllMatches(regex, `true:`)).toEqual([]);
            expect(getAllMatches(regex, `:true`)).toEqual(['true']);
            expect(getAllMatches(regex, `:true,`)).toEqual(['true']);
            expect(getAllMatches(regex, `:ab`)).toEqual(['ab']);
            expect(getAllMatches(regex, `:'ab'`)).toEqual([]);
            expect(getAllMatches(regex, `:ab,`)).toEqual(['ab']);
            expect(getAllMatches(regex, `:4`)).toEqual(['4']);
            expect(getAllMatches(regex, `:4ab`)).toEqual([]);
            expect(getAllMatches(regex, `:-123,12`)).toEqual([]);
            expect(getAllMatches(regex, `:-123:12`)).toEqual(['12']); // TODO: false positive
            expect(getAllMatches(regex, `:123`)).toEqual(['123']);
            expect(getAllMatches(regex, `:123.12`)).toEqual(['123.12']);
            expect(getAllMatches(regex, `:-123.12`)).toEqual(['-123.12']);
            expect(getAllMatches(regex, `:-123`)).toEqual(['-123']);
            expect(getAllMatches(regex, `:-123.`)).toEqual([]);
            expect(getAllMatches(regex, `:-123.12`)).toEqual(['-123.12']);
        });
    });
});
describe('6. 💫 replace', () => {
    describe('REPLACE_KEY_*', () => {
        it('should extract a single quoted key from valid property', () => {
            const regex = REPLACE_KEY_SQ_START;
            const K = 'a:3';
            expect(getAllMatches(regex, `{ '${K}':`)).toEqual([`'${K}'`, K]);
            expect(getAllMatches(regex, `{ '${K}'`)).toEqual([]);
            expect(getAllMatches(regex, `{ "${K}":`)).toEqual([]);
        });
        it('should extract a double quoted key from valid property', () => {
            const regex = REPLACE_KEY_DQ_START;
            const K = 'a:3';
            expect(getAllMatches(regex, `{ "${K}":`)).toEqual([`"${K}"`, K]);
            expect(getAllMatches(regex, `{ "${K}"`)).toEqual([]);
            expect(getAllMatches(regex, `{ '${K}':`)).toEqual([]);
        });
        it('should extract a none quoted key from valid property', () => {
            const regex = REPLACE_KEY_NQ_START;
            const K = 'a3';
            expect(getAllMatches(regex, `{ ${K}:`)).toEqual([K, K]);
            expect(getAllMatches(regex, `{ ${K}`)).toEqual([]);
            expect(getAllMatches(regex, `{ '${K}':`)).toEqual([]);
            expect(getAllMatches(regex, `{ "${K}":`)).toEqual([]);
        });
    });
    describe('REPLACE_VALUE_', () => {
        it('should extract a single quoted value after double quoted key', () => {
            const V = `A:B\\\'C,`;
            const K = 'ABC';
            const regex = GET_VALUE_SQ_AFTER_KEY_DQ_START;
            const result = [`'${V}'`, V];
            expect(getAllMatches(regex, `{ "${K}":'${V}'`)).toEqual(result);
            expect(getAllMatches(regex, `{ "${K}":'${V}',`)).toEqual(result); // with comma
        });
        it('should extract a single quoted value after single quoted key', () => {
            const V = `A:B\\\'C,`;
            const K = 'ABC';
            const regex = GET_VALUE_SQ_AFTER_KEY_SQ_START;
            const result = [`'${V}'`, V];
            expect(getAllMatches(regex, `{ '${K}':'${V}'`)).toEqual(result);
            expect(getAllMatches(regex, `{ '${K}':'${V}',`)).toEqual(result); // with comma
        });
        it('should extract a single quoted value after none quoted key', () => {
            const V = `A:B\\\'C,`;
            const K = 'ABC';
            const regex = GET_VALUE_SQ_AFTER_KEY_NQ_START;
            const result = [`'${V}'`, V];
            expect(getAllMatches(regex, `{ ${K}:'${V}'`)).toEqual(result);
            expect(getAllMatches(regex, `{ ${K}:'${V}',`)).toEqual(result); // with comma
        });
    });
    describe('GET_ITEM_', () => {
        it('should extract a single quoted key/value', () => {
            const V = `D:E\\\'F//,`;
            const K = 'ABC';
            const TERM = `'${K}':'${V}'`;
            const regex = GET_ITEM_SQ;
            const result = [`{ ${TERM}`, `{ ${TERM}`];
            expect(getAllMatches(regex, `{ ${TERM}`)).toEqual(result);
            expect(getAllMatches(regex, `{ ${TERM} //`)).toEqual(result);
            expect(getAllMatches(regex, `{ ${TERM},`)).toEqual(result);
            expect(getAllMatches(regex, `{ ${TERM}, //`)).toEqual(result);
        });
        it('should extract a double quoted key/value', () => {
            const V = `D:E\\\'F//,`;
            const K = 'ABC';
            const TERM = `"${K}":"${V}"`;
            const regex = GET_ITEM_DQ;
            const result = [`{ ${TERM}`, `{ ${TERM}`];
            expect(getAllMatches(regex, `{ ${TERM}`)).toEqual(result);
            expect(getAllMatches(regex, `{ ${TERM} //`)).toEqual(result);
            expect(getAllMatches(regex, `{ ${TERM},`)).toEqual(result);
            expect(getAllMatches(regex, `{ ${TERM}, //`)).toEqual(result);
        });
        it('should extract a none quoted key/value', () => {
            const V = `DF`;
            const K = 'ABC';
            const TERM = `${K}:${V}`;
            const regex = GET_ITEM_NQ;
            const result = [`{ ${TERM}`, `{ ${TERM}`];
            expect(getAllMatches(regex, `{ ${TERM}`)).toEqual(result);
            expect(getAllMatches(regex, `{ ${TERM} //`)).toEqual(result);
            expect(getAllMatches(regex, `{ ${TERM},`)).toEqual(result);
            expect(getAllMatches(regex, `{ ${TERM}, //`)).toEqual(result);
        });
        it('should extract a none quoted key/value', () => {
            const V = `DEF`;
            const K = 'ABC';
            const TERM = `${K}:'${V}'`;
            const regex = GET_ITEM_NQ_SQ;
            const result = [`{ ${TERM}`, `{ ${TERM}`];
            expect(getAllMatches(regex, `{ ${TERM}`)).toEqual(result);
            expect(getAllMatches(regex, `{ ${TERM} //`)).toEqual(result);
            expect(getAllMatches(regex, `{ ${TERM},`)).toEqual(result);
            expect(getAllMatches(regex, `{ ${TERM}, //`)).toEqual(result);
        });
        it('should extract a none quoted key/value', () => {
            const V = `DEF`;
            const K = 'ABC';
            const TERM = `${K}:"${V}"`;
            const regex = GET_ITEM_NQ_DQ;
            const result = [`{ ${TERM}`, `{ ${TERM}`];
            expect(getAllMatches(regex, `{ ${TERM}`)).toEqual(result);
            expect(getAllMatches(regex, `{ ${TERM} //`)).toEqual(result);
            expect(getAllMatches(regex, `{ ${TERM},`)).toEqual(result);
            expect(getAllMatches(regex, `{ ${TERM}, //`)).toEqual(result);
        });
        it('should extract a none quoted key/value', () => {
            const V = `DEF`;
            const K = 'ABC';
            const TERM = `${K}:${V}`;
            const regex = GET_ITEM_NQ_NQ;
            const result = [`{ ${TERM}`, `{ ${TERM}`];
            expect(getAllMatches(regex, `{ ${TERM}`)).toEqual(result);
            expect(getAllMatches(regex, `{ ${TERM} //`)).toEqual(result);
            expect(getAllMatches(regex, `{ ${TERM},`)).toEqual(result);
            expect(getAllMatches(regex, `{ ${TERM}, //`)).toEqual(result);
        });
    });
});
