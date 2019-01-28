/* eslint-disable consistent-return, no-use-before-define */
import { SAVE_DEMO_URL, GET_DEMOS_URL } from '../constants';

let requestInFlight = false;
let queue = [];

const emptyQueue = function () {
  if (queue.length > 0) {
    const { state, token, diff } = queue.shift();

    saveDemo(state, token, diff);
  }
};

const saveDemo = async function (state, token, diff) {
  if (requestInFlight) {
    queue.push({ state, token, diff });
    return;
  }

  try {
    requestInFlight = true;
    const response = await fetch(SAVE_DEMO_URL, {
      method: 'POST',
      body: JSON.stringify({ state, a: diff }),
      headers: { token }
    });

    const result = await response.json();

    requestInFlight = false;
    emptyQueue();

    if (result.error) {
      console.error(result.error);
    } else if (result.demoId) {
      return result.demoId;
    }
    console.log(result);
  } catch (error) {
    emptyQueue();
    console.error(error);
  }
};

const getDemos = async function (id, token) {
  try {
    const response = await fetch(GET_DEMOS_URL + '/' + id, { headers: { token } });
    const result = await response.json();

    if (result.error) {
      console.error(result.error);
    } else if (result) {
      return result;
    } else {
      console.log(result);
    }
  } catch (error) {
    console.error(error);
  }
};

export default {
  saveDemo,
  getDemos
};
