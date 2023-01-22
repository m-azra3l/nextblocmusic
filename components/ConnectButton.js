import Web3Modal from 'web3modal'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import styles from '@/styles/Home.module.css'
import WalletConnectProvider from "@walletconnect/web3-provider"
import{marketplaceAddress} from '../config'
import MusicMarketPlace from '../artifacts/contracts/MusicMarketPlace.sol/MusicMarketPlace.json'


let web3Modal

function ConnectButton() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
        web3Modal = new Web3Modal({
        network: 'mumbai',
        cacheProvider: true,
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              infuraId: process.env.INFURA_ID
            }
          },
          metamask: true,
          walletconnect: true,
        }
      })
    }
  }, [])
  
  const [isConnected, setIsConnected] = useState(false)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const persistedIsConnected = localStorage.getItem('isConnected')
    if (persistedIsConnected) {
    setIsConnected(JSON.parse(persistedIsConnected))
    }
    }, [])
    
    useEffect(() => {
    localStorage.setItem('isConnected', JSON.stringify(isConnected))
    }, [isConnected])

  // async function connect() {
  //   console.log('User Connected')
  //   const provider = await web3Modal.connect()
  //   setProvider(provider)
  //   alert("Your wallet has been connected")
  //   localStorage.setItem('isConnected', true)
  //   setIsConnected(true)
  // }

  const connect = async () => {
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    setProvider(provider)
    const signer = provider.getSigner()
    setSigner(signer)
    const contract = new ethers.Contract(marketplaceAddress, MusicMarketPlace.abi, signer)
    setContract(contract)
    localStorage.setItem('isConnected', true)
    setIsConnected(true)
    alert("Your wallet has been connected")
    console.log('User Connected')
    
}

  function disconnect() {    
    console.log('User Disconnected')
    web3Modal.on('disconnect', () => {
      localStorage.removeItem('isConnected')
      setIsConnected(false)
      console.log('User disconnected')
      alert("Your wallet has been disconnected")
    })
    web3Modal.clearCachedProvider()
    localStorage.removeItem('isConnected')
    setIsConnected(false)
    alert("Your wallet has been disconnected")
    setProvider(null)
  }

  return (
    <div>
      <center>
        <h1>Your Wallet Connection</h1>
        <br/>
        {isConnected && <p>You are connected!</p>}
        
        {!isConnected && <p>You are not connected!</p>}
        <br/>
        {!isConnected && <button className={styles.connectButton} onClick={connect}>Connect</button>}
        {isConnected && <button className={styles.disconnectButton} onClick={disconnect}>Disconnect</button>}
      </center>
      
    </div>
  )
}

export default ConnectButton
