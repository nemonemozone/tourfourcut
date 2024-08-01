interface MakePhotoCardProps {
    title: string;
    date: string;
    photo_list: [string, string, string, string];
    logo_list: string[];
    theme: "blue" | "pink" | "yellow" | "white";
}

export default function MakePhotoCard(eventInfo: MakePhotoCardProps): React.ReactElement {
    const { title, date, photo_list, logo_list, theme } = eventInfo;

    return (
        <div className={`comp_make_photo_card ${theme}`}>
            <div className="wrap_title_date">
                <p className="title">{title}</p>
                <p className="date">{date}</p>
            </div>
            <div className="container_pictures">
                {photo_list.map((photo_src) =>
                    <div className="wrap_picture_captureBtn">
                        {photo_src ? <div className="picture">
                            <img src={photo_src} />
                        </div> :
                            <div className="capture_btn">
                                <span className="material-icons icon">camera_enhance</span>
                            </div>}
                    </div>
                )
                }
            </div >
            <div className="comp_logo_container">
                {logo_list.map((logo_src) =>
                    <div className="container_logo">
                        <img alt="logo image" src={logo_src} />
                    </div>
                )
                }
            </div>
            <div className="container_QR">
                <img src="/qrcode.svg" />
            </div>
        </div >
    );
}