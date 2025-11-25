import { COORD } from '../endpoints/geo/geo.d';
export type ISSUE_CATEGORY = {
    id: number;
    createdAt: string;
};
export type PICTURE_ITEM = {
    id: number;
    createdAt: number;
    filename: string;
    fileCDNUrl: string;
    published: boolean;
};
export type CIVIC_ISSUE_STATE =
    | 'OPEN'
    | 'CLOSED'
    | 'NOT_RESPONSIBLE'
    | 'IN_PROCESS';
export type ADRESS_DETAILS = {
    place_id: string;
    licence: string;
    osm_type: string;
    osm_id: string;
    lat: string;
    lon: string;
    display_name: string;
    address: {
        road?: string;
        suburb?: string;
        city?: string;
        state?: string;
        postcode?: string;
        country?: string;
        country_code?: string;
        [key: string]: string | undefined;
    };
    boundingbox: [string, string, string, string];
};

export type CIVIC_ISSUE_ITEM = {
    createdAt: string;
    id: number;
    category: ISSUE_CATEGORY;
    coordinate: COORD;
    flawReport: {
        id: number;
        createdAt: string;
    };
    originalText: string;
    pictures: PICTURE_ITEM[];
    replaceingText: string;
    state: CIVIC_ISSUE_STATE;
};
export type CIVIC_ISSUE_EXTENDED_ITEM = CIVIC_ISSUE_ITEM & {
    streetID: string | null;
    streetName: string | null;
    address: ADRESS_DETAILS | null;
};
export type CIVIC_ISSUES_DATA = {
    items: CIVIC_ISSUE_ITEM[];
};
export type CIVIC_ISSUES_DATA_EXTENDED = {
    items: CIVIC_ISSUE_EXTENDED_ITEM[];
};
export type UPDATE_DATA = {
    issues: CIVIC_ISSUES_DATA_EXTENDED;
    coords: FOUND_COORDS;
};
