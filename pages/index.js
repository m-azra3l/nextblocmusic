/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { TbPlayerPlay, TbPlayerPause } from "react-icons/tb"
import {ethers} from 'ethers'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import{marketplaceAddress,nftAddress} from '../config'
import MarketPlace from '../artifacts/contracts/MarketPlace.sol/MarketPlace.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

const infura_mumbai = process.env.MUMBAI_INFURA
const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const audioRef = useRef(null);
  const [nfts, setNfts] = useState([])
  const [playing, setPlay] = useState(false)

  useEffect(() => {
    if (playing) {
      audioRef.current.play()
    } else if (playing !== null && audioRef.current) {
      audioRef.current.pause()
    }
  })


  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
    //const provider = new ethers.providers.JsonRpcProvider(infura_mumbai)
    //const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/')
    const marketplaceContract = new ethers.Contract(marketplaceAddress, MarketPlace.abi, provider)
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);    
    const data = await marketplaceContract.fetchMarketItems();

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
      
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
          image: meta.data.image,
          song: meta.data.song
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
    const contract = new ethers.Contract(marketplaceAddress, MarketPlace.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await contract.createMarketSale(nftAddress, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }
  if (loadingState === 'loaded' && !nfts.length) return (
    
    <div className={styles.centers}>
      <br/>
      <center>
      <h1>Welcome to blocMusic</h1>
      <div className={styles.center}>
        <p>Putting control in the hands of the creator, home of creators supporting their works</p>
        <div className={styles.thirteen}>
          <Image
            src="/images/blocmusic.png"
            alt="13"
            width={150}
            height={120}
            priority
          />
        </div>
      </div>
      
      <h2>No items in marketplace</h2>
    </center>
  </div>
  )
  return (
    <>
        <div className={styles.centers}>
          <br/>
            <center>
              <h1>Welcome to blocMusic</h1>
              <div className={styles.center}>
                <p>Putting control in the hands of the creator, home of creators supporting their works</p>
                <div className={styles.thirteen}>
                  <Image
                    src="/images/blocmusic.png"
                    alt="13"
                    width={150}
                    height={120}
                    priority
                  />
                </div>
              </div>
          </center>
        </div>
        <div className={styles.grid}>
          <div>
          {
            nfts.map((nft, i) => (
              <div className={styles.mycard} key={i}>
                <center>
                <img className={styles.cardimgtop} src={nft.image} alt={nft.title} />
                <div className={StyleSheet.cardbody}>
                  <div className={styles.cardtitle}>
                    <h2 className={styles.cardtext}>{nft.title}</h2>                  
                    <p className={styles.carddescription}>{nft.description}</p>  
                    <h2 className={styles.cardprice}>{nft.price} MATIC</h2>
                  </div>
                  <div classname={styles.cardbuttons}>                    
                    <button className={styles.cardbutton} onClick={() => buyNft(nft)}>Buy</button>
                    <button className={styles.cardplaybutton} onClick={() => setPlay(!playing)}
                    >
                      {playing ? (
                        <TbPlayerPause />
                      ) : (
                        <TbPlayerPlay />
                      )}
                    </button>
                    <audio 
                      src={nft.song} 
                      ref={audioRef}
                      onEnded={() => setPlay(false)}
                  />
                  </div>
                </div>
                </center>
              </div>
              
            ))
          }
          </div>
        </div>
    </>
  )
}
