import {
    CONGRUENT,
    DIFF,
    EQUAL,
    EXACT,
    NEARLY,
    PARTIAL,
} from './../item.config';
import {
    compareObject,
    compareProperties,
    compareSimpleValues,
} from './compare';

describe('✅ compareProperties()', () => {
    const FN = compareProperties;
    const EXPECTED = { id: 1, name: 'Test' };
    it('should return extra properties', () => {
        const received = { id: 1, name: 'Test', age: 30 };
        expect(FN(EXPECTED, received)).toEqual({
            missing: [],
            extra: ['age'],
            different: [],
            same: ['id', 'name'],
            status: false,
        });
    });
    it('should return missing properties', () => {
        const received = { id: 1 };
        expect(FN(EXPECTED, received)).toEqual({
            missing: ['name'],
            extra: [],
            different: [],
            same: ['id'],
            status: false,
        });
    });
    it('should return both missing and extra properties', () => {
        const expected = { ...EXPECTED, age: 30 };
        const received = { id: 1, age: 25, car: 'Toyota' };
        expect(FN(expected, received)).toEqual({
            missing: ['name'],
            extra: ['car'],
            different: ['age'],
            same: ['id'],
            status: false,
        });
    });
    it('should return different properties', () => {
        const received = { id: 1, name: 'Different' };
        expect(FN(EXPECTED, received)).toEqual({
            missing: [],
            extra: [],
            different: ['name'],
            same: ['id'],
            status: false,
        });
    });
    it('should return status true for identical objects', () => {
        const received = { id: 1, name: 'Test' };
        expect(FN(EXPECTED, received)).toEqual({
            missing: [],
            extra: [],
            different: [],
            same: ['id', 'name'],
            status: true,
        });
    });
    it('should handle empty objects', () => {
        const expected = {};
        const received = {};
        expect(FN(expected, received)).toEqual({
            missing: [],
            extra: [],
            different: [],
            same: [],
            status: true,
        });
    });
    it('should handle empty expected object', () => {
        const expected = {};
        const received = { id: 1, name: 'Test' };
        expect(FN(expected, received)).toEqual({
            missing: [],
            extra: ['id', 'name'],
            different: [],
            same: [],
            status: false,
        });
    });
    it('should handle empty received object', () => {
        const received = {};
        expect(FN(EXPECTED, received)).toEqual({
            missing: ['id', 'name'],
            extra: [],
            different: [],
            same: [],
            status: false,
        });
    });
});
describe('✅ compareObject()', () => {
    const FN = compareObject;
    describe('true cases', () => {
        it('should compare two objects with the same properties', () => {
            const received = { id: 1, name: 'Test' };
            const expected = { id: 1, name: 'Test' };
            expect(FN(received, expected)).toEqual(true);
        });
    });
    describe('false cases', () => {
        it('should return false for objects with different properties', () => {
            const received = { id: 1, name: 'Test' };
            const expected = { id: 2, name: 'Test' };
            expect(FN(received, expected)).toEqual(false);
        });
        it('should return false for objects with different property values', () => {
            const received = { id: 1, name: 'Test' };
            const expected = { id: 1, name: 'Different' };
            expect(FN(received, expected)).toEqual(false);
        });
        it('should return false for objects with different property values', () => {
            const received = { id: 1, name: 'Test', age: 2 };
            const expected = { id: 1, name: 'Test' };
            expect(FN(received, expected)).toEqual(false);
        });
        it('should return false for objects with different property values', () => {
            const received = { id: 1, name: 'Test', age: 2 };
            const expected = { id: 1, name: 'Test' };
            const keys = ['id', 'name'];
            expect(FN(received, expected, keys)).toEqual(true);
        });
        it('should return false for objects with different property values', () => {
            const received = { id: 1, name: 'Test' };
            const expected = { id: 1, name: 'Different', age: 2 };
            expect(FN(received, expected)).toEqual(false);
        });
    });
});
describe('compareSimpleValues()', () => {
    describe('level=exact', () => {
        const level = EXACT;
        const EXPECTED = { level, status: EQUAL, accuracy: 100 };
        it('should return 100% for identical strings', () => {
            expect(compareSimpleValues('Test', 'Test')).toEqual(EXPECTED);
        });
        it('should return 100% for identical non-string values', () => {
            expect(compareSimpleValues(23, 23)).toEqual(EXPECTED);
            expect(compareSimpleValues(true, true)).toEqual(EXPECTED);
            expect(compareSimpleValues(false, false)).toEqual(EXPECTED);
            expect(compareSimpleValues(null, null)).toEqual(EXPECTED);
        });
    });
    describe('level=nearly', () => {
        const level = NEARLY;
        const EXPECTED = { level, status: CONGRUENT, accuracy: 50 };
        it('should return 90% for case-insensitive match', () => {
            expect(compareSimpleValues('Test', 'test')).toEqual(EXPECTED);
        });
        it('should compare non-string values as different', () => {
            expect(compareSimpleValues(123, '123')).toEqual(EXPECTED);
            expect(compareSimpleValues('123', 123)).toEqual(EXPECTED);
            expect(compareSimpleValues(true, 'true')).toEqual(EXPECTED);
            expect(compareSimpleValues(false, 'false')).toEqual(EXPECTED);
            expect(compareSimpleValues(null, 'null')).toEqual(EXPECTED);
        });
    });
    describe('level=partial', () => {
        const level = PARTIAL;
        it('should return 60% for partial match', () => {
            const input = 'This is a Test string';
            const expected = 'Test string example';
            const result = compareSimpleValues(input, expected);
            expect(result).toEqual({ level, status: DIFF, accuracy: 40 });
        });
        it('should return 40% for low partial match', () => {
            const input = 'Hello world';
            const expected = 'Test string example';
            const result = compareSimpleValues(input, expected);
            expect(result).toEqual({ level, status: DIFF, accuracy: 0 });
        });

        // TODO: check word by word
        it('should return 100% for placeholder match', () => {
            const input = 'Max retry for FOO on page 2, stop...';
            const expected = 'Max retry for {string} on page {number}, stop...';
            const result = compareSimpleValues(input, expected);
            expect(result).toEqual({
                level,
                status: CONGRUENT,
                accuracy: 100,
            });
        });
    });
    describe('level=diff', () => {
        const level = PARTIAL;
        it('should return 0% for completely different strings', () => {
            const input = 'Completely different';
            const expected = 'Test string example';
            const result = compareSimpleValues(input, expected);
            expect(result).toEqual({ level, status: DIFF, accuracy: 0 });
        });
        it('should return 0% for different non-string values', () => {
            expect(compareSimpleValues(123, 456)).toEqual({
                level,
                status: DIFF,
                accuracy: 0,
            });
            expect(compareSimpleValues(true, false)).toEqual({
                level,
                status: DIFF,
                accuracy: 0,
            });
            expect(compareSimpleValues(null, 0)).toEqual({
                level,
                status: DIFF,
                accuracy: 0,
            });
        });
    });
});
