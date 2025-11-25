/**
 * 🧪 Testing module tools
 * @module backend/_shared/TOOLS
 * @version 0.0.1
 * @date 2025-09-18
 * @license MIT
 * @author Robert Willemelis <github.com/willi84>
 */

import { DOM } from './tools.d';
import { clone, getFlagValue, isObject, selectAll, substitute } from './tools';
import {
    deepMerge,
    detectType,
    detectTypeFromString,
    replaceAll,
    select,
} from './tools';

describe('✅ detectTypeFromString()', () => {
    const FN = detectTypeFromString;
    it('detect boolean', () => {
        expect(FN('true')).toEqual('boolean');
        expect(FN('false')).toEqual('boolean');
        expect(FN('TrUE')).toEqual('boolean');
        expect(FN('False ')).toEqual('boolean');
    });
    it('detect string', () => {
        expect(FN('Ein String ')).toEqual('string');
        expect(FN('a false positive ')).toEqual('string');
    });
    it('check integer', () => {
        expect(FN('3.x')).toEqual('string');
        expect(FN('3')).toEqual('number');
        expect(FN('3.3')).toEqual('number');
        // false positive
        expect(FN('I haxve 3.3 bla')).toEqual('string');
    });
    it('check error', () => {
        expect(FN('[1,2]')).toEqual('string');
    });
});
describe('✅ detectType()', () => {
    const FN = detectType;
    it('detects primitives', () => {
        expect(FN(3.2)).toEqual('number');
        expect(FN(3)).toEqual('number');
        expect(FN(true)).toEqual('boolean');
        expect(FN('true')).toEqual('string');
    });
    it('detects object', () => {
        expect(FN({})).toEqual('object');
        expect(FN({ xx: 'foo', yy: 3, zz: true })).toEqual('object');
    });
    it('detects array', () => {
        expect(FN([])).toEqual('array');
    });
});

describe('✅ replaceAll()', () => {
    const FN = replaceAll;
    it('replace single item', () => {
        const input = 'Das ist ein Test.';
        const output = 'Das dort ein Test.';
        expect(FN(input, 'ist', 'dort')).toEqual(output);
    });
    it('NOT replace single item', () => {
        const input = 'Das sei ein Test.';
        const output = 'Das sei ein Test.';
        expect(FN(input, 'ist', 'dort')).toEqual(output);
    });
    it('replace detected items', () => {
        const input = 'Das ist ein doppeltes ist hier.';
        const output = 'Das dort ein doppeltes dort hier.';
        expect(FN(input, 'ist', 'dort')).toEqual(output);
    });
});
describe('✅ deepMerge()', () => {
    const FN = deepMerge;
    it('merges two objects', () => {
        const target = { a: 1, b: { c: 2 } };
        const source = { b: { d: 3 }, e: 4 };
        const expected = { a: 1, b: { c: 2, d: 3 }, e: 4 };
        expect(FN(target, source)).toEqual(expected);
    });
    it('handles null and undefined', () => {
        expect(FN(null, { a: 1 })).toEqual({ a: 1 });
        expect(FN({ a: 1 }, null)).toEqual({ a: 1 });
        expect(FN(undefined, { a: 1 })).toEqual({ a: 1 });
        expect(FN({ a: 1 }, undefined)).toEqual({ a: 1 });
        expect(FN(null, null)).toEqual(null);
        expect(FN(undefined, undefined)).toEqual(undefined);
        expect(FN(null, undefined)).toEqual(undefined);
        expect(FN(2, 3)).toEqual(3);
        expect(FN('test', 'test2')).toEqual('test2');
        expect(FN(2, 'test')).toEqual('test');
        expect(FN([2], [3])).toEqual([3]);
        expect(FN([2], 'test')).toEqual('test');
    });
});
describe('✅ isObject()', () => {
    const FN = isObject;
    it('detects objects', () => {
        expect(FN({})).toBe(true);
        expect(FN({ a: 1 })).toBe(true);
        expect(FN([])).toBe(false);
        expect(FN(null)).toBe(false);
        expect(FN(undefined)).toBe(false);
        expect(FN(3)).toBe(false);
        expect(FN('test')).toBe(false);
    });
    it('detects non-objects', () => {
        expect(FN(null)).toBe(false);
        expect(FN(undefined)).toBe(false);
        expect(FN(3)).toBe(false);
        expect(FN('test')).toBe(false);
    });
});
describe('✅ clone()', () => {
    const FN = clone;
    it('clones primitives', () => {
        expect(FN(3)).toBe(3);
        expect(FN('test')).toBe('test');
        expect(FN(true)).toBe(true);
        expect(FN(null)).toBe(null);
        expect(FN(undefined)).toBe(undefined);
    });
    it('clones objects', () => {
        const obj = { a: 1, b: { c: 2 } };
        const cloned = FN(obj);
        expect(cloned).toEqual(obj);
        expect(cloned).not.toBe(obj);
        cloned.b.c = 3;
        expect(obj.b.c).toBe(2); // Original bleibt unverändert
    });
    it('clones arrays', () => {
        const arr = [1, 2, { a: 3 }];
        const cloned = FN(arr);
        expect(cloned).toEqual(arr);
        expect(cloned).not.toBe(arr);
        cloned[2].a = 4;
        // expect(arr[2]?.a).toBe(3); // Original bleibt unverändert
    });
});

