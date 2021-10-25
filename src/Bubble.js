const { html, $ } = require('@forgjs/noframework');

const Bubble = (eventManager) => {
  const DomElement = html`<div class="bubble">
    <div class="body">
      <p>
        Hello and welcome to The NFT vending machine!
        I'm Gloody, I'm here to help, if you want to publish your NFT
        use the typing machine to write your descripion and the camera to take a picture.
        Once you are done ring the bell, I'll handle everything else.
      </p>
      <div class="priceInput hide">
        <input type="number" class="price">
        <button class="submitPrice">Sell</button>
      </div>
      <div class="addressInput hide">
        <input type="text" class="address">
        <button class="submitAddress">Send</button>
      </div>
    </div>
  </div>`;
  const priceInput = $('.price', DomElement);
  const priceHolder = $('.priceInput', DomElement);
  const addressHolder = $('.addressInput', DomElement);
  const addressInput = $('.address', DomElement);

  let sell = false;

  DomElement.setText = (txt) => {
    $('p', DomElement).innerText = txt;
  };

  DomElement.askPrice = (txt, s = false) => {
    sell = s;
    $('p', DomElement).innerText = txt;
    priceHolder.classList.remove('hide');
    addressHolder.classList.add('hide');
  };

  DomElement.askAddress = (txt) => {
    $('p', DomElement).innerText = txt;
    addressHolder.classList.remove('hide');
    priceHolder.classList.add('hide');
  };

  priceInput.addEventListener('keydown', (e) => {
    if (!/[0-9]/.test(e.key)
      && ['Backspace', 'ArrowLeft', 'ArrowRight', '.'].indexOf(e.key) === -1) {
      e.preventDefault();
      return false;
    }
    return true;
  });

  $('.submitPrice', DomElement).addEventListener('click', () => {
    if (priceInput.value !== '' && parseInt(priceInput.value, 10) > 0) {
      DomElement.value = parseInt(priceInput.value, 10);
      eventManager.emit(sell ? 'gotPrice' : 'mintNFT');
      DomElement.setText('I\'m creating your NFT please wait...');
      priceHolder.classList.add('hide');
    } else {
      DomElement.value = null;
    }
  });

  $('.submitAddress', DomElement).addEventListener('click', () => {
    if (addressInput.value !== '') {
      eventManager.emit('gotAddress', addressInput.value);
      DomElement.setText('I\'m sending your NFT please wait...');
      addressHolder.classList.add('hide');
    } else {
      DomElement.setText('Please make sure the address is correct!');
    }
  });

  DomElement.reset = () => {
    DomElement.setText(`Hello and welcome to The NFT vending machine!
    I'm Gloody, I'm here to help, if you want to publish your NFT
    use the typing machine to write your descripion and the camera to take a picture.
    Once you are done ring the bell, I'll handle everything else.`);
    addressHolder.classList.add('hide');
    priceHolder.classList.add('hide');
  };

  return DomElement;
};

module.exports = Bubble;
