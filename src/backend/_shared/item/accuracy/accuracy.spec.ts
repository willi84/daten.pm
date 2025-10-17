import {
    evaluateItemAccuracy,
    evaluateSimpleItem,
    evaluateStringAccuracy,
    evaluateWordAccuracy,
    getAnalyzeItems,
    getCharAccuracy,
    getTotalAccuracy,
    getWordAccuracy,
} from './accuracy';

describe('✅ getTotalAccuracy()', () => {
    const FN = getTotalAccuracy;
    it('should return the average accuracy', () => {
        expect(FN([100, 100, 100])).toEqual(100); // all 100%
        expect(FN([100, 50, 0])).toEqual(50); // average 50%
        expect(FN([80, 90, 100])).toEqual(90); // average 90%
        expect(FN([0, 0, 0])).toEqual(0); // average 0
        expect(FN([])).toEqual(0); // average 0
    });
});
describe('✅ getCharAccuracy()', () => {
    const FN = getCharAccuracy;
    it('should return the number of matching characters', () => {
        expect(FN('Tests', 'Tests')).toEqual(100);
        expect(FN('Tests2', 'Tests')).toEqual(83.3);
        expect(FN('Tests', 'tests')).toEqual(90);
        expect(FN('Test', 'Tast')).toEqual(75);
        expect(FN('Test', 'Different')).toEqual(0);

        expect(FN('Test', 'Best')).toEqual(75);
        expect(FN('TEsts', 'Tests')).toEqual(90); // different case
        expect(FN('Test', 'Te')).toEqual(50);
        expect(FN('Te', 'Test')).toEqual(50); // different order
        expect(FN('Short', 'A very long string')).toEqual(0);
        expect(FN('some test', 'some test')).toEqual(100);
        expect(FN('some test', 'some  test')).toEqual(50);
        expect(FN('some  test', 'some test')).toEqual(50);
    });
});

