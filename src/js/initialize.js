import { getParam } from './utils';

const readFromJSONFile = async function (file) {
  const res = await fetch(file);
  return await res.json();
}

export default async function initialize(state) {
  const predefinedState = getParam('state');

  if (predefinedState) {
    try {
      state.setState(await readFromJSONFile(predefinedState));
    } catch(error) {
      console.error(`Error reading ${ predefinedState }`);
    }
  }
}