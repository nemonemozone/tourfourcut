import React from "react";
import { useNavigate } from "react-router-dom";

export default function TopNav(props: any): React.ReactElement {
    const navigate = useNavigate();
    const handleLogoBtn = () => {
        navigate("/");
    }
   return (
        <div className="comp_top_nav">
            <div className="container_logo"  onClick={handleLogoBtn}>
                <div className="container">
                    <img src="/LOGO_Happics.svg" />
                </div>
                <p className="logo_ci">Happics</p>
            </div>
           
        </div>
    )
}