describe('✅ getWordAccuracy()', () => {
    const FN = getWordAccuracy;
    it('should return 100% for identical words', () => {
        expect(FN('Test', 'Test')).toEqual(100);
        expect(FN('test', 'test')).toEqual(100);
        expect(FN('TEST', 'TEST')).toEqual(100);
    });
    it('should return value for case-insensitive match', () => {
        expect(FN('Test', 'test')).toEqual(87.5);
        expect(FN('TEST', 'test')).toEqual(50);
        expect(FN('TeSt', 'tEsT')).toEqual(50);
    });
    it('should return value for placeholders', () => {
        expect(FN('He has 99 balls.', '{number}')).toEqual(100);
        expect(FN('This is a ball', '{string}')).toEqual(100);
        expect(FN('This is a ball', '{boolean}')).toEqual(0);
    });
});
describe('✅ evaluateWordAccuracy()', () => {
    const FN = evaluateWordAccuracy;
    const base = { index: 0, found: false, accuracy: 0 };
    const baseFound = { index: 0, found: true, accuracy: 100 };
    it('should update items with full accuracy', () => {
        const input = { word: 'Test', lowerWord: 'test', ...base };
        const expected = { word: 'Test', lowerWord: 'test', ...base };
        FN(input, expected);
        expect(input.found).toEqual(true);
        expect(input.accuracy).toEqual(100);
        expect(expected.found).toEqual(true);
        expect(expected.accuracy).toEqual(100);
    });
    it('should update items with half accuracy (case insensitive)', () => {
        const input = { word: 'test', lowerWord: 'test', ...base };
        const expected = { word: 'Test', lowerWord: 'test', ...base };
        FN(input, expected);
        expect(input.found).toEqual(true);
        expect(input.accuracy).toEqual(87.5);
        expect(expected.found).toEqual(true);
        expect(expected.accuracy).toEqual(87.5);
    });
    it('should update items with placeholder accuracy', () => {
        const input = { word: '10', lowerWord: '10', ...base };
        const expected = { word: '{number}', lowerWord: '{number}', ...base };
        FN(input, expected);
        expect(input.found).toEqual(true);
        expect(input.accuracy).toEqual(100);
        expect(expected.found).toEqual(true);
        expect(expected.accuracy).toEqual(100);
    });
    it('should not update items if they do not match', () => {
        const input = { word: 'Different', lowerWord: 'different', ...base };
        const expected = { word: 'Test', lowerWord: 'test', ...base };
        FN(input, expected);
        expect(input.found).toEqual(false);
        expect(input.accuracy).toEqual(0);
        expect(expected.found).toEqual(false);
        expect(expected.accuracy).toEqual(0);
    });
    it('should not update items if one is already found', () => {
        const input = { word: 'Test', lowerWord: 'test', ...baseFound };
        const expected = { word: 'Test', lowerWord: 'test', ...base };
        FN(input, expected);
        expect(input.found).toEqual(true);
        expect(input.accuracy).toEqual(100);
        expect(expected.found).toEqual(false);
        expect(expected.accuracy).toEqual(0);
    });
});
describe('✅ evaluateStringAccuracy()', () => {
    const FN = evaluateStringAccuracy;
    it('should return the percentage of accuracy', () => {
        expect(FN('Test', 'Test')).toEqual(100); // simple
        expect(FN('I have 10 Items left', 'I have 10 balls left')).toEqual(80);
        expect(FN('I have 10 Item', 'I have 10 Items')).toEqual(95);
        expect(FN('He has 100 balls.', 'He has {number} balls.')).toEqual(100); // placeholder
        expect(FN('I have 10 Items left', 'I have 10 items left')).toEqual(98); // lowercase
        expect(FN('test string', 'test string')).toEqual(100); // unequal
        expect(FN('test   string', 'test string')).toEqual(38.5); // unequal
        expect(FN('test foo string', 'test my string {string}')).toEqual(50); // unequal
        // expect(FN('test foo bar string', 'test {string} string')).toEqual(100); // unequal

        // duplicated same word
        expect(FN('the new the old', 'the new the old')).toEqual(100);
        expect(FN('the new old', 'the new the old')).toEqual(75); //different pos "the"
        expect(FN('new the old', 'the new the old')).toEqual(75); //different pos "the"
        expect(FN('new the old of now', 'the new the old')).toEqual(60); //different pos "the"
    });
});
describe('✅ evaluateSimpleItem()', () => {
    const FN = evaluateSimpleItem;
    it('should return 100% for identical item', () => {
        expect(FN('Test', 'Test')).toEqual(100);
        expect(FN('test', 'test')).toEqual(100);
        expect(FN('TEST', 'TEST')).toEqual(100);
        expect(FN('TEST', '{string}')).toEqual(100);
        expect(FN(123, 123)).toEqual(100);
        expect(FN(true, true)).toEqual(100);
        expect(FN(false, false)).toEqual(100);
        expect(FN(null, null)).toEqual(100);
        expect(FN(undefined, undefined)).toEqual(100);
    });
    it('should return value for case-insensitive match', () => {
        expect(FN('Test', 'test')).toEqual(87.5);
        expect(FN('TEST', 'test')).toEqual(50);
        expect(FN('TeSt', 'tEsT')).toEqual(50);
    });
    it('should return value for congruent match', () => {
        expect(FN('true', true)).toEqual(50);
        expect(FN('false', false)).toEqual(50);
        expect(FN('null', null)).toEqual(50);
        expect(FN('undefined', undefined)).toEqual(50);
        expect(FN('123', 123)).toEqual(50);
    });
    it('should return 0% for different item', () => {
        expect(FN('Test', 'Different')).toEqual(0);
        expect(FN(123, 456)).toEqual(0);
        expect(FN(true, false)).toEqual(0);
        expect(FN(null, undefined)).toEqual(0);
        expect(FN('Test', '123')).toEqual(0);
        expect(FN('123', 12)).toEqual(0);
        expect(FN('TEST', '{number}')).toEqual(0);
    });
});
describe('evaluateItemAccuracy()', () => {
    const FN = evaluateItemAccuracy;
    describe('full similarity', () => {
        it('should return 100% for full similiar simple values', () => {
            expect(FN(2, 2)).toEqual(100);
            expect(FN(true, true)).toEqual(100);
            expect(FN('true', 'true')).toEqual(100);
            expect(FN(null, null)).toEqual(100);
            expect(FN(undefined, undefined)).toEqual(100);
            expect(FN('a Test', 'a Test')).toEqual(100); // full string
        });
        it('should return 100% for full similiar object values', () => {
            const input = { id: 1, name: 'Test', age: 30, car: 'Toyota' };
            const expected = { id: 1, name: 'Test', age: 30, car: 'Toyota' };
            expect(FN(input, expected)).toEqual(100);
        });
        it('should return 100% for full similiar complex object values', () => {
            const input = { id: 1, detail: { name: 'Test', age: 3 } };
            const expected = { id: 1, detail: { name: 'Test', age: 3 } };
            expect(FN(input, expected)).toEqual(100);
        });
    });
    describe('congruent values', () => {
        const base = { id: 1, car: 'Toyota' };
        it('should return 50% percentage for congruent values', () => {
            expect(FN('true', true)).toEqual(50);
            expect(FN(true, 'true')).toEqual(50);
            expect(FN([1, 2], [1, 2, 3, 4])).toEqual(50);
            expect(FN(undefined, 'undefined')).toEqual(50);
        });
        it('should return non 100% for congruent object', () => {
            const input = { ...base, age: 30 };
            const expected = { ...base, age: '30' };
            expect(FN(input, expected)).toEqual(83.3); // 3 out of 4 properties match
        });
        it('should return non 100% for congruent complex object', () => {
            const input = { ...base, name: 'Lars' };
            const expected = { ...base, name: 'lars' };
            expect(FN(input, expected)).toEqual(95.8); // 3 out of 4 properties match
        });
        it('should return non 100% for congruent complex object', () => {
            const input = { ...base, name: 'lars', age: '23' };
            const expected = { ...base, name: 'lars', age: 23 };
            expect(FN(input, expected)).toEqual(87.5); // 3 out of 4 properties match
        });
    });
    describe('similarity values > 50%', () => {
        it('should return percentage of 3 of 4 similarity', () => {
            const input = { id: 2, name: 'Test1', age: 30, car: 'Toyota1' };
            const expected = { id: 1, name: 'Test1', age: 30, car: 'Toyota1' };
            expect(FN(input, expected)).toEqual(75); // 3 out of 4 properties match
        });
        it('should return percentage of string similarity', () => {
            expect(FN('Test', 'a Test')).toEqual(50);
            expect(FN('a Test', 'Test')).toEqual(50);
        });
    });
    describe('different values', () => {
        it('should return 0% for different values', () => {
            expect(FN(2, 3)).toEqual(0);
            expect(FN(true, false)).toEqual(0);
            expect(FN('true', 'false')).toEqual(0);
            expect(FN(null, undefined)).toEqual(0);
        });
    });
    describe('mixed property types', () => {
        it('should return 50% if some properties different', () => {
            const input = { id: 1, detail: 4 };
            const expected = { id: 1, detail: { name: 1233, age: 3 } };
            expect(FN(input, expected)).toEqual(50);
        });
        it('should return 0% if all properties are different', () => {
            const input = { detail: 4 };
            const expected = { detail: { name: 1233, age: 3 } };
            expect(FN(input, expected)).toEqual(0);
        });
    });
});
describe('getAnalyzeItems()', () => {
    const FN = getAnalyzeItems;
    const base = { found: false, accuracy: -1 };
    it('should return array of WordItems', () => {
        const result = FN('This is a test');
        const EXPECTED = [
            { word: 'This', lowerWord: 'this', index: 0, ...base },
            { word: 'is', lowerWord: 'is', index: 1, ...base },
            { word: 'a', lowerWord: 'a', index: 2, ...base },
            { word: 'test', lowerWord: 'test', index: 3, ...base },
        ];
        expect(result).toEqual(EXPECTED);
    });
    it('should handle multiple spaces and punctuation', () => {
        const result = FN('This, is a   test!');
        const EXPECTED = [
            { word: 'This,', lowerWord: 'this,', index: 0, ...base },
            { word: 'is', lowerWord: 'is', index: 1, ...base },
            { word: 'a', lowerWord: 'a', index: 2, ...base },
            { word: 'test!', lowerWord: 'test!', index: 3, ...base },
        ];
        expect(result).toEqual(EXPECTED);
    });
    it('should handle multiple spaces and punctuation', () => {
        const result = FN(
            '[3/3] [100ms] received 3 items from https://gitlab.flakyMultipleTimes.com/api/v4/projects?per_page=3&page=3'
        );
        const EXPECTED = [
            { word: '[3/3]', lowerWord: '[3/3]', index: 0, ...base },
            { word: '[100ms]', lowerWord: '[100ms]', index: 1, ...base },
            { word: 'received', lowerWord: 'received', index: 2, ...base },
            { word: '3', lowerWord: '3', index: 3, ...base },
            { word: 'items', lowerWord: 'items', index: 4, ...base },
            { word: 'from', lowerWord: 'from', index: 5, ...base },
            {
                word: 'https://gitlab.flakyMultipleTimes.com/api/v4/projects?per_page=3&page=3',
                lowerWord:
                    'https://gitlab.flakymultipletimes.com/api/v4/projects?per_page=3&page=3',
                index: 6,
                ...base,
            },
        ];
        expect(result).toEqual(EXPECTED);
    });
    // '[3/3] [100ms] received 3 items from https://gitlab.flakyMultipleTimes.com/api/v4/projects?per_page=3&page=3'
});
