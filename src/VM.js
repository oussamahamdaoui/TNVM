const { html, $ } = require('@forgjs/noframework');

const VM = (eventManager) => {
  const DomElement = html`<div class="vending-machine">
        <img class="graffiti" src="./graffiti.svg">
        <img class="scratches" src="./scratches.svg">

        <div class="door">
            <div class="nail"></div>
            <div class="nail"></div>
            <div class="nail"></div>
            <div class="nail"></div>
            <div class="glass-shadow"></div>
            <div class="glass">
                <div class="cube top"></div>
                <div class="cube left"></div>
                <div class="cube bot"></div>
                <div class="cube right"></div>
                <div class="glaire"></div>
                <div class="shelves">
                    <div class="shelve">
                        <div class="product" position="11" style="--drop:400%;">
                            <img src="one.png">
                            <img src="one.png">
                            <div class="position">11</div>
                        </div>
                        <div class="product" position="12" style="--drop:400%;">
                            <img src="two.png">
                            <div class="position">12</div>
                        </div>
                        <div class="product" position="13" style="--drop:400%;">
                            <img src="two.png">
                            <div class="position">13</div>
                        </div>
                    </div>
                    <div class="shelve">
                        <div class="product" position="21" style="--drop:300%;">
                            <img src="one.png">
                            <div class="position">21</div>
                        </div>
                        <div class="product" position="22" style="--drop:300%;">
                            <div class="position">22</div>
                        </div>
                        <div class="product" position="23" style="--drop:300%;">
                            <div class="position">23</div>
                        </div>
                    </div>
                    <div class="shelve">
                        <div class="product" position="31" style="--drop:200%;">
                            <div class="position">31</div>
                        </div>
                        <div class="product" position="32" style="--drop:200%;">
                            <img src="one.png">
                            <div class="position" >32</div>
                        </div>
                        <div class="product" position="33" style="--drop:200%;">
                            <div class="position">33</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="trap">
                <div class="cube-wrapper">
                    <div class="cube top"></div>
                    <div class="cube left"></div>
                    <div class="cube bot"></div>
                    <div class="cube right"></div>
                    <div class="cube back"></div>
                    <img src="one.png">
                </div>
                <div class="trap-door-wrapper">
                    <div class="trap-door">
                        <div class="glaire"></div>
                        <div class="lid">PULL</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="buttons">
            <div class="nail"></div>
            <div class="nail"></div>
            <div class="nail"></div>
            <div class="nail"></div>
            <div class="pad">
                <div class="screen">
                   <span class="selected-item"></span>
                </div>
                <div class="keyboard">
                    <button type="button" class="button">1</button>
                    <button type="button" class="button">2</button>
                    <button type="button" class="button">3</button>
                    <button type="button" class="button">4</button>
                    <button type="button" class="button">5</button>
                    <button type="button" class="button">6</button>
                    <button type="button" class="button green">OK</button>
                </div>
                <div class="card">
                    <div class="top">PAYE</div>
                    <div class="circle"></div>
                    <div class="cb"></div>
                </div>
            </div>
        </div>
        <div class="foot left"></div>
        <div class="foot right"></div>
        <div class="bottom"></div>
        <div class="light"></div>
    </div>`;

  const keyboard = $('.keyboard', DomElement);
  const selectedItem = $('.selected-item', DomElement);
  const trap = $('.trap', DomElement);
  const motorSound = new Audio('./motor.mp3');
  const bipSound = new Audio('/bip.mp3');
  const bgSound = new Audio('./bg.mp3');
  const flickerSound = new Audio('./flicker.mp3');
  const dropSound = new Audio('./drop.mp3');
  const openSound = new Audio('./open.mp3');
  bgSound.loop = true;
  const audioFiles = [
    {
      name: 'motorSound',
      audio: motorSound,
      volume: 0.3,
    }, {
      name: 'bipSound',
      audio: bipSound,
      volume: 0.3,
    }, {
      name: 'bgSound',
      audio: bgSound,
      volume: 0.5,
    }, {
      name: 'flickerSound',
      audio: flickerSound,
      volume: 0.3,
    }, {
      name: 'dropSound',
      audio: dropSound,
      volume: 0.3,
    }, {
      name: 'openSound',
      audio: openSound,
      volume: 0.2,
    },
  ];

  audioFiles.forEach((f, i) => { audioFiles[i].audio.volume = 0; });

  eventManager.subscribe('toggle-mute', () => {
    if (audioFiles[0].audio.volume > 0) {
      audioFiles.forEach((f, i) => { audioFiles[i].audio.volume = 0; });
    } else {
      audioFiles.forEach((f, i) => { audioFiles[i].audio.volume = f.volume; });
      if (bgSound.paused) {
        bgSound.play();
      }
    }
  });

  bgSound.addEventListener('timeupdate', () => {
    const buffer = 0.4;
    if (bgSound.currentTime > bgSound.duration - buffer) {
      bgSound.currentTime = 0;
      bgSound.play();
    }
  });

  trap.addEventListener('mouseenter', () => {
    openSound.play();
  });

  trap.addEventListener('mouseleave', () => {
    openSound.play();
  });

  const drop = (elem) => {
    if (!elem || !$('img', elem)) return;
    $('img', elem).classList.add('drop');
    if ($('img', trap).classList.contains('drop')) {
      $('img', trap).className = '';
    }
    $('img', trap).src = $('img', elem).src;
    elem.parentNode.classList.add('drop');
    const css = window.getComputedStyle($('img', elem));
    motorSound.play();
    const timeout = parseInt(css.animationDuration, 10) * 620;
    const pos = Array.from($('img', elem).parentNode.parentNode.children).indexOf($('img', elem).parentNode);

    setTimeout(() => {
      $('img', trap).classList.add(`pos${pos}`);
      $('img', trap).classList.add('drop');
      dropSound.play();
    }, timeout);

    $('img', elem).addEventListener('animationend', () => {
      $('img', elem).remove();
    });
  };

  keyboard.addEventListener('click', (e) => {
    if (!e.target.classList.contains('button')) return;
    bipSound.play();
    if (e.target.classList.contains('green')) {
      if (selectedItem.innerHTML.length < 2) return;
      const id = selectedItem.innerHTML;
      drop($(`[position="${id}"]`, DomElement));
      selectedItem.innerHTML = '';
    } else {
      selectedItem.innerHTML = (selectedItem.innerHTML + e.target.innerHTML).slice(-2);
    }
  });

  let flickerTime = Math.random() * 30000 + 500;
  const light = $('.light', DomElement);

  const flicker = () => {
    if (light.classList.contains('flicker')) {
      return;
    }
    light.classList.add('flicker');
    flickerSound.play();
    Array(10).fill().map((e, i) => {
      setTimeout(() => {
        if (light.classList.contains('flicker')) {
          flickerSound.play();
        }
      }, i * 50);
      return false;
    });
    flickerTime = Math.random() * 30000 + 500;
    console.log(flickerTime);
    setTimeout(flicker, flickerTime);
  };

  light.addEventListener('animationend', () => {
    light.classList.remove('flicker');
  });

  setTimeout(flicker, flickerTime);

  return DomElement;
};

module.exports = VM;
