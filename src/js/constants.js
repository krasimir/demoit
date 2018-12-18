export const DEV = false;

export const GITHUB_CLIENT_ID = DEV ? '093f677d824bdf526b05' : '94dc62a335b2f3e38d25';

export const AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
export const LOGIN_URL = DEV ? 'http://localhost:8004/api/login' : '/api/login';
export const SAVE_DEMO_URL = DEV ? 'http://localhost:8004/api/demo' : 'https://demoit.app/api/demo';
