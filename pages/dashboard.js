import React from "react";
import Navbar from "../components/Navbar";
import { Link } from "next/link";
import "../components/Market.module.css";
import { Tabs } from "antd";
import { library } from "../helpers/imageList";

const { TabPane } = Tabs;

const Dashboard = () => {

return(
  <>
  <div>
  <div className="flex mb-20">
    <Navbar/>
    <div className="m-4 w-[100%] m-auto h-[100%]">
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Collections" key="1">
            <div className="albums">
              {library.map((e) => (
                <Link href="/album" state={e} className="albumSelection">
                  <img
                    src={e.image}
                    alt="bull"
                    style={{ width: "150px", marginBottom: "10px" }}
                  ></img>
                  <p>{e.title}</p>
                </Link>
              ))}
            </div>
        </TabPane>
        <TabPane tab="Listed" key="2">
          <h1 className="featuredTitle">Listed</h1>
            <div className="albums">
              {library.slice(7, 13).map((e) => (
                <Link href="/album" state={e} className="albumSelection">
                  <img
                    src={e.image}
                    alt="bull"
                    style={{ width: "150px", marginBottom: "10px" }}
                  ></img>
                  <p>{e.title}</p>
                </Link>
              ))}
            </div>  
          <h1 className="featuredTitle">Top Hits</h1>
            <div className="albums">
              {library.slice(5, 11).map((e) => (
                <Link href="/album" state={e} className="albumSelection">
                  <img
                    src={e.image}
                    alt="bull"
                    style={{ width: "150px", marginBottom: "10px" }}
                  ></img>
                  <p>{e.title}</p>
                </Link>
              ))}
            </div>
          <h1 className="featuredTitle">Country</h1>
          <div className="albums">
            {library.slice(0, 6).map((e) => (
              <Link href="/album" state={e} className="albumSelection">
                <img
                  src={e.image}
                  alt="bull"
                  style={{ width: "150px", marginBottom: "10px" }}
                ></img>
                <p>{e.title}</p>
              </Link>
            ))}
          </div>
          <h1 className="featuredTitle">Classics</h1>
          <div className="albums">
            {library.slice(5, 11).map((e) => (
              <Link href="/album" state={e} className="albumSelection">
                <img
                  src={e.image}
                  alt="bull"
                  style={{ width: "150px", marginBottom: "10px" }}
                ></img>
                <p>{e.title}</p>
              </Link>
            ))}
          </div>                
        </TabPane>
        <TabPane tab="Sold" key="3">
          <h1 className="featuredTitle">Sold</h1>
          <div className="albums">
            {library.map((e) => (
              <Link href="/album" state={e} className="albumSelection">
                <img
                  src={e.image}
                  alt="bull"
                  style={{ width: "150px", marginBottom: "10px" }}
                ></img>
                <p>{e.title}</p>
              </Link>
            ))}
          </div>
        </TabPane>
      </Tabs>
        </div>
    </div>
  </div>
  
  </>
)
}

export default Dashboard;