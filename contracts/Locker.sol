// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract Locker  is ReentrancyGuard {
    using Counters for Counters.Counter;

    uint256 ONE_ROUND = 1 minutes;
    uint256 ONE_COIN = 1 ether;
    Counters.Counter private _userIdsCount;
   
    uint256 LAST_ROUND_DATE = block.timestamp;
    uint256 CURRENT_ROUND = 1;
    uint256 EXIT_POOL = 0;

    struct locked {
        uint piggybank;
        uint256 id;
        uint256 lastRound;
    }

    struct PotentialRewardInfo {
      uint256 TVL;
      uint256 potentialPoolValue;
      uint256 potentialReward;
      uint256 timeLesft;
    }

    event NewRound (
      uint256 currentRound
    );
      

    mapping(address => locked) users;
    mapping(uint256 => address) userKeys;

    function enter() public payable nonReentrant {
       if(block.timestamp > LAST_ROUND_DATE + ONE_ROUND){
          reward();
        }
        require(msg.value == ONE_COIN, "Value should be 1");
        require(users[msg.sender].lastRound < CURRENT_ROUND, "Address already participated in this CURRENT_ROUND");        
        if(users[msg.sender].id == 0){
          _userIdsCount.increment();
          users[msg.sender].id = _userIdsCount.current();
          userKeys[users[msg.sender].id] = msg.sender;
        }
        users[msg.sender].lastRound = CURRENT_ROUND;
        users[msg.sender].piggybank += msg.value;
    }

    function exit() public payable nonReentrant{
        if(block.timestamp > LAST_ROUND_DATE + ONE_ROUND){
          reward();
        }
        locked storage userInfo = users[msg.sender];
        require(userInfo.piggybank > ONE_COIN, "You don't have enaugh coins");
        uint256 value = userInfo.piggybank;
        userInfo.piggybank = 0;
        EXIT_POOL += ONE_COIN;
        payable(msg.sender).transfer(value - ONE_COIN);
    }


    function reward() public {
      require(block.timestamp > LAST_ROUND_DATE + ONE_ROUND, "It's not time yet");
      uint256 poolValue = EXIT_POOL;
      uint256 usersOnTime = 0;
      uint256 TVL = 0;
      
      for(uint i = 1; i <= _userIdsCount.current(); i++){
        address userAddress = userKeys[i];
        if(users[userAddress].lastRound < CURRENT_ROUND){
          if(users[userAddress].piggybank < (CURRENT_ROUND - users[userAddress].lastRound) * 1 ether){
            poolValue += users[userAddress].piggybank;
            users[userAddress].piggybank = 0;
          } else {
            users[userAddress].piggybank -= (CURRENT_ROUND - users[userAddress].lastRound) * 1 ether;
            poolValue += (CURRENT_ROUND - users[userAddress].lastRound) * 1 ether;
          }
        } else {
          usersOnTime += 1;
          TVL += users[userAddress].piggybank;
        }
      }
      console.log("Round", CURRENT_ROUND, "USERS on time", usersOnTime);
      console.log("Pool Value", poolValue);
      if(usersOnTime == 0 || TVL == 0) {
        CURRENT_ROUND += 1;
        LAST_ROUND_DATE = block.timestamp;
        EXIT_POOL = poolValue;
        return;
      }
      uint256 totalPoolValue = poolValue;
      for(uint i = 1; i <= _userIdsCount.current(); i++){
        address userAddress = userKeys[i];
        if(users[userAddress].lastRound == CURRENT_ROUND){
          uint256 v = (users[userAddress].piggybank / TVL) * totalPoolValue;
          poolValue -= v;
          users[userAddress].piggybank += v;
        }
      }
      LAST_ROUND_DATE = block.timestamp;
      CURRENT_ROUND += 1;
      EXIT_POOL = poolValue;
      emit NewRound(CURRENT_ROUND);
    }

    function fetchCurentRound() public view returns (uint256) {
      return CURRENT_ROUND;
    }

    function fetchAddressInfo() public view returns (locked memory){
      return users[msg.sender];
    }
    function fetchRewards () public view returns (uint256) {
      return EXIT_POOL;
    }
    
    function fetchPotentialRewardInfo() public view returns (PotentialRewardInfo memory) {
      uint256 poolValue = EXIT_POOL;
      uint256 usersOnTime = 0;
      uint256 TVL = 0;
      for(uint i = 1; i <= _userIdsCount.current(); i++){
        address userAddress = userKeys[i];
        if(users[userAddress].lastRound < CURRENT_ROUND) {
           if(users[userAddress].piggybank < CURRENT_ROUND - users[userAddress].lastRound){
            poolValue += users[userAddress].piggybank;
          } else {
            poolValue += (CURRENT_ROUND - users[userAddress].lastRound) * 1 ether;
          }
        } else {
          usersOnTime += 1;
          TVL += users[userAddress].piggybank;
        }
      }
      uint256 potentialPoolReward = TVL == 0 ? 0 : (users[msg.sender].piggybank/TVL) * poolValue;
      uint256 timeLeft = ONE_ROUND >  block.timestamp - LAST_ROUND_DATE ? ONE_ROUND - (block.timestamp - LAST_ROUND_DATE) : 0;
      return PotentialRewardInfo(TVL, poolValue, potentialPoolReward, timeLeft);
    }
}
