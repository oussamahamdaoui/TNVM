const { html, $ } = require('@forgjs/noframework');

const Camera = (eventManager) => {
  const DomElement = html`<div class="camera">
    <div class="c1"></div>
    <div class="c2"></div>
    <div class="c3"></div>
    <div class="btn btn1"></div>
    <div class="sq1"></div>
    <div class="sq2"></div>
    <div class="lightBulb"></div>
    <div class="band">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div class="body">
      <div class="line">
        <div class="btn btn1"></div>
      </div>
      <div class="slot"></div>
      <div class="picture">
        <img class="img" src="">
      </div>
    </div>
    <div class="lens"></div>
    <input type="file" style="opacity:0;width:0;height:0">
  </div>`;

  const file = $('input', DomElement);
  const img = $('img', DomElement);
  let volume = 0;

  eventManager.subscribe('toggle-mute', () => {
    volume = volume === 0 ? 0.2 : 0;
  });

  DomElement.addEventListener('click', () => {
    file.click();
  });

  file.addEventListener('change', () => {
    if (file.files && file.files.length > 0) {
      const reader = new FileReader();
      img.parentNode.classList.remove('pull');
      reader.onload = (e) => {
        eventManager.emit('changeImage', file.files[0]);
        img.setAttribute('src', e.target.result);
        img.parentNode.classList.add('pull');
        if (volume > 0) {
          const sound = new Audio('./polaroid.mp3');
          sound.play();
        }
      };
      setTimeout(() => {
        reader.readAsDataURL(file.files[0]);
      }, 200);
    }
  });

  DomElement.reset = () => {
    img.parentNode.classList.remove('pull');
  };

  return DomElement;
};

module.exports = Camera;
