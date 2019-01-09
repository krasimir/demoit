function matchAgainstURL(pattern) {
  return window.location.href.match(pattern);
}

export const IS_PROD = matchAgainstURL(/^https:\/\/poet.codes/) || matchAgainstURL(/^http:\/\/localhost:8004/);
export const DEV = matchAgainstURL(/^http:\/\/localhost:8004/);

export const SAVE_DEMO_URL = !DEV ? 'https://poet.codes/api/demo' : 'http://localhost:8004/api/demo';
export const GET_DEMOS_URL = !DEV ? 'https://poet.codes/api/profile' : 'http://localhost:8004/api/profile';
