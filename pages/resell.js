/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import axios from 'axios'
import Web3Modal from 'web3modal'
import styles from '@/styles/Home.module.css'

import {
  marketplaceAddress,
  nftAddress
} from '../config'

import MarketPlace from '../artifacts/contracts/MarketPlace.sol/MarketPlace.json'

export default function Resell() {
  const [formInput, updateFormInput] = useState({ price: '', image: '' })
  const router = useRouter()
  const { id, tokenUri } = router.query
  const { image, price } = formInput

  useEffect(() => {
    fetchNFT()
  }, [id])

  async function fetchNFT() {
    if (!tokenUri) return
    const meta = await axios.get(tokenUri)
    updateFormInput(state => ({ ...state, image: meta.data.image }))
  }

  async function listNFTForSale() {
    alert("Clicked")
    if (!price) return
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    //const priceFormatted = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, MarketPlace.abi, signer)
    let listingPrice = await contract.getListingPrice()

    const tx = await contract.putItemToResell(
      nftAddress,
      id,
      ethers.utils.parseUnits(formInput.price, "ether"),
      { value: listingPrice.toString() }
    );
    
    await tx.wait();
   
    router.push('/')
  }

  return (
    <div className={styles.buttonContainer}>
      <form>
        <div className={styles.formgroup}>
            <input
            placeholder="Asset Price in MATIC"
            className=''
            onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
            />
        </div>
        <div className={styles.formgroup}>
            {
            image && (
                <img style={{width: "350px"}} src={image} />
            )
            }
        </div>
        <div className={styles.formgroup}>
            <button onClick={(event) => {event.preventDefault();listNFTForSale()}} className={styles.btn}>
                List NFT
            </button>
        </div>
      </form>
    </div>
  )
}