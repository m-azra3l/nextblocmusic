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

export default function Collection () {
     
  const [sold, setSold] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')  
  const router = useRouter()
  
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
    const data = await marketplaceContract.fetchMyNFTs()

    const items = await Promise.all(data.map(async i => {
        const tokenURI = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenURI)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            title: meta.data.title,        
            description: meta.data.description,
            image: meta.data.image,
            song: meta.data.songurl,
            tokenURI
        }
        return item
      }))
      setmyNfts(items)
      setLoadingState('loaded')
  }

  function listNFT(nft) {
      console.log('nft:', nft)
      router.push(`/resell?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
  }

  if (loadingState === 'loaded' && !mynfts.length) 
  return (
    <div className={styles.mycontainer}>
      <h2>No NFTs owned</h2>
    </div>
    )
  return(
    <>
      <div className={styles.mycontainer}>        
          <div>
          </div>      
      </div> 
    </>
  )
}