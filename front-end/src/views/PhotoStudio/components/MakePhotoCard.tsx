import React, { useState, useRef, Ref, useEffect } from 'react';
import QRCode from 'react-qr-code';
import Webcam from 'react-webcam';

interface MakePhotoCardProps {
    title: string;
    date: string;
    photo_list: [string, string, string, string];
    logo_list: string[] | undefined;
    theme: "blue" | "pink" | "yellow" | "white";
    change_photo: (_idx: number, _newSrc: string) => void;
    photo_render_ref: any;
    background_image_src: string | undefined;
}

export default function MakePhotoCard(eventInfo: MakePhotoCardProps): React.ReactElement {
    const { title, date, photo_list, logo_list, theme, change_photo, photo_render_ref, background_image_src } = eventInfo;
    const [running_cam_idx, setRunningCamIdx] = useState<number>(-1);
    const [is_facingMode_user, setIsFacingmodeUser] = useState<boolean>(false);
    const webcamRef: any = useRef<any>(null);

    const turn_off_cam = () => { setRunningCamIdx(-1); }

    const handle_back_btn = () => {
        turn_off_cam();
    }
    const handle_cam_btn = async (_idx: number) => {
        //turn on camera
        setRunningCamIdx(_idx);
    }
    const handle_capture_btn = (_idx: number) => {
        turn_off_cam();
        //get new blob of captured image
        const new_src = webcamRef.current.getScreenshot();
        //change photo to new image
        if (new_src) change_photo(_idx, new_src);
    }

    const handle_gallary_btn = (_idx: number) => { }
    const handle_mirror_btn = (_idx: number) => {
        setIsFacingmodeUser(!is_facingMode_user);
    }


    return (
        <div className={`comp_make_photo_card`} >
            <div ref={photo_render_ref} >
                <div className={`comp_card ${theme}`}>
                    <div className='background_image'>
                        <img className='background_img' src={background_image_src} />
                    </div>
                    <div className="wrap_title_date">
                        <p className="title">{title}</p>
                        <p className="date">{date}</p>
                    </div>
                    <div className="container_pictures">
                        {photo_list.map((photo_src, idx) =>
                            <div key={idx} className="wrap_picture_captureBtn">
                                {photo_src && <div className="picture">
                                    <img src={photo_src} />
                                </div>}
                                <div className={`capture_btn ${photo_src && "got_photo"}`} onClick={() => { handle_cam_btn(idx); }} data-html2canvas-ignore="true">
                                    <span className="material-icons icon">camera_enhance</span>
                                </div>
                                {running_cam_idx == idx &&
                                    <div className="comp_capture">
                                        <div className="top_nav">
                                            <span className="material-icons icon" onClick={handle_back_btn}>arrow_back</span>
                                        </div>
                                        <div className={"Comp-photo-canvas"}>
                                            <Webcam
                                                mirrored={is_facingMode_user}
                                                videoConstraints={{ "facingMode": is_facingMode_user ? "user" : "environment" }}
                                                audio={false}
                                                autoPlay={true}
                                                screenshotFormat="image/png"
                                                ref={webcamRef}
                                                style={{
                                                    position: "absolute",
                                                    left: 0,
                                                    top: 0,
                                                    textAlign: "center",
                                                    height: "100%",
                                                    width: "100%",
                                                    objectFit: "cover",
                                                    zIndex: -1,

                                                }} />
                                            <div className={"Comp-grid"}>
                                                <div className={"Comp-column"} />
                                                <div className={"Comp-row"} />
                                            </div>
                                        </div>
                                        <div className={"Comp-controller"}>
                                            <div className={"Comp-gallary-btn"}>
                                                <span className={"material-icons"} onClick={() => { handle_gallary_btn(idx) }}>photo</span>
                                            </div>
                                            <div className={"Comp-capture-btn"} onClick={() => { handle_capture_btn(idx) }} />
                                            <div className={"Comp-turn-btn"}>
                                                <span className={"material-icons"} onClick={() => { handle_mirror_btn(idx) }}>cached</span>
                                            </div>
                                        </div>
                                    </div>}
                            </div>
                        )
                        }
                    </div >
                    <div className="comp_logo_container">
                        <div className="container_logo">
                            <img alt="logo image" src={"/LOGO_Happics.svg"} />
                        </div>
                        {logo_list && logo_list.map((logo_src, key) =>
                            <div key={key} className="container_logo">
                                <img alt="logo image" src={logo_src} />
                            </div>
                        )
                        }
                    </div>
                    <div className="container_QR">
                        <QRCode value={`${process.env.REACT_APP_WEB_HREF}/tourfourcut`} size={3 * 16} className={"qrcode"} />
                    </div>
                </div>
            </div>

        </div>
    );
}