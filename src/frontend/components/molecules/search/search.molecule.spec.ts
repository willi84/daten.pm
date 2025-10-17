import { getHighlightedText } from './search.molecule';

describe('getHighlightedText()', () => {
    const defaultInput = 'my custom text';
    const highlightedTerm = '<span class="search-match">cust</span>';
    describe('should split the result with a highlighting', () => {
        it('should make no change when search term is empty', () => {
            const searchTerm = '';
            const result = getHighlightedText(defaultInput, searchTerm);
            const expected = defaultInput;
            expect(result).toEqual(expected);
        });
        it('should highlight lowercase input', () => {
            const searchTerm = 'cust';
            const result = getHighlightedText(defaultInput, searchTerm);
            const expected = 'my <span class="search-match">cust</span>om text';
            expect(result).toEqual(expected);
        });
        it('should highlight uppercase input', () => {
            const searchTerm = 'CUST';
            const result = getHighlightedText(defaultInput, searchTerm);
            const expected = 'my <span class="search-match">cust</span>om text';
            expect(result).toEqual(expected);
        });
        it('should highlight multiple', () => {
            const input = 'my custom text of custom input';
            const searchTerm = 'CUST';
            const result = getHighlightedText(input, searchTerm);
            const expected = `my ${highlightedTerm}om text of ${highlightedTerm}om input`;
            expect(result).toEqual(expected);
        });
    });
});
