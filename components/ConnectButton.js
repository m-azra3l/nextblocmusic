import Web3Modal from 'web3modal'
import '@styles/Home.module.css'
// const web3Modal = new Web3Modal({
//   network: 'mainnet', // or 'ropsten' for example
//   cacheProvider: true,
//   providerOptions: {
//     walletconnect: {
//       package: WalletConnectProvider,
//       options: {
//         infuraId: 'your-infura-id'
//       }
//     },
//     metamask: true,
//   }
// })
const web3Modal = new Web3Modal({
  network: "mainnet",
  cacheProvider: true,
})

function ConnectButton() {
  const [isConnected, setIsConnected] = useState(false)
  const [provider, setProvider] = useState(null)

  async function connect() {
    const provider = await web3Modal.connect()
    // provider = await web3Modal.connect()
    setProvider(provider)
    setIsConnected(true)
  }

  function disconnect() {
    web3Modal.clearCachedProvider()
    setIsConnected(false)
    setProvider(null)
  }

  return (
    <div className="card-buttons">
      {!isConnected && <button className="connect-button" onClick={connect}>Connect</button>}
      {isConnected && <button className="disconnect-button" onClick={disconnect}>Disconnect</button>}
    </div>
  )
}

export default ConnectButton
