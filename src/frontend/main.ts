// import 'vite/dynamic-import-polyfill'; // for prod mode
import './_framework/css/index.css';
import { createSearch } from './components/molecules/search/search.molecule';
// import './components/atoms/badge/badge.atom.css';
import './components/atoms/css-icon/css-icon.atom.css';
// import './components/molecules/details/details.molecule.css';
// import './components/molecules/search/search.molecule.css';
// import './pages/internal/lint.css';

createSearch('data-search', 'repos', '[data-repo]');
