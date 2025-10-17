import { COMPARE_STATE } from './item.d';

export const CompareState: { [key: string]: COMPARE_STATE } = {
    MISS: 'missing',
    EXTRA: 'extra',
    DIFF: 'different',
    EQUAL: 'equal',
    CONGRUENT: 'congruent',
    TYPE: 'type', // different type
    PLACEHOLDER: 'placeholder', // placeholder match
    VALUE: 'value', // different value
    CASE: 'case', // different case
    SPACES: 'spaces', // different spaces
    MIXED: 'mixed', // different type
};
export const MISS: COMPARE_STATE = CompareState.MISS;
export const EXTRA: COMPARE_STATE = CompareState.EXTRA;
export const DIFF: COMPARE_STATE = CompareState.DIFF;
export const EQUAL: COMPARE_STATE = CompareState.EQUAL;
export const CONGRUENT: COMPARE_STATE = CompareState.CONGRUENT;
export const TYPE: COMPARE_STATE = CompareState.TYPE;
export const VALUE: COMPARE_STATE = CompareState.VALUE;
export const CASE: COMPARE_STATE = CompareState.CASE;
export const SPACES: COMPARE_STATE = CompareState.SPACES;
export const MIXED: COMPARE_STATE = CompareState.MIXED;
export const PLACEHOLDER: COMPARE_STATE = CompareState.PLACEHOLDER;

export const MatchLevel = {
    EXACT: 1, // exact match
    NEARLY: 2, // no case and missing spaces and wrong type (string/number/boolean)
    PARTIAL: 3, // partial match
    // DIFF: 4, // different
};

export const EXACT = MatchLevel.EXACT;
export const NEARLY = MatchLevel.NEARLY;
export const PARTIAL = MatchLevel.PARTIAL;
// export const LEVEL_DIFF = MatchLevel.DIFF;

export const CONGRUENT_VALUE = 50; // 50%
