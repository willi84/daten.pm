import { analyzeFileTree, getDevFolder } from './analyze';
import { FILE_TREE } from './analyze.d';

describe('getDevFolder()', () => {
    const FN = getDevFolder;
    it('should return the dev folder name', () => {
        const input = '/home/willi84/dev/2025/repo-quality';
        const EXPECTED = '/home/willi84/dev/2025';
        expect(FN(input)).toEqual(EXPECTED);
        expect(FN(`${input}/`)).toEqual(EXPECTED);
    });
});
describe('analyzeFileTree()', () => {
    const FN = analyzeFileTree;
    it('should return an array of file paths', () => {
        const BASE_PATH = '/home/willi84/dev/2025/repo-quality';
        const files = [
            `${BASE_PATH}/src/backend/_shared/cmd/cmd.spec.ts`,
            `${BASE_PATH}/src/backend/_shared/cmd/cmd.ts`,
            `${BASE_PATH}/src/backend/_shared/colors.ts`,
            `${BASE_PATH}/src/backend/_shared/format/format.spec.ts`,
            `${BASE_PATH}/src/backend/_shared/format/format.ts`,
            `${BASE_PATH}/src/backend/_shared/item/format/format.spec.ts`,
            `${BASE_PATH}/src/backend/_shared/item/format/format.ts`,
            `${BASE_PATH}/src/backend/_shared/item/is/is.spec.ts`,
            `${BASE_PATH}/src/backend/_shared/item/is/is.ts`,
        ];
        const EXPECTED: FILE_TREE = {
            cmd: {
                component: 'cmd',
                files: ['cmd/cmd.spec.ts', 'cmd/cmd.ts'],
                folder: ['src/backend/_shared/cmd'],
            },
            colors: {
                component: 'colors',
                files: ['_shared/colors.ts'],
                folder: ['src/backend/_shared'],
            },
            format: {
                component: 'format',
                files: [
                    'format/format.spec.ts',
                    'format/format.ts',
                    'item/format/format.spec.ts',
                    'item/format/format.ts',
                ],
                folder: [
                    'src/backend/_shared/format',
                    'src/backend/_shared/item/format',
                ],
            },
            is: {
                component: 'is',
                files: ['item/is/is.spec.ts', 'item/is/is.ts'],
                folder: ['src/backend/_shared/item/is'],
            },
        };

        expect(FN(files, BASE_PATH)).toEqual(EXPECTED);
        expect(FN(files, `${BASE_PATH}/`)).toEqual(EXPECTED); // with trailing slash
    });
});
