import createPage from './page';

export default function (state, pagesDefinitions) {
  var currentPage = null;
  const changePage = async function (name, params) {
    const newPage = pages.find(({ name: n }) => n === name);
    
    if (!newPage) {
      throw new Error(`There's no a page with name "${ name }".`);
    }
    if (currentPage) {
      await currentPage.hide();
    }
    newPage.show(params);
    currentPage = newPage;
  }
  const pages = pagesDefinitions.map(
    factory => createPage(factory({ changePage, state }))
  );
  
  return defaultPage => changePage(defaultPage);
}