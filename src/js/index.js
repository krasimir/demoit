import dependenciesPage from './pages/dependencies';
import homePage from './pages/home';
import editorPage from './pages/editor';

import createPagesManager from './pages/manager';

window.onload = async function () {
  createPagesManager([
    homePage,
    dependenciesPage,
    editorPage
  ])('home');
};