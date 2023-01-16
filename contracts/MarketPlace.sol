// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract MarketPlace is ReentrancyGuard{
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    address payable owner;
    uint256 listingPrice = 0.25 ether;    

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
            false
        );
    }
    function createMarketSale(
        address nftContract,
        uint256 itemId
    )public payable nonReentrant{
        uint price = idtoMarketItem[itemId].price;
        uint tokenId = idtoMarketItem[itemId].tokenId;

        require(msg.value == price, "Please provide the asking price to make purchase.");

        idtoMarketItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idtoMarketItem[itemId].owner = payable(msg.sender);
        idtoMarketItem[itemId].sold = true;
        _itemsSold.increment();
        payable(owner).transfer(listingPrice);
    }

    function fetchMarketItems() public view returns (MarketItem[] memory){
        uint itemCount = _itemIds.current();
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);

        for(uint i = 0; i < itemCount; i++){
            if(idtoMarketItem[i + 1].owner == address(0)){
                uint currentId = idtoMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idtoMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchMyNFTS() public view returns (MarketItem[] memory){
        uint totalItemCount = _itemIds.current(); 
        uint itemCount = 0;
        uint currentIndex = 0;

        for(uint i = 0; i < totalItemCount; i++){
            if(idtoMarketItem[i + 1].owner == msg.sender){
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for(uint i = 0; i < totalItemCount; i++){
            if(idtoMarketItem[i + 1].owner == msg.sender){
                uint currentId = idtoMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idtoMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchItemsCreated() public view returns (MarketItem[] memory){
        uint totalItemCount = _itemIds.current(); 
        uint itemCount = 0;
        uint currentIndex = 0;

        for(uint i = 0; i < totalItemCount; i++){
            if(idtoMarketItem[i + 1].seller == msg.sender){
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for(uint i = 0; i < totalItemCount; i++){
            if(idtoMarketItem[i + 1].seller == msg.sender){
                uint currentId = idtoMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idtoMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }    
}
