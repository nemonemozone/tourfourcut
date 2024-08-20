import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewEvent(): React.ReactElement {
    const date = new Date();
    const today = date.toISOString().split("T")[0];
    const [title, setTitle] = useState("");
    const [dateStart, setDateStart] = useState(today);
    const [dateEnd, setDateEnd] = useState(today);
    const EVENT_DATA_API = `${process.env.REACT_APP_API}/eventInfo/${title}`;
    const LOGO_UPLOAD_API = `${process.env.REACT_APP_API}/files/logo/${title}`;
    const navigate = useNavigate();
    const [logo_list, setLogoList] = useState<File[]>([]);

    const post_new_event = (_title: string, _dateStart: string, _dateEnd: string, _logo_key_list: string[]) => {
        fetch(EVENT_DATA_API, {
            method: "POST",
            body: JSON.stringify({
                Method: "POST", name: _title, date: `${_dateStart}~${_dateEnd}`, logo_list: `${_logo_key_list}`
            }),
        }).then((response) => { console.log(response.json()); })
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if (title.length < 1) {
            window.alert("행사 이름을 입력하세요.");
            return;
        }

        try {
            // 중복된 이름이 존재하는지 아닌지 확인
            const data = await fetch(EVENT_DATA_API)
                .then((_res) => {
                    console.log(_res);
                    return _res.json();
                })
                .then((_json) => {
                    console.log(_json);
                    return _json;
                })

            // 중복된 이름이 없을 경우 성공
            if (data.body === "null") {
                const upload_logo_res = await upload_logo(title, logo_list);
                console.log(upload_logo_res);
                // const logo_key_list = JSON.stringify(upload_logo_res);
                post_new_event(title, dateStart, dateEnd, upload_logo_res);
                navigate(`/${title}`);
            } else {
                // 중복된 이름이 있을 경우 실패
                window.alert("이미 존재하는 행사명입니다.");
            }
        } catch (error) {
            console.error("Error during submission:", error);
            window.alert("서버 오류가 발생했습니다.");
        }
    };

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

    const upload_logo = async (_title: string, _logo_obj_list: any) => {
        const formData = new FormData();
        formData.append("event_name", _title);

        for (const _file_obj of _logo_obj_list) {
            formData.append("image_list", _file_obj);
        }
        const res = await fetch(LOGO_UPLOAD_API, {
            method: "POST",
            body: formData
        })
            .then((_res) => { console.log(_res); return _res.json(); })
            .then((_json) => { console.log(_json); return JSON.parse(_json.body) });
        return res;
    };

    const handle_reset_btn = () => {
        setLogoList([]);
    }


    return (
        <div className="page_new_event">
            <p>새로운 행사 등록하기</p>
            <form onSubmit={handleSubmit}>
                <div className="input_title">
                    <span>행사명</span>
                    <input
                        aria-label="title"
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={15}
                        minLength={1}
                    />
                </div>
                <div className="input_date">
                    <span>행사 시작일</span>
                    <input
                        min={today}
                        type="date"
                        aria-label="date start"
                        onChange={(e) => setDateStart(e.target.value)}
                        defaultValue={dateStart}
                    />
                </div>
                <div className="input_date">
                    <span>행사 종료일</span>
                    <input
                        min={dateStart}
                        type="date"
                        aria-label="date end"
                        onChange={(e) => setDateEnd(e.target.value)}
                        defaultValue={dateEnd}
                    />
                </div>
                <input type="file" accept="image/png,image/jpg" multiple onChange={(event) => inputTheImage(event)} />
                <button type="button" onClick={handle_reset_btn}>이미지 목록 리셋</button>
                {
                    logo_list.map((_logo_obj, index) => (
                        <img key={index} src={URL.createObjectURL(_logo_obj)} alt={"logo" + index} />
                    ))
                }
                <button type="submit">변경사항 저장</button>
            </form>
        </div>
    );
}
