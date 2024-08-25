import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../Loading/Loading";
import QRCode from "react-qr-code";
import { eventInfo } from "../../types/eventInfo";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "./EventInfo.scss";
import domtoimage from 'dom-to-image-more';
import { saveAs } from "file-saver";

export default function EventInfo(): React.ReactElement {
    const params = useParams();
    const invite_card = useRef<HTMLDivElement>(null);
    const qr_download_btn = useRef<HTMLSpanElement>(null);
    const navigate = useNavigate();
    const eventID = params.eventID;
    const [eventInfo, setEventData] = useState<eventInfo | null>(null);
    const EVENT_DATA_API = `${process.env.REACT_APP_API}/eventInfo/${eventID}`;
    const title = eventInfo?.name;
    const handle_photo_studio_btn = () => {
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

    const handle_down_qr = () => {
        const filter = (node: Node) => {
            return !(node instanceof HTMLElement && node.classList.contains("icon"));
        };
        domtoimage
            .toBlob(invite_card.current!, {
                filter: filter
            })
            .then((_blob) => {
                saveAs(_blob, `happics_invite_${eventID}.png`);
                return _blob;
            });
    }
    const handle_gallary_btn = ()=>{
        navigate("/admin/gallary/"+eventID);
    }
    return (<div>
        {
            eventID ?
                <div className="page_event_info">
                        <button className="btn_navigate_photo_studio" onClick={handle_photo_studio_btn}>행사 사진 촬영 바로가기</button>
                        <button className="btn_navigate_gallary" onClick={handle_gallary_btn}>촬영된 사진 목록</button>
                    <div className="comp_header">
                        <p>행사명: {title}</p>
                        <CopyToClipboard text={`${process.env.REACT_APP_WEB_HREF}/${eventID}`} onCopy={() => alert("클립보드에 초대 링크가 복사되었습니다.")} >
                            <p>
                                <span>초대 링크 복사: </span>
                                <span className="material-icons" style={{ fontSize: "1rem" }}>content_copy</span>
                                <span>{` ${process.env.REACT_APP_WEB_HREF}/${eventID}`}</span>
                            </p>
                        </CopyToClipboard>
                    </div>
                    <div className="comp_invite_card" ref={invite_card}>
                        <span className="material-icons icon" onClick={handle_down_qr} ref={qr_download_btn}>download</span>
                        <QRCode className="asset_qr" value={`${process.env.REACT_APP_WEB_HREF}/${eventID}`} />
                    </div>
                </div>
                : <Loading />
        }
    </div>)
}