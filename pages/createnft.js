import { useState } from 'react'
import styles from '@/styles/Home.module.css'
import { Inter } from '@next/font/google'
import { Buffer } from 'buffer'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import{marketplaceAddress, nftAddress} from '../config'
import MarketPlace from '../artifacts/contracts/MarketPlace.sol/MarketPlace.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

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

const myclient = ipfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

const inter = Inter({ subsets: ['latin'] })

export default function CreateNFT() {
    const [progress, setProgress] = useState(0);
    const [imageUrl, setImageUrl] = useState(null)  
    const [songUrl, setSongUrl] = useState(null)

    const [formInput, updateFormInput] = useState({ title: "", price: "", description: "" })
    const [loadingCreate, setLoadingCreate] = useState(false);
    const router = useRouter()

    const handleClick = () => {
        router.back()
    }

    async function onChange(e) {
        const file = e.target.files[0]
        try {
            let added
            if (e.target.name === 'image') {
                alert("Please wait while song image cover upload")
                added = await client.add(
                    file,
                    {   
                        progress: (prog) => {
                            console.log(`received: ${prog}`);
                            setProgress(Math.round((prog / file.size) * 100));
                        }
                    }
                )                    
                alert("Cover uploaded successfully")
            }
            else if (e.target.name === 'song') {
                alert("Please wait while song upload")
                added = await client.add(
                    file,
                    {   
                        progress: (prog) => {
                            console.log(`received: ${prog}`);
                            setProgress(Math.round((prog / file.size) * 100));
                        }
                    }
                )                    
                alert("Song uploaded successfully")
            }
            const url = `https://ipfs.io/ipfs/${added.path}`
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
        alert(data)
        try {
          const added = await client.add(data)
            const url = `https://ipfs.io/ipfs/${added.path}`
            alert('File uploaded succesfully')
            /* after file is uploaded to IPFS, return the URL to use it in the transaction */
            listNFTForSale(url)
        } catch (error) {
            console.log('Error uploading file: ', error)            
            alert('Error uploading file: ', error)
            return
        }  
      }
    
      async function listNFTForSale(url) {

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
        let transaction = await contract.createToken(url);
        let tx = await transaction.wait();
        let event = tx.events[0];
        let value = event.args[2];
        let tokenId = value.toNumber();
    
        /* next, create the item */
        const price = ethers.utils.parseUnits(formInput.price, 'ether')
        contract = new ethers.Contract(marketplaceAddress, MarketPlace.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()
        transaction = await contract.createMarketItem(nftAddress, tokenId, price, { value: listingPrice })
        
        await transaction.wait()
        alert('Token created succesfully')        
        setLoadingCreate(false)
        router.push('/dashboard')        
      }
      return(
        <>
            <form className={styles.buttonContainer}>
                <div className={styles.formgroup}>
                    <input 
                    placeholder="Asset Title"
                    className=""
                    onChange={e => updateFormInput({ ...formInput, title: e.target.value })}
                    />
                </div>
                <div className={styles.formgroup}>
                    <input
                    placeholder="Asset Price in MATIC"
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
                    <p>Select Cover</p>
                    <input
                        type="file"
                        name="image"
                        accept=".jpg, .png"
                        placeholder="Select Cover"                        
                        onChange={onChange}
                    />
                </div>
                <div className={styles.formgroup}>
                    <p>Select Song</p>
                    <input
                        type="file"
                        accept=".mp3, .wav"
                        name="song"
                        placeholder='Select Song'
                        onChange={onChange}
                    />
                </div>
                <div className={styles.formgroup}>
                    <div className={styles.progressbar} style={{ width: `${progress}%` }}></div>
                </div>
                <div className={styles.cardbuttons}>
                    <button onClick={(event) => {event.preventDefault();uploadToIPFS()}} className={styles.btn}>Create 
                    {loadingCreate ? (<img
                        style={{ width: "30px", height: "30px", marginLeft: "20px" }}
                        src={
                            "https://icons8.com/preloaders/preloaders/865/Ethereum%20logo%20revolving.gif"
                        }
                        alt="loading..."
                        />
                    ) : null}
                    </button>
                    <button onClick={handleClick} className={styles.btnCancel}>Cancel</button>
                </div>
            </form>
        </>
        )
}