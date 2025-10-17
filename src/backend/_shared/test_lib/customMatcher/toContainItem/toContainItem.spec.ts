import { ITEM, MatchItem, ValueItem } from './../../../item/item.d';
import {
    compareItem,
    getMatchingData,
    toContainItems,
    getMatchingState,
    makeFailMsg,
    getMatchesStats,
} from './toContainItem';

import {
    CONGRUENT,
    DIFF,
    EQUAL,
    EXTRA,
    MISS,
    MIXED,
} from './../../../item/item.config';
import { formatOutput } from './../../../format/format';

const $ = expect.objectContaining;

const A = 'Test';
const a = 'test';
const B = 'Example';
// const b = 'example';
const X = undefined;

const ID_1 = { id: 1 };
const ID_1_NAME_A = { id: 1, name: A };
const ID_1_NAME_a = { id: 1, name: a };
const ID_1_NAME_A_AGE_30 = { id: 1, name: A, age: 30 };
const ID_2_NAME_A = { id: 2, name: A };
// const ID_2_NAME_a = { id: 2, name: a };
const ID_1_NAME_B = { id: 1, name: B };
const ID_2_NAME_B = { id: 2, name: B };
const ID_1_NAME_OBJ_1 = { id: 1, name: { first: 'Test', last: 'User' } };
const ID_2_NAME_OBJ_1 = { id: 2, name: { first: 'Test', last: 'User' } };
const ID_1_NAME_OBJ_2 = { id: 1, name: { first: 'Test', last: 'User2' } };
const ID_2_NAME_OBJ_2 = { id: 2, name: { first: 'Test', last: 'User2' } };
const OBJ_1 = { first: 'Test', last: 'User' };
const OBJ_2 = { first: 'Test', last: 'User2' };

const ID_EQUAL = { key: 'id', state: EQUAL, accuracy: 100 };
const ID_DIFF = { key: 'id', state: DIFF, accuracy: 0 };
const NAME_EQUAL = { key: 'name', state: EQUAL, accuracy: 100 };
// const NAME_CONGRUENT = { key: 'name', state: CONGRUENT, accuracy: 50 };
const NAME_CONGRUENT = { key: 'name', state: CONGRUENT, accuracy: 87.5 };
const NAME_DIFF = { key: 'name', state: DIFF, accuracy: 0 };
const AGE_EXTRA = { key: 'age', state: EXTRA, accuracy: 0 };
const NAME_MISS = { key: 'name', state: MISS, accuracy: 0 };

