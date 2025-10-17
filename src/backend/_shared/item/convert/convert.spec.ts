/**
 * 🧪 Testing module CONVERT
 * @module backend/_shared/item/CONVERT
 * @version 0.0.1
 * @date 2025-09-18
 * @license MIT
 * @author Robert Willemelis <github.com/willi84>
 */
import {
    addDoubleQuotesToValues,
    addQuotesToKeys,
    convert2KeyValue,
    convertKey2CamelCase,
    convertNumber2String,
    removeComments,
    replace,
    round,
    roundToString,
    strToJSON,
} from './convert';

// TODO: []
// https://json5.org/

describe('✅ replace', () => {
    const FN = replace;
    it('should replace regex in string', () => {
        expect(FN('a', 'abcabc', 'X')).toBe('XbcXbc');
        expect(FN('d', 'abcabc', 'X')).not.toBe('XbcXbc');
    });
});
describe('✅ round()', () => {
    const FN = round;
    it('full number', () => {
        expect(FN(2.34245245)).toBe(2);
        expect(FN(2, 2)).toBe(2);
        expect(FN(2.1, 0)).toBe(2);
    });
    it('decimals', () => {
        expect(FN(2.34245245, 2)).toBe(2.34);
        expect(FN('2.34245245', 2)).toBe(2.34);
        expect(FN(2.1, 2)).toBe(2.1);
    });
});
describe('✅ roundToString()', () => {
    const FN = roundToString;
    it('full number', () => {
        expect(FN(2.1, 0)).toBe('2');
    });
    it('deciamls', () => {
        expect(FN(2.34245245, 2)).toBe('2.34');
        expect(FN('2.34245245', 2)).toBe('2.34');
        expect(FN(2, 2)).toBe('2.00');
        expect(FN(2.1, 2)).toBe('2.10');
    });
});
describe('✅ removeComments()', () => {
    const K_DQ = `"ke:y-2"`;
    const V_DQ = `"value2"`;

    const K_SQ = `'ke:y-2'`;
    const V_SQ = `'value2'`;

    const K_NQ = `$fo_o2bar`;
    // const K_NQ = `§fo_o2bar`;
    const V_NQ = 2;
    const COM = `comment:// ,'':'' "":""`;
    const FN = removeComments;

    describe('✅ json: unminified', () => {
        describe(`"KEY"`, () => {
            describe(`"KEY":<value> //`, () => {
                it('with double quote value', () => {
                    const input = `{
                        ${K_DQ}: ${V_DQ} //${COM}
                    }`;
                    const EXPECTED = `{
                        ${K_DQ}: ${V_DQ}
                    }`;
                    expect(FN(input)).toEqual(EXPECTED);
                });
                it('with single quote value', () => {
                    const input = `{
                        ${K_DQ}: ${V_SQ} //${COM}
                    }`;
                    const EXPECTED = `{
                        ${K_DQ}: ${V_SQ}
                    }`;
                    expect(FN(input)).toEqual(EXPECTED);
                });
                it('with simple value', () => {
                    const input = `{
                        ${K_DQ}: ${V_NQ} //${COM}
                    }`;
                    const EXPECTED = `{
                        ${K_DQ}: ${V_NQ}
                    }`;
                    expect(FN(input)).toEqual(EXPECTED);
                });
            });
            describe(`"KEY":<value>, //`, () => {
                it('with double quote value', () => {
                    const input = `{
                        ${K_DQ}: ${V_DQ}, //${COM}
                    }`;
                    const EXPECTED = `{
                        ${K_DQ}: ${V_DQ},
                    }`;
                    expect(FN(input)).toEqual(EXPECTED);
                });
                it('with single quote value', () => {
                    const input = `{
                        ${K_DQ}: ${V_SQ}, //${COM}
                    }`;
                    const EXPECTED = `{
                        ${K_DQ}: ${V_SQ},
                    }`;
                    expect(FN(input)).toEqual(EXPECTED);
                });
                it('with simple value', () => {
                    const input = `{
                        ${K_DQ}: ${V_NQ}, //${COM}
                    }`;
                    const EXPECTED = `{
                        ${K_DQ}: ${V_NQ},
                    }`;
                    expect(FN(input)).toEqual(EXPECTED);
                });
            });
        });
        describe(`'KEY'`, () => {
            describe(`'KEY':<value> //`, () => {
                it('with double quote value', () => {
                    const input = `{
                        ${K_SQ}: ${V_DQ} //${COM}
                    }`;
                    const EXPECTED = `{
                        ${K_SQ}: ${V_DQ}
                    }`;
                    expect(FN(input)).toEqual(EXPECTED);
                });
                it('with single quote value', () => {
                    const input = `{
                        ${K_SQ}: ${V_SQ} //${COM}
                    }`;
                    const EXPECTED = `{
                        ${K_SQ}: ${V_SQ}
                    }`;
                    expect(FN(input)).toEqual(EXPECTED);
                });
                it('with simple value', () => {
                    const input = `{
                        ${K_SQ}: ${V_NQ} //${COM}
                    }`;
                    const EXPECTED = `{
                        ${K_SQ}: ${V_NQ}
                    }`;
                    expect(FN(input)).toEqual(EXPECTED);
                });
            });
            describe(`'KEY':<value>, //`, () => {
                it('with double quote value', () => {
                    const input = `{
                        ${K_SQ}: ${V_DQ}, //${COM}
                    }`;
                    const EXPECTED = `{
                        ${K_SQ}: ${V_DQ},
                    }`;
                    expect(FN(input)).toEqual(EXPECTED);
                });
                it('with single quote value', () => {
                    const input = `{
                        ${K_SQ}: ${V_SQ}, //${COM}
                    }`;
                    const EXPECTED = `{
                        ${K_SQ}: ${V_SQ},
                    }`;
                    expect(FN(input)).toEqual(EXPECTED);
                });
                it('with simple value', () => {
                    const input = `{
                        ${K_SQ}: ${V_NQ}, //${COM}
                    }`;
                    const EXPECTED = `{
                        ${K_SQ}: ${V_NQ},
                    }`;
                    expect(FN(input)).toEqual(EXPECTED);
                });
            });
        });
        describe(`KEY`, () => {
            describe(`KEY:<value> //`, () => {
                it('with double quote value', () => {
                    const input = `{
                        ${K_NQ}: ${V_DQ} //${COM}
                    }`;
                    const EXPECTED = `{
                        ${K_NQ}: ${V_DQ}
                    }`;
                    expect(FN(input)).toEqual(EXPECTED);
                });
                it('with single quote value', () => {
                    const input = `{
                        ${K_NQ}: ${V_SQ} //${COM}
                    }`;
                    const EXPECTED = `{
                        ${K_NQ}: ${V_SQ}
                    }`;
                    expect(FN(input)).toEqual(EXPECTED);
                });
                it('with simple value', () => {
                    const input = `{
                        ${K_NQ}: ${V_NQ} //${COM}
                    }`;
                    const EXPECTED = `{
                        ${K_NQ}: ${V_NQ}
                    }`;
                    expect(FN(input)).toEqual(EXPECTED);
                });
            });
            describe(`KEY:<value>, //`, () => {
                it('with double quote value', () => {
                    const input = `{
                        ${K_NQ}: ${V_DQ}, //${COM}
                    }`;
                    const EXPECTED = `{
                        ${K_NQ}: ${V_DQ},
                    }`;
                    expect(FN(input)).toEqual(EXPECTED);
                });
                it('with single quote value', () => {
                    const input = `{
                        ${K_NQ}: ${V_SQ}, //${COM}
                    }`;
                    const EXPECTED = `{
                        ${K_NQ}: ${V_SQ},
                    }`;
                    expect(FN(input)).toEqual(EXPECTED);
                });
                it('with simple value', () => {
                    const input = `{
                        ${K_NQ}: ${V_NQ}, //${COM}
                    }`;
                    const EXPECTED = `{
                        ${K_NQ}: ${V_NQ},
                    }`;
                    expect(FN(input)).toEqual(EXPECTED);
                });
            });
        });
        describe(`sort`, () => {
            it('removes comments last entry', () => {
                const input = `{
                    ${K_DQ}: ${V_DQ} //${COM}
                }`;
                const EXPECTED = `{
                    ${K_DQ}: ${V_DQ}
                }`;
                expect(FN(input)).toEqual(EXPECTED);
            });
            it('removes comments last entry', () => {
                const input = `{
                    ${K_DQ}: ${V_NQ} //${COM}
                }`;
                const EXPECTED = `{
                    ${K_DQ}: ${V_NQ}
                }`;
                expect(FN(input)).toEqual(EXPECTED);
            });
            it('removes comments last entry', () => {
                const input = `{
                    ${K_SQ}: ${V_SQ} //${COM}
                }`;
                const EXPECTED = `{
                    ${K_SQ}: ${V_SQ}
                }`;
                expect(FN(input)).toEqual(EXPECTED);
            });
            it('removes comments last entry', () => {
                const input = `{
                    'ke:y-2': 2 // comment
                }`;
                const EXPECTED = `{
                    'ke:y-2': 2
                }`;
                expect(FN(input)).toEqual(EXPECTED);
            });
            it('removes comments from JSON1', () => {
                const input = `{
                    "key": "value", // this is a comment
                    "key-2": "value2" // another comment
                }`;
                const result = FN(input);
                const EXPECTED = `{
                    "key": "value",
                    "key-2": "value2"
                }`;
                expect(result).toEqual(EXPECTED);
            });
            it('removes comments from JSON2', () => {
                const input = `{
                    // this is a comment
                    "key": "value",
                    "key2": "value2" // another comment
                }`;
                const result = FN(input);
                const EXPECTED = `{
                    "key": "value",
                    "key2": "value2"
                }`;
                expect(result).toEqual(EXPECTED);
            });
            it('removes comments from JSON2', () => {
                const input = `{
                    // this is a comment
                    "key": "value",
                    "key2": 3 // another comment
                    // blubber
                }`;
                const result = FN(input);
                const EXPECTED = `{
                    "key": "value",
                    "key2": 3
                }`;
                expect(result).toEqual(EXPECTED);
            });
            it('removes comments from JSON2', () => {
                const input = `{
                    // this is a comment
                    "key1": "value", // 1 comment
                    'key2': 'value', // 2 comment
                    key3: true, // 3 comment
                    "key4": 3 // 4 comment
                    // blubber
                }`;
                const result = FN(input);
                const EXPECTED = `{
                    "key1": "value",
                    'key2': 'value',
                    key3: true,
                    "key4": 3
                }`;
                expect(result).toEqual(EXPECTED);
            });
            it('removes comments from JSON2', () => {
                const input = `{
                    // this is a comment
                    "key": "value",
                    "key:2": "val//ue2" // another comment "" : ""
                }`;
                const result = FN(input);
                const EXPECTED = `{
                    "key": "value",
                    "key:2": "val//ue2"
                }`;
                expect(result).toEqual(EXPECTED);
            });
        });
    });
});
describe('✅ addQuotesToKeys()', () => {
    const FN = addQuotesToKeys;
    it('adds quotes to keys', () => {
        expect(FN(`{ k: "v" }`)).toEqual(`{ "k": "v" }`);
        expect(FN(`{ k_a: "v" }`)).toEqual(`{ "k_a": "v" }`);
        expect(FN(`{ "k": "v" }`)).toEqual(`{ "k": "v" }`);
        expect(FN(`{ 'k': "v" }`)).toEqual(`{ "k": "v" }`);
        expect(FN(`{ 'k': "v'a" }`)).toEqual(`{ "k": "v'a" }`);
        expect(FN(`{ 'k': "v\"a\"" }`)).toEqual(`{ "k": "v\"a\"" }`);
        expect(FN(`{ 'k': "v{a}" }`)).toEqual(`{ "k": "v{a}" }`);
        expect(FN(`{ 'k': "v'a'" }`)).toEqual(`{ "k": "v'a'" }`);
        expect(FN(`{ 'k:x': "v" }`)).toEqual(`{ "k:x": "v" }`);
        expect(FN(`{ "k:x": "v" }`)).toEqual(`{ "k:x": "v" }`);
        expect(FN(`{ "k:x": 2 }`)).toEqual(`{ "k:x": 2 }`);
        expect(FN(`{ "k:x": true }`)).toEqual(`{ "k:x": true }`);
    });
    it('adds quotes to keys with colon', () => {
        const input = `{ key: "value", "key2": "value2" }`;
        const result = FN(input);
        const EXPECTED = `{ "key": "value", "key2": "value2" }`;
        expect(result).toEqual(EXPECTED);
    });
    it('adds quotes to keys with colon', () => {
        const input = `{ key: "value", "key2:foo": "value2", key3: 2 }`;
        const result = FN(input);
        const EXPECTED = `{ "key": "value", "key2:foo": "value2", "key3": 2 }`;
        expect(result).toEqual(EXPECTED);
    });
});
describe('✅ addDoubleQuotesToValues()', () => {
    const FN = addDoubleQuotesToValues;
    it('adds double quotes to single quoted value', () => {
        const input = `{ "key2": true }`;
        const result = FN(input);
        const EXPECTED = `{ "key2": true }`;
        expect(result).toEqual(EXPECTED);
    });
    it('adds double quotes to single quoted value', () => {
        const input = `{ "key2": 'value:2', "key3": 'value3' }`;
        const result = FN(input);
        const EXPECTED = `{ "key2": "value:2", "key3": "value3" }`;
        expect(result).toEqual(EXPECTED);
    });
    it('adds double quotes to values', () => {
        const input = `{ key: "value", "key2": 'value:2', 'key3': 2, key4: true }`;
        const result = FN(input);
        const EXPECTED = `{ key: "value", "key2": "value:2", 'key3': 2, key4: true }`;
        expect(result).toEqual(EXPECTED);
    });
    it('adds double quotes to values with colon', () => {
        const input = `{ key: "value", key2: 'value2', key3: 2, key4: true, key5: { foo: 'bar' } }`;
        const result = FN(input);
        const EXPECTED = `{ key: "value", key2: "value2", key3: 2, key4: true, key5: { foo: "bar" } }`;
        expect(result).toEqual(EXPECTED);
    });
});
describe('✅ strToJSON', () => {
    const FN = strToJSON;
    it('valid JSON', () => {
        const input = `{"key": "value"}`;
        const result = FN(input);
        const EXPECTED = { data: { key: 'value' }, isValid: true };
        expect(result).toEqual(EXPECTED);
    });
    it('avoid fixing JSON', () => {
        const input = `{"key": 'value'}`;
        const result = FN(input, true);
        const EXPECTED = {
            data: input, // no changes
            isValid: false,
            error: `Unexpected token ''', "{"key": 'value'}" is not valid JSON`,
        };
        expect(result).toEqual(EXPECTED);
    });
    it('valid JSON', () => {
        const input = `{key: "value"}`;
        const result = FN(input);
        const EXPECTED = { data: { key: 'value' }, isValid: true };
        expect(result).toEqual(EXPECTED);
    });
    it('invalid JSON', () => {
        const input = `{key: "value"`;
        const result = FN(input);
        const EXPECTED = {
            data: input, // no changes
            isValid: false,
            error: `Expected ',' or '}' after property value in JSON at position 15 (line 1 column 16)`,
        };
        expect(result).toEqual(EXPECTED);
    });
});
describe('✅ convertNumber2String()', () => {
    const FN = convertNumber2String;
    it('should return number string for integer', () => {
        expect(FN(123)).toEqual('123');
        expect(FN(0)).toEqual('0');
        expect(FN(-1)).toEqual('-1');
    });
    it('should return number string for float', () => {
        expect(FN(123.456)).toEqual('123.456');
        expect(FN(0.123)).toEqual('0.123');
        expect(FN(-1.234)).toEqual('-1.234');
    });
    it('should return number string for negative float', () => {
        expect(FN(-123.456)).toEqual('-123.456');
        expect(FN(-0.123)).toEqual('-0.123');
        expect(FN(-1.234)).toEqual('-1.234');
    });
});
describe('🚧 convertLine2KeyValue()', () => {
    const FN = convert2KeyValue;
    describe('split line with colon', () => {
        it('should split line with simple key/value', () => {
            const INPUT = 'KEY: value';
            const EXPECTED = { key: 'KEY', value: 'value' };
            expect(FN(INPUT)).toEqual(EXPECTED);
        });
        it('should split line with multiple values', () => {
            const INPUT = 'KEY: multiple value';
            const EXPECTED = { key: 'KEY', value: 'multiple value' };
            expect(FN(INPUT)).toEqual(EXPECTED);
        });
        it('should split line with multiple values with colon', () => {
            const INPUT = 'KEY: multiple: value';
            const EXPECTED = { key: 'KEY', value: 'multiple: value' };
            expect(FN(INPUT)).toEqual(EXPECTED);
        });
        it('should split line with key with dash', () => {
            const INPUT = 'KEY-XX: value';
            const EXPECTED = { key: 'KEY-XX', value: 'value' };
            expect(FN(INPUT)).toEqual(EXPECTED);
        });
        it('should split line with key with dash and multiple values', () => {
            const INPUT = 'KEY-XX: multiple value';
            const EXPECTED = { key: 'KEY-XX', value: 'multiple value' };
            expect(FN(INPUT)).toEqual(EXPECTED);
        });
        it('should split line with key with dash and multiple values with colon', () => {
            const INPUT = 'KEY-XX: multiple: value';
            const EXPECTED = { key: 'KEY-XX', value: 'multiple: value' };
            expect(FN(INPUT)).toEqual(EXPECTED);
        });
    });
    describe('split line without colon', () => {
        it('should split line with simple key/value', () => {
            const INPUT = 'KEY value';
            const EXPECTED = { key: 'KEY', value: 'value' };
            expect(FN(INPUT)).toEqual(EXPECTED);
        });
        it('should split line with multiple values', () => {
            const INPUT = 'KEY multiple value';
            const EXPECTED = { key: 'KEY', value: 'multiple value' };
            expect(FN(INPUT)).toEqual(EXPECTED);
        });
        it('should split line with multiple values with colon', () => {
            const INPUT = 'KEY multiple: value';
            const EXPECTED = { key: 'KEY', value: 'multiple: value' };
            expect(FN(INPUT)).toEqual(EXPECTED);
        });
        it('should split line with key with dash', () => {
            const INPUT = 'KEY-XX value';
            const EXPECTED = { key: 'KEY-XX', value: 'value' };
            expect(FN(INPUT)).toEqual(EXPECTED);
        });
        it('should split line with key with dash and multiple values', () => {
            const INPUT = 'KEY-XX multiple value';
            const EXPECTED = { key: 'KEY-XX', value: 'multiple value' };
            expect(FN(INPUT)).toEqual(EXPECTED);
        });
        it('should split line with key with dash and multiple values with colon', () => {
            const INPUT = 'KEY-XX multiple: value';
            const EXPECTED = { key: 'KEY-XX', value: 'multiple: value' };
            expect(FN(INPUT)).toEqual(EXPECTED);
        });
        it('should split line with key with dash and multiple values with colon after first space', () => {
            const INPUT = 'KEY-XX multiple: value';
            const EXPECTED = { key: 'KEY-XX', value: 'multiple: value' };
            expect(FN(INPUT)).toEqual(EXPECTED);
        });
    });
});
describe('✅ convertKey2CamelCase()', () => {
    const FN = convertKey2CamelCase;
    it('should transform key', () => {
        expect(FN('HTTP/1.1')).toEqual('http/1.1');
        expect(FN('Location')).toEqual('location');
        expect(FN('location')).toEqual('location');
        expect(FN('Content-Type')).toEqual('contentType');
        expect(FN('content-type')).toEqual('contentType');
        expect(FN('X-Frame-Options')).toEqual('xFrameOptions');
    });
});
