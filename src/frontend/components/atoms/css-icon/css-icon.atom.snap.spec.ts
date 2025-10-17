import { LOG } from '../../../../backend/_shared/log/log';
import { getSnapshots } from '../../../../setup/utils/get-snapshots';
import { renderComponent } from '../../../../setup/utils/render-compontent';

describe('component macro (inline assertions)', () => {
    // const TEMPLATE = `{{ component('css-icon', { name: params.type }) }}`;
    const spyLOG = jest.spyOn(LOG, 'DEBUG');
    afterAll(() => {
        const calls = spyLOG.mock.calls;
        getSnapshots(calls);
        spyLOG.mockRestore();
    });
    it('renders css-icon with given type', async () => {
        const params = { name: 'success' };
        const TEMPLATE = `{{ component('css-icon', ${JSON.stringify(params)}) }}`;
        const html = await renderComponent(TEMPLATE);
        expect(html).toContain('data-component="css-icon.atom"');
        expect(html).toEqual(
            '<span data-icon="success" data-component="css-icon.atom"></span>'
        );
    });
    it('renders css-icon with given type', async () => {
        const params = { name: 'warning' };
        const TEMPLATE = `{{ component('css-icon', ${JSON.stringify(params)}) }}`;
        const html = await renderComponent(TEMPLATE);
        expect(html).toContain('data-component="css-icon.atom"');
        expect(html).toEqual(
            '<span data-icon="warning" data-component="css-icon.atom"></span>'
        );
    });
    it('renders css-icon with given type', async () => {
        const params = { name: 'danger' };
        const TEMPLATE = `{{ component('css-icon', ${JSON.stringify(params)}) }}`;
        const html = await renderComponent(TEMPLATE);
        expect(html).toContain('data-component="css-icon.atom"');
        expect(html).toEqual(
            '<span data-icon="danger" data-component="css-icon.atom"></span>'
        );
    });
    it('not renders css-icon when type is missing', async () => {
        const params = {};
        const TEMPLATE = `{{ component('css-icon', ${JSON.stringify(params)}) }}`;
        const html = await renderComponent(TEMPLATE);

        expect(html).toEqual('');
    });
});
