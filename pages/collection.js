/* eslint-disable @next/next/no-img-element */
import React from "react"
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import{marketplaceAddress,nftAddress} from '../config'
import MarketPlace from '../artifacts/contracts/MarketPlace.sol/MarketPlace.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import { ethers } from 'ethers'
import { useEffect, useState, useRef } from 'react'
import { TbPlayerPlay, TbPlayerPause } from "react-icons/tb"
import axios from 'axios'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

export default function Collection () {
     
  const [mynfts, setmyNfts] = useState([]) 
  const [loadingState, setLoadingState] = useState('not-loaded')  
  const router = useRouter()

  const audioRef = useRef([])
  const [playing, setPlay] = useState(false) 
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (playing) {
      // Pause any previously playing audio
      audioRef.current.forEach((audio, index) => {
        if (index !== selected) {
          audio.pause();
        }
      });
      // Play the selected audio
      audioRef.current[selected].play();
    } else if (playing !== null && audioRef.current[selected]) {
      audioRef.current[selected].pause();
    }
  }, [playing, selected]);
  
  useEffect(() => {
    loadmyNFTs()    
  }, [])

  async function loadmyNFTs() {
    /* create provider and signer and query for collections of the signer*/
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketplaceContract = new ethers.Contract(marketplaceAddress, MarketPlace.abi, signer)
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);  
    const data = await marketplaceContract.fetchMyNFTs()
     /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    try{
      const items = await Promise.all(data.map(async i => {      
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          title: meta.data.title,
          description: meta.data.description,
          image: meta.data.image,
          song: meta.data.song,
          tokenUri
        }
        return item
      }))
      // Sort the items array by tokenId in descending order
      items.sort((a, b) => b.tokenId - a.tokenId);
      setmyNfts(items)
      setLoadingState('loaded')
    }
    catch(e){
      console.log(e)
      alert('Unable to load your NFTs',e)
    }
  }

  function listNFT(nft) {
    router.push(`/resell?id=${nft.tokenId}&tokenUri=${nft.tokenUri}`)
  }

  if (loadingState === 'loaded' && !mynfts.length) 
  return (
    <div className={styles.mycontainer}>
      <center>           
        <h1>Your Purchases</h1>
        <br/>
        <h2>No NFTs Purchased</h2>
      </center>
    </div>
    )
  return(
    <>
      <div className={styles.centers}>
        <br/>
        <br/>
        <div className={styles.center}>              
          <h1>Your Purchases</h1>
        </div>    
        <div className={styles.grid}>
          {
            mynfts.map((nft, i) => (
              <div className={styles.mycard} key={i}>
                <center>
                <img className={styles.cardimgtop} src={nft.image} alt={nft.title} />
                <div className={StyleSheet.cardbody}>
                  <div className={styles.cardtitle}>
                    <h2 className={styles.cardtext}>{nft.title}</h2>                  
                    <p className={styles.carddescription}>{nft.description}</p>  
                    <h2 className={styles.cardprice}>{nft.price} MATIC</h2>
                  </div>
                  <div className={styles.cardbuttons}>                    
                    <button className={styles.cardbutton} onClick={() => listNFT(nft)}>Resell</button>
                    <button className={styles.cardplaybutton} onClick={() => {
                      setSelected(i)
                      if(!playing || i === selected) setPlay(!playing)}}
                    >
                        {playing && selected === i ?  (
                          <TbPlayerPause />
                        ) : (
                          <TbPlayerPlay />
                        )}
                    </button>
                    <audio 
                      src={nft.song} 
                      ref={el => audioRef.current[i] = el}
                      key={i}
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