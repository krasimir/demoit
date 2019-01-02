import createPopup from './popup';
import { CHECK_ICON } from '../utils/icons';

const ENTER_KEY = 13;

export default function profilePopUp(profile, getDemos) {
  createPopup({
    title: profile.name,
    content: `
      <div data-export="demosContainer" class="demos">...</div>
      <button class="save secondary" data-export="logoutButton">${ CHECK_ICON }<span>Logout</span></button>
    `,
    async onRender({ logoutButton, demosContainer, closePopup }) {
      logoutButton.onClick(() => window.location.href = '/logout');

      const { demos } = await getDemos();

      if (demos.length === 0) {
        demosContainer.content('You have no demos.');
      } else {
        demosContainer.content(
          demos.map(({ demoId, name }) => {
            return `
              <a href="/e/${ demoId }">
                ${ name || 'unnamed' }
              </a>
            `;
          }).join('')
        );
      }
    }
  });
}