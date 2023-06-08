// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.11;

/**
 * @title BytecodeSalt
 * @author Royal
 *
 * @notice Used to make the bytecode of each deployment unique.
 *
 *  This helps ensure that we can verify each contract separately on Etherscan.
 *
 *  This file serves no other purpose, and does not affect the functionality of the inheriting
 *  smart contract.
 */
contract BytecodeSalt {
    uint256 public constant BYTECODE_SALT = 3;
}
