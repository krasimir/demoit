import { SAVE_DEMO_URL } from '../constants';
import { debounce } from '../utils';

const DEBOUNCE_INTERVAL = 2000;
const STATUS = {
  IN_FLIGHT: 'IN_FLIGHT',
  OK: 'OK',
  ERROR_WITH_REQUEST: 'WITH_REQUEST',
  INVALID_TOKEN: 'INVALID_TOKEN'
}

let requestInFlight = false;

const saveDemo = debounce(async function (state, token) {
  if (requestInFlight) { return STATUS.IN_FLIGHT; }

  try {
    requestInFlight = true;
    const response = await fetch(SAVE_DEMO_URL, {
      method: 'POST',
      body: JSON.stringify({ state }),
      headers: { token }
    });

    const result = await response.json();

    requestInFlight = false;

    if (result.ok) {
      return STATUS.OK;
    } else if (result.error) {
      return result.error;
    }
  } catch(error) {
    return STATUS.ERROR_WITH_REQUEST;
  }
}, DEBOUNCE_INTERVAL, true);

export default {
  saveDemo,
  STATUS
};