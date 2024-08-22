import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../Loading/Loading";
import QRCode from "react-qr-code";
import { eventInfo } from "../../types/eventInfo";

export default function EventInfo(): React.ReactElement {
    const params = useParams();
    const navigate = useNavigate();
    const eventID = params.eventID;
    const [eventInfo, setEventData] = useState<eventInfo | null>(null);
    const EVENT_DATA_API = `${process.env.REACT_APP_API}/eventInfo/${eventID}`;
    const title = eventInfo?.name;
    const handle_photo_studio_btn = ()=>{
        navigate(`/${eventID}`);   
    }

    useEffect(() => {
        fetch(EVENT_DATA_API)
            .then((res) => res.json())
            .then((data) => {
                if (data.body != "null") setEventData(JSON.parse(data.body)[0]);
                else window.alert("개최되지 않은 행사입니다.");
            })
            .catch((error) => { console.log(error); window.alert("서버 오류가 발생했습니다."); });

    }, []);
    return (<div>
        {
            eventID ?
                <div className="page_event_info">
                    <div className="comp_header">
                        <span>행사명: </span><p>{title}</p>
                        <span>초대 링크: </span><a href={`${process.env.REACT_APP_WEB_HREF}/${eventID}`}>{`${process.env.REACT_APP_WEB_HREF}/${eventID}`}</a>
                    </div>
                    <div className="comp_invite_card">
                        <p>QR코드</p>
                        <QRCode value={`${process.env.REACT_APP_WEB_HREF}/${eventID}`}/>
                    </div>
                <button onClick={handle_photo_studio_btn}>행사 사진 촬영 바로가기</button>
                </div>
                : <Loading />
        }
    </div>)
}