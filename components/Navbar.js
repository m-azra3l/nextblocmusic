import React from 'react'
import { IconContext } from 'react-icons'
import { FaHome, FaUser, FaWallet } from 'react-icons/fa'
import NavLink from './NavLink'
import styles from '@/styles/Home.module.css'

export default function Navbar (){
    return(
        <div className={styles.description}>
          <p>
            <nav>        
              <ul><li><span>
                  <IconContext.Provider value={{ color: 'white' }}>
                    <NavLink href="/">
                        <FaHome title='Home'/>
                    </NavLink> 
                  </IconContext.Provider>
              </span></li></ul>
              <ul><li><span>
                  <IconContext.Provider value={{ color: 'white' }}>
                    <NavLink href="/dashboard">
                      <FaUser title='User Dashboard'/>    
                    </NavLink>
                  </IconContext.Provider>    
              </span></li></ul>
              <ul><li><span>
                  <IconContext.Provider value={{ color: 'white' }}>
                    <NavLink href="/wallet">
                      <FaWallet title='Wallet' />    
                    </NavLink>
                  </IconContext.Provider>    
              </span></li></ul> 
            </nav>
          </p>
        </div>
    )
} 