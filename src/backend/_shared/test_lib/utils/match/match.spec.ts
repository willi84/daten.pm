import {
    testRegex,
    // getRegexMatches,
    exactMatch,
    matchAll,
    hasMatch,
    get1stMatch,
    getAllMatches,
} from './match';

describe('✅ testRegex()', () => {
    const fn = testRegex;
    it('should return true for a matching character', () => {
        const regexStr = '[a-z]';
        const input = 'abc';
        const result = fn(regexStr, input);
        expect(result).toBe(true);
    });
    it('should return false for a non-matching character', () => {
        const regexStr = '[a-z]';
        const input = '123';
        const result = fn(regexStr, input);
        expect(result).toBe(false);
    });
    it('should return true for a matching character with special characters', () => {
        const regexStr = '[a-zA-Z0-9_:-]';
        const input = 'test_123';
        const result = fn(regexStr, input);
        expect(result).toBe(true);
    });
});
describe('✅ exactMatch()', () => {
    const fn = exactMatch;
    describe('single character', () => {
        it('should return true for exact match', () => {
            const regexStr = '[a-z]';
            const input = 'a';
            const result = fn(regexStr, input);
            expect(result).toBe(true);
        });
        it('should return false for non-exact match', () => {
            const regexStr = '[a-z]';
            const input = 'abc';
            const result = fn(regexStr, input);
            expect(result).toBe(false);
        });
    });
    describe('multiple characters', () => {
        it('should return true for exact match', () => {
            const regexStr = '[a-z]+';
            const input = 'abc';
            const result = fn(regexStr, input);
            expect(result).toBe(true);
        });
        it('should return true for exact match', () => {
            const regexStr = '^[a-z]+$';
            const input = 'abc';
            const result = fn(regexStr, input);
            expect(result).toBe(true);
        });
        it('should return false for non-exact match', () => {
            const regexStr = '[a-z]+';
            const input = 'abc123';
            const result = fn(regexStr, input);
            expect(result).toBe(false);
        });
    });
});
describe('✅ matchAll()', () => {
    const fn = matchAll;
    describe('valid', () => {
        it('should return true for single character', () => {
            const regexStr = '[a-z]';
            const input = 'a';
            const result = fn(regexStr, input);
            expect(result).toBe(true);
        });
        it('should return false for multiple characters', () => {
            const regexStr = '[a-z]';
            const input = 'abc';
            const result = fn(regexStr, input);
            expect(result).toBe(true);
        });
    });
    describe('invalid', () => {
        it('should return false if not all matching', () => {
            const regexStr = '[a-z]';
            const input = 'abc123';
            const result = fn(regexStr, input);
            expect(result).toBe(false);
        });
    });
});
describe('✅ hasMatch()', () => {
    const fn = hasMatch;
    it('should return true for a matching character', () => {
        const regexStr = '[a-z]';
        const input = 'abc123';
        const result = fn(regexStr, input);
        expect(result).toEqual(true);
    });
    it('should return false for no matches', () => {
        const regexStr = '[a-z]';
        const input = '123';
        const result = fn(regexStr, input);
        expect(result).toEqual(false);
    });
    it('should return true for special characters', () => {
        const regexStr = '[a-zA-Z0-9_:-]';
        const input = 'test_123:example';
        const result = fn(regexStr, input);
        expect(result).toEqual(true);
    });
});
describe('✅ get1stMatch()', () => {
    const fn = get1stMatch;
    it('should return null if nothing matching', () => {
        const regexStr = ',[a-z][0-9]';
        const input = 'abc123';
        const result = fn(regexStr, input);
        expect(result).toEqual(null);
    });
    it('should return the first match for a regex', () => {
        const regexStr = ',[a-z]+[0-9]+';
        const input = ',abc123';
        const result = fn(regexStr, input);
        expect(result).toEqual(',abc123');
    });
    it('should return the first match for a regex', () => {
        const regexStr = ',[a-z]+[0-9]+';
        const input = ',a1,b3';
        const result = fn(regexStr, input);
        expect(result).toEqual(',a1');
    });
});
describe('✅ getAllMatch()', () => {
    const fn = getAllMatches;
    it('should return all matches for a regex', () => {
        const regexStr = ',[a-z][0-9]';
        const input = 'abc123';
        const result = fn(regexStr, input);
        expect(result).toEqual([]);
    });
    it('should return all matches for a regex', () => {
        const regexStr = ',[a-z]+[0-9]+';
        const input = ',abc123';
        const result = fn(regexStr, input);
        expect(result).toEqual([',abc123']);
    });
    it('should return all matches for a regex', () => {
        const regexStr = ',[a-z]+[0-9]+';
        const input = ',a1,b3';
        const result = fn(regexStr, input);
        expect(result).toEqual([',a1']);
    });
    it('should return all matches for a regex', () => {
        const regexStr = '(,[a-z]+[0-9]+)+';
        const input = ',a1,b3';
        const result = fn(regexStr, input);
        expect(result).toEqual([',a1,b3', ',b3']);
    });
});
