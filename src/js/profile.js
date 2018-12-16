import { removeParam } from './utils';
import el from './utils/element';
import GitHub from './providers/github';

export default function profile(state) {
  const provider = GitHub;

  return {
    authorize(code) {
      return provider
        .authorize(code)
        .then(profileData => {
          state.login(profileData);
          window.top.location.href = removeParam('code', window.top.location.href);
        })
        .catch(this.fallbackUI);
    },
    showProfile() {
      if (state.loggedIn()) {
        
      } else {
        provider.grandAccess();
      }
    },
    fallbackUI(error) {
      const fallback = el('.layout');
      
      fallback.content(`
        <div class="authentication-failed">
          <h1>Authentication failed</h1>
          <p>Reason: ${ error && error.message ? error.message : 'Unknown' }</p>
          <p>
            <a href="javascript:void(0);" data-export="goBack">Go back</a><br />
            <a href="https://github.com/krasimir/demoit/issues">Report an issue</a><br />
          </p>
        </div>
      `);
      fallback.namedExports().goBack.onClick(() => window.top.location.href = removeParam('code', window.top.location.href));
    }
  }
}