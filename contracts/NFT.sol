// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

//import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;
    mapping(uint256 => string) private _imageURIs;
    mapping(uint256 => string) private _songURIs;

    constructor(address marketplaceAddress) ERC721("blocMusic Tokens", "BMT"){
        contractAddress = marketplaceAddress;
    }

    function createToken(string memory tokenURI, string memory imageURI, string memory songURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _imageURIs[newItemId] = imageURI;
        _songURIs[newItemId] = songURI;
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }
    
    function getImageURI(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token ID does not exist");
        return (_imageURIs[tokenId]);
    }

    function getSongURI(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token ID does not exist");
        return (_songURIs[tokenId]);
    }
}