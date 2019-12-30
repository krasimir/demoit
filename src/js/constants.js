function matchAgainstURL(pattern) {
  return window.location.href.match(pattern);
}

export const DEBUG = false;

export const IS_PROD = matchAgainstURL(/^https:\/\/poet.krasimir.now.sh/) || matchAgainstURL(/^http:\/\/localhost:8004/);
export const DEV = matchAgainstURL(/^http:\/\/localhost:8004/);

export const SAVE_DEMO_URL = !DEV ? 'https://poet.krasimir.now.sh/api/demo' : 'http://localhost:8004/api/demo';
export const GET_DEMOS_URL = !DEV ? 'https://poet.krasimir.now.sh/api/profile' : 'http://localhost:8004/api/profile';
