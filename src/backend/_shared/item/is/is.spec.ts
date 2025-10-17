import { CASE, EQUAL, PLACEHOLDER, SPACES, TYPE, VALUE } from '../item.config';
import {
    isBothComplexValue,
    isBothSimpleValue,
    isBothString,
    isCheckPlaceholder,
    isComplexValue,
    isCongruent,
    isCongruentValue,
    isMatchingWord,
    isOneString,
    isPlaceholder,
    isSimpleValue,
} from './is';

describe('✅ isSimpleValue()', () => {
    const FN = isSimpleValue;
    it('should return true for simple values', () => {
        expect(FN('string')).toEqual(true);
        expect(FN(123)).toEqual(true);
        expect(FN(true)).toEqual(true);
        expect(FN(null)).toEqual(true);
    });
    it('should return false for complex values', () => {
        expect(FN(undefined)).toEqual(true);
        expect(FN({})).toEqual(false);
        expect(FN([])).toEqual(false);
        expect(FN(() => {})).toEqual(false);
        expect(FN(new Date())).toEqual(false);
    });
});
describe('✅ isComplexValue()', () => {
    const FN = isComplexValue;
    it('should return true for complex values', () => {
        expect(FN({})).toEqual(true);
        expect(FN([])).toEqual(true);
        expect(FN(new Date())).toEqual(true);
    });
    it('should return false for simple values', () => {
        expect(FN(() => {})).toEqual(false); // function is not object
        expect(FN('string')).toEqual(false);
        expect(FN(123)).toEqual(false);
        expect(FN(true)).toEqual(false);
        expect(FN(null)).toEqual(false);
        expect(FN(undefined)).toEqual(false);
    });
});
describe('✅ isCheckPlaceholder()', () => {
    const FN = isCheckPlaceholder;
    describe('valid placeholders', () => {
        it('should return true for matching string placeholders', () => {
            const TYPE = 'string';
            const TERM = `{${TYPE}}`;
            expect(FN(TERM, 'foo123bar', TYPE)).toEqual(true);
            expect(FN(TERM, 'foo123bar.', TYPE)).toEqual(true);
            expect(FN(TERM, 'foo123bar,', TYPE)).toEqual(true);
            expect(FN(`foo${TERM},bar.`, 'foo1,bar.', TYPE)).toEqual(true);
        });
        it('should return true for matching number placeholders', () => {
            const TYPE = 'number';
            const TERM = `{${TYPE}}`;
            expect(FN(TERM, '123', TYPE)).toEqual(true);
            expect(FN(`f${TERM}b`, 'f123b', TYPE)).toEqual(true);
            expect(FN(`f${TERM},b.`, 'f123,b.', TYPE)).toEqual(true);
            expect(FN(`f${TERM},`, 'f12,', TYPE)).toEqual(true);
            expect(FN(`f${TERM}.`, 'f12.', TYPE)).toEqual(true);
        });
        it('should return true for matching boolean placeholders', () => {
            const TYPE = 'boolean';
            const TERM = `{${TYPE}}`;
            expect(FN(TERM, 'true', TYPE)).toEqual(true);
            expect(FN(TERM, 'false', TYPE)).toEqual(true);
            expect(FN(`f${TERM}b`, 'ftrueb', TYPE)).toEqual(true);
            expect(FN(`f${TERM}b`, 'ffalseb', TYPE)).toEqual(true);
        });
    });
    describe('invalid placeholders', () => {
        it('should return false for non-matching string placeholders', () => {
            const TYPE = 'string';
            const TERM = `{${TYPE}}`;
            expect(FN(TERM, '', TYPE)).toEqual(false);
            expect(FN(TERM, ' ', TYPE)).toEqual(false);
            expect(FN(`f${TERM},`, 'fo1,b', TYPE)).toEqual(false);
            expect(FN(`b${TERM},`, 'fo1,b', TYPE)).toEqual(false);
        });
        it('should return false for non-matching number placeholders', () => {
            const TYPE = 'string';
            const TERM = `{${TYPE}}`;
            expect(FN(TERM, '', TYPE)).toEqual(false);
            expect(FN(`fo${TERM},b.`, 'f123,b.', TYPE)).toEqual(false);
            expect(FN(TERM, ' ', TYPE)).toEqual(false);
            expect(FN(`f${TERM},`, 'fo1,b', TYPE)).toEqual(false);
            expect(FN(`b${TERM},`, 'fo1,b', TYPE)).toEqual(false);
        });
        it('should return false for non-matching boolean placeholders', () => {
            const TYPE = 'boolean';
            const TERM = `{${TYPE}}`;
            expect(FN(TERM, '', TYPE)).toEqual(false);
            expect(FN(TERM, ' ', TYPE)).toEqual(false);
            expect(FN(`f${TERM},`, 'fo1,b', TYPE)).toEqual(false);
            expect(FN(`b${TERM},`, 'fo1,b', TYPE)).toEqual(false);
        });
        it('should return false for non-matching placeholders', () => {
            const TYPE = 'bla';
            const TERM = `{${TYPE}}`;
            expect(FN(TERM, 'foo123bar', TYPE)).toEqual(false);
        });
    });
});
describe('✅ isMatchingWord()', () => {
    const FN = isMatchingWord;
    it('should return true for matching words', () => {
        expect(FN('foobar', 'foobar')).toEqual(true);
        expect(FN('foobar,bar.', 'foobar,bar.')).toEqual(true);
    });
    it('should return true for matching words with placeholder', () => {
        expect(FN('{string}', 'foo123bar')).toEqual(true);
        expect(FN('{string}', 'foo123bar.')).toEqual(true);
        expect(FN('{string}', 'foo123bar,')).toEqual(true);
        expect(FN('{number}', '123')).toEqual(true);
        expect(FN('{boolean}', 'true')).toEqual(true);
        expect(FN('foo{string}bar', 'foo123bar')).toEqual(true);
        expect(FN('foo{number}bar', 'foo123bar')).toEqual(true);
        expect(FN('foo{boolean}bar', 'footruebar')).toEqual(true);
        expect(FN('foo{string},bar.', 'foo123,bar.')).toEqual(true);
        expect(FN('foo{number},bar.', 'foo123,bar.')).toEqual(true);
        expect(FN('fo{boolean},bar.', 'fotrue,bar.')).toEqual(true);
    });
    it('should return false for non-matching words', () => {
        expect(FN('foobar', 'foobaz')).toEqual(false);
        expect(FN('foo{bla}bar', 'foobaz')).toEqual(false);
    });
});
describe('✅ isBothString', () => {
    it('should return true if both are string', () => {
        expect(isBothString('foo', 'bar')).toEqual(true);
    });
    it('should return false if both are string', () => {
        expect(isBothString('foo', 22)).toEqual(false);
        expect(isBothString(22, 'foo')).toEqual(false);
    });
});
describe('✅ isBothSimpleValue', () => {
    const FN = isBothSimpleValue;
    it('should return true if both are simple values', () => {
        expect(FN('foo', 'bar')).toEqual(true);
        expect(FN(22, 33)).toEqual(true);
        expect(FN(true, false)).toEqual(true);
        expect(FN(null, null)).toEqual(true);
        expect(FN(undefined, undefined)).toEqual(true);
        expect(FN('foo', null)).toEqual(true);
        expect(FN(22, undefined)).toEqual(true);
    });
    it('should return false if one is complex value', () => {
        expect(FN('foo', {})).toEqual(false);
        expect(FN([], 33)).toEqual(false);
        expect(FN(true, new Date())).toEqual(false);
        expect(FN(() => {}, null)).toEqual(false);
    });
});
describe('✅ isBothComplexValue', () => {
    const FN = isBothComplexValue;
    it('should return true if both are complex values', () => {
        expect(FN({}, { a: 1 })).toEqual(true);
        expect(FN([], [1, 2, 3])).toEqual(true);
        expect(FN(new Date(), new Date())).toEqual(true);
        expect(FN({ a: 1 }, { b: 2 })).toEqual(true);
        expect(FN([1, 2], [3, 4])).toEqual(true);
        expect(FN(new Date('2023-01-01'), new Date('2024-01-01'))).toEqual(
            true
        );
    });
    it('should return false if one is complex value', () => {
        expect(FN('foo', {})).toEqual(false);
        expect(FN([], 33)).toEqual(false);
        expect(FN(true, new Date())).toEqual(false);
        expect(FN(() => {}, null)).toEqual(false);
    });
    it('should return false if both are simple values', () => {
        expect(FN('foo', 'bar')).toEqual(false);
        expect(FN(22, 33)).toEqual(false);
        expect(FN(true, false)).toEqual(false);
        expect(FN(null, null)).toEqual(false);
        expect(FN(undefined, undefined)).toEqual(false);
        expect(FN('foo', null)).toEqual(false);
        expect(FN(22, undefined)).toEqual(false);
    });
});
describe('✅ isOneString', () => {
    const FN = isOneString;
    it('should return true if one is string', () => {
        expect(FN('foo', 22)).toEqual(true);
        expect(FN(22, 'foo')).toEqual(true);
    });
    it('should return false if none is string', () => {
        expect(FN(22, 33)).toEqual(false);
    });
    it('should return false if both are string', () => {
        expect(FN('foo', 'bar')).toEqual(false);
    });
});
describe('✅ isCongruentValue', () => {
    const FN = isCongruentValue;
    it('should return true for congruent values', () => {
        expect(FN('2', 2)).toEqual(true);
        expect(FN('True', true)).toEqual(true);
        expect(FN(' false ', false)).toEqual(true);
        expect(FN(' null ', null)).toEqual(true);
        expect(FN(' undefined ', undefined)).toEqual(true);
    });
    it('should return false for non-congruent values', () => {
        expect(FN('2', 3)).toEqual(false);
        expect(FN('true', false)).toEqual(false);
        expect(FN('false', true)).toEqual(false);
        expect(FN('null', undefined)).toEqual(false);
        expect(FN('null', '')).toEqual(false);
    });
});
describe('✅ isCongruent', () => {
    const FN = isCongruent;
    it('should return true for congruent strings (left)', () => {
        expect(FN('Test', 'Test')).toEqual(EQUAL);
        expect(FN('Test', 'test')).toEqual(CASE);
        expect(FN('TEST', 'test')).toEqual(CASE);
        expect(FN('TeSt', 'tEsT')).toEqual(CASE);
        expect(FN('Tt', ' tT ')).toEqual(VALUE);
        expect(FN('Tt', ' Tt ')).toEqual(SPACES);
        expect(FN('true', true)).toEqual(TYPE);
        expect(FN('false', false)).toEqual(TYPE);
        expect(FN('123', 123)).toEqual(TYPE);
        expect(FN('{number}', 123)).toEqual(PLACEHOLDER);
        expect(FN('null', null)).toEqual(TYPE);
    });
    it('should return true for congruent strings (right)', () => {
        expect(FN('test', 'Test')).toEqual(CASE);
        expect(FN('test', 'TEST')).toEqual(CASE);
        expect(FN('tEsT', 'TeSt')).toEqual(CASE);
        expect(FN(' tT ', 'Tt')).toEqual(VALUE);
        expect(FN(true, 'true')).toEqual(TYPE);
        expect(FN(false, 'false')).toEqual(TYPE);
        expect(FN(123, '123')).toEqual(TYPE);
        expect(FN(123, '{number}')).toEqual(PLACEHOLDER);
        expect(FN(null, 'null')).toEqual(TYPE);
    });
    it('should return false for non-congruent strings', () => {
        expect(FN('Test', 'Test1')).toEqual(null);
        expect(FN('Test', 'Best')).toEqual(null);
        expect(FN('true', false)).toEqual(null);
        expect(FN('false', true)).toEqual(null);
        expect(FN('123', 124)).toEqual(null);
        expect(FN('null', undefined)).toEqual(null);
        expect(FN('null', '')).toEqual(null);
    });
});
describe('✅isPlaceholder()', () => {
    const FN = isPlaceholder;
    it('should return true for valid placeholders', () => {
        expect(FN('{string}')).toEqual('string');
        expect(FN('{number}')).toEqual('number');
        expect(FN('{boolean}')).toEqual('boolean');
    });
    it('should return false for invalid placeholders', () => {
        expect(FN('string')).toEqual(null);
        expect(FN('{bla}')).toEqual(null);
        expect(FN('{}')).toEqual(null);
        expect(FN('{ }')).toEqual(null);
        expect(FN('{string')).toEqual(null);
        expect(FN('string}')).toEqual(null);

        /* @ts-expect-error: testing non-string inputs */
        expect(FN(123)).toEqual(null);
        /* @ts-expect-error: testing non-string inputs */
        expect(FN(true)).toEqual(null);
        /* @ts-expect-error: testing non-string inputs */
        expect(FN(null)).toEqual(null);
        /* @ts-expect-error: testing non-string inputs */
        expect(FN(undefined)).toEqual(null);
        /* @ts-expect-error: testing non-string inputs */
        expect(FN({})).toEqual(null);
        /* @ts-expect-error: testing non-string inputs */
        expect(FN([])).toEqual(null);
    });
});
