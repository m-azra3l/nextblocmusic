import React from "react";
import { library } from "../helpers/albumList";
import { Link } from "react-router-dom";
import "./Market.css";

function Market() {
    
    return (
        <>
        <h1 className="font-bold text-xl text-left text-white">Collections</h1>
        <br/>
        <div className="albums">
            {library.map((e) => (
              <Link to="/album" state={e} className="albumSelection">
                <img
                  src={e.image}
                  alt={e.title}
                  style={{ width: "150px", marginBottom: "10px" }}
                ></img>
                <p>{e.title}</p>
              </Link>
            ))}
        </div>
        </>
    )
}

export default Market