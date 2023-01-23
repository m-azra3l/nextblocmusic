import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import axios from 'axios'
import Web3Modal from 'web3modal'
import styles from '@/styles/Home.module.css'

import {
  marketplaceAddress
} from '../config'

import MarketPlace from '../artifacts/contracts/MarketPlace.sol/MarketPlace.json'

export default function Resell() {
  const [formInput, updateFormInput] = useState({ price: '', image: '' })
  const router = useRouter()
  const { id, tokenURI } = router.query
  const { image, price } = formInput

  useEffect(() => {
    fetchNFT()
  }, [id])

  async function fetchNFT() {
    if (!tokenURI) return
    const meta = await axios.get(tokenURI)
    updateFormInput(state => ({ ...state, image: meta.data.imageUrl }))
  }

  async function listNFTForSale() {
    if (!price) return
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const priceFormatted = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, MarketPlace.abi, signer)
    let listingPrice = await contract.getListingPrice()

    listingPrice = listingPrice.toString()
    let transaction = await contract.resellToken(id, priceFormatted, { value: listingPrice })
    await transaction.wait()
   
    router.push('/collection')
  }

  return (
    <div className={styles.buttonContainer}>
      <form>
        <div className='form-group'>
            <input
            placeholder="Asset Price in Eth"
            className="mt-2 border rounded p-4"
            onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
            />
        </div>
        <div className='form-group'>
            {
            image && (
                <img style={{width: "350px"}} src={image} />
            )
            }
        </div>
        <div className='form-group'>
            <button onClick={listNFTForSale} className="btn">
                List NFT
            </button>
        </div>
      </form>
    </div>
  )
}