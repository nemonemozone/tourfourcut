export default function MakePhotoCard(): React.ReactElement {
    return (
        <div className="comp_make_photo_card">
            <div className="wrap_title_date">
                <p className="title">2024 아그톤</p>
                <p className="date">2024. 08. 04 ~ 2024. 08. 05</p>
            </div>
            <div className="container_pictures">
                {[1, 2, 3, 4].map((picture_number) =>
                    <div className="wrap_picture_captureBtn">
                        <div className="picture">
                            <img />
                        </div>
                        <div className="capture_btn">
                            <span className="material-icons">camera_enhance</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="container_logos">
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
            </div>
            <div className="contaienr_QR">
                <img />
            </div>
        </div>
    );
}