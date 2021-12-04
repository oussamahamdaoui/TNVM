import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import {
  nftaddress, nftmarketaddress,
} from '../config';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json';

const { html, EventManager, $ } = require('@forgjs/noframework');

// eslint-disable-next-line import/no-extraneous-dependencies
const feather = require('feather-icons');
const VM = require('./VM');
const TM = require('./TM');
const Camera = require('./Camera');
const Bell = require('./Bell');
const Robot = require('./Robot');
const Bubble = require('./Bubble');
const Door = require('./Door');

async function createSale(url, pr) {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();

  /* next, create the item */
  let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
  let transaction = await contract.createToken(url);
  const tx = await transaction.wait();
  const event = tx.events[0];
  const value = event.args[2];
  const tokenId = value.toNumber();

  const price = ethers.utils.parseUnits(pr, 'ether');

  /* then list the item for sale on the marketplace */
  contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
  let listingPrice = await contract.getListingPrice();
  listingPrice = listingPrice.toString();

  transaction = await contract.createMarketItem(nftaddress,
    tokenId, price, { value: listingPrice });
  await transaction.wait();
}

const App = () => {
  const eventManager = new EventManager();
  const bubble = Bubble(eventManager);
  const robot = Robot(eventManager);
  const door = Door(eventManager);
  const camera = Camera(eventManager);
  const tm = TM(eventManager);

  const DomElement = html`
    <div class="app">
        ${door}
        <button class="button-sound mute">
          ${feather.icons['volume-x'].toSvg()}
          ${feather.icons['volume-1'].toSvg()}
        </button>
        ${VM(eventManager)}
        ${robot}
        ${bubble}
        <div class="table">
          ${tm}
          ${camera}
          ${Bell(eventManager)}
          <div class="table-leg l"></div>
          <div class="table-leg r"></div>
        </div>
        <img class="graffiti2" src="graffiti2.svg">
        <div class="floor"></div>
    </div>`;
  const toggleMuteButton = $('.button-sound', DomElement);
  let nftImage = null;
  let nftDescription = '';
  let nftTitle = '';
  let toBeSold = null;
  let toBeSent = null;

  toggleMuteButton.addEventListener('click', () => {
    eventManager.emit('toggle-mute');
    toggleMuteButton.classList.toggle('mute');
  });

  eventManager.subscribe('changeTitle', (newTitle) => {
    nftTitle = newTitle;
  });

  eventManager.subscribe('changeDescription', (newDescription) => {
    nftDescription = newDescription;
  });

  eventManager.subscribe('changeImage', (newImage) => {
    nftImage = newImage;
  });

  eventManager.subscribe('submitNft', () => {
    if (!nftDescription || !nftImage || !nftTitle) {
      bubble.setText(`Please fill the title and description using the typing machine
       and click a picture using the camera before I can submit your NFT`);
    } else {
      bubble.askPrice('Wow! Very interresting NFT. How much are you selling this for?');
    }
  });

  eventManager.subscribe('mintNFT', async () => {
    robot.toggleLoad();
    const formData = new FormData();
    formData.append('file', nftImage);
    formData.append('json', JSON.stringify({
      nftTitle, nftDescription,
    }));
    let url = await fetch('/create-nft', {
      method: 'POST',
      body: formData,
    });
    url = (await url.json()).path;
    await createSale(url, bubble.value.toString());
    bubble.reset();
    robot.toggleLoad();
    camera.reset();
    tm.reset();
  });

  eventManager.subscribe('sell-owned-nft', async (nft) => {
    bubble.askPrice('Wow! Very interresting NFT. How much are you selling this for?', true);
    toBeSold = nft;
  });

  eventManager.subscribe('send-owned-nft', async (nft) => {
    bubble.askAddress('Very nice of you! What address do you want to send this NFT to?');
    toBeSent = nft;
  });
  eventManager.subscribe('gotAddress', async (address) => {
    robot.toggleLoad();
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    const contractNft = new ethers.Contract(nftaddress, NFT.abi, signer);
    await contractNft.setApprouve();
    await contract.transferTo(nftaddress, address, toBeSent.tokenId);
    robot.toggleLoad();
    bubble.reset();
    tm.reset();
  });
  eventManager.subscribe('gotPrice', async () => {
    if (toBeSold === null) return;
    robot.toggleLoad();
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contractNft = new ethers.Contract(nftaddress, NFT.abi, signer);
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    await contractNft.setApprouve();
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();
    const pr = ethers.utils.parseUnits(bubble.value.toString(), 'ether');
    await contract.createMarketItem(nftaddress,
      toBeSold.tokenId, pr, { value: listingPrice });
    robot.toggleLoad();
    bubble.reset();
    tm.reset();
  });

  eventManager.subscribe('boughtNft', () => {
    door.infoBubble('Check yor NFTs here');
  });

  return DomElement;
};
if (window.ethereum) {
  window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [{
      chainId: '0x2328',
      chainName: 'Evmos Testnet',
      nativeCurrency: {
        name: 'PHOTON',
        symbol: 'PHO',
        decimals: 18,
      },
      rpcUrls: ['https://ethereum.rpc.evmos.dev'],
      blockExplorerUrls: ['https://evm.evmos.com'],
    }],
  }).then((e) => {
    console.log(e);
    document.body.append(App());
  }).catch(() => {
    document.body.append(html`<h1>Methamask is required to run this app</h1>`);
  });
} else {
  document.body.append(html`<h1>Methamask is required to run this app</h1>`);
}
