import React from "react"
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Owned from "@/components/Owned"
import Listed from "@/components/Listed"
import Sold from "@/components/Sold"
import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

export default function Dashboard () {
  const router = useRouter()

  const handleClick = () => {
    router.push('/createnft')
  }
  return(
    <>

      <div className={styles.buttonContainer}>
          <div>
            <div>
              <button onClick={handleClick} className={styles.btnCancel}>CreateNFT</button>
              <Owned/>
            </div>
          </div>      
      </div>
    
    </>
  )
}