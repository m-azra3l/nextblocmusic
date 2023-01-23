import React from "react"
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import{marketplaceAddress,nftAddress} from '../config'
import MarketPlace from '../artifacts/contracts/MarketPlace.sol/MarketPlace.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

export default function Dashboard () {
  
  const [mynfts, setmyNfts] = useState([]) 
  const [loadingState, setLoadingState] = useState('not-loaded')  
  const router = useRouter()
  

  const handleClick = () => {
    router.push('/createnft')
  }
  useEffect(() => {
    loadmyNFTs()    
  }, [])

  async function loadmyNFTs() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketplaceContract = new ethers.Contract(marketplaceAddress, MarketPlace.abi, signer)
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);    
    const data = await marketplaceContract.fetchItemsCreated();

    const items = await Promise.all(data.filter(i => library.find(x => x.tokenId === i.tokenId)).map(async i => {
      let item = library.find(x => x.tokenId === i.tokenId);
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        title: item.title,
        description: item.description,
        image: item.imageUrl,
        song: item.songUrl
      }
      return item
    }))
    setmyNfts(items);
    setLoadingState('loaded')
  }

  if (loadingState === 'loaded' && !mynfts.length) 
  return (
    <div className={styles.mycontainer}>
      <h2>No NFTs owned</h2>
      <button onClick={handleClick} className={styles.connectButton}>CreateNFT</button>
    </div>
    )
  return(
    <>
      <div className={styles.mycontainer}>        
          <button onClick={handleClick} className={styles.connectButton}>CreateNFT</button>
          <div>
          </div>      
      </div> 
    </>
  )
}