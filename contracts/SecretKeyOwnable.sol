// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.11;

// Can use console.log() for debugging.
import "hardhat/console.sol";

/**
 * @title SecretKeyOwnable
 * @author Royal
 *
 * @notice A buggy contract that attempts to implement access control.
 *
 *  THIS CODE CONTAINS VULNERABILITIES. DO NOT USE THIS CODE IN PRODUCTION.
 */
abstract contract SecretKeyOwnable {

    // ==================== Storage ==================== //

    bytes32 private _SECRET_KEY_HASH_;

    constructor(
        bytes32 secretKeyHash
    ) {
        _SECRET_KEY_HASH_ = secretKeyHash;
    }

    // ==================== Modifiers ==================== //

    /**
     * @dev Requires that the caller knows the secret key that matches the stored hash.
     */
    modifier onlyOwner(
        string calldata secretKey
    ) {
       require(
           _isSecretKey(secretKey),
           "wrong secret key"
       );
       _;
    }

    // ==================== External Functions ==================== //

    function getSecretKeyHash()
        external
        view
        returns (bytes32)
    {
        return _SECRET_KEY_HASH_;
    }

    // ==================== Internal Functions ==================== //

    function _isSecretKey(
        string memory secretKey
    )
        internal
        view
        returns (bool)
    {
        return keccak256(abi.encodePacked(secretKey)) == _SECRET_KEY_HASH_;
    }
}
