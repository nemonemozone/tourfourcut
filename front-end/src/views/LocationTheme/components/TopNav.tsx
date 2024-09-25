import React from "react";
import { useNavigate } from "react-router-dom";

export default function TopNav(props: any): React.ReactElement {
    console.log(props)

    return (
        <div className="comp_top_nav">
            <div className="container_logo" onClick={props.handle_logo_click}>
                <div className="container">
                    <img src="/LOGO_Happics.svg" />
                </div>
                <p className="logo_ci">Happics</p>
            </div>
            <button onClick={props.handleNxtBtn}>
                다음
            </button>
        </div>
    )
}