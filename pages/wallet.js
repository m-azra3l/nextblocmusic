import React from "react";
import { Link } from "next/link";

function Account() {
    return (
       <div className= "">
            <Navbar />
            <button className="text-white font-bold text-xl border-none rounded-xl bg-yellow-400 p-4 hover:bg-yellow-500 transition-all mb-20">
                <Link href=''>Connect Wallet</Link>
            </button>
        </div>
    )
}

export default Account