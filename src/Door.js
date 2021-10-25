import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import {
  nftaddress, nftmarketaddress,
} from '../config';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json';

const {
  html, $, emptyElement, escape,
} = require('@forgjs/noframework');

const NFTElem = (props, eventManager) => {
  const DomElement = html`<div class="nft">
    <img src="${props.image}">
    <div class="info">
      <h2>${escape(props.name)}</h2>
      <p>${escape(props.description)}</p>
      ${props.owned ? html`<div class="opts">
        <div class="send">Send nft</div>
        <div class="sell">Sell</div>
      </div>` : ''}
    </div>
  </div>`;

  if ($('.opts', DomElement)) {
    $('.sell', DomElement).addEventListener('click', () => {
      eventManager.emit('open');
      eventManager.emit('sell-owned-nft', props);
    });

    $('.send', DomElement).addEventListener('click', async () => {
      eventManager.emit('open');
      eventManager.emit('send-owned-nft', props);
    });
  }
  return DomElement;
};

async function myNFTS() {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
  const data = await marketContract.fetchItemsCreated();

  const items = await Promise.all(data.map(async (i) => {
    const tokenUri = await tokenContract.tokenURI(i.tokenId);
    const meta = await (await fetch(tokenUri)).json();
    const price = ethers.utils.formatUnits(i.price.toString(), 'ether');
    const item = {
      price,
      tokenId: i.tokenId.toNumber(),
      seller: i.seller,
      owner: i.owner,
      sold: i.sold,
      image: meta.image,
      name: meta.nftTitle,
      description: meta.nftDescription,
    };
    return item;
  }));

  return {
    soldItems: items.filter((i) => i.sold),
    items: items.filter((i) => !i.sold),
  };
}

async function ownedNFTS() {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);

  const data = await marketContract.fetchMyNFTs();
  const items = await Promise.all(data.map(async (i) => {
    const tokenUri = await tokenContract.tokenURI(i.tokenId);
    const meta = await (await fetch(tokenUri)).json();
    const price = ethers.utils.formatUnits(i.price.toString(), 'ether');
    const item = {
      price,
      tokenId: i.tokenId.toNumber(),
      seller: i.seller,
      owner: i.owner,
      sold: i.sold,
      image: meta.image,
      name: meta.nftTitle,
      description: meta.nftDescription,
      owned: true,
    };
    return item;
  }));
  return items;
}

const Door = (eventManager) => {
  const DomElement = html`<div class="close">
    <div class="owned">
      <h2>Owned NFTs</h2>
      <div class="list"></div>
    </div>
    <div class="created">
      <h2>On the market NFTs</h2>
      <div class="list"></div>
    </div>
    <div class="sold">
      <h2>Sold NFTs</h2>
      <div class="list"></div>
    </div>
    <div class="handle">Pull</div>
    <div class="info-bubble hide"></div>
  </div>`;
  let y = 0;
  let on = false;
  const UP = 1;
  const DOWN = 2;

  let dir = UP;

  $('.handle', DomElement).addEventListener('mousedown', (e) => {
    on = true;
    y = e.clientY;
    DomElement.classList.remove('animate');
  });

  document.body.addEventListener('mouseup', (e) => {
    if (on === true) {
      on = false;
      y = e.clientY;
      DomElement.classList.add('animate');
      if (dir === DOWN && y > 150) {
        DomElement.style.bottom = '0px';
        DomElement.updatePreview();
      } else if (dir === UP && y > document.body.clientHeight - 150) {
        DomElement.style.bottom = 'calc(0%)';
      } else {
        DomElement.style.bottom = 'calc(100% - 40px)';
      }
    }
  });
  document.body.addEventListener('mousemove', (e) => {
    if (on === false) return;
    if (Math.abs(y - e.clientY) < 10) return;
    dir = y - e.clientY > 0 ? UP : DOWN;
    y = e.clientY;
    DomElement.style.bottom = `calc(100% - ${y + 25}px)`;
  });

  DomElement.updatePreview = async () => {
    const { soldItems, items } = await myNFTS();
    const owned = await ownedNFTS();
    const createdList = $('.created>.list', DomElement);
    const soldList = $('.sold>.list', DomElement);
    const ownedList = $('.owned>.list', DomElement);

    emptyElement(createdList);
    emptyElement(soldList);
    emptyElement(ownedList);

    soldItems.forEach((e) => {
      soldList.appendChild(NFTElem(e, eventManager));
    });
    items.forEach((e) => {
      createdList.appendChild(NFTElem(e, eventManager));
    });

    owned.forEach((e) => {
      ownedList.appendChild(NFTElem(e, eventManager));
    });
  };

  eventManager.subscribe('open', () => {
    DomElement.classList.add('animate');
    DomElement.style.bottom = 'calc(100% - 40px)';
  });

  DomElement.infoBubble = (txt) => {
    const bubble = $('.info-bubble', DomElement);
    bubble.innerText = txt;
    bubble.classList.remove('hide');
    setTimeout(() => {
      bubble.innerText = '';
      bubble.classList.add('hide');
    }, 3000);
  };

  return DomElement;
};

module.exports = Door;
