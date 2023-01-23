import React from 'react'
import { IconContext } from 'react-icons'
import { FaHome, FaFolder, FaUser, FaList, FaMoneyBillWave } from 'react-icons/fa'
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
                      <FaUser title='Created Items'/>    
                    </NavLink>
                  </IconContext.Provider>    
              </span></li></ul>
              <ul><li><span>
                  <IconContext.Provider value={{ color: 'white' }}>
                    <NavLink href="/collection">
                      <FaFolder title='User Collection'/>    
                    </NavLink>
                  </IconContext.Provider>    
              </span></li></ul>
              <ul><li><span>
                  <IconContext.Provider value={{ color: 'white' }}>
                    <NavLink href="/sold">
                      <FaMoneyBillWave title='Sold Items'/>    
                    </NavLink>
                  </IconContext.Provider>    
              </span></li></ul>
            </nav>
          </p>
        </div>
    )
} 