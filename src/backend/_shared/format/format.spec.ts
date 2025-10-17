import { formatOutput, formatPlaceholder } from './format';

describe('formatPlaceholder()', () => {
    const FN = formatPlaceholder;
    describe('simple', () => {
        it('should replace received value with expected placeholder', () => {
            expect(FN('{string}', 'test')).toEqual('{string}');
            expect(FN('{number}', 22)).toEqual('{number}');
            expect(FN('{boolean}', true)).toEqual('{boolean}');
            expect(FN('{boolean}', false)).toEqual('{boolean}');
        });
    });
    describe('complex', () => {
        it('should replace received object values with expected placeholders', () => {
            const expected = {
                id: '{number}',
                name: '{string}',
                active: '{boolean}',
            };
            const received = { id: 1, name: 'Test', active: true };
            const result = FN(expected, received);
            expect(result).toEqual(expected);
        });
        it('should not replace received object values with different expected placeholders', () => {
            const expected = {
                id: '{number}',
                name: '{string}',
                active: '{boolean}',
            };
            const received = { id: '1', name: 'Test', active: 'true' };
            const EXPECTED = { id: '1', name: '{string}', active: 'true' };
            const result = FN(expected, received);
            expect(result).toEqual(EXPECTED);
        });
        it('should replace partly placeholder values', () => {
            const expected = {
                id: '{number}',
                name: 'User {string} value',
                active: '{boolean}',
            };
            const received = {
                id: 1,
                name: 'User Test value',
                active: true,
            };
            const EXPECTED = {
                id: '{number}',
                name: 'User {string} value',
                active: '{boolean}',
            };
            const result = FN(expected, received);
            expect(result).toEqual(EXPECTED);
        });
    });
});
describe('formatOutput()', () => {
    const FN = formatOutput;
    it('should format input with emoji', () => {
        const input = `
            🎯 matchex: 1
                    - index=0 (100%)
        `;
        const EXPECTED = `
            🎯 matchex: 1
                    - index=0 (100%)
                    `;
        expect(FN(input)).toEqual(formatOutput(EXPECTED));
    });
    it('should return input when no indent found', () => {
        const input = `
expect(object).toContainItems(expected)
foo`;
        const output = `
expect(object).toContainItems(expected)
foo`;
        expect(FN(input)).toEqual(output);
    });
    it('should indent according to space of first item', () => {
        const input = `
            expect(object).toContainItems(expected)
foo

            Expected object has different values then received (50%) {"id": 1, "name": "Test"}

            Keys: id, name

            diff:
            - Expected  - 1
            + Received  + 1

              Object {
            -   "id": 1,
            +   "id": 2,
                "name": "Test",
              }
`;
        const output = `
expect(object).toContainItems(expected)
foo

Expected object has different values then received (50%) {"id": 1, "name": "Test"}

Keys: id, name

diff:
- Expected  - 1
+ Received  + 1

  Object {
-   "id": 1,
+   "id": 2,
    "name": "Test",
  }
`;
        expect(FN(input)).toEqual(output);
    });
});
