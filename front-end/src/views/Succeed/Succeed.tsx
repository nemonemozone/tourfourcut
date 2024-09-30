import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopNav from "./components/TopNav";
import "./Succeed.scss";
import { saveAs } from "file-saver";
import Loading from "../Loading/Loading";

export default function Succeed(): React.ReactElement {
    const location = useLocation();
    const navigate = useNavigate();
    const [is_loading, setIsLoading] = useState(true);
    useEffect(()=>{
        location.state.eventID&&setIsLoading(false);
    })
    const handle_restart_btn = () => {
        navigate("/");
    }
    const handle_download_btn = () => {
        saveAs(location.state.image, "tourfourcut.png");
    }

    const handle_logo_click = ()=>{
        navigate("/" );
    }
    return (
        is_loading?
        <Loading/>:
        <div className="page_succeed">
            <TopNav handle_logo_click = {handle_logo_click} />
            <div className="wrap_photo_restart_btn" onClick={() => { handle_restart_btn() }}>
                <div className="container_photo_card">
                    <img src={URL.createObjectURL(location.state.image)} />
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