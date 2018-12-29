function matchAgainstURL(pattern) {
  return window.location.href.match(pattern);
}

export const IS_PROD = matchAgainstURL(/^https:\/\/demoit.app/) || matchAgainstURL(/^http:\/\/localhost:8004/);
export const DEV = matchAgainstURL(/^http:\/\/localhost:8004/);

export const SAVE_DEMO_URL = !DEV ? 'https://demoit.app/api/demo' : 'http://localhost:8004/api/demo';
export const GET_DEMOS_URL = !DEV ? 'https://demoit.app/api/profile' : 'http://localhost:8004/api/profile';
