import { select, selectAll } from '../../../../backend/_shared/tools/tools';
import { DOM, DOMS } from '../../../../backend/_shared/tools/tools.d';

// TODO: Perforamcen auf 1500

// idee alle values in attribut
export const createSearch = (target: string, uid: string, source: string) => {
    const searchArea: DOM = select(`[${target}="${uid}"]`);
    if (searchArea) {
        const filters: DOMS = selectAll('[data-filter-type]', searchArea);
        for (const filter of filters) {
            filter.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const isActive = target.getAttribute('data-active');
                if (isActive === 'true') {
                    target.setAttribute('data-active', 'false');
                } else {
                    target.setAttribute('data-active', 'true');
                }
                const filterType = target.getAttribute('data-filter-type');
                const filterValue = target.getAttribute('data-filter-value');
                if (filterType) {
                    const query = `[data-${filterType}="${filterValue}"]`;
                    const items: DOMS = selectAll(`${query}`);
                    for (const item of items) {
                        const dataHidden = item.getAttribute('data-hidden');
                        if (dataHidden === 'true') {
                            item.setAttribute('data-hidden', 'false');
                        } else {
                            item.setAttribute('data-hidden', 'true');
                        }
                    }
                }
            });
        }
        const input: DOM = select('input', searchArea);
        input?.addEventListener('keyup', (e) => {
            //write to local storage
            const target = e.target as HTMLInputElement;
            localStorage.setItem('search', target?.value || '');
            const start = new Date().getTime();
            const items: DOMS = selectAll(source);
            const searchValue = target.value.toLowerCase();

            const area: DOM = select('.search__result', searchArea);
            const nonHiddenSkills: DOMS = selectAll(`${source}:not(.hidden)`);
            const noResultItem: DOM = select('.search__no-result', area);
            const hasResultItem: DOM = select('.search__has-result', area);
            const defaultItem: DOM = select('.search__default', area);
            const searchItem: DOM = select('.search__value', area);
            const searchNumResults: DOM = select('.search__num-results', area);
            if (target.value === '') {
                // reset search
                // info area
                noResultItem?.classList.add('hidden');
                hasResultItem?.classList.add('hidden');
                defaultItem?.classList.remove('hidden');

                //hide placeholders
                const st = new Date().getTime();
                for (const item of items) {
                    const placeholders: DOMS = selectAll('.skill-search', item);
                    for (const placeholder of placeholders) {
                        placeholder.classList.add('hidden');
                    }
                }
                const duration = new Date().getTime() - st;
                console.log(`Reset search took: ${duration}ms`);
            } else {
                for (const skill of items) {
                    const searchValues = skill.getAttribute('data-searchable');
                    const hasValue = searchValues?.includes(searchValue);
                    if (hasValue) {
                        skill.classList.remove('hidden');
                    } else {
                        skill.classList.add('hidden');
                    }
                }

                // info area
                defaultItem?.classList.add('hidden');
                if (nonHiddenSkills.length === 0) {
                    noResultItem?.classList.remove('hidden');
                    hasResultItem?.classList.add('hidden');
                    if (searchItem) {
                        searchItem.innerText = `${target.value}`;
                    }
                } else {
                    noResultItem?.classList.add('hidden');
                    hasResultItem?.classList.remove('hidden');
                    if (searchNumResults) {
                        searchNumResults.innerText = `${nonHiddenSkills.length}`;
                    }
                }
            }
            const duration = new Date().getTime() - start;
            console.log(`Search for ${target.value} took: ${duration}ms`);
        });
    }
};
export const getHighlightedText = (text: string, searchTerm: string) => {
    if (searchTerm === '') return text;
    // Split the text by the highlight term
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts
        .map((part, i) =>
            part.toLowerCase() === searchTerm.toLowerCase()
                ? `<span class="search-match">${part}</span>`
                : part
        )
        .join('');
};
export const searchRow = (target: HTMLElement) => {
    const start = new Date().getTime();
    const targetValue = localStorage.getItem('search')?.toLowerCase() || '';
    if (!targetValue || targetValue === '') {
        return;
    }
    const valueItems = selectAll('.skill-value', target);
    for (const valueItem of valueItems) {
        const item = valueItem as HTMLElement;
        const skillValue: string = item.innerText;
        const itemValue = skillValue?.toLowerCase();
        const parent: DOM = item?.parentElement;
        const placeholder = select('.skill-search', parent); // as HTMLElement;
        if (itemValue.includes(targetValue)) {
            placeholder?.classList.remove('hidden');
            if (placeholder) {
                const html = getHighlightedText(skillValue, targetValue);
                placeholder.innerHTML = `${html}`;
            }
        } else {
            placeholder?.classList.add('hidden');
        }
    }
    const duration = new Date().getTime() - start;
    console.log(`searchRow [${targetValue}] took: ${duration}ms`);
};

// foreach not with DOMS
const rows = document.querySelectorAll('[data-active="true"]');

document.addEventListener('DOMContentLoaded', () => {
    const io = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                const verticalVisible =
                    entry.intersectionRect.height > 0 &&
                    entry.boundingClientRect.top < window.innerHeight &&
                    entry.boundingClientRect.bottom > 0;

                if (verticalVisible) {
                    console.log('vertical fires');
                    entry.target.classList.toggle('is-visible', entry.isIntersecting);

                    if (entry.isIntersecting) {
                        searchRow(entry.target as HTMLElement);
                    }
                }
            }
        },
        { threshold: 0.1 }
    );
    rows.forEach((r) => io.observe(r));
    localStorage.setItem('search', '');
});
