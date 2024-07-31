import React from "react";
import { useNavigate } from "react-router-dom";

export default function TopNav(): React.ReactElement {
    const navigate = useNavigate();
    const handleLogoBtn = () => {
        navigate("/");
    }
    const handleSubmitBtn = () => {
        //navigate to next page
    }
    return (
        <div className="comp_top_nav" onClick={handleLogoBtn}>
            <div className="container_logo">
                <div className="container">
                    <img src="/LOGO_Happics.svg" />
                </div>
                <p className="logo_ci">Happics</p>
            </div>
            <div className="btn_submit" onClick={handleSubmitBtn}>
                완료
            </div>
        </div>
    )
}