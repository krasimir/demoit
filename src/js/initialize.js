import { getParam, readFromJSONFile } from './utils';

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