const HTML = `
        <div class="container">
         <div class="item" data-id="1">Item 1</div>
         <div class="item" data-id="2">Item 2</div>
         <div class="item" data-id="3">Item 3</div>
         <div class="item" data-id="4">Item 4</div>
        </div>
    `;

describe('✅ select()', () => {
    let dom: DOM;
    const FN = select;
    beforeEach(() => {
        document.body.innerHTML = HTML;
        dom = document.body as unknown as DOM;
    });
    afterEach(() => {
        document.body.innerHTML = ''; // Reset zwischen Tests
    });

    it('selects correct dom without target', () => {
        expect(FN('.item')?.innerHTML).toEqual('Item 1');
    });
    it('selects correct dom without target', () => {
        expect(FN('.item', dom)?.innerHTML).toEqual('Item 1');
    });
    it('selects no dom', () => {
        expect(FN('.nonexistent', dom)).toBeNull();
    });
});
describe('✅ selectAll()', () => {
    let dom: DOM;
    const FN = selectAll;
    beforeEach(() => {
        document.body.innerHTML = HTML;
        dom = document.body as unknown as DOM;
    });
    afterEach(() => {
        document.body.innerHTML = ''; // Reset zwischen Tests
    });
    it('selects all correct doms without target', () => {
        expect(FN('.item').length).toEqual(4);
        expect(FN('.item')[0].innerHTML).toEqual('Item 1');
    });
    it('selects all correct doms with target', () => {
        expect(FN('.item', dom).length).toEqual(4);
        expect(FN('.item')[0].innerHTML).toEqual('Item 1');
    });
    it('selects no doms', () => {
        expect(FN('.nonexistent', dom).length).toEqual(0);
    });
});
describe('✅ substitue()', () => {
    const FN = substitute;
    it('substitues values in string', () => {
        const template = 'Hello {name}! Welcome 2 {place}.';
        const values = { name: 'Alice', place: 'Wonderland' };
        expect(FN(template, values)).toBe('Hello Alice! Welcome 2 Wonderland.');
    });
    it('substitues missing values in string', () => {
        const template = 'Hello, {name}! Welcome to {place}.';
        const values = { name: 'Bob' };
        expect(FN(template, values)).toBe('Hello, Bob! Welcome to {place}.');
    });
    it('stringifies non-string replacements', () => {
        const template = '{count} Einträge aktiv={active}';
        const values = { count: 3, active: false };
        expect(substitute(template, values)).toBe('3 Einträge aktiv=false');
    });
});
describe('✅ getFlagValue()', () => {
    const FN = getFlagValue;
    it('returns currentValue when newValue is undefined', () => {
        expect(FN(undefined, 'current')).toBe('current');
        expect(FN(undefined, 42)).toBe(42);
        expect(FN(undefined, false)).toBe(false);
    });
    it('returns newValue when it is defined', () => {
        expect(FN('new', 'current')).toBe('new');
        expect(FN(100, 42)).toBe(100);
        expect(FN(true, false)).toBe(true);
        expect(FN(null, 'current')).toBe(null);
    });
});
