export type MATCHES = number[];
export type ACCURACY = number;
export type INDEX = number;
export type WordItem = {
    word: string;
    lowerWord: string;
    index: number;
    found: boolean;
    accuracy: ACCURACY;
};
