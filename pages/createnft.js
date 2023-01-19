import { useState } from 'react'
import styles from '@/styles/Home.module.css'
import { Inter } from '@next/font/google'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import{marketplaceAddress} from '../config'
import MusicMarketPlace from '../artifacts/contracts/MusicMarketPlace.sol/MusicMarketPlace.json'

const projectId = process.env.IPFS_ID;   // <---------- your Infura Project ID

const projectSecret = process.env.IPFS_KEY;  // <---------- your Infura Secret
// (for security concerns, consider saving these values in .env files)

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

const inter = Inter({ subsets: ['latin'] })

export default function CreateNFT() {
    const [imageUrl, setImageUrl] = useState(null)  
    const [songUrl, setSongUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ title: '', price: '', description: '' })
    const router = useRouter()
    const handleClick = () => {
        router.back()
    }

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
                setImageUrl(url)
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
          title, description, image: imageUrl, song: songUrl
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
        let contract = new ethers.Contract(marketplaceAddress, MusicMarketPlace.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()
        let transaction = await contract.createToken(url, price, { value: listingPrice })
        await transaction.wait()
       
        router.push('/dashboard')
      }
      return(
        <>
            <form className={styles.buttonContainer}>
                <div className={styles.formgroup}>
                    <input 
                    placeholder="Asset Name"
                    className=""
                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                    />
                </div>
                <div className={styles.formgroup}>
                    <input
                    placeholder="Asset Price in Eth"
                    onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                    />
                </div>
                <div className={styles.formgroup}>
                    <textarea
                    placeholder="Asset Description"
                    onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                    />
                </div>
                <div className={styles.formgroup}>
                <input
                    type="file"
                    name="image"
                    onChange={onChange}
                />
                </div>
                <div className={styles.formgroup}>
                <input
                    type="file"
                    name="song"
                    onChange={onChange}
                />
                </div>
                <div className={styles.cardbuttons}>
                    <button onClick={listNFTForSale} className={styles.btn}>Create</button>
                    <button onClick={handleClick} className={styles.btnCancel}>Cancel</button>
                </div>
            </form>
        </>
        )
}