// import * as mock from 'mock-fs';
import {
    analyzeComponents,
    getNewSettings,
    getComponentType,
    getFileExtension,
    getFileType,
    getFolderParts,
} from './setting';
import { DETECTION_STATES } from './setting.config';
import { ICON, ICON_DETECTION } from './setting.d';
import { LOG } from '../../../_shared/log/log';
import * as readline from 'readline';
import path from 'path';
import { FileItems, FileItem } from '../../../_shared/fs/fs.d';

const KEYS = {
    ID_ATOM_TS: '*.atom.ts',
    ID_MOLECULE_TS: '*.molecule.ts',
    ID_ATOM_CSS: '*.atom.css',
    ID_ATOM_FOO: '*.atom.foo',
    ID_FOLDER: 'button',
};
const BTN = 'button';
const FILE: { [key: string]: FileItem } = {
    btn_atom_folder: {
        path: `components/atoms/${BTN}`,
        type: 'folder',
    },
    btn_atom_folder2: {
        path: `components/atoms/${BTN}/`,
        type: 'folder',
    },
    empty: {
        path: '',
        type: 'file',
    },
    btn_ts: {
        path: `components/${BTN}/${BTN}.ts`,
        type: 'file',
    },
    atom_ts: {
        path: `components/atoms/${BTN}/atom.ts`,
        type: 'file',
    },
    btn_atom_tsx: {
        path: `components/atoms/${BTN}/${BTN}.atom.tsx`,
        type: 'file',
    },
    btn_atom_spec_ts: {
        path: `components/atoms/${BTN}/${BTN}.atom.spec.ts`,
        type: 'file',
    },
    btn_atom_ts: {
        path: `components/atoms/${BTN}/${BTN}.atom.ts`,
        type: 'file',
    },
    btn_bb_atom_ts: {
        path: `components/atoms/${BTN}/${BTN}.bb.atom.ts`,
        type: 'file',
    },
    btn_atom_css: {
        path: `components/atoms/${BTN}/${BTN}.atom.css`,
        type: 'file',
    },
    btn_atom_foo: {
        path: `components/atoms/${BTN}/${BTN}.atom.foo`,
        type: 'file',
    },
    btn_molecule_ts: {
        path: `components/molecules/${BTN}/${BTN}.molecule.ts`,
        type: 'file',
    },
    btn_organism_ts: {
        path: `components/organisms/${BTN}/${BTN}.organism.ts`,
        type: 'file',
    },
    btn_page_njk: {
        path: `components/pages/${BTN}/${BTN}.page.njk`,
        type: 'file',
    },
    btn_template_njk: {
        path: `components/templates/${BTN}/${BTN}.template.njk`,
        type: 'file',
    },
};
const ICON_FOLDER = '../../../../icons';
describe('SETTINGS', () => {
    describe('getFileExtension()', () => {
        it('should return the file extension of single extension', () => {
            const file = `foo/${BTN}`;
            expect(getFileExtension(`${file}.atom.ts`)).toEqual('ts');
            expect(getFileExtension(`${file}.atom.TS`)).toEqual('TS');
        });
        it('should return the file extension of double extension', () => {
            const file = `foo/${BTN}`;
            expect(getFileExtension(`${file}.atom.spec.ts`)).toEqual('spec.ts');
            expect(getFileExtension(`${file}.atom.test.ts`)).toEqual('test.ts');
            expect(getFileExtension(`${file}.atom.TEST.js`)).toEqual('TEST.js');
        });
    });
    describe('getFolderParts()', () => {
        it('should return an empty array for an empty string', () => {
            expect(getFolderParts('')).toEqual([]);
        });
        it('should return an array of folder parts', () => {
            const file = `foo/${BTN}`;
            expect(getFolderParts(`${file}.atom.ts`)).toEqual([
                'foo',
                `${BTN}.atom.ts`,
            ]);
            expect(getFolderParts(`${file}`)).toEqual(['foo', BTN]);
            expect(getFolderParts(`${file}/`)).toEqual(['foo', BTN]);
        });
    });
    describe('getFileType()', () => {
        it('should return the file extension of single extension', () => {
            const file = `foo/${BTN}`;
            expect(getFileType(`${file}.atom.ts`)).toEqual('typescript');
            expect(getFileType(`${file}.atom.TS`)).toEqual('typescript');
            expect(getFileType(`${file}.atom.css`)).toEqual('css');
            expect(getFileType(`${file}.atom.md`)).toEqual('markdown');
            expect(getFileType(`${file}.atom.html`)).toEqual('html');
            expect(getFileType(`${file}.atom.json`)).toEqual('json');
            expect(getFileType(`${file}.atom.njk`)).toEqual('nunjucks');
            expect(getFileType(`${file}.atom.js`)).toEqual('javascript');
            expect(getFileType(`${file}.atom.foo`)).toEqual('unknown');
            expect(getFileType(`${file}`)).toEqual('unknown');
        });
        it('should return the file extension of double extension', () => {
            const file = `foo/${BTN}`;
            expect(getFileType(`${file}.atom.spec.ts`)).toEqual('test-ts');
            expect(getFileType(`${file}.atom.test.ts`)).toEqual('test-ts');
            expect(getFileType(`${file}.atom.TEST.js`)).toEqual('test-js');
        });
    });
    describe('getComponentType()', () => {
        it('should return the standard types', () => {
            expect(getComponentType(FILE.btn_atom_ts)).toEqual('atom');
            expect(getComponentType(FILE.btn_molecule_ts)).toEqual('molecule');
            expect(getComponentType(FILE.btn_organism_ts)).toEqual('organism');
            expect(getComponentType(FILE.btn_page_njk)).toEqual('page');
            expect(getComponentType(FILE.btn_template_njk)).toEqual('template');
        });
        it('should handle special types', () => {
            expect(getComponentType(FILE.btn_ts)).toEqual('unknown');
            expect(getComponentType(FILE.empty)).toEqual('unknown');
            expect(getComponentType(FILE.atom_ts)).toEqual('unknown');
        });
        it('should return the standard types from uppercase', () => {
            const fileItem: FileItem = {
                path: `FOO/${BTN.toUpperCase()}.ATOM.ts`,
                type: 'file',
            };
            expect(getComponentType(fileItem)).toEqual('atom');
        });
        it('should handle different file endings', () => {
            expect(getComponentType(FILE.btn_atom_tsx)).toEqual('atom');
            expect(getComponentType(FILE.btn_atom_spec_ts)).toEqual('atom');
            expect(getComponentType(FILE.btn_bb_atom_ts)).toEqual('atom');
        });
    });
    describe('analyzeComponents()', () => {
        const ICONS: ICON[] = [
            {
                file: `${ICON_FOLDER}/typescript-atom`,
                key: 'typescript-atom',
            },
            {
                file: `${ICON_FOLDER}/typescript-molecule`,
                key: 'typescript-molecule',
            },
            {
                file: `${ICON_FOLDER}/css-atom`,
                key: 'css-atom',
            },
            {
                file: `${ICON_FOLDER}/folder-atom`,
                key: 'folder-atom',
            },
        ];
        const ICON_KEYS = {
            ID_ATOM_TS: 'typescript-atom',
            ID_MOLECULE_TS: 'typescript-molecule',
            ID_ATOM_CSS: 'css-atom',
            ID_ATOM_FOO: 'unknown-atom',
            ID_ATOM_FOLDER: 'folder-atom',
        };
        describe('different component types', () => {
            it('should add atom file of type to settings', () => {
                const FILES = [FILE.btn_atom_ts];
                const settings = {};
                const components = analyzeComponents(FILES, ICONS, settings);
                const EXPECTED = [
                    {
                        file: FILE.btn_atom_ts,
                        key: KEYS.ID_ATOM_TS,
                        icon: ICON_KEYS.ID_ATOM_TS,
                        state: DETECTION_STATES.ADDED,
                    },
                ];
                expect(components).toEqual(EXPECTED);
            });
            it('should add atom folder of type to settings', () => {
                const FILES = [FILE.btn_atom_folder];
                const settings = {};
                const components = analyzeComponents(FILES, ICONS, settings);
                const EXPECTED = [
                    {
                        file: FILE.btn_atom_folder,
                        key: KEYS.ID_FOLDER,
                        icon: ICON_KEYS.ID_ATOM_FOLDER,
                        state: DETECTION_STATES.ADDED,
                    },
                ];
                expect(components).toEqual(EXPECTED);
            });
            it('should add atom folder of type to settings', () => {
                const FILES = [FILE.btn_atom_folder2];
                const settings = {};
                const components = analyzeComponents(FILES, ICONS, settings);
                const EXPECTED = [
                    {
                        file: FILE.btn_atom_folder,
                        key: KEYS.ID_FOLDER,
                        icon: ICON_KEYS.ID_ATOM_FOLDER,
                        state: DETECTION_STATES.ADDED,
                    },
                ];
                expect(components).toEqual(EXPECTED);
            });
            it('should add atom folder and file', () => {
                const FILES = [FILE.btn_atom_folder, FILE.btn_atom_ts];
                const settings = {};
                const components = analyzeComponents(FILES, ICONS, settings);
                const EXPECTED = [
                    {
                        file: FILE.btn_atom_folder,
                        key: KEYS.ID_FOLDER,
                        icon: ICON_KEYS.ID_ATOM_FOLDER,
                        state: DETECTION_STATES.ADDED,
                    },
                    {
                        file: FILE.btn_atom_ts,
                        key: KEYS.ID_ATOM_TS,
                        icon: ICON_KEYS.ID_ATOM_TS,
                        state: DETECTION_STATES.ADDED,
                    },
                ];
                expect(components).toEqual(EXPECTED);
            });
            it('should add molecule file of type to settings', () => {
                const FILES = [FILE.btn_molecule_ts];
                const settings = {};
                const components = analyzeComponents(FILES, ICONS, settings);
                const EXPECTED = [
                    {
                        file: FILE.btn_molecule_ts,
                        key: KEYS.ID_MOLECULE_TS,
                        icon: ICON_KEYS.ID_MOLECULE_TS,
                        state: DETECTION_STATES.ADDED,
                    },
                ];
                expect(components).toEqual(EXPECTED);
            });
        });
        describe('different file types', () => {
            it('should add atom file of type to settings', () => {
                const FILES = [FILE.btn_atom_ts];
                const settings = {};
                const components = analyzeComponents(FILES, ICONS, settings);
                const EXPECTED = [
                    {
                        file: FILE.btn_atom_ts,
                        key: KEYS.ID_ATOM_TS,
                        icon: ICON_KEYS.ID_ATOM_TS,
                        state: DETECTION_STATES.ADDED,
                    },
                ];
                expect(components).toEqual(EXPECTED);
            });
            it('should add atom file of type to settings', () => {
                const FILES: FileItems = [FILE.btn_atom_css];
                const settings = {};
                const components = analyzeComponents(FILES, ICONS, settings);
                const EXPECTED = [
                    {
                        file: FILE.btn_atom_css,
                        key: KEYS.ID_ATOM_CSS,
                        icon: ICON_KEYS.ID_ATOM_CSS,
                        state: DETECTION_STATES.ADDED,
                    },
                ];
                expect(components).toEqual(EXPECTED);
            });
            it('should ignore unknown file-types', () => {
                const FILES: FileItems = [FILE.btn_atom_foo];
                const settings = {};
                const components = analyzeComponents(FILES, ICONS, settings);
                const EXPECTED = [
                    {
                        file: FILE.btn_atom_foo,
                        key: KEYS.ID_ATOM_FOO,
                        icon: ICON_KEYS.ID_ATOM_FOO,
                        state: DETECTION_STATES.NOT_SUPPORTED,
                    },
                ];
                expect(components).toEqual(EXPECTED);
            });
        });
        it('should not add file type if already exists', () => {
            const ICON = ICON_KEYS.ID_ATOM_TS;
            const KEY = KEYS.ID_ATOM_TS;
            const FILES: FileItems = [FILE.btn_atom_ts];
            const settings = { [KEY]: `${ICON_FOLDER}/${ICON}` };
            const components = analyzeComponents(FILES, ICONS, settings);
            const EXPECTED = [
                {
                    file: FILE.btn_atom_ts,
                    key: KEYS.ID_ATOM_TS,
                    icon: ICON_KEYS.ID_ATOM_TS,
                    state: DETECTION_STATES.UNCHANGED,
                },
            ];
            expect(components).toEqual(EXPECTED);
        });
    });
    describe('getNewSettings()', () => {
        const ICONS: ICON[] = [
            {
                file: `${ICON_FOLDER}/typescript-atom`,
                key: 'typescript-atom',
            },
            {
                file: `${ICON_FOLDER}/typescript-molecule`,
                key: 'typescript-molecule',
            },
            {
                file: `${ICON_FOLDER}/css-atom`,
                key: 'css-atom',
            },
        ];

        const COMPONENT_DETECTIONS: ICON_DETECTION[] = [
            {
                file: FILE.btn_atom_ts,
                key: '*.atom.ts',
                icon: 'typescript-atom',
                state: DETECTION_STATES.ADDED,
            },
            {
                file: FILE.btn_molecule_ts,
                key: '*.molecule.ts',
                icon: 'typescript-molecule',
                state: DETECTION_STATES.UNCHANGED,
            },
            {
                file: FILE.btn_atom_css,
                key: '*.atom.css',
                icon: 'css-atom',
                state: DETECTION_STATES.ADDED,
            },
            {
                file: FILE.btn_atom_foo,
                key: '*.atom.foo',
                icon: 'unknown-atom',
                state: DETECTION_STATES.NOT_SUPPORTED,
            },
        ];
        it('should create new settings', () => {
            const newSettings = getNewSettings(ICONS, COMPONENT_DETECTIONS);
            const EXPECTED = {
                settings: {
                    '*.atom.ts': `${ICON_FOLDER}/typescript-atom`,
                    '*.molecule.ts': `${ICON_FOLDER}/typescript-molecule`,
                    '*.atom.css': `${ICON_FOLDER}/css-atom`,
                },
                stats: {
                    added: ['*.atom.ts', '*.atom.css'],
                    unchanged: ['*.molecule.ts'],
                    notSupported: ['*.atom.foo'],
                },
            };
            expect(newSettings).toEqual(EXPECTED);
        });
    });
});
