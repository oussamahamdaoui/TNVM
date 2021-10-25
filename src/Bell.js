const { html } = require('@forgjs/noframework');

const Bell = (eventManager) => {
  const DomElement = html`<div class="bell">
    <div class="head"></div>
    <div class="body"></div>
  </div>`;

  let volume = 0;

  eventManager.subscribe('toggle-mute', () => {
    if (volume > 0) {
      volume = 0;
    } else {
      volume = 0.2;
    }
  });

  DomElement.addEventListener('click', () => {
    DomElement.classList.add('ring');
    eventManager.emit('submitNft');
  });

  DomElement.addEventListener('animationend', () => {
    DomElement.classList.remove('ring');
    if (volume > 0) {
      const bellSound = new Audio('./bell.mp3');
      bellSound.play();
    }
  });

  return DomElement;
};

module.exports = Bell;
