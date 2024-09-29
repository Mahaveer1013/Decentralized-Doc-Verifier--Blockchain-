// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedNumber = 5;

    event NumberChanged(uint256 newNumber);

    function setNumber(uint256 _number) public {
        storedNumber = _number;
        emit NumberChanged(_number);
    }

    function getNumber() public view returns (uint256) {
        return storedNumber;
    }

    function increment() public {
        storedNumber += 1;
        emit NumberChanged(storedNumber);
    }

    function decrement() public {
        require(storedNumber > 0, "Cannot decrement below zero");
        storedNumber -= 1;
        emit NumberChanged(storedNumber);
    }
}
