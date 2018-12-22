import { SAVE_DEMO_URL, GET_DEMOS_URL } from '../constants';

let requestInFlight = false;

const saveDemo = async function (state, token) {
  if (requestInFlight) { return; }

  try {
    requestInFlight = true;
    const response = await fetch(SAVE_DEMO_URL, {
      method: 'POST',
      body: JSON.stringify({ state }),
      headers: { token }
    });

    const result = await response.json();

    requestInFlight = false;

    if (result.error) {
      console.error(result.error);
    } else if (result.demoId) {
      return result.demoId;
    } else {
      console.log(result);
    }
  } catch(error) {
    console.error(error);
  }
};

const getDemos = async function (token) {
  try {
    const response = await fetch(GET_DEMOS_URL, {
      headers: { token }
    });

    const result = await response.json();

    if (result.error) {
      console.error(result.error);
    } else if (result) {
      return result;
    } else {
      console.log(result);
    }
  } catch(error) {
    console.error(error);
  }
};

export default {
  saveDemo,
  getDemos
};