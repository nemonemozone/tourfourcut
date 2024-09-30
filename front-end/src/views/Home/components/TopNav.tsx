import React from "react";
import { useNavigate } from "react-router-dom";

export default function TopNav(props: any): React.ReactElement {
    const { photo_list, render_photo, eventID } = props;
    const navigate = useNavigate();
    // const history = useHistory();
    const handleLogoBtn = () => {
        navigate("/" + eventID);
    };
    return (
        <>
            <div
                className={
                    "comp_top_nav Comp-app-bar p-2 w-full bg-white flex flex-col justify-center font-bold border-b border-[#D7D7D7]"
                }
                onClick={handleLogoBtn}
            >
                <img
                    className="h-8 cursor-pointer"
                    src="/LOGO_nemozone.svg"
                ></img>
            </div>
        </>
    );
}