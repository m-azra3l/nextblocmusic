import Head from 'next/head'
import '@/styles/globals.css'
import styles from '@/styles/Home.module.css'
import Navbar from '../components/Navbar'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>blocMusic</title>
        <meta name="description" content="Decentralized Music App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/blocmusic.png" />
      </Head>
      <main className={styles.main}>
        <Navbar/>
        <Component {...pageProps} />
      </main>
    </>
  )
}
