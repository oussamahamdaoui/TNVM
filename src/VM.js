import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import {
  nftaddress, nftmarketaddress,
} from '../config';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json';

const { html, $, $$ } = require('@forgjs/noframework');

async function loadNFTs() {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
  const data = await marketContract.fetchMarketItems();

  const items = await Promise.all(data.map(async (i) => {
    const tokenUri = await tokenContract.tokenURI(i.tokenId);
    const meta = await (await fetch(tokenUri)).json();
    const price = ethers.utils.formatUnits(i.price.toString(), 'ether');
    const item = {
      price,
      tokenId: i.tokenId.toNumber(),
      seller: i.seller,
      owner: i.owner,
      image: meta.image,
      name: meta.nftTitle,
      description: meta.nftDescription,
    };
    return item;
  }));
  return items;
}

async function buyNft(nft) {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

  const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
  const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
    value: price,
  });
  await transaction.wait();
}

const VM = async (eventManager) => {
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
                            <div class="position">11</div>
                        </div>
                        <div class="product" position="12" style="--drop:400%;">
                            <div class="position">12</div>
                        </div>
                        <div class="product" position="13" style="--drop:400%;">
                            <div class="position">13</div>
                        </div>
                    </div>
                    <div class="shelve">
                        <div class="product" position="21" style="--drop:300%;">
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
                            <div class="position">32</div>
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
    </div>`;

  const keyboard = $('.keyboard', DomElement);
  const selectedItem = $('.selected-item', DomElement);
  const trap = $('.trap', DomElement);
  const motorSound = new Audio('./motor.mp3');
  const bipSound = new Audio('/bip.mp3');
  const bgSound = new Audio('./bg.mp3');
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
      name: 'dropSound',
      audio: dropSound,
      volume: 0.3,
    }, {
      name: 'openSound',
      audio: openSound,
      volume: 0.05,
    },
  ];

  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider);
  let selected = null;
  marketContract.on('MarketItemCreated', () => {
    DomElement.loadNFTs();
  });

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
    const buffer = 0.44;
    if (bgSound.currentTime > bgSound.duration - buffer) {
      bgSound.currentTime = 0;
      bgSound.play();
    }
  });

  trap.addEventListener('mouseenter', () => {
    if (audioFiles[0].audio.volume > 0) {
      openSound.play();
    }
  });

  trap.addEventListener('mouseleave', () => {
    if (audioFiles[0].audio.volume > 0) {
      openSound.play();
    }
  });

  trap.addEventListener('click', (e) => {
    if (e.target === $('img', trap)) {
      $('img', trap).className = '';
      eventManager.emit('boughtNft');
    }
  });

  const drop = async (elem) => {
    if (!elem || !$('img', elem)) return;
    $('img', elem).classList.add('drop');
    if ($('img', trap).classList.contains('drop')) {
      $('img', trap).className = '';
    }
    $('img', trap).src = $('img', elem).src;
    elem.parentNode.classList.add('drop');
    if (audioFiles[0].audio.volume > 0) {
      motorSound.play();
    }

    $('img', elem).onanimationend = () => {
      const pos = Array.from($('img', elem).parentNode.parentNode.children).indexOf($('img', elem).parentNode);
      $('img', trap).classList.add(`pos${pos}`);
      $('img', trap).classList.add('drop');
      if (audioFiles[0].audio.volume > 0) {
        dropSound.play();
      }
      $('img', elem).remove();
    };
  };

  keyboard.addEventListener('click', (e) => {
    if (!e.target.classList.contains('button')) return;
    bipSound.play();
    if (e.target.classList.contains('green')) {
      if (selectedItem.innerHTML.length < 2) return;
      const id = selectedItem.innerHTML;
      selected = $(`[position="${id}"]`, DomElement);
      if (selected === null) return;
      const { price } = $('img', selected).nftData;
      selectedItem.innerHTML = price;
    } else {
      if (selected) {
        selectedItem.innerHTML = '';
        selected = null;
      }
      selectedItem.innerHTML = (selectedItem.innerHTML + e.target.innerHTML).slice(-2);
    }
  });

  $('.card', DomElement).addEventListener('click', async () => {
    if (selected === null) return;
    await buyNft($('img', selected).nftData);
    setTimeout(() => {
      drop(selected);
      selectedItem.innerHTML = '';
      selected = null;
    }, 1200);
  });

  DomElement.loadNFTs = async () => {
    const nfts = await loadNFTs();
    const places = {
      11: [],
      12: [],
      13: [],
      21: [],
      22: [],
      23: [],
      31: [],
      32: [],
      33: [],
    };
    let i = 0;
    nfts.forEach((nft) => {
      places[Object.keys(places)[i % Object.keys(places).length]].push(nft);
      i += 1;
    });
    Object.keys(places).forEach((place) => {
      $$(`[position="${place}"]>img`, DomElement).forEach((e) => e.remove());
      places[place].forEach((nft) => {
        const nftElem = html`<img src="${nft.image}">`;
        nftElem.nftData = nft;
        $(`[position="${place}"]`, DomElement)
          .appendChild(nftElem);
      });
    });
  };

  DomElement.loadNFTs();

  return DomElement;
};

module.exports = VM;
