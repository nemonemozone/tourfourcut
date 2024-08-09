import React from "react";
import { useNavigate } from "react-router-dom";

export default function TopNav(props: any): React.ReactElement {
    const { photo_list, render_photo } = props;
    const navigate = useNavigate();
    const handleLogoBtn = () => {
        navigate("/");
    }
    const is_full = (_arr: string[]) => {
        return _arr.every((elem) => elem.length !== 0);
    }
    const handleSubmitBtn = () => {
        //navigate to next page
        if (is_full(photo_list)) {
            render_photo();
            navigate("/succeed");
        }
        else {
            window.alert("사진을 모두 촬영하기 전입니다.");
        }
    }
    return (
        <div className="comp_top_nav" onClick={handleLogoBtn}>
            <div className="container_logo">
                <div className="container">
                    <img src="/LOGO_Happics.svg" />
                </div>
                <p className="logo_ci">Happics</p>
            </div>
            <div className={`btn_submit ${is_full(photo_list) || "full_false"}`} onClick={handleSubmitBtn}>
                완료
            </div>
        </div>
    )
}