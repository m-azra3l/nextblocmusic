// SPDX-License-Identifier: MIT
// This code is licensed under the MIT license


// This code is written in Solidity version 0.8.17
pragma solidity ^0.8.17;

// This code imports the "@openzeppelin/contracts/utils/Counters.sol" library which provides the Counters.Counter type used in the contract
// It also imports the "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol" library which provides the ERC721URIStorage contract that this contract inherits from
// Finally, it imports the "@openzeppelin/contracts/token/ERC721/ERC721.sol" library which provides the ERC721 contract that the ERC721URIStorage contract inherits from
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


// commented out import statement for "hardhat/console.sol"
//import "hardhat/console.sol";


// This contract is called "NFT" and it inherits from the "ERC721URIStorage" contract
// It uses the "Counters" library for the Counters.Counter type
// It has a private variable "_tokenIds" of type Counters.Counter
// It also has a variable "contractAddress" of type "address" to store the address of the marketplace.
contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    // This constructor takes in an address for the marketplace and creates an ERC-721 token with the name "blocMusic Tokens" and symbol "BMT"
    // it also saves the marketplace address in a variable 
    constructor(address marketplaceAddress) ERC721("blocMusic Tokens", "BMT"){
        contractAddress = marketplaceAddress;
    }
    
    // createToken function takes in a tokenURI and creates a new token by incrementing the tokenIds counter
    // it then calls the _mint function to mint the token to the msg.sender and sets the tokenURI for the new token
    // it also sets the approval for all for the marketplace address 
    // it returns the new token's ID
    function createToken(string memory tokenURI) public returns (uint){
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
    
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }
    
}

