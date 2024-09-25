import { set } from "date-fns";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../Loading/Loading";
import "./LocationTheme.scss";
import TopNav from "./components/TopNav";
export default function LocationTheme():React.ReactElement{
    const params = useParams();
    const locationID:string|undefined = params.locationID;
    const [locationTitle, setLocationTitle] = useState<string|undefined>("");
    const [locationDescription, setLocationDescription] = useState<string|undefined>("");
    const [locationPhotoSrcList, setLocationPhotoSrcList] = useState<string[]|undefined>();
    const [selectedPhoto, setSelectedPhoto] = useState(0);
    
    const fetch_location_title_description = (_locationID:string)=>{
        //선택한 장소의 이름과 해당 장소에 대한 설명을 불러옵니다.
        setLocationTitle("암사동 선사유적지");//목업 데이터
        setLocationDescription("좋은 곳임니다...");//목업 데이터
    }
    const fetch_location_img_src = (_locationID:string)=>{
        //선택한 장소의 사진 데이터를 불러옵니다.
        setLocationPhotoSrcList(
            [
                "http://tong.visitkorea.or.kr/cms/resource/77/3372877_image2_1.JPG",
                "http://tong.visitkorea.or.kr/cms/resource/76/3372876_image2_1.JPG",
                "http://tong.visitkorea.or.kr/cms/resource/92/3372892_image2_1.JPG",
                "http://tong.visitkorea.or.kr/cms/resource/21/3372921_image2_1.JPG",
            ]
        )
    }

    const update_selected_photo = (_new_idx:number)=>{
        setSelectedPhoto(_new_idx);
    }

    useEffect(()=>{
        fetch_location_img_src(locationID!);
        fetch_location_title_description(locationID!);
    }, [])

    return(
        locationTitle&&locationDescription&&locationPhotoSrcList?
        <div className="page_location_theme">
            <TopNav/>
            <div className="comp_header">
                <p>{locationTitle}</p>
                <p>{locationDescription}</p>
            </div>
            <div className="comp_photo_select">
                {
                    locationPhotoSrcList.map(
                        (_img_url,_idx)=>
                            <div className={"image_container" +( _idx==selectedPhoto&&" selected")} key={_idx} onClick={()=>{update_selected_photo(_idx)}}>
                               <img  alt={"land scape number "+_idx+1} src={_img_url}/>
                            </div>
                    )
                }
            </div>
        </div>
        :<Loading/>
    )
}