// settings.d.ts is not allowed name
import { FileItem } from '../../../_shared/fs/fs.d';

export type STATS = {
    added: string[];
    unchanged: string[];
    notSupported: string[];
};
export type DETECTION_STATE = typeof DETECTION_STATES;

export type ICON_DETECTION = {
    file: FileItem;
    key: string;
    icon: string;
    state: DETECTION_STATE[keyof DETECTION_STATE];
};
export type ICON = {
    file: string;
    key: string;
};
