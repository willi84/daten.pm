import { FS } from '../../backend/_shared/fs/fs';

export const getSnapshots = (callsInput: any[]) => {
    const calls = callsInput.filter((call) =>
        call[0].includes('renderComponent called from:')
    );
    const componentName = calls[0][1]?.component || 'unknown';
    const componentType = calls[0][1]?.type || 'unknown';
    const fileName = calls[0][1]?.fileName || 'unknown';
    console.log(fileName);
    const COMPONENT_ID = `${componentName}_${componentType}`;
    const TEMPLATE_FOLDER = 'src/_docs';
    const DATA_FOLDER = 'src/_data/docs';
    // const PATH = `${TEMPLATE_FOLDER}/button_atom.njk`;
    const PATH = `${TEMPLATE_FOLDER}/${COMPONENT_ID}.njk`;
    const PATH_DATA = `${DATA_FOLDER}/${COMPONENT_ID}.json`;
    const data = {
        path: PATH,
        fileName,
    };
    // let templates = '';
    let templates = `{%- from "./../frontend/templates/_setup/macros/component.macro.njk" import component -%}\n
    `;
    for (const call of calls) {
        const params = call[1];
        if (!call[1]) continue;
        const c: any = {};
        c['id'] = params?.id;
        c['filePath'] = params?.filePath;
        c['line'] = params?.line;
        c['template'] = params?.template;
        const snippet = `
        
                <div class="row g-3" id="item-${c.id}">
                    <div class="col-md-7">
                        <div class="card border-secondary h-100">
                            <div class="card-header py-2">
                                <span class="badge text-bg-secondary">TEMPLATE</span> ${c.filePath}<span class="fw-bold"> : L.${c.line}</span>
                            </div>
                            <div class="card-body">
                                <pre class="mb-0"><code>{% raw %}${c.template}{% endraw %}</code></pre>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-5">
                        <div class="card border-primary h-100">
                            <div class="card-header py-2 d-flex align-items-center justify-content-between">
                                <span class="badge text-bg-primary">RENDERED</span>
                                <small class="text-muted">live render</small>
                            </div>
                            <div class="card-body">
                                ${c.template}
                            </div>
                        </div>
                    </div>
                </div>                    
            
            `;
        console.log(c);
        templates += snippet;
    }
    // templates = ``;
    templates += ``;
    console.log(templates)
    FS.writeFile(PATH_DATA, JSON.stringify(data, null, 4), 'replace', true);
    FS.writeFile(PATH, templates, 'replace', true);
};