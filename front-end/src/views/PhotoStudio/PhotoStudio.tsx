import { useEffect, useState, useRef } from "react";
import MakePhotoCard from "./components/MakePhotoCard";
import TopNav from "./components/TopNav";
import ThemePalette from "./components/ThemePalette";
import "./PhotoStudio.scss";
import domtoimage from 'dom-to-image-more';
import Loading from "../Loading/Loading";
import { useParams } from "react-router-dom";
import 'doodle.css/doodle.css'
import { eventInfo, theme, photo_list } from "../../types/eventInfo";



export default function PhotoStudio(): React.ReactElement {
    const mock_data = {
        "ID": "default",
        "name": "Happics",
        "date": (new Date().toISOString().split("T")[0]).replaceAll("-", ". "),
        "owner": "eemune"
    }
    const [eventInfo, setEventData] = useState<eventInfo | null>(mock_data);
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
        try {
            fetch_event_data(eventID!);
            fetch_logo_img_src(eventID!);
        }
        catch {
            setEventData(mock_data);
        }
    }, []);

    const fetch_logo_img_src = (_eventID: string) => {
        fetch(LOGO_API)
            .then((_res) => _res.json())
            .then((_body) => {
                setLogoSrcList(JSON.parse(_body));
            })
            .catch((_e) => {
                console.log(_e);
                setLogoSrcList([]);
            })
    }

    const fetch_event_data = (_eventID: string) => {
        fetch(GET_EVENT_DATA_API)
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                console.log(data.body)
                setEventData(JSON.parse(data.body)[0]);
            })
            .catch((error) => { console.log(error); });
    }

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
                const PHOTO_API = `${process.env.REACT_APP_API}/files/photo_card/${eventID}`;
                const file = new File([_blob], 'image.png', {
                    type: _blob.type,
                });
                const post_res = post_photos([file], PHOTO_API);

                return _blob;
            });



        return blob;
    }

    const base64_to_file_obj = (dataurl: string, filename: string): File => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || '';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    }

    const post_photos = async (_file_obj_list: File[], _api: string) => {

        const formData = new FormData();

        for (const _file_obj of _file_obj_list) {
            formData.append("image_list", _file_obj);
        }
        const res = await fetch(_api, {
            method: "POST",
            body: formData
        })
            .then((_res) => _res.json())
            .then((_json) => JSON.parse(_json.body));
        return res;
    }

    const change_photo = (_idx: number, _src: string) => {
        const PHOTO_API = `${process.env.REACT_APP_API}/files/pictures/${eventID}`;
        const file_obj = [base64_to_file_obj(_src, "image.png")];
        const post_res = post_photos(file_obj, PHOTO_API);

        if (_idx < 0 || photo_list.length - 1 < _idx) return;
        const newPhotoList = [...photo_list];
        newPhotoList[_idx] = _src;
        setPhotoList(newPhotoList as photo_list);
    }

    return (
        eventInfo ?
            <div className="page_photo_studio">
                <TopNav photo_list={photo_list} render_photo={render_photo} eventID={eventID} />
                <MakePhotoCard title={eventInfo.name}
                    date={eventInfo.date}
                    photo_list={photo_list}
                    logo_list={logo_src_list}
                    theme={selectedTheme}
                    change_photo={change_photo}
                    photo_render_ref={renderPhotoRef}
                    render_sub_ref={renderSubRef}
                    eventID={eventID}
                />
                <ThemePalette selectedTheme={selectedTheme} changeSelectedTheme={setSelectedTheme} />
            </div>
            :
            <Loading />
    );
}