describe('compareIte()', () => {
    const FN = compareItem;
    describe('level 1 - exact match', () => {
        it('should return equal states', () => {
            const result = FN(ID_1_NAME_A, ID_1_NAME_A);
            const EXPECTED = [
                { expected: 1, received: 1, ...ID_EQUAL },
                { expected: A, received: A, ...NAME_EQUAL },
            ];
            expect(result).toEqual(EXPECTED);
        });
        it('should return diff states', () => {
            const result = FN(ID_1_NAME_A, ID_2_NAME_A);
            const EXPECTED = [
                { expected: 1, received: 2, ...ID_DIFF },
                { expected: A, received: A, ...NAME_EQUAL },
            ];
            expect(result).toEqual(EXPECTED);
        });
        it('should return diff states', () => {
            const result = FN(ID_1_NAME_A, ID_1_NAME_B);
            const EXPECTED = [
                { expected: 1, received: 1, ...ID_EQUAL },
                { expected: A, received: B, ...NAME_DIFF },
            ];
            expect(result).toEqual(EXPECTED);
        });
        it('should return extra states', () => {
            const result = FN(ID_1_NAME_A, ID_1_NAME_A_AGE_30);
            const EXPECTED = [
                { expected: 1, received: 1, ...ID_EQUAL },
                { expected: A, received: A, ...NAME_EQUAL },
                { expected: undefined, received: 30, ...AGE_EXTRA },
            ];
            expect(result).toEqual(EXPECTED);
        });
        it('should return missing states', () => {
            const result = FN(ID_1_NAME_A, ID_1);
            const EXPECTED = [
                { expected: 1, received: 1, ...ID_EQUAL },
                { expected: A, received: X, ...NAME_MISS },
            ];
            expect(result).toEqual(EXPECTED);
        });
        it('should return congruent states', () => {
            const expected = { id: 1, name: A };
            const received = { id: 1, name: a };
            const result = FN(expected, received);
            const EXPECTED = [
                { expected: 1, received: 1, ...ID_EQUAL },
                { expected: A, received: a, ...NAME_CONGRUENT },
            ];
            expect(result).toEqual(EXPECTED);
        });
        it('should return equal states for undefined', () => {
            const expected = { id: 1, name: X };
            const received = { id: 1, name: X };
            const result = FN(expected, received);
            const EXPECTED = [
                { expected: 1, received: 1, ...ID_EQUAL },
                { expected: X, received: X, ...NAME_EQUAL },
            ];
            expect(result).toEqual(EXPECTED);
        });
        it('should return diff states for objects', () => {
            const result = FN(ID_1_NAME_OBJ_1, ID_1_NAME_OBJ_2);
            const EXPECTED = [
                { expected: 1, received: 1, ...ID_EQUAL },
                {
                    expected: OBJ_1,
                    received: OBJ_2,
                    ...NAME_CONGRUENT,
                    accuracy: 90,
                },
            ];
            expect(result).toEqual(EXPECTED);
        });
    });
});
describe('getMatchingData()', () => {
    const expected = ID_1_NAME_A;
    const FN = getMatchingData;
    describe('valid', () => {
        const pass = true;
        it('should succeed when equal item value found', () => {
            const received = [ID_1_NAME_A, ID_2_NAME_B];
            const result = FN(received, expected);
            const values = [
                { expected: 1, received: 1, ...ID_EQUAL },
                { expected: A, received: A, ...NAME_EQUAL },
            ];
            const found: MatchItem[] = [
                { index: 0, values, state: EQUAL, accuracy: 100 },
            ];
            const EXPECTED = { expected, received, found, pass };
            expect(result).toEqual(EXPECTED);
        });
        it('should succeed when multiple equal items value found', () => {
            const received = [ID_1_NAME_A, ID_2_NAME_B, ID_1_NAME_A];
            const result = FN(received, expected);
            const values = [
                { expected: 1, received: 1, ...ID_EQUAL },
                { expected: A, received: A, ...NAME_EQUAL },
            ];
            const found: MatchItem[] = [
                { index: 0, values, state: EQUAL, accuracy: 100 },
                { index: 2, values, state: EQUAL, accuracy: 100 },
            ];
            const EXPECTED = { expected, received, found, pass };
            expect(result).toEqual(EXPECTED);
        });
        it('should succeed when equal item obj found', () => {
            const expected = ID_1_NAME_OBJ_1;
            const received = [ID_1_NAME_OBJ_2, ID_1_NAME_OBJ_1];
            const result = FN(received, expected);
            const val = [
                { expected: 1, received: 1, ...ID_EQUAL },
                { expected: OBJ_1, received: OBJ_1, ...NAME_EQUAL },
            ];
            const found: MatchItem[] = [
                { index: 1, values: val, accuracy: 100, state: EQUAL },
            ];
            const EXPECTED = { expected, received, found, pass };
            expect(result).toEqual(EXPECTED);
        });
    });
    describe('field cases', () => {
        it('should pass when message and type match with placeholders', () => {
            const MSG_EXPECTED = 'empty content from response';
            const MSG_OTHER =
                'No xTotalPages header found in response from https://gitlab.nocontent.com/api/v4/projects?per_page=5&page=1';
            const BASE = { time: 2, type: 'WARN' };
            const received = [
                { message: MSG_EXPECTED, telemetry: {}, ...BASE },
                { message: MSG_OTHER, telemetry: {}, ...BASE },
            ];
            const expected = { message: MSG_EXPECTED, telemetry: {}, ...BASE };
            const ITEM_EXPECTED = {
                key: 'message',
                expected: MSG_EXPECTED,
                received: MSG_EXPECTED,
                state: EQUAL,
                accuracy: 100,
            };
            // const ITEM_OTHER = {
            //     key: 'message',
            //     expected: MSG_EXPECTED,
            //     received: MSG_EXPECTED,
            //     state: EQUAL,
            //     accuracy: 100,
            // };
            const ITEMS_BASE = [
                {
                    key: 'telemetry',
                    expected: {},
                    received: {},
                    state: EQUAL,
                    accuracy: 100,
                },
                {
                    key: 'time',
                    expected: 2,
                    // expected: '{number}',
                    received: 2,
                    state: EQUAL,
                    accuracy: 100,
                },
                {
                    key: 'type',
                    expected: 'WARN',
                    received: 'WARN',
                    state: EQUAL,
                    accuracy: 100,
                },
            ];
            const EXPECTED = {
                expected,
                received,
                pass: true,
                found: [
                    {
                        index: 0,
                        values: [ITEM_EXPECTED, ...ITEMS_BASE],
                        accuracy: 100,
                        state: EQUAL,
                    },
                    // {
                    //     index: 1,
                    //     values: [ITEM_OTHER, ...ITEMS_BASE],
                    //     accuracy: 100,
                    //     state: EQUAL,
                    // },
                ],
            };
            expect(FN(received, expected)).toEqual(EXPECTED);
        });
        it('should pass when message and type match with placeholders', () => {
            const MSG_EXPECTED = 'empty content from response';
            const MSG_OTHER =
                'No xTotalPages header found in response from https://gitlab.nocontent.com/api/v4/projects?per_page=5&page=1';
            const BASE = { time: 2, type: 'WARN' };
            const received = [
                { message: MSG_OTHER, telemetry: {}, ...BASE },
                { message: MSG_EXPECTED, telemetry: {}, ...BASE },
            ];
            const expected = { message: MSG_EXPECTED, telemetry: {}, ...BASE };
            const ITEM_EXPECTED = {
                key: 'message',
                expected: MSG_EXPECTED,
                received: MSG_EXPECTED,
                state: EQUAL,
                accuracy: 100,
            };
            // const ITEM_OTHER = {
            //     key: 'message',
            //     expected: MSG_EXPECTED,
            //     received: MSG_EXPECTED,
            //     state: EQUAL,
            //     accuracy: 100,
            // };
            const ITEMS_BASE = [
                {
                    key: 'telemetry',
                    expected: {},
                    received: {},
                    state: EQUAL,
                    accuracy: 100,
                },
                {
                    key: 'time',
                    expected: 2,
                    // expected: '{number}',
                    received: 2,
                    state: EQUAL,
                    accuracy: 100,
                },
                {
                    key: 'type',
                    expected: 'WARN',
                    received: 'WARN',
                    state: EQUAL,
                    accuracy: 100,
                },
            ];
            const EXPECTED = {
                expected,
                received,
                pass: true,
                found: [
                    {
                        index: 1,
                        values: [ITEM_EXPECTED, ...ITEMS_BASE],
                        accuracy: 100,
                        state: EQUAL,
                    },
                    // {
                    //     index: 1,
                    //     values: [ITEM_OTHER, ...ITEMS_BASE],
                    //     accuracy: 100,
                    //     state: EQUAL,
                    // },
                ],
            };
            expect(FN(received, expected)).toEqual(EXPECTED);
        });
    });
    describe('invalid', () => {
        const pass = false;
        it('fail when its empty', () => {
            const received: ITEM[] = [];
            const result = FN(received, expected);
            const found: MatchItem[] = [];
            const EXPECTED = { expected, received, found, pass };
            expect(result).toEqual(EXPECTED);
        });
        it('#B fail when item has extra property', () => {
            const received = [ID_1_NAME_A_AGE_30, ID_2_NAME_B];
            const result = FN(received, expected);
            const values = [
                { expected: 1, received: 1, ...ID_EQUAL },
                { expected: A, received: A, ...NAME_EQUAL },
                { expected: undefined, received: 30, ...AGE_EXTRA },
            ];
            const found: MatchItem[] = [
                { index: 0, values, accuracy: 66.7, state: EXTRA },
            ];
            const EXPECTED = { expected, received, found, pass };
            expect(result).toEqual(EXPECTED);
        });
        it('#C fail when item has missing property', () => {
            const received = [ID_1, ID_2_NAME_B];
            const result = FN(received, expected);
            const values = [
                { expected: 1, received: 1, ...ID_EQUAL },
                { expected: A, received: undefined, ...NAME_MISS },
            ];
            const found: MatchItem[] = [
                { index: 0, values, accuracy: 50, state: MISS },
            ];
            const EXPECTED = { expected, received, found, pass };
            expect(result).toEqual(EXPECTED);
        });
        it('fail when item has different value', () => {
            const received = [ID_2_NAME_A, ID_2_NAME_B];
            const result = FN(received, expected);
            const values = [
                { expected: 1, received: 2, ...ID_DIFF },
                { expected: A, received: A, ...NAME_EQUAL },
            ];
            const found: MatchItem[] = [
                { index: 0, values: values, accuracy: 50, state: DIFF },
            ];
            const EXPECTED = { expected, received, found, pass };
            expect(result).toEqual(EXPECTED);
        });
        it('should fail when item has different value in case (CONGRUENT)', () => {
            const received = [ID_1_NAME_a, ID_2_NAME_B];
            const result = FN(received, expected);
            const values = [
                $({ key: 'id', expected: 1, received: 1, state: EQUAL }),
                $({ key: 'name', expected: A, received: a, state: CONGRUENT }),
            ];
            const found: MatchItem[] = [
                { index: 0, values, accuracy: 93.8, state: CONGRUENT },
            ];
            const EXPECTED = { expected, received, found, pass };
            expect(result).toEqual(EXPECTED);
        });
        it('should fail when item has different obj value in case (CONGRUENT)', () => {
            const expected = ID_1_NAME_OBJ_1;
            const received = [ID_1_NAME_OBJ_2, ID_2_NAME_OBJ_2];
            const result = FN(received, expected);
            const values = [
                { expected: 1, received: 1, ...ID_EQUAL },
                {
                    expected: OBJ_1,
                    received: OBJ_2,
                    ...NAME_CONGRUENT,
                    accuracy: 90, // overwrite of NAME_CONGRUENT
                },
            ];
            const found: MatchItem[] = [
                { index: 0, values, accuracy: 95, state: CONGRUENT },
            ];
            const EXPECTED = { expected, received, found, pass };
            expect(result).toEqual(EXPECTED);
        });
        describe('complex results', () => {
            it('should fail when item has partly different values', () => {
                const expected = ID_1_NAME_OBJ_1;
                const received = [ID_1_NAME_OBJ_2, ID_2_NAME_OBJ_1];
                const result = FN(received, expected);
                const val1 = [
                    { expected: 1, received: 1, ...ID_EQUAL },
                    {
                        expected: OBJ_1,
                        received: OBJ_2,
                        ...NAME_CONGRUENT,
                        accuracy: 90, // overwrite of NAME_CONGRUENT
                    },
                ];
                const val2 = [
                    { expected: 1, received: 2, ...ID_DIFF },
                    { expected: OBJ_1, received: OBJ_1, ...NAME_EQUAL },
                ];
                const found: MatchItem[] = [
                    { index: 0, values: val1, accuracy: 95, state: CONGRUENT },
                    { index: 1, values: val2, accuracy: 50, state: DIFF },
                ];
                const EXPECTED = { expected, received, found, pass };
                expect(result).toEqual(EXPECTED);
            });
            it('should fail when item has partly different values', () => {
                const expected = ID_1_NAME_OBJ_1;
                const received = [ID_1_NAME_OBJ_2, ID_2_NAME_OBJ_2];
                const result = FN(received, expected);
                const val1 = [
                    { expected: 1, received: 1, ...ID_EQUAL },
                    {
                        expected: OBJ_1,
                        received: OBJ_2,
                        ...NAME_CONGRUENT,
                        accuracy: 90, // overwrite of NAME_CONGRUENT
                    },
                ];
                const found: MatchItem[] = [
                    { index: 0, values: val1, accuracy: 95, state: CONGRUENT },
                ];
                const EXPECTED = { expected, received, found, pass };
                expect(result).toEqual(EXPECTED);
            });
        });
    });
    // TODO: mehrfach nearly matches, priorities je property (e.g id, name, type)
    // TODO: mixed types
});
describe(' getMatchingState()', () => {
    const FN = getMatchingState;
    const values: ValueItem[] = []; // empty mocked
    it('should return EQUAL', () => {
        const input = [{ index: 0, values, accuracy: 100, state: EQUAL }];
        const result = FN(input);
        expect(result).toBe(EQUAL);
    });
    it('should return DIFF', () => {
        const input = [{ index: 0, values, accuracy: 50, state: DIFF }];
        const result = FN(input);
        expect(result).toBe(DIFF);
    });
    it('should return CONGRUENT', () => {
        const input = [{ index: 0, values, accuracy: 90, state: CONGRUENT }];
        const result = FN(input);
        expect(result).toBe(CONGRUENT);
    });
    it('should return MIXED', () => {
        const input = [
            { index: 0, values, accuracy: 90, state: CONGRUENT },
            { index: 1, values, accuracy: 50, state: DIFF },
        ];
        const result = FN(input);
        expect(result).toBe(MIXED);
    });
});
describe('toContainItem()', () => {
    const FN = toContainItems;
    xdescribe('valid', () => {
        xit('should return pass true', () => {
            const received = [ID_1_NAME_A, ID_2_NAME_B];
            const expected = ID_1_NAME_A;
            const result = FN(received, expected);
            const EXPECTED = { message: expect.any(Function), pass: true };
            expect(result).toEqual(EXPECTED);
            expect(result.message()).toEqual('xxx');
        });
    });
    describe('invalid', () => {
        xit('should return pass false', () => {
            const received = [ID_2_NAME_A, ID_2_NAME_B];
            const expected = ID_1_NAME_A;
            const result = FN(received, expected);
            const EXPECTED = { message: expect.any(Function), pass: false };
            const MSG = `found 1. item with different value
            ❌ property "id" expected: {GREEN}1{/GREEN}, received: {RED}2 [different]{/RED}
            ✅ property "name" [OK]
        `;
            expect(result).toEqual(EXPECTED);
            const EXPECTED_MSG = MSG.replace(/\n\s+/g, '\n').trim();
            expect(result.message()).toEqual(`${EXPECTED_MSG}\n`);
            //
            // expect(result.message()).toEqual(MSG.replace(/\s+/g, ' ').trim());
        });
    });
});
// properties
// types
// content

