import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UploadLogo(): React.ReactElement {
    const params = useParams();
    const navigate = useNavigate();
    const title = params.event_name;
    const LOGO_UPLOAD_API = `${process.env.REACT_APP_API}/files/logo/${title}`;
    const [logo_list, setLogoList] = useState<File[]>([]);


    const inputTheImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const files = event.target.files;
        if (files!.length < 1) return;
        else if (10 < files!.length) {
            window.alert("로고는 최대 10개까지만 등록할 수 있습니다.");
            return;
        }
        else {
            setLogoList(Array.from(files!));
        }
    }

    const handle_file_upload = () => {
        const formData = new FormData();
        formData.append("event_name", title!);

        for (const _file_obj of logo_list) {
            console.log(_file_obj);
            formData.append("logo_list", _file_obj);
        }
        fetch(LOGO_UPLOAD_API, {
            method: "POST",
            body: formData
        })
            .then((_res) => {
                console.log(_res);
                if (_res.ok) {
                    window.alert("새로운 행사 등록에 성공하였습니다.");
                    navigate(`/${title}`);
                }
            });
    };

    const handle_reset_btn = () => {
        setLogoList([]);
    }


    return (<div>
        <p>새로운 행사 등록하기</p>
        <p>step2: 로고 업로드</p>

        <input type="file" accept="image/svg,image/png" multiple onChange={(event) => inputTheImage(event)} />
        <button type="button" onClick={handle_reset_btn}>이미지 목록 리셋</button>
        <button type="button" onClick={handle_file_upload}>변경사항 저장</button>
        {
            logo_list.map((_logo_obj, index) => (
                <img key={index} src={URL.createObjectURL(_logo_obj)} alt="logo image" />
            ))
        }
    </div>)
}