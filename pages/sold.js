import React from "react"
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import{marketplaceAddress,nftAddress} from '../config'
import MarketPlace from '../artifacts/contracts/MarketPlace.sol/MarketPlace.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

const inter = Inter({ subsets: ['latin'] })

export default function Sold () {  
  
  const [sold, setSold] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded')  

  useEffect(() => {
    loadsoldNFTs();
  }, [])


  async function loadsoldNFTs() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const marketplaceContract = new ethers.Contract(marketplaceAddress, MarketPlace.abi, signer)
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);    
    const data = await marketplaceContract.fetchItemsCreated();

    // const items = await Promise.all(data.filter(i => library.find(x => x.tokenId === i.tokenId)).map(async i => {
    //   let item = library.find(x => x.tokenId === i.tokenId);
    //   let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
    //   item = {
    //     price,
    //     tokenId: i.tokenId.toNumber(),
    //     seller: i.seller,
    //     owner: i.owner,
    //     sold: i.sold,
    //     title: item.title,
    //     description: item.description,
    //     image: item.imageUrl,
    //     song: item.songUrl
    //   }
    //   return item
    // }))
    const items = await Promise.all(data.map(async i => {      
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          sold: i.sold,
          title: meta.data.title,
          description: meta.data.description,
          image: meta.data.imageUrl,
          song: meta.data.songUrl
      }
      return item
    }))
    const soldItems = items.filter((i) => i.sold);
    setSold(soldItems)
    setLoadingState('loaded') 
  }

    if (loadingState === 'loaded' && !sold.length) 
    return (
        <div className={styles.mycontainer}> 
            <h2>No NFTs sold</h2>
        </div>
    )
    return(
        <>
            <div clasName={styles.mycontainer}>
            
            </div>
            
        </>
    )
}