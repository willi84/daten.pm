import { PlainObject } from '../index.d';

export type PropertyCheck = {
    missing: string[];
    extra: string[];
    different: string[];
    same: string[];
    status: boolean;
};

export type ITEM = PlainObject;
export type PROPS = string[];

export type COMPARE_STATE = string;

export type ValueItem = {
    key: string;
    expected: any;
    received: any;
    state: COMPARE_STATE;
    accuracy: number;
};
export type ValueItems = ValueItem[][];

export type MatchItem = {
    index: number;
    accuracy: number;
    values: ValueItem[];
    state: COMPARE_STATE;
};
export type FoundItem = {
    index: number;
    accuracy: number;
    value: any;
    state: COMPARE_STATE;
};

export type diffItem = {
    key: string;
    expected: any;
    received: any;
    state: COMPARE_STATE;
};

export type diffItems = diffItem[];

export type CustomMatchStatus = {
    // diff: diffItems;
    expected: any;
    received: any;
    found: MatchItem[];
    pass: boolean;
    // state: COMPARE_STATE;
};
export type MatchStatus = {
    message: string;
    pass: boolean;
    matchingItems?: MatchItem[];
};

export type SIMILIARITY = DIFF | EQUAL | TYPE | VALUE | CASE | SPACES | null;
export type StringCompare = {
    level: number;
    status: string;
    accuracy: number; // 0-100%
};

export type SIMPLE_VALUE = string | number | boolean | null | undefined;
export type CUSTOM_MATCHER = { message: () => string; pass: boolean };
