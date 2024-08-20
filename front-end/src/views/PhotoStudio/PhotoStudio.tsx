import { useEffect, useState, useRef } from "react";
import MakePhotoCard from "./components/MakePhotoCard";
import TopNav from "./components/TopNav";
import ThemePalette from "./components/ThemePalette";
import "./PhotoStudio.scss";
import domtoimage from 'dom-to-image-more';
import Loading from "../Loading/Loading";
import { useParams } from "react-router-dom";

export type theme = "pink" | "blue" | "yellow" | "white";
type logo_list = string;//length less than 10
type photo_list = [string, string, string, string] //length 4
type EventInfo = {
    name: string;
    date: string;
    logo_list: logo_list;
};

export default function PhotoStudio(): React.ReactElement {
    const [eventInfo, setEventData] = useState<EventInfo | null>(null);
    const [selectedTheme, setSelectedTheme] = useState<theme>("blue");
    const [photo_list, setPhotoList] = useState<photo_list>(["", "", "", ""]);
    const [logo_src_list, setLogoSrcList] = useState<string[]>();
    const params = useParams();
    const eventID = params.eventID;
    const GET_EVENT_DATA_API = `${process.env.REACT_APP_API}/eventInfo/${eventID}`;
    const LOGO_API = `${process.env.REACT_APP_API}/files/logo/${eventID}`;
    const renderPhotoRef = useRef<HTMLDivElement>(null);
    const renderSubRef = useRef();

    useEffect(() => {
        const mock_data = {
            "name": "해커네컷",
            "date": new Date().toISOString().split("T")[0],
            "logo_list":
                "/LOGO_aws.svg,/LOGO_nxtCloud.svg,/LOGO_Happics.svg"

        }
        if (!eventID) {
            setEventData(mock_data);
        }
        else {
            fetch(GET_EVENT_DATA_API)
                .then((res) => {
                    console.log(res);
                    return res.json()
                })
                .then((data) => {
                    if (data.body != "null") setEventData(JSON.parse(data.body));
                    else setEventData((mock_data));
                })
                .catch((error) => { console.log(error); setEventData(mock_data) });
        }
    }, []);

    useEffect(() => {
        fetch(LOGO_API)
            .then((_res) => _res.json())
            .then((_body) => {
                console.log(_body);
                setLogoSrcList(JSON.parse(_body));
            })
            .catch((_e) => {
                console.log(_e);
                setLogoSrcList([]);
            })
    }, [eventInfo?.logo_list]);

    const render_photo = () => {
        const card = renderPhotoRef.current;
        const cam_btn_class_name = "capture_btn";
        const photo_scale = 3;

        const filter = (node: Node) => {
            return !(node instanceof HTMLElement && node.classList.contains(cam_btn_class_name));
        };

        const blob = domtoimage
            .toBlob(card!, {
                filter: filter,
                width: card!.clientWidth * photo_scale,
                height: card!.clientHeight * photo_scale,
                style: {
                    transform: `scale(${photo_scale})`,
                    transformOrigin: 'top left'
                }
            })
            .then((_blob) => {
                return _blob;
            });

        return blob;
    }

    const change_photo = (_idx: number, _src: string) => {
        if (_idx < 0 || photo_list.length - 1 < _idx) return;
        const newPhotoList = [...photo_list];
        newPhotoList[_idx] = _src;
        setPhotoList(newPhotoList as photo_list);
    }

    return (
        eventInfo ?
            <div className="page_photo_studio">
                <TopNav photo_list={photo_list} render_photo={render_photo} />
                <MakePhotoCard title={eventInfo.name}
                    date={eventInfo.date}
                    photo_list={photo_list}
                    logo_list={logo_src_list}
                    theme={selectedTheme}
                    change_photo={change_photo}
                    photo_render_ref={renderPhotoRef}
                    render_sub_ref={renderSubRef}
                />
                <ThemePalette selectedTheme={selectedTheme} changeSelectedTheme={setSelectedTheme} />
            </div>
            :
            <Loading />
    );
}