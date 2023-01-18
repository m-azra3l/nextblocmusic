import '@/styles/globals.css'
import Market from '../components/Market'
import NavLink from '../components/NavLink'
import { IconContext } from 'react-icons'
import { FaHome, FaBookmark, FaPlusCircle, FaUser, FaCartPlus } from 'react-icons/fa'
import { useState } from 'react'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
//import Navbar from '../components/Navbar'

export default function App({ Component, pageProps }) {
  return (
    <div>
        
      <Component {...pageProps} />
    </div>
  )
}
