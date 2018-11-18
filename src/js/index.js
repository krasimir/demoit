import dependenciesPage from './pages/dependencies';
import homePage from './pages/home';
import editorPage from './pages/editor';
import manageStoragePage from './pages/manageStorage';
import manageDependencies from './pages/manageDependencies';

import createPagesManager from './pages/manager';

window.onload = async function () {
  createPagesManager([
    homePage,
    dependenciesPage,
    editorPage,
    manageStoragePage,
    manageDependencies
  ])('home');
};