// message checke `has something like ${number} for ${string}`
// 1st, 2nd, 3rd, 4th, 5th priority

describe('getMatchesStats()', () => {
    const FN = getMatchesStats;
    it('should return empty string when no matches', () => {
        const result = FN([]);
        const EXPECTED = '\n🎯 matches: 0\n';
        expect(result).toEqual(EXPECTED);
    });
    it('should return stats for 1 match', () => {
        const input = [
            { index: 0, value: ID_1_NAME_A, accuracy: 100, state: EQUAL },
        ];
        const result = FN(input);
        const EXPECTED = `
            🎯 matches: 1
                    - index=0 (100%)
        `;
        console.log(formatOutput(EXPECTED));
        expect(result).toEqual(formatOutput(EXPECTED));
    });
    it('should return stats for 3 matches', () => {
        const input = [
            { index: 0, value: ID_1_NAME_A, accuracy: 100, state: EQUAL },
            { index: 1, value: ID_2_NAME_B, accuracy: 50, state: DIFF },
            { index: 2, value: ID_1_NAME_A, accuracy: 100, state: EQUAL },
        ];
        const result = FN(input);
        const EXPECTED = `
            🎯 matches: 3
                    - index=0 (100%)
                    - index=2 (100%)
                    - index=1 (50%)
                `;
        expect(result).toEqual(formatOutput(EXPECTED));
    });
});

