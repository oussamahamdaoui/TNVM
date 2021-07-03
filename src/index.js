const {html, $} = require('@forgjs/noframework');

const Calculator = ()=>{
    const DomElement = html`<div class="vending-machine">
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
                <div class="cube back"></div>
                <div class="glaire"></div>

                <div class="shelve">
                    <div class="product" position="11">
                        <img src="one.png">
                        <div class="position">11</div>
                    </div>
                    <div class="product" position="12">
                        <img src="two.png">
                        <div class="position">12</div>
                    </div>
                    <div class="product" position="13">
                        <img src="two.png">
                        <div class="position">13</div>
                    </div>
                </div>
                <div class="shelve">
                    <div class="product" position="21">
                        <img src="one.png">
                        <div class="position">21</div>
                    </div>
                    <div class="product"></div>
                    <div class="product"></div>
                </div>
                <div class="shelve"></div>
                <div class="shelve"></div>
            </div>
            
            <div class="trap">
                <div class="cube top"></div>
                <div class="cube left"></div>
                <div class="cube bot"></div>
                <div class="cube right"></div>
                <div class="cube back"></div>
                <div class="glaire"></div>
                <div class="lid">PULL</div>
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
                </div>
            </div>
        </div>
        <div class="foot left"></div>
        <div class="foot right"></div>
        <div class="bottom"></div>
    </div>`;


    const keyboard = $('.keyboard', DomElement);
    const selectedItem = $('.selected-item', DomElement);

    const drop = (elem) => {
        $('img',elem).classList.add('drop');
        elem.parentNode.classList.add('drop');
    }

    keyboard.addEventListener('click', (e)=>{
        if(!e.target.classList.contains('button')) return;
        if(e.target.classList.contains('green')){
            if(selectedItem.innerHTML.length < 2) return;
            const id = selectedItem.innerHTML;
            drop($(`[position="${id}"]`, DomElement));
            selectedItem.innerHTML = "";
        } else {
            selectedItem.innerHTML = (selectedItem.innerHTML + e.target.innerHTML).slice(-2);
        }
    });
    

    return DomElement;
};

document.body.append(Calculator());