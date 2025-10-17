import path from 'path';
import { FS } from '../../../../backend/_shared/fs/fs';
import { LOG } from '../../../../backend/_shared/log/log';
import { renderComponent } from '../../../../setup/utils/render-compontent';
import { getSnapshots } from '../../../../setup/utils/get-snapshots';

const removeNewline = (str: string) =>
    str.replace(/\n/g, '').replace(/\t/g, '').replace(/\s+/g, ' ');

describe('component macro (inline assertions)', () => {
    const spyLOG = jest.spyOn(LOG, 'DEBUG');
    afterAll(() => {
        const calls = spyLOG.mock.calls;
        getSnapshots(calls);
        spyLOG.mockRestore();
    });
    it('renders button with given text', async () => {
        const params = { text: 'ok' };
        const TEMPLATE = `{{ component('button', ${JSON.stringify(params)}) }}`;
        const html = await renderComponent(TEMPLATE, { text: 'ok' });
        const result = removeNewline(html);
        expect(html).toContain('data-component="button.atom"');
        expect(result).toEqual(
            '<button data-component="button.atom" class="" type="button">ok</button>'
        );
    });
    it('renders button with given text & type', async () => {
        const params = {
            text: 'ok',
            type: 'submit',
            class_modifier: 'bg-danger',
        };
        const TEMPLATE = `{{ component('button', ${JSON.stringify(params)}) }}`;
        const html = await renderComponent(TEMPLATE);
        const result = removeNewline(html);
        expect(html).toContain('data-component="button.atom"');
        expect(result).toEqual(
            '<button data-component="button.atom" class="bg-danger" type="submit">ok</button>'
        );
    });
    // it('renders button with post_html', async () => {
    //     const params = { text: 'ok', post_html: '<span>3</span>' };
    //     const TEMPLATE = `{{ component('button', ${JSON.stringify(params)}) }}`;
    //     const html = await renderComponent(TEMPLATE);
    //     const result = removeNewline(html);
    //     expect(html).toContain('data-component="button.atom"');
    //     expect(result).toEqual(
    //         '<button data-component="button.atom" class="" type="button">ok <span>3</span></button>'
    //     );
    // });
    // it('renders basic button when data is missing', async () => {
    //     const TEMPLATE = `{{ component('button', {}) }}`;
    //     const html = await renderComponent(TEMPLATE, {});
    //     const result = removeNewline(html);
    //     expect(html).toContain('data-component="button.atom"');
    //     expect(result).toEqual(
    //         '<button data-component="button.atom" class="" type="button"></button>'
    //     );
    // });
});
