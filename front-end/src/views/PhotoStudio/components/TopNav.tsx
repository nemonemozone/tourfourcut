import React from "react";
import { useNavigate } from "react-router-dom";

export default function TopNav(props: any): React.ReactElement {
    const { photo_list, render_photo, eventID } = props;
    const navigate = useNavigate();
    // const history = useHistory();
    const handleLogoBtn = () => {
        navigate("/" + eventID);
    }
    return (
        <div className="comp_top_nav" onClick={handleLogoBtn}>
            <div className="container_logo">
                <div className="container">
                    <img src="/LOGO_Happics.svg" />
                </div>
                <p className="logo_ci">tourfourcut</p>
            </div>
        </div>
    )
}