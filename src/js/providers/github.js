import { AUTHORIZE_URL, LOGIN_URL, GITHUB_CLIENT_ID } from '../constants';

const GITHUB = {
  async authorize(code) {
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      body: JSON.stringify({
        mode: 'cors',
        client_id: GITHUB_CLIENT_ID,
        code
      })
    });
    const profile = await response.json();

    if (!profile || profile.error) {
      throw new Error(profile.error);
    }

    return profile;
  },
  grandAccess() {
    const params = [
      `client_id=${ GITHUB_CLIENT_ID }`,
      `redirect_uri=${ window.top.location.href }`
    ];

    window.top.location.href = `${ AUTHORIZE_URL }?${ params.join('&') }`;
  }
}

export default GITHUB;