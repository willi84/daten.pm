import { PlainObject } from './../../../index.d';
import { ITEM, PROPS } from './../item.d';

export const hasAllProps = (items: ITEM[], props: PROPS): boolean => {
    let hasAll = true;
    for (const item of items) {
        for (const prop of props) {
            if (item[prop] === undefined) {
                hasAll = false;
                // break;
            }
        }
    }
    return hasAll;
};
export const getProps = (item: ITEM, allKeys: string[]): string[] => {
    const keys = Object.keys(item);
    for (const key of keys) {
        if (!allKeys.includes(key)) {
            allKeys.push(key);
        }
    }
    return allKeys;
};

export const getAllProps = (obj1: PlainObject, obj2: PlainObject): string[] => {
    const allKeys: string[] = getProps(obj1, []);
    const subKeys2 = getProps(obj2, allKeys);
    // getProps(obj1, allKeys);
    // getProps(obj2, allKeys);
    return subKeys2;
};
