import { FS } from '../../_shared/fs/fs';
import { LOG } from '../../_shared/log/log';

// icons: C:\Users\Robert Willemelis\.vscode\extensions\icons

const FRONTEND = 'src/frontend';
const COMPONENTS = `${FRONTEND}/components`;
const PAGES = `${FRONTEND}/pages`;
const TEMPLATES = `${FRONTEND}/templates`;
const SETTINGS_FILE = '.vscode/settings.json';
const CSS_INDEX_FILE = 'src/frontend/_framework/css/index.css';
const AUTO_START = '/* AUTO-COMPONENT-CSS-START */';
const AUTO_END = '/* AUTO-COMPONENT-CSS-END */';

const getNewFolderSettings = (settings: any, folderPath: string, typePath: string, iconPath: string) => {
    if(folderPath.includes(typePath)){
        const subFolder = folderPath.split('/')[folderPath.split('/').length - 1];
        console.log(settings);
        if(!settings['material-icon-theme.folders.associations'][subFolder]){
            settings['material-icon-theme.folders.associations'][subFolder] = iconPath;
            LOG.OK(`Added ${subFolder} to settings`);
        }
    }
}

// read vscode settings file and get the value of the key
const vscodeSettings = FS.readFile(SETTINGS_FILE);
// if(vscodeSettings){
//     try {

//         const settings = JSON.parse(vscodeSettings);

//         // file list of src/frontend
//         const folderList = FS.list(FRONTEND).filter((folder: any) => folder.type === 'folder');
//         for(const folder of folderList){
//             if(folder.path.indexOf(`${COMPONENTS}/`) !== -1){
//                 getNewFolderSettings(settings, folder.path, `${COMPONENTS}/atoms/`, `${ICON_FOLDER}/folder-atom`);
//                 getNewFolderSettings(settings, folder.path, `${COMPONENTS}/molecules/`, `${ICON_FOLDER}/folder-molecule`);
//                 getNewFolderSettings(settings, folder.path, `${COMPONENTS}/organisms/`, `${ICON_FOLDER}/folder-organism`);
//             } else if(folder.path.indexOf(`${PAGES}/`) !== -1){
//                 getNewFolderSettings(settings, folder.path, `${PAGES}/`, `${ICON_FOLDER}/folder-page`);
//             } else if(folder.path.indexOf(`${TEMPLATES}/`) !== -1){
//                 getNewFolderSettings(settings, folder.path, `${TEMPLATES}/`, `${ICON_FOLDER}/folder-template`);
//             }
//         }
//         // FS.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 4));
//         LOG.OK('Settings updated');
//     } catch (e) {
//         LOG.FAIL(`${e}`);
//     }
// };


// const syncComponentCSSImports = () => {
//     const cssFiles = readFilesRecursively(COMPONENTS)
//         .filter((file: any) => file.type === 'file' && file.path.endsWith('.css'));

//     const importLines = cssFiles.map((file: any) => {
//         const relativePath = './' + file.path.replace(FRONTEND + '/', '').replace(/\\/g, '/');
//         return `@import "${relativePath}";`;
//     });

//     // filter importLines if they already exist in the CSS index file
//     const existingContent = readFile(CSS_INDEX_FILE) || '';
//     for (const line of importLines) {
//         if (existingContent.includes(line)) {
//             LOG(WARNING, `Skipping existing import: ${line}`);
//             importLines.splice(importLines.indexOf(line), 1);
//         }
//     }
//     if (importLines.length === 0) {
//         LOG(OK, 'No new CSS imports to add.');
//         return;
//     }
//     const newBlock = [AUTO_START, ...importLines, AUTO_END].join('\n') + '\n';

//     let content = readFile(CSS_INDEX_FILE) || '';

//     if (!content.includes(AUTO_START) || !content.includes(AUTO_END)) {
//         LOG(ERROR, `Missing ${AUTO_START} or ${AUTO_END} in ${CSS_INDEX_FILE}`);

//         // add at the beginning
//         content = `${AUTO_START}\n${AUTO_END}\n` + content;

//     }

//     // Regex ersetzt den Block zwischen den Markern
//     const updatedContent = content.replace(
//         new RegExp(`${AUTO_START}[\\s\\S]*?${AUTO_END}`, 'g'),
//         newBlock.trim()
//     ) + '\n';

//     if (updatedContent !== content) {
//         writeFileSync(CSS_INDEX_FILE, updatedContent);
//         LOG(OK, `CSS imports updated in ${CSS_INDEX_FILE}`);
//     } else {
//         LOG(OK, 'CSS import block is already up-to-date');
//     }
// };

// syncComponentCSSImports();
