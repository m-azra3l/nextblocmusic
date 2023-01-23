import React from "react"
import { Link } from "next/link"
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import{marketplaceAddress} from '../config'
import MusicMarketPlace from '../artifacts/contracts/MusicMarketPlace.sol/MusicMarketPlace.json'

const inter = Inter({ subsets: ['latin'] })

export default function Sold () {
  const [soldnfts, setsoldNfts] = useState([])
  const [soldloadingState, soldsetLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadsoldNFTs();
  }, [])


  async function loadsoldNFTs() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(marketplaceAddress, MusicMarketPlace.abi, signer)
    const data = await contract.fetchMySoldItems()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        title: meta.data.title,
        image: meta.data.imageurl,
        song: meta.data.songurl
      }
      return item
    }))
    setsoldNfts(items)
    soldsetLoadingState('loaded') 
  }

    if (soldloadingState === 'loaded' && !soldnfts.length) 
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