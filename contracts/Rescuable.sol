// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.11;

// Can use console.log() for debugging.
import "hardhat/console.sol";

import { IERC20 } from "./openzeppelin/IERC20.sol";
import { SafeERC20 } from "./openzeppelin/SafeERC20.sol";
import { SecretKeyOwnable } from "./SecretKeyOwnable.sol";

/**
 * @title Rescuable
 * @author Royal
 *
 * @notice A buggy contract that attempts to implement withdrawals of exccess tokens.
 *
 *  THIS CODE CONTAINS VULNERABILITIES. DO NOT USE THIS CODE IN PRODUCTION.
 *
 *  This contract inherits from SecretKeyOwnable.sol.
 */
abstract contract Rescuable is
    SecretKeyOwnable
{
    using SafeERC20 for IERC20;

    /**
     * @dev Get the “excess” withdrawable ETH amount.
     *
     *  Default implementation. Should be overriden by inheriting contract.
     */
    function _getExcessEthAmount()
        internal
        view
        virtual
        returns (uint256)
    {
        return address(this).balance;
    }

    /**
     * @dev Get the “excess” withdrawable ERC-20 token amount.
     *
     *  Default implementation. Should be overriden by inheriting contract.
     */
    function _getExcessErc20Amount(
        IERC20 token
    )
        internal
        view
        virtual
        returns (uint256)
    {
        return token.balanceOf(address(this));
    }

    /**
     * @notice Allows the owner to withdraw excess ETH.
     *
     *  The inheriting contract is responsible for determining what counts as “excess”.
     */
    function rescueEth(
        string calldata secretKey,
        address to
    )
        external
        onlyOwner(secretKey)
    {
        uint256 excess = _getExcessEthAmount();
        payable(to).transfer(excess);
    }

    /**
     * @notice Allows the owner to withdraw excess ERC-20 tokens.
     *
     *  The inheriting contract is responsible for determining what counts as “excess”.
     */
    function rescueERC20(
        string calldata secretKey,
        IERC20 token,
        address to
    )
        external
        onlyOwner(secretKey)
    {
        uint256 excess = _getExcessErc20Amount(token);
        token.safeTransfer(to, excess);
    }
}
