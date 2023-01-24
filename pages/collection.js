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

  const audioRef = useRef(null)
  const [playing, setPlay] = useState(false)

  useEffect(() => {
    if (playing) {
      audioRef.current.play()
    } else if (playing !== null && audioRef.current) {
      audioRef.current.pause()
    }
  })  
  
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
          image: meta.data.imageUrl,
          song: meta.data.songUrl
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
      <h1>Purchased NFTS</h1>
      <h2>No NFTs Purchased</h2>
    </div>
    )
  return(
    <>
      <div className={styles.mycontainer}>
        <h1>Purchased NFTS</h1>        
        <div className={styles.grid}>
          <div>
          {
            mynfts.map((nft, i) => (
              <div className={styles.mycard} key={i}>
                <center>
                <img className={styles.cardimgtop} src={nft.image} alt={nft.title} />
                <div className={StyleSheet.cardbody}>
                  <div className={styles.cardtitle}>
                    <p className={styles.cardtext}>{nft.title}</p>
                    <p className={styles.cardtext}>{nft.description}</p>
                    <p className={styles.cardtext}>{nft.price} MATIC</p>
                  </div>
                  <div classname={styles.cardbuttons}>                    
                    <button className={styles.cardbutton} onClick={() => listNFT(nft)}>Resell</button>
                    <button className={styles.cardbutton} onClick={() => setPlay(!playing)}
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
      </div> 
    </>
  )
}