const { html, $$, $ } = require('@forgjs/noframework');

const Robot = () => {
  const DomElement = html`<div class="robot">
    <div class="body">
      <div class="face">
        <div class="brow"></div>
        <div class="brow"></div>
        <div class="eye"></div>
        <div class="eye"></div>
        <div class="loader hide">
          <div class="dot-pulse"></div>
        </div>
      </div>
      <div class="circle"></div>
    </div>
    <div class="arm"></div>
    <div class="arm"></div>
    <div class="base">
      <div class="btm"></div>
      <div class="ellipse"></div>
    </div>
  </div>`;
  const loader = $('.loader', DomElement);

  DomElement.toggleLoad = () => {
    loader.classList.toggle('hide');
    $$('.brow, .eye', DomElement).forEach((e) => {
      e.classList.toggle('hide');
    });
  };

  return DomElement;
};

module.exports = Robot;
