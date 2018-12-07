import initialize from './initialize';
import dependenciesPage from './pages/dependencies';
import editorPage from './pages/editor';
import createPagesManager from './pages/manager';
import createState from './state';

window.onload = async function () {
  const state = createState();
  const loadPage = createPagesManager(state, [ dependenciesPage, editorPage ]);

  await initialize(state);
  loadPage('dependencies');
};