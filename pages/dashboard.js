import React from "react"
import { Link } from "next/link"
import { Tabs } from "antd"
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import{marketplaceAddress} from '../config'
import MusicMarketPlace from '../artifacts/contracts/Markeplace.sol/MusicMarketPlace.json'

const inter = Inter({ subsets: ['latin'] })

const { TabPane } = Tabs;

export default function Dashboard () {
  const [mynfts, setmyNfts] = useState([])
  const [listednfts, setlistedNfts] = useState([])  
  const [soldnfts, setsoldNfts] = useState([])
  const [myloadingState, mysetLoadingState] = useState('not-loaded')  
  const [listloadingState, listsetLoadingState] = useState('not-loaded')
  const [soldloadingState, soldsetLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadmyNFTs();
    loadlistedNFTs();
    loadsoldNFTs();
  }, [])
  async function loadmyNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
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
    mysetLoadingState('loaded')
  }
  async function loadlistedNFTs() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
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
    const solditems = items.filter(i => i.sold)

    setlistedNfts(items)
    listsetLoadingState('loaded') 
    setsoldNfts(solditems)
    soldsetLoadingState('loaded') 
  }

     
    function listNFT(nft) {
      console.log('nft:', nft)
      router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
    }
    if (myloadingState === 'loaded' && !mynfts.length) return (<h1>No NFTs owned</h1>)
    if (listloadingState === 'loaded' && !listednfts.length) return (<h1>No NFTs listed</h1>)
    if (soldloadingState === 'loaded' && !soldnfts.length) return (<h1>No NFTs sold</h1>)
return(
  <>
  <div>
  <div className="flex mb-20">
    <div className="m-4 w-[100%] m-auto h-[100%]">
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Collections" key="1">
          <div>
          <button className="text-white font-bold text-xl border-none rounded-xl bg-yellow-400 p-4 hover:bg-yellow-500 transition-all mb-20">
            
          </button>
          </div>
            <div className="albums">
             
            </div>
        </TabPane>
        <TabPane tab="Listed" key="2">
          <h1 className="featuredTitle">Listed</h1>
            <div className="albums">
              
            </div>    
        </TabPane>
        <TabPane tab="Sold" key="3">
          <h1 className="featuredTitle">Sold</h1>
          <div className="albums">
            
          </div>
        </TabPane>
      </Tabs>
        </div>
    </div>
  </div>
  
  </>
)
}