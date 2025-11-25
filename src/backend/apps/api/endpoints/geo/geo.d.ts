export type COORD = {
    latitude: number;
    longitude: number;
};
export type ADDRESS = {
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
export type ADDRESS_ITEM = {
    address: ADDRESS | null;
    id: string;
    count: number;
};
export type GEO_ID = `${number}-${number}`;
export type FOUND_COORDS = {
    [key: string]: ADDRESS_ITEM;
};

export type UPDATE_COORD_RESULT = {
    state: 'found' | 'not_found' | 'cached';
    request: number;
};
