import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopNav from "./components/TopNav";
import "./Succeed.scss";
import { saveAs } from "file-saver";

export default function Succeed(): React.ReactElement {
    const location = useLocation();
    const navigate = useNavigate();
    const handle_restart_btn = () => {
        navigate("/" + location.state.eventID);
    }
    const handle_download_btn = () => {
        saveAs(location.state.image, "Happics.png");
    }
    return (
        <div className="page_succeed">
            <TopNav />
            <div className="wrap_photo_restart_btn" onClick={() => { handle_restart_btn() }}>
                <div className="container_photo_card">
                    <img src={location.state.image} />
                </div>
                <div className="btn_restart">
                    <span className={"material-icons icon"}>replay</span>
                </div>
            </div>
            <div className="container_btn">
                <button className="btn_download" onClick={handle_download_btn}><span className={"material-icons icon"}>file_download</span>다운로드</button>
            </div>
        </div>
    )
}