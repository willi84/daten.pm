export type ITEM = {
    key: string;
    value: string;
};
export type HTTPStatusBase = {
    protocol: string;
    protocolVersion: string;
    status: string;
    statusMessage: string;
    server: string;
    date: string;
    contentType: string;
    // Define other common properties here
    [key: string]: string;
};

export type HTTP_STATUS = HTTPStatusBase & {
    // Define specific properties for status code 200
    contentLength: string;
    lastModified: string;
};

export type HTTP_STATUS_300 = HTTPStatusBase & {
    // Define specific properties for status code 300
    location: string;
};
export type HTTP_OBJECTS = {
    [key: string]: HTTPStatusBase;
};
export type IMAGE_UPDATE = {
    url: string;
    httpItem: HTTPStatusBase;
};
export type ERROR_TYPE = number;

// test for object but not includes array
export type PlainObject<T = unknown> = Record<string, T> & {
    [n: number]: never;
};
export type OPTS = {
    [key: string]: any;
};
export type JSON = {
    [key: string]: any;
};
export type LOW_STR<S extends string> = S extends LOW_STR<S> ? S : never;
export type UP_STR<S extends string> = S extends Uppercase<S> ? S : never;
// export type MIX_STR<S extends string> =
//     S extends Lowercase<S> ? never : S extends Uppercase<S> ? never : S;

export type MIX_STR = string & { __brand: 'MixedCase' };
export type NumericString = string & { readonly __type: 'NumericString' };

function toMixedCase(str: string): MIX_STR {
    if (str.toLowerCase() === str) throw new Error('Lowercase only');
    if (str.toUpperCase() === str) throw new Error('Uppercase only');
    return str as MIX_STR;
}
export type HeaderItem = HTTPStatusBase | {};
export type CurlItem = {
    header: HeaderItem;
    content: string;
    status: string;
    success: boolean;
    time?: number; // Optional, for performance measurement
};
export type KEY_VALUE = {
    key: string;
    value: string;
};
