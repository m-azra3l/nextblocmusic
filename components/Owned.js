import React from "react"
import { Link } from "next/link"
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { Inter } from '@next/font/google'
import '@/styles/Home.module.css'
import{marketplaceAddress} from '../config'
import MusicMarketPlace from '../artifacts/contracts/MusicMarketPlace.sol/MusicMarketPlace.json'

const inter = Inter({ subsets: ['latin'] })

const { TabPane } = Tabs;

export default function Owned () {
    const [mynfts, setmyNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')  
    

    useEffect(() => {
        loadmyNFTs()    
    }, [])

    async function loadmyNFTs() {
        const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const marketplaceContract = new ethers.Contract(marketplaceAddress, MusicMarketPlace.abi, signer)
        const data = await marketplaceContract.fetchMyNFTs()

        const items = await Promise.all(data.map(async i => {
        const tokenURI = await marketplaceContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenURI)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
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
 
    if (loadingState === 'loaded' && !mynfts.length) return (<h1>No NFTs owned</h1>)
   
    return(
        <>
            <div>
            </div>
        
        </>
    )
}