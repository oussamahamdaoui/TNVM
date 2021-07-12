const { html, EventManager, $ } = require('@forgjs/noframework');
// eslint-disable-next-line import/no-extraneous-dependencies
const feather = require('feather-icons');
const VM = require('./VM');

const App = () => {
  const eventManager = new EventManager();

  const DomElement = html`
    <div class="app">
        <button class="button-sound mute">
          ${feather.icons['volume-x'].toSvg()}
          ${feather.icons['volume-1'].toSvg()}
        </button>
        ${VM(eventManager)}
        <img class="graffiti2" src="graffiti2.svg">
        <div class="floor"></div>
    </div>`;
  const toggleMuteButton = $('.button-sound', DomElement);

  toggleMuteButton.addEventListener('click', () => {
    eventManager.emit('toggle-mute');
    toggleMuteButton.classList.toggle('mute');
  });

  return DomElement;
};
document.body.append(App());
