import { FS } from '../../../_shared/fs/fs';
import { LOG } from '../../../_shared/log/log';
import { ICON, ICON_DETECTION, STATS } from './setting.d';
import { DETECTION_STATES } from './setting.config';
import { FileItems, FileItem } from '../../../_shared/fs/fs.d';

const DOUBLE_FILE_EXTENSIONS = [
    'spec.ts',
    'test.ts',
    'test.js',
    'test.jsx',
    'test.tsx',
];
const FILE_TYPE = {
    typescript: ['ts', 'tsx'],
    javascript: ['js', 'jsx'],
    css: ['css'],
    markdown: ['md'],
    html: ['html'],
    json: ['json'],
    nunjucks: ['njk'],
    'test-ts': ['spec.ts', 'test.ts'],
    'test-js': ['test.js', 'test.jsx', 'test.tsx'],
};
const FILE_TYPES: { [key: string]: string } = {
    ts: 'typescript',
    'spec.ts': 'tests',
    css: 'css',
    md: 'markdown',
    html: 'html',
    json: 'json',
    js: 'javascript',
    njk: 'nunjucks',
};
const ATOMIC_TYPES = ['atom', 'molecule', 'organism', 'page', 'template'];

export const getFileExtension = (file: string): string => {
    const folderParts = file.split('/');
    const fileName = folderParts[folderParts.length - 1];
    const fileParts = fileName.split('.');
    if (fileParts.length < 2) {
        return 'unknown';
    }
    const last = fileParts[fileParts.length - 1];
    const preLast = fileParts[fileParts.length - 2];
    const type = last;
    const doubleType = `${preLast}.${last}`;
    if (DOUBLE_FILE_EXTENSIONS.indexOf(doubleType.toLowerCase()) > -1) {
        return doubleType;
    }
    return type;
};
export const getFolderParts = (file: string): string[] => {
    if (file === '') {
        return [];
    }
    const folderParts = file.split('/').filter((part) => part !== '');
    return folderParts;
};

export const getFileType = (file: string): string => {
    const folderParts = getFolderParts(file.toLowerCase());
    const fileName = folderParts[folderParts.length - 1];
    const fileParts = fileName.split('.');
    if (fileParts.length < 2) {
        return 'unknown';
    }
    const last = fileParts[fileParts.length - 1];
    const preLast = fileParts[fileParts.length - 2];
    const type = last;
    const doubleType = `${preLast}.${last}`;
    let result = undefined;
    for (const key in FILE_TYPE) {
        const typedKey = key as keyof typeof FILE_TYPE;
        const types = FILE_TYPE[typedKey];
        if (types.indexOf(doubleType) > -1) {
            result = key;
        } else if (types.indexOf(type) > -1) {
            result = key;
        }
    }
    return result || 'unknown';
};

export const getComponentType = (file: FileItem): string => {
    const isFolder = file.type === 'folder';
    const filePath = file.path;
    const folderParts = getFolderParts(filePath.toLowerCase());
    if (isFolder) {
        let folderType = 'unknown';
        const atomicFolderTypes = ATOMIC_TYPES.map((type) => `${type}s`);
        for (const part of folderParts) {
            const index = atomicFolderTypes.indexOf(part);
            if (index > -1) {
                folderType = ATOMIC_TYPES[index];
            }
        }
        return folderType;
    }

    const fileName = folderParts[folderParts.length - 1];
    if (!fileName) {
        return 'unknown';
    }
    const fileParts = fileName.split('.');
    let type = 'unknown';
    let len = fileParts.length;
    if (len < 3) {
        return type;
    } else {
        const type1 = fileParts[fileParts.length - 2];
        const type2 = fileParts[fileParts.length - 3];
        if (ATOMIC_TYPES.indexOf(type1) > -1) {
            type = type1;
        } else if (ATOMIC_TYPES.indexOf(type2) > -1) {
            type = type2;
        }
    }
    return type;
};

export const analyzeComponents = (
    files: FileItems,
    icons: ICON[],
    settings: any
) => {
    const result: ICON_DETECTION[] = [];
    files.forEach((fileItem: FileItem) => {
        const isFolder = fileItem.type === 'folder';
        // if (fileItem.type !== 'file') {
        //     // only files are supported
        //     return;
        // }
        const file = fileItem.path;
        const folderParts = getFolderParts(file);
        const lastFolder = folderParts[folderParts.length - 1];
        const fileName = FS.getFileName(file);
        const componentType = getComponentType(fileItem);
        const fileType = getFileExtension(fileName).toLowerCase();
        const key = isFolder ? lastFolder : `*.${componentType}.${fileType}`;
        const iconPrefix = isFolder ? fileItem.type : getFileType(fileName);
        let iconName: string = `${iconPrefix}-${componentType}`;
        const newFileItem: FileItem = {
            type: fileItem.type,
            path: fileItem.path.replace(/\/$/, ''), // remove trailing slash if exists
        };
        const icon =
            icons
                .map((icon) => icon.key)
                .filter((iconKey) => iconKey === iconName)[0] || undefined;
        if (!icon) {
            // no icon found
            result.push({
                file: newFileItem,
                key: key,
                icon: iconName,
                state: DETECTION_STATES.NOT_SUPPORTED,
            });
        } else if (!settings[key]) {
            result.push({
                file: newFileItem,
                key: key,
                icon: iconName,
                state: DETECTION_STATES.ADDED,
            });
        } else {
            result.push({
                file: newFileItem,
                key: key,
                icon: iconName,
                state: DETECTION_STATES.UNCHANGED,
            });
        }
    });
    return result;
};
const addSetting = (
    settings: any,
    icons: ICON[],
    component: ICON_DETECTION
) => {
    const key: string = component.key;
    if (!settings[key]) {
        const detected = icons
            .filter((icon) => icon.key === component.icon)
            .map((icon) => icon.file);
        settings[key] = `${detected[0]}`;
    }
};

export const getNewSettings = (
    icons: ICON[],
    componentDetections: ICON_DETECTION[]
): any => {
    const settings: any = {};
    const stats: STATS = { added: [], unchanged: [], notSupported: [] };
    for (const component of componentDetections) {
        const key: string = component.key;
        if (component.state === DETECTION_STATES.ADDED) {
            addSetting(settings, icons, component);
            stats.added.push(key);
        } else if (component.state === DETECTION_STATES.UNCHANGED) {
            addSetting(settings, icons, component);
            stats.unchanged.push(key);
        } else if (component.state === DETECTION_STATES.NOT_SUPPORTED) {
            stats.notSupported.push(key);
        }
    }
    return { settings, stats };
};
