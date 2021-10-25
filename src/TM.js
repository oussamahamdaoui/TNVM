const { html, $, $$ } = require('@forgjs/noframework');

const TM = (eventManager) => {
  const DomElement = html`<div class="tm">
    <div class="w-page">
      <div class="page">
        <input type="text" class="title">
        <textarea class="body"></textarea>
      </div>
    </div>
    <div class="top">
      <div class="l"></div>
      <div class="r"></div>
    </div>
    <div class="keyboard">
      <div class="line">
        <div class="btn"></div>
        <div class="btn"></div>
        <div class="btn"></div>
        <div class="btn"></div>
        <div class="btn"></div>
        <div class="btn"></div>
        <div class="btn"></div>
        <div class="btn"></div>
      </div>
      <div class="line">
        <div class="btn"></div>
        <div class="btn"></div>
        <div class="btn"></div>
        <div class="btn"></div>
        <div class="btn"></div>
        <div class="btn"></div>
        <div class="btn"></div>
        <div class="btn"></div>
      </div>
      <div class="line">
        <div class="btn"></div>
        <div class="btn"></div>
        <div class="btn"></div>
        <div class="btn2"></div>
        <div class="btn"></div>
        <div class="btn"></div>
        <div class="btn"></div>
      </div>
    </div>
    <div class="t1"></div>
    <div class="t2"></div>
    <div class="t3"></div>
    <div class="t4"></div>
  </div>`;
  const titleElement = $('.title', DomElement);
  const bodyElement = $('.body', DomElement);
  const page = $('.page', DomElement);
  let volume = 0;

  let pressedBtn = null;

  titleElement.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      bodyElement.focus();
    }
  });

  const downBtn = (key) => {
    const btns = $$('.btn', DomElement);
    const rand = btns[Math.floor(Math.random() * btns.length)];
    rand.classList.add('active');
    if (volume !== 0) {
      let typeSound = new Audio('./type.mp3');
      if (key === 'Enter') {
        typeSound = new Audio('./enter.mp3');
      }
      typeSound.volume = volume;
      typeSound.play();
    }
    return rand;
  };

  const upBtn = (btn) => {
    btn.classList.remove('active');
  };

  DomElement.setVolume = (v) => {
    volume = v;
  };

  bodyElement.addEventListener('keydown', (e) => {
    if (pressedBtn) {
      pressedBtn.classList.remove('active');
    }
    const textLines = bodyElement.value.substr(0, bodyElement.selectionStart).split('\n');
    const currentColumnIndex = textLines[textLines.length - 1].length;
    const currentLineNumber = textLines.length;
    if (e.key === 'Backspace' && currentColumnIndex === 0 && currentLineNumber === 1) {
      titleElement.focus();
      return;
    }
    page.style.left = `calc(50% + ${currentColumnIndex}px)`;
    page.style.top = `calc(100% - ${(currentLineNumber + 2) * 20}px)`;
    pressedBtn = downBtn(e.key);
  }, false);

  bodyElement.addEventListener('keyup', () => {
    if (!pressedBtn) return;
    eventManager.emit('changeDescription', bodyElement.value);
    upBtn(pressedBtn);
  }, false);

  titleElement.addEventListener('keydown', (e) => {
    if (pressedBtn) {
      pressedBtn.classList.remove('active');
    }
    const textLines = titleElement.value.substr(0, titleElement.selectionStart).split('\n');
    const currentColumnIndex = textLines[textLines.length - 1].length;
    const currentLineNumber = textLines.length;
    page.style.top = `calc(100% - ${(currentLineNumber + 1) * 20}px)`;
    page.style.left = `calc(50% + ${currentColumnIndex}px)`;
    pressedBtn = downBtn(e.key);
  }, false);

  titleElement.addEventListener('keyup', () => {
    if (!pressedBtn) return;
    upBtn(pressedBtn);
    eventManager.emit('changeTitle', titleElement.value);
  }, false);

  DomElement.addEventListener('click', (e) => {
    if (e.target !== titleElement && e.target !== bodyElement) {
      titleElement.focus();
    }
  });

  eventManager.subscribe('toggle-mute', () => {
    if (volume === 0) {
      DomElement.setVolume(0.1);
    } else {
      DomElement.setVolume(0);
    }
  });

  $('.w-page', DomElement).addEventListener('click', (e) => {
    if (e.target === $('.w-page', DomElement)) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  DomElement.reset = () => {
    titleElement.value = '';
    bodyElement.value = '';
    page.style.left = null;
    page.style.top = null;
  };

  return DomElement;
};

module.exports = TM;
