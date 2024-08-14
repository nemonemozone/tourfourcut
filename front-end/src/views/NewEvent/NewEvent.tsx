import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewEvent(): React.ReactElement {
    const date = new Date();
    const today = date.toISOString().split("T")[0];
    const [title, setTitle] = useState("");
    const [dateStart, setDateStart] = useState(today);
    const [dateEnd, setDateEnd] = useState(today);
    const EVENT_DATA_API = `${process.env.REACT_APP_API}/eventInfo/${title}`;
    const navigate = useNavigate();

    const post_new_event = (_title: string, _dateStart: string, _dateEnd: string) => {
        fetch(EVENT_DATA_API, {
            method: "POST",
            body: JSON.stringify({
                Method: "POST", name: _title, date: `${_dateStart}~${_dateEnd}`, logo_list: ["gogo.png", "go.png"]
            }),
        }).then((response) => { console.log(response.json()); navigate(`/${_title}`) })
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (title.length < 1) {
            window.alert("행사 이름을 입력하세요.");
            return;
        }

        //중복된 이름이 존재하는지 아닌지 확인
        fetch(EVENT_DATA_API)
            .then((res) => res.json())
            .then((data) => {
                //중복된 이름이 없을 경우 성공
                if (data.body == "null") post_new_event(title, dateStart, dateEnd);
                //중복된 이름이 있을 경우 실패
                else window.alert("이미 존재하는 행사명입니다.");
            })
    };

    return (
        <div className="page_new_event">
            <form onSubmit={handleSubmit}>
                <div className="input_title">
                    <span>Title</span>
                    <input
                        aria-label="title"
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={15}
                        minLength={1}
                    />
                </div>
                <div className="input_date">
                    <span>Date Start</span>
                    <input
                        min={today}
                        type="date"
                        aria-label="date start"
                        onChange={(e) => setDateStart(e.target.value)}
                        defaultValue={dateStart}
                    />
                </div>
                <div className="input_date">
                    <span>Date End</span>
                    <input
                        min={dateStart}
                        type="date"
                        aria-label="date end"
                        onChange={(e) => setDateEnd(e.target.value)}
                        defaultValue={dateEnd}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
