# blocMusic

## Project Description

This project is a web3-based marketplace for buying, selling, and trading music NFTs (non-fungible tokens) using smart contracts. Users can mint their own NFTs representing their music, and also view and purchase existing NFTs from other artists.

## Project Snapshot

![Screenshot (132)](https://user-images.githubusercontent.com/26850963/214449150-0aa79e0a-86e2-4ce9-bb27-62c86bc2d99b.png)

![Screenshot (133)](https://user-images.githubusercontent.com/26850963/214449197-06338849-b5a9-4765-927a-1a27eb3c129b.png)

![Screenshot (131)](https://user-images.githubusercontent.com/26850963/214449238-e06fdc1a-c564-4d5d-ade8-bb5455d7593f.png)

## Project Website Link

Live website link: [blocMusic](https://blocmusic-m-azra3l.vercel.app/)

## Project Author

- [Michael Damilare Adesina](https://github.com/m-azra3l)


## How to Install and Run the Project

Fork the repository to your Github account
Clone the forked repository to your local machine

```git clone https://github.com/[username]/blocmusic.git```

### Dependecies

- OpenZeppelin
- Hardhat
- Waffle
- web3modal
- Infura
- IPFS

### Install the required dependencies

Open your terminal and run:
```yarn install```

### Compile and test the smart contract using hardhat and waffle

Open your terminal and run:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test

Deploy on localhost blockchain:
npx hardhat node
npx hardhat run scripts/deploy.js 

Deploy on Mumbai testnet:
npx hardhat run scripts/deploy.js --network polygon_mumbai
```

### Start the development server

```This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).```

First, run the development server:

```shell

yarn dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.jsx`. The page auto-updates as you edit the file.

### Infura IPFS

Here are the steps to create an Infura IPFS project, get the project ID and project secret key, and add them to the .env file:

1. Sign up for an account on Infura's website and create a new project.

2. In the project dashboard, click on the "Keys" tab and generate a new API key for IPFS.

3. Copy the Project ID and Project Secret Key from the project dashboard.

4. Rename `.env.example` to `.env` in the root directory of your project.

5. Add the following lines to the .env file, replacing YOUR_PROJECT_ID and YOUR_PROJECT_SECRET_KEY with the actual values:

IPFS_ID = "Your infura ipfs project Id "
IPFS_KEY = "Your infura ipfs project key"

6. Save the .env file.
Now you can use the project ID and project secret key in your application by accessing the IPFS_ID and IPFS_KEY environment variables.

### Learn more about Next JS

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Usage

Connect to a web3 wallet (e.g. MetaMask)
Browse and purchase existing Music NFTs or mint your own
Add your Music NFTs to your collection

## License

This project is licensed under GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007 and Grandida LLC.
