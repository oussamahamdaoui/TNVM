// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NVM is ERC721Enumerable {
    address private _administrator;
     constructor() ERC721("The NFT VendingMachine", "TNVM") {
         _administrator = msg.sender;
    }

    function createItem(address to) public returns (uint256){

    }
}