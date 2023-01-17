const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MarketPlace", function(){
    it("Should create and execute market sales", async function(){
        const Market = await ethers.getContractFactory("MarketPlace")
        const market = await Market.deploy()
        await market.deployed()
        const marketAddress = market.address

        const NFT = await ethers.getContractFactory("NFT")
        const nft = await NFT.deploy(marketAddress)
        await nft.deployed()
        const nftContractAddress = nft.address

        let listingPrice = await market.getListingPrice()
        listingPrice = listingPrice.toString()

        const auctionPrice = ethers.utils.parseUnits('100','ether')
        
        await nft.createToken("https://www.mytokelocation.com", "https://www.mytokelocation.com", "https://www.mytokelocation.com")
        await nft.createToken("https://www.mytokelocation2.com", "https://www.mytokelocation2.com","https://www.mytokelocation2.com")

        await market.createMarketItem(nftContractAddress, 1, auctionPrice, {value: listingPrice}, {value: "https://www.mytokelocation.com"}, {value: "https://www.mytokelocation.com"})
        await market.createMarketItem(nftContractAddress, 2, auctionPrice, {value: listingPrice}, {value: "https://www.mytokelocation2.com"}, {value: "https://www.mytokelocation2.com"})

        const [_,buyerAddress] = await ethers.getSigners()

        await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, {value: auctionPrice})
        
        let items = await market.fetchMarketItems()

        items = await Promise.all(items.map(async i =>{
            const tokenUri = await nft.tokenURI(i.tokenId)
            let item = {
              price: i.price.toString(),
              tokenId: i.tokenId.toString(),
              seller: i.seller,
              owner: i.owner,
              imageURI: i.imageURI,
              songURI: i.songURI,
              tokenUri
            }
            return item
        }))

        console.log('items:', items)
    });
});