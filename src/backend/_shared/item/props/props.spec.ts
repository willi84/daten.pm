import { hasAllProps, getAllProps, getProps } from './props';

describe('✅ hasAllProps()', () => {
    it('should return true if all properties are present', () => {
        const input = [{ id: 1, name: 'Test', foo: 'bar' }];
        const expected = ['id', 'name'];
        expect(hasAllProps(input, expected)).toEqual(true);
    });
    it('should return false if not all properties are present', () => {
        const input = [{ id: 1 }];
        const expected = ['id', 'name'];
        expect(hasAllProps(input, expected)).toEqual(false);
    });
});
describe('✅ getProps()', () => {
    const FN = getProps;
    it('should add unique keys to allKeys array', () => {
        const item = { a: 1, b: 2, c: 3 };
        const allKeys: string[] = ['a'];
        FN(item, allKeys);
        expect(allKeys).toEqual(['a', 'b', 'c']);
    });
});
describe('✅ getAllProps()', () => {
    const FN = getAllProps;
    it('should return all unique keys from both objects', () => {
        const expected = { a: 1, b: 2, d: 5 };
        const input = { a: 1, b: 3, c: 4 };
        expect(FN(input, expected)).toEqual(['a', 'b', 'c', 'd']);
    });
});
