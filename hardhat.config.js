require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    
    mumbai: {
      // Infura
      url: process.env.MUMBAI_INFURA,
      accounts: [process.env.PRIVATE_INFURA]
    },
    matic: {
      // Infura
      url: process.env.MATIC_INFURA,
      accounts: [process.env.PRIVATE_INFURA]
    }
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

