import React from "react";
import { useNavigate } from "react-router-dom";

export default function TopNav(props: any): React.ReactElement {
    console.log(props);

    return (
        <div className="py-2.5 w-full flex flex-row items-center justify-between font-normal">
            <div
                className="pl-6 w-[80px] cursor-pointer"
                onClick={() => {
                    window.history.back();
                }}
            >
                <img
                    className="h-[13px] cursor-pointer"
                    src={"/left_arrow.svg"}
                ></img>
            </div>
            <p className="text-xl text-white">테마선택</p>
            <p
                onClick={props.handleNxtBtn}
                className="text-xl text-[#E44D71] pr-6 w-[80px] text-right cursor-pointer"
            >
                다음
            </p>
        </div>
    );
}
