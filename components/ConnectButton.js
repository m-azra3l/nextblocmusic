import Web3Modal from 'web3modal'
import { useEffect, useState } from 'react'
import styles from '@/styles/Home.module.css'
import WalletConnectProvider from "@walletconnect/web3-provider"


let web3Modal

function ConnectButton() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
        web3Modal = new Web3Modal({
        network: 'mainnet',
        cacheProvider: true,
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              infuraId: process.env.INFURA_ID
            }
          },
          metamask: true,
          walletconnect: false,
        }
      })
    }
  }, [])
  
  const [isConnected, setIsConnected] = useState(false)
  const [provider, setProvider] = useState(null)

  useEffect(() => {
    const persistedIsConnected = localStorage.getItem('isConnected')
    if (persistedIsConnected) {
    setIsConnected(JSON.parse(persistedIsConnected))
    }
    }, [])
    
    useEffect(() => {
    localStorage.setItem('isConnected', JSON.stringify(isConnected))
    }, [isConnected])

  async function connect() {
    console.log('User Connected')
    const provider = await web3Modal.connect()
    setProvider(provider)
    alert("Your wallet has been connected")
    localStorage.setItem('isConnected', true)
    setIsConnected(true)
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
    <>
      <h1>Your Wallet Connection</h1>
      {!isConnected && <button className={styles.connectButton} onClick={connect}>Connect</button>}
      {isConnected && <button className={styles.disconnectButton} onClick={disconnect}>Disconnect</button>}
    </>
  )
}

export default ConnectButton
