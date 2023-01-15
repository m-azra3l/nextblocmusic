// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

//import "hardhat/console.sol";

contract MarketPlace is ReentrancyGuard{
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    address payable owner;
    uint256 listingPrice;    
    uint256 public royaltyFee;

    constructor ()
    {
        owner = payable(msg.sender);
    }
    struct MarketItem {
        uint itemId;
        uint256 tokenId;
        address nftContract;
        address payable owner;
        address payable seller;
        uint256 price;
        address payable author;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idtoMarketItem; 

    event MarketItemCreated (
        uint indexed itemId,
        uint256 indexed tokenId,
        address indexed nftContract,
        address owner,
        address seller,
        uint256 price,
        address author,
        bool sold
    );
    
    function getListingPrice() public view returns (uint256) {return listingPrice;}

    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    )public payable nonReentrant{
        require(price > 0,"price must be at least 1 wei");
        require(msg.value == listingPrice,"price must be at least 1 wei");

        _itemIds.increment;
        uint256 itemId = _itemIds.current();
        idtoMarketItem[itemId] = MarketItem(
            itemId,            
            tokenId,
            nftContract,
            payable (msg.sender),
            payable (address(0)),
            price,            
            payable (msg.sender),
            false
        );
    }
}
