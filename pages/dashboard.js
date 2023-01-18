import React from "react"
import { Link } from "next/link"
import { useState } from "react"
import Popover from 'react-popover'
import { Tabs } from "antd"
import Image from 'next/image'
import { Inter } from '@next/font/google'
import '@/styles/Home.module.css'
import Owned from "@/components/Owned"
import Listed from "@/components/Listed"
import Sold from "@/components/Sold"
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import{marketplaceAddress} from '../config'
import MusicMarketPlace from '../artifacts/contracts/MusicMarketPlace.sol/MusicMarketPlace.json'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const inter = Inter({ subsets: ['latin'] })

const { TabPane } = Tabs;

export default function Dashboard () {
  const [isOpen, setIsOpen] = useState(false)
  const handleClick = () => setIsOpen(!isOpen)
  const [imageUrl, setImageUrl] = useState(null)  
  const [songUrl, setSongUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ title: '', price: '', description: '' })
  const router = useRouter()

  // async function onChange(e) {
  //   if(e.target.name === 'image') {
  //     const file = e.target.files[0]
  //     try {
  //       const added = await client.add(
  //         file,
  //         {
  //           progress: (prog) => console.log(`received: ${prog}`)
  //         }
  //       )
  //       const url = `https://ipfs.infura.io/ipfs/${added.path}`
  //       setImageUrl(url)
  //     } catch (error) {
  //       console.log('Error uploading file: ', error)
  //     }
  //   } else if (e.target.name === 'song') {
  //     const file = e.target.files[0]
  //     try {
  //       const added = await client.add(
  //         file,
  //         {
  //           progress: (prog) => console.log(`received: ${prog}`)
  //         }
  //       )
  //       const url = `https://ipfs.infura.io/ipfs/${added.path}`
  //       setSongUrl(url)
  //     } catch (error) {
  //       console.log('Error uploading file: ', error)
  //     }
  //   }
  // }

  async function onChange(e) {
    const file = e.target.files[0]
    try {
        const added = await client.add(
            file,
            {
                progress: (prog) => console.log(`received: ${prog}`)
            }
        )
        const url = `https://ipfs.infura.io/ipfs/${added.path}`
        if (e.target.name === 'image') {
            setFileUrl(url)
        } else if (e.target.name === 'song') {
            setSongUrl(url)
        }
    } catch (error) {
        console.log('Error uploading file: ', error)
    }
  }


  async function uploadToIPFS() {
    const { title, description, price } = formInput
    if (!title || !description || !price || !imageUrl || !songUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: imageUrl, song: songUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS()
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* next, create the item */
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    let transaction = await contract.createToken(url, price, { value: listingPrice })
    await transaction.wait()
   
    router.push('/')
  }

  return(
    <>
    <Popover
      isOpen={isOpen}
      body={
        <form>
          <div className="form-group">
            <input 
              placeholder="Asset Name"
              className="mt-8 border rounded p-4"
              onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              placeholder="Asset Price in Eth"
              className="mt-2 border rounded p-4"
              onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Asset Description"
              className="mt-2 border rounded p-4"
              onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
            />
          </div>
          <div className="form-group">
          <input
            type="file"
            name="image"
            className="my-4"
            onChange={onChange}
          />
          </div>
          <div className="form-group">
          <input
            type="file"
            name="song"
            className="my-4"
            onChange={onChange}
          />
          </div>
          <button onClick={listNFTForSale} className="btn btn-primary">Createt NFT</button>
        </form>
      }
      place="below"
      onOuterAction={handleClick}
    >
      <button>Open Form</button>
    </Popover>
    <div>
    <div className="flex mb-20">
      <div className="m-4 w-[100%] m-auto h-[100%]">
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Collections" key="1">
            <div>
              <button className="card-button" onClick={handleClick}>
                Create
              </button>
            </div>
            <div>
              <Owned/>
            </div>
          </TabPane>
          <TabPane tab="Listed" key="2">
            <h1>Listed</h1>
            <div className="albums">
              <Listed/>
            </div>    
          </TabPane>
          <TabPane tab="Sold" key="3">
            <h1>Sold</h1>
            <div>
              <Sold/>
            </div>
          </TabPane>
        </Tabs>
          </div>
      </div>
    </div>
    
    </>
  )
}