/**
 * 🧩 types for HTTP
 * @module backend/_shared/HTTP
 * @version 0.0.2
 * @date 2025-09-18
 * @lastModified 2025-10-15
 * @license MIT
 * @author Robert Willemelis <github.com/willi84>
 */
export type MOCKED_URL = { [key: string]: string };
export type MOCKED_URLS_TYPE = { [key: string]: MOCKED_URL };
export type MOCKED_RESPONSE = { [key: string]: string };
export type MOCKED_RESPONSES_TYPE = { [key: string]: MOCKED_RESPONSE };

export type $MOCK_VALUE = string | undefined;

type StringLike<T extends string> = string & { __brand?: T }; // avoid collision not working with build-in prototypes of a string (e.g. replace())

export type TLD = `${string}`;
export type SLD = `${string}`;
export type SUBDOMAIN = `${string}`;
export type HOSTNAME = StringLike<`${SUBDOMAIN | ''}${SLD}.${TLD}`>;
export type DOMAIN = `${SLD}.${TLD}`;
export type FQDN = `http${'s' | ''}://${DOMAIN}`; // fully qualified domain name
export type URL = StringLike<`${FQDN | DOMAIN}`>;
