import '@/styles/globals.css'
import Link from 'next/link'
import Market from '../components/Market'

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Component {...pageProps} />
      
      <Market/>
    </div>
  )
}
