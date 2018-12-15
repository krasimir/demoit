import { removeParam } from './utils';

const GITHUB = {
  authorizeURL: 'https://github.com/login/oauth/authorize',
  getTokenURL: 'https://demoit.app/api/token',
  getProfileURL: 'https://api.github.com/user',
  clientID: '94dc62a335b2f3e38d25',
  async authorize(code, setProfile) {
    const response = await fetch(this.getTokenURL, {
      method: 'POST',
      body: JSON.stringify({
        mode: 'cors',
        client_id: this.clientID,
        code
      })
    });
    const { token } = await response.json();
    
    if (!token) {
      throw new Error('Demoit is not able to get access token.');
    }
    const profile = await fetch(this.getProfileURL, {
      headers: {
        'Authorization': `token ${ token }`
      }
    });
    if (!profile) {
      throw new Error('Invalid or missing profile.');
    }
    const profileData = await profile.json();

    setProfile({
      token,
      id: profileData.id,
      name: profileData.name,
      avatar: profileData.avatar_url
    });

    window.location.href = removeParam('code', window.location.href);
  },
  grandAccess() {
    const params = [
      `client_id=${ this.clientID }`,
      `redirect_uri=${ window.location.href }`
    ];

    window.location.href = this.authorizeURL + '?' + params.join('&');
  }
}

export default function profile(state) {
  const provider = GITHUB;

  return {
    authorize(code) {
      return provider.authorize(code, profile => state.login(profile));
    },
    showProfile() {
      if (state.loggedIn()) {
        
      } else {
        provider.grandAccess();
      }
    }
  }
}