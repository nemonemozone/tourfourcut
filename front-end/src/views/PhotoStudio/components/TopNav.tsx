// import React from "react";
// import { useNavigate } from "react-router-dom";

// export default function TopNav(props: any): React.ReactElement {
//     const { photo_list, render_photo, eventID } = props;
//     const navigate = useNavigate();
//     // const history = useHistory();
//     const handleLogoBtn = () => {
//         navigate("/" + eventID);
//     };
//     return (
//         <>
//             <div
//                 className={
//                     "Comp-app-bar p-2 w-full bg-white flex flex-col justify-center font-bold border-b border-[#D7D7D7]"
//                 }
//                 onClick={handleLogoBtn}
//             >
//                 <img
//                     className="h-8 cursor-pointer"
//                     src="/LOGO_nemozone.svg"
//                 ></img>
//             </div>
//         </>
//         // <div className="comp_top_nav" onClick={handleLogoBtn}>
//         //     <div className="container_logo">
//         //         <div className="container">
//         //             <img src="/LOGO_Happics.svg" />
//         //         </div>
//         //         <p className="logo_ci">tourfourcut</p>
//         //     </div>
//         // </div>
//     );
// }



import React from "react";
import { useNavigate } from "react-router-dom";

export default function TopNav(props: any): React.ReactElement {
    const { photo_list, render_photo, eventID } = props;
    const navigate = useNavigate();
    // const history = useHistory();
    const handleLogoBtn = () => {
        // navigate("/" + eventID);
    }
    const is_full = (_arr: string[]) => {
        return _arr.every((elem) => elem.length !== 0);
    }
    const handleSubmitBtn = async () => {
        //navigate to next page
        if (is_full(photo_list)) {
            const blob = await render_photo();
            navigate("/succeed", { state: { "image": blob, "eventID": eventID } });
        }
        else {
            window.alert("사진을 모두 촬영하기 전입니다.");
        }
    }
    return (
        <div className="comp_top_nav " onClick={handleLogoBtn}>
            <div className="container_logo ">

                <img
                   className="h-8 cursor-pointer"
                   src="/LOGO_nemozone.svg"
               />

            </div>
            <div className={`btn_submit ${is_full(photo_list) || "full_false"}`} onClick={handleSubmitBtn}>
                완료
            </div>
        </div>
    )
}