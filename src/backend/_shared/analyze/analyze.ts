import { FILE_TREE } from './analyze.d';
const BLACKLIST = ['_shared', 'apps', 'backend', 'frontend', 'src'];

export const getDevFolder = (filePath: string): string => {
    const cleanPath = filePath.endsWith('/') ? filePath.slice(0, -1) : filePath;
    const folderParts = cleanPath.split('/').filter((p) => p !== '');
    const lastFolder = folderParts[folderParts.length - 1];
    return cleanPath.replace(`/${lastFolder}`, '');
};

export const analyzeFileTree = (
    files: string[],
    baseFolder: string
): FILE_TREE => {
    const result: FILE_TREE = {};
    const basePath = baseFolder.endsWith('/') ? baseFolder : `${baseFolder}/`;
    files.forEach((filePath) => {
        const parts = filePath.split('/').filter((p) => p !== '');
        const file = parts[parts.length - 1];
        const fileParts = file.split('.');
        let componentName = parts[parts.length - 2]; //.join('/');
        if (BLACKLIST.includes(componentName) === true && parts.length >= 3) {
            componentName = fileParts[0]; // take file name without extension
        }
        if (!result[componentName]) {
            result[componentName] = {
                component: componentName,
                files: [],
                folder: [],
            };
        }
        const folder = filePath.replace(basePath, '').replace(`/${file}`, '');
        if (result[componentName].folder.includes(folder) === false) {
            result[componentName].folder.push(folder);
        }
        let componentFilePath: string = '';
        for (const folderName of BLACKLIST) {
            if (folder.includes(`/${folderName}/`) === true) {
                const folderParts = folder.split(`/${folderName}/`);
                componentFilePath = `${folderParts[1]}/${file}`;
                break;
            }
        }
        result[componentName].files.push(componentFilePath);
    });
    return result;
};