describe('makeFailMsg()', () => {
    const FN = makeFailMsg;
    it('should return fail message', () => {
        const expected = { id: 1, name: 'Test' };
        const received = [
            {
                index: 0,
                value: { id: 2, name: 'Test' },
                accuracy: 50,
                state: DIFF,
            },
        ];
        const result = FN(expected, received);
        const MSG = `
            expect(object).toContainItems(expected)

            Expected object has different values then received (50%)

            🎯 matches: 1
                    - index=0 (50%)

            🔑 Keys: id, name

            diff:
            - Expected  - 1
            + Received  + 1

              Object {
            -   "id": 1,
            +   "id": 2,
                "name": "Test",
              }`;
        const EXPECTED_MSG = formatOutput(MSG);
        expect(result).toEqual(EXPECTED_MSG);
    });
    it('should return fail message', () => {
        const expected = { id: 1, name: 'Test' };
        const received = [
            {
                index: 0,
                value: { id: 2, name: 'Test' },
                accuracy: 50,
                state: DIFF,
            },
            {
                index: 1,
                value: { id: 1, name: 'Test' },
                accuracy: 100,
                state: EQUAL,
            },
        ];
        const result = FN(expected, received);
        const MSG = `
            expect(object).toContainItems(expected)

            Expected object has different values then received (50%)

            🎯 matches: 2
                    - index=1 (100%)
                    - index=0 (50%)

            🔑 Keys: id, name

            diff:
            - Expected  - 1
            + Received  + 1

              Object {
            -   "id": 1,
            +   "id": 2,
                "name": "Test",
              }`;
        const EXPECTED_MSG = formatOutput(MSG);
        expect(result).toEqual(EXPECTED_MSG);
    });
});
