const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const MusicMarketPlace = await hre.ethers.getContractFactory("MusicMarketPlace");
  const nftMarketplace = await MusicMarketPlace.deploy();
  await nftMarketplace.deployed();
  console.log("nftMarketplace deployed to:", nftMarketplace.address);

  fs.writeFileSync('./config.js', `
  export const marketplaceAddress = "${nftMarketplace.address}"
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
