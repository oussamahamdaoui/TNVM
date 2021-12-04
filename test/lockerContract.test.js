require('@nomiclabs/hardhat-waffle');
const { expect } = require('chai');
const { ethers, network } = require('hardhat');

const { formatUnits, parseEther } = ethers.utils;

let Locker;
let locker;

describe('Locker', () => {
  beforeEach(async () => {
    Locker = await ethers.getContractFactory('Locker');
    locker = await Locker.deploy();
  });
  it('Should prevent from rentring the pool', async () => {
    const [addr1] = await ethers.getSigners();

    await locker.deployed();
    expect(await locker.fetchCurentRound()).to.equal(1);
    await locker.connect(addr1).enter({ value: parseEther('1') });
    const { piggybank } = await locker.connect(addr1).fetchAddressInfo();
    expect(formatUnits(piggybank, 'ether')).to.equal('1.0');
    let error;
    try {
      await locker.connect(addr1).enter({ value: parseEther('1') });
    } catch (e) {
      error = e;
    }
    expect(error).to.be.an('Error');
  });

  it('Should play nicely', async () => {
    const [addr1, addr2] = await ethers.getSigners();
    let piggybank;
    // ROUND 1
    await locker.connect(addr1).enter({ value: parseEther('1') }); // 1
    await locker.connect(addr2).enter({ value: parseEther('1') }); // 1

    // ROUND 2
    await network.provider.send('evm_increaseTime', [3600]);
    await locker.connect(addr1).enter({ value: parseEther('1') }); // 2

    // ROUND 3
    await network.provider.send('evm_increaseTime', [3600]);
    await locker.connect(addr1).enter({ value: parseEther('1') }); // 3

    // ROUND 4
    await network.provider.send('evm_increaseTime', [3600]);
    await locker.connect(addr2).enter({ value: parseEther('1') }); // 0

    piggybank = (await locker.connect(addr1).fetchAddressInfo()).piggybank;
    expect(formatUnits(piggybank, 'ether')).to.equal('4.0');
    piggybank = (await locker.connect(addr2).fetchAddressInfo()).piggybank;
    expect(formatUnits(piggybank, 'ether')).to.equal('1.0');
  });

  it('Should be able to redraw', async () => {
    const [addr1, addr2, addr3] = await ethers.getSigners();
    let piggybank;
    // ROUND 1
    await locker.connect(addr1).enter({ value: parseEther('1') }); // 1
    await locker.connect(addr2).enter({ value: parseEther('1') }); // 1
    await locker.connect(addr3).enter({ value: parseEther('1') }); // 1

    // ROUND 2
    await network.provider.send('evm_increaseTime', [3600]);
    await locker.connect(addr1).enter({ value: parseEther('1') }); // 2
    await locker.connect(addr2).enter({ value: parseEther('1') }); // 2
    // ROUND 3

    await network.provider.send('evm_increaseTime', [3600]);
    await locker.connect(addr1).enter({ value: parseEther('1') }); // 3

    piggybank = (await locker.connect(addr3).fetchAddressInfo()).piggybank;
    expect(formatUnits(piggybank, 'ether')).to.equal('0.0');

    await locker.connect(addr2).enter({ value: parseEther('1') }); // 3
    await locker.connect(addr2).exit();

    piggybank = (await locker.connect(addr2).fetchAddressInfo()).piggybank;
    expect(formatUnits(piggybank, 'ether')).to.equal('0.0');

    piggybank = (await locker.connect(addr1).fetchAddressInfo()).piggybank;
    expect(formatUnits(piggybank, 'ether')).to.equal('3.0');

    await network.provider.send('evm_increaseTime', [3600]);
    await locker.connect(addr1).enter({ value: parseEther('1') }); // 4
    await locker.connect(addr2).enter({ value: parseEther('1') }); // 1

    piggybank = (await locker.connect(addr1).fetchAddressInfo()).piggybank;
    expect(formatUnits(piggybank, 'ether')).to.equal('6.0'); // one from the redraw pool
    piggybank = (await locker.connect(addr2).fetchAddressInfo()).piggybank;
    expect(formatUnits(piggybank, 'ether')).to.equal('1.0'); // one from the redraw pool
  });
});
