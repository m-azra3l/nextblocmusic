// Import chai and hardhat
const { expect } = require("chai");
const { ethers } = require("hardhat");

// Describe the test suite for the MarketPlace contract
describe("MarketPlace", function(){
    // Define the test case
    it("Should create and execute market sales", async function(){

        // Deploy the MarketPlace contract
        const Market = await ethers.getContractFactory("MarketPlace")
        const market = await Market.deploy()
        await market.deployed()
        const marketAddress = market.address

        // Deploy the NFT contract
        const NFT = await ethers.getContractFactory("NFT")
        const nft = await NFT.deploy(marketAddress)
        await nft.deployed()
        const nftContractAddress = nft.address

        // Get the listing price for the market
        let listingPrice = await market.getListingPrice()
        listingPrice = listingPrice.toString()

        // Define the auction price
        const auctionPrice = ethers.utils.parseUnits('100','ether')
        
        // Create two tokens
        await nft.createToken("https://www.mysonguri.com")
        await nft.createToken("https://www.mysonguri2.com")

        // Create two market items
        await market.createMarketItem(nftContractAddress, 1, auctionPrice, {value: listingPrice})
        await market.createMarketItem(nftContractAddress, 2, auctionPrice, {value: listingPrice})

        // Get the address of the buyer
        //get the signer's address and assign to buyerAddress variable
        const [_,buyerAddress] = await ethers.get.getSigners()

        //connect to the market contract using the buyerAddress, and create a market sale using the nft contract address and token id 1, with a value of auctionPrice
        await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, {value: auctionPrice})

        //fetch all the items in the market
        let items = await market.fetchMarketItems()

        //fetch the token URI for each item and return the item object with token URI
        items = await Promise.all(items.map(async i =>{
        const tokenUri = await nft.tokenURI(i.tokenId)
        let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
        }
        return item
        }))

        //log the items
        console.log('items:', items)
    });
});