import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import {ethers} from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'Web3Modal'

import{marketplaceAddress} from '../config'
import MusicMarketPlace from '../artifacts/contracts/MusicMarketPlace.sol/MusicMarketPlace.json'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider()
    const contract = new ethers.Contract(marketplaceAddress, MusicMarketPlace.abi, provider)
    const data = await contract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.imageurl,        
        song: meta.data.songurl,
        title: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(marketplaceAddress, MusicMarketplace.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className={styles.featuredTitle}>No items in marketplace</h1>)
  return (
    <>
        <div className={styles.centers}>
          <br/>
          <h1>Welcome to blocMusic</h1>
          <div className={styles.center}>
            <p>Putting control in the hands of the creator, home of creators supporting their works</p>
            <div className={styles.thirteen}>
              <Image
                src="/images/blocmusic.png"
                alt="13"
                width={40}
                height={31}
                priority
              />
            </div>
          </div>
        </div>
        <div className={styles.grid}>
          <div className={styles.songs}>
          {
             nfts.map((nft, i) => (
              <div className={styles.card}>
                <img src={nft.image} />
                  <p>{nft.name}</p>
                  <p>{nft.description}</p>
                <div>
                  <p>{nft.price} ETH</p>
                  <button onClick={() => buyNft(nft)}>Buy</button>
                  <button onClick={() => buyNft(nft)}>Play</button>
                </div>
              </div>

             ))
          }
          </div>
        </div>
    </>
  )
}
