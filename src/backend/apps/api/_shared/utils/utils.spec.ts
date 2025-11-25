import { generateID, getObject, sleepSync, spyOnCMD } from './utils';
import * as cmd from '../../../../_shared/cmd/cmd';
import { CurlItem } from '../../../../index.d';

describe('generateID()', () => {
    it('should generate correct IDs', () => {
        const cases = [
            { input: 'Münchener Straße', expected: 'muenchener_strasse' },
            { input: 'Hauptstraße', expected: 'hauptstrasse' },
            { input: 'Bergstraße 12', expected: 'bergstrasse_12' },
            { input: 'My-Ebert-Allee', expected: 'my_ebert_allee' },
            { input: 'Königsweg!', expected: 'koenigsweg' },
            { input: 'Äußere Allee', expected: 'aeussere_allee' },
            { input: 'A___t______U', expected: 'a_t_u' },
            { input: '_Anfangsunterstrich', expected: 'anfangsunterstrich' },
            { input: 'Endungsunterstrich_', expected: 'endungsunterstrich' },
        ];

        for (const testCase of cases) {
            const result = generateID(testCase.input);
            expect(result).toBe(testCase.expected);
        }
    });
});
describe('spyOnCMD()', () => {
    it('should mock cmd.command and return expected default', () => {
        const mockContent = 'NO_RESULT';
        const mockCommand = spyOnCMD();

        const result = cmd.command('curl http://example.com');
        expect(result).toContain(mockContent);

        mockCommand.mockRestore();
    });
    it('should mock cmd.command and return expected content', () => {
        const mockContent = JSON.stringify({ message: 'Hello, World!' });
        const mockCommand = spyOnCMD(mockContent, '200');

        const result = cmd.command('curl http://example.com');
        expect(result).toContain(mockContent);

        mockCommand.mockRestore();
    });
});
describe('getObject()', () => {
    const FN = getObject;
    it('should parse valid JSON content', () => {
        const response = {
            content: JSON.stringify({ key: 'value', number: 42 }),
        } as CurlItem;
        const result = FN(response);
        expect(result).toEqual({ key: 'value', number: 42 });
    });
    it('should return empty object for empty content', () => {
        const response = {
            content: '',
        } as CurlItem;
        const result = FN(response);
        expect(result).toEqual({});
    });
});
describe('sleepSync()', () => {
    const FN = sleepSync;
    it('should sleep for at least the specified time', () => {
        const sleepTime = 100; // milliseconds
        const start = Date.now();
        FN(sleepTime);
        const end = Date.now();
        const elapsed = end - start;
        expect(elapsed).toBeGreaterThanOrEqual(sleepTime);
    });
});
