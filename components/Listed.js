import React from "react"
import { Link } from "next/link"
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { Inter } from '@next/font/google'
import  '@/styles/Home.module.css'
import{marketplaceAddress} from '../config'
import MusicMarketPlace from '../artifacts/contracts/MusicMarketPlace.sol/MusicMarketPlace.json'

const inter = Inter({ subsets: ['latin'] })

export default function Listed () {
 
  const [listednfts, setlistedNfts] = useState([])  
  const [listloadingState, listsetLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadlistedNFTs()
  }, [])

  
  async function loadlistedNFTs() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(marketplaceAddress, MusicMarketPlace.abi, signer)
    const data = await contract.fetchItemsListed()

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
        song: meta.data.songurl
      }
      return item
    }))

    setlistedNfts(items)
    listsetLoadingState('loaded') 
  }

 

    if (listloadingState === 'loaded' && !listednfts.length) return (<h1>No NFTs listed</h1>)
return(
  <>
    <div>
    </div>
  </>
)
}