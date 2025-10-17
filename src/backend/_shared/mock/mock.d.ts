export type RETRY_DATA = {
    [key: string]: {
        [key: number]: number;
    };
};
export type FLAKY_SCENARIO = Array<number[]>;
export type MOCK_ITEM = {
    id: number;
    name: string;
};
