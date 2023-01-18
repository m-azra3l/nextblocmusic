import React from "react";
import { library } from "../helpers/imageList";
import { Link } from "next/link";
import "./Market.module.css";

function Market() {
    
    return (
        <>
        <h1 className="font-bold text-xl text-left text-white">Collections</h1>
        <br/>
        <div className="albums">
            {library.map((e) => (
                <div state={e} className="albumSelection">
                <img
                  src={e.image}
                  alt={e.title}
                  style={{ width: "150px", marginBottom: "10px" }}
                ></img>
                <p>{e.title}</p>
              </div>
            ))}
        </div>
        </>
    )
}

export default Market