import React from "react";
import ConnectButton from "@/components/ConnectButton";
import styles from '@/styles/Home.module.css'

export default function Wallet() {
    return (
       <div className={styles.buttonContainer}>            
            <ConnectButton/>
        </div>
    )
}

