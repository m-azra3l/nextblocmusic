// imports
const hre = require("hardhat");
const fs = require('fs');

// funtion to deploy the contracts
async function main() {

  // deploy the MarketPlace
  const MarketPlace = await hre.ethers.getContractFactory("MarketPlace");
  const nftMarketplace = await MarketPlace.deploy();
  await nftMarketplace.deployed();
  console.log("nftMarketplace deployed to:", nftMarketplace.address);

  //deploy the NFT
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarketplace.address);
  await nft.deployed();
  console.log("nft deployed to:", nft.address);


  // export the addresses
  fs.writeFileSync('./config.js', `
    export const marketplaceAddress = "${nftMarketplace.address}"
    export const nftAddress = "${nft.address}"

  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
