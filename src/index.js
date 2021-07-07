const {html, $} = require('@forgjs/noframework');
const VM = require('./VM');

const App = () => {
    const DomElement = html`
    <div class="app">
        ${VM()}
        <div class="floor"></div>
        <div class="light"></div>
    </div>`;
    
    return DomElement;
}
document.body.append(App());

