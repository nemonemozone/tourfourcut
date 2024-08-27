import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { eventInfo } from "../../types/eventInfo";
import Loading from "../Loading/Loading";
import { useNavigate } from "react-router-dom";

export default function EventList(): React.ReactElement {
    const userID = "Bj_king";
    const href_event = `${process.env.REACT_APP_WEB_HREF}/${userID}`;
    const [event_list, setEventList] = useState<eventInfo[] | null>();
    const EVENT_INFO_API = `${process.env.REACT_APP_API}/user/event/${userID}`
    const navigate = useNavigate();
    const get_event_list = async (_userID: string) => {
        fetch(EVENT_INFO_API)
            .then((_res) => { console.log(_res); return _res.json() }
            )
            .then((_json) => { console.log(_json); setEventList(JSON.parse(_json.body)) });
    }
    const handle_navigate_new_event = () => {
        navigate("/admin/newEvent");
    }
    useEffect(() => { get_event_list(userID) }, [])
    return (<>
        {event_list ?
            <div className="page_event_list">
                <p>{userID}님 안녕하세요!</p>
                <p>---나의 행사 목록---</p>
                {
                    event_list.map((_elem: eventInfo, _idx: number) =>
                        <div className="comp_event_card" key={_idx}>
                            <a href={`/admin/${_elem.ID}`}>[{_idx + 1}] {_elem.name}({_elem.date})</a>
                        </div>
                    )
                }
                <button onClick={handle_navigate_new_event}>새로운 이벤트 생성</button>
            </div>
            : <Loading />}
    </>
    )
}