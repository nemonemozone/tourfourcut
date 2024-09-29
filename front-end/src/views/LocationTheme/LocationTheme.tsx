import { set } from "date-fns";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import "./LocationTheme.scss";
import TopNav from "./components/TopNav";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
// import required modules
import { EffectCoverflow, Pagination } from "swiper/modules";

interface ApiResponse {
    response: {
      body: {
        items: {
          item: Array<{
            galWebImageUrl: string;
            [key: string]: any;
          }>;
        };
      };
    };
}

export default function LocationTheme(): React.ReactElement {
    const params = useParams();
    const navigate = useNavigate();
    const locationName: string | undefined = params.locationName;
    const [locationTitle, setLocationTitle] = useState<string | undefined>("");
    const [locationDescription, setLocationDescription] = useState<
        string | undefined
    >("");
    const [locationPhotoSrcList, setLocationPhotoSrcList] = useState<
        string[] | undefined
    >();
    const [selectedPhoto, setSelectedPhoto] = useState(0);

    const fetch_location_title_description = (_locationName: string) => {
        //선택한 장소의 이름과 해당 장소에 대한 설명을 불러옵니다.
        setLocationTitle(_locationName);
        setLocationDescription(
            "익선동은 골목과 한옥이 어우러져 아름다운 매력을 풍기는 곳으로, 남녀노소 많은 관광객들이 찾는 핫플레이스로 떠오르고 있다.",
        ); //목업 데이터
    };
    const fetch_location_img_src = async (_locationName: string) => {
        //선택한 장소의 사진 데이터를 불러옵니다.
        const API_URL = `https://apis.data.go.kr/B551011/PhotoGalleryService1/gallerySearchList1?numOfRows=4&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&arrange=BAC&keyword=${encodeURIComponent(_locationName)}&serviceKey=${process.env.REACT_APP_TOUR_API_KEY}`
        const resPhotoList: string[] = []

        const res = await fetch(API_URL, {
            method: "GET"
        })
            .then((res) => {
                console.log(res);
                return res;
            })
            .then(response => response.json())
            .then((data: ApiResponse) => {
            const items = data.response.body.items.item;
            items.forEach(item => {
                if (item.galWebImageUrl) {
                resPhotoList.push(item.galWebImageUrl);
                }
            });
        })
        console.log(resPhotoList);
        setLocationPhotoSrcList(resPhotoList);
    };

    const update_selected_photo = (_new_idx: number) => {
        setSelectedPhoto(_new_idx);
    };

    const handleNxtBtn = () => {
        navigate("/takePhoto/tourfourcut", {
            state: {
                title: locationTitle,
                img_src: locationPhotoSrcList![selectedPhoto],
            },
        });
    };

    useEffect(() => {
        console.log(locationName);
        fetch_location_img_src(locationName!);
        fetch_location_title_description(locationName!);
    }, []);

    return (
        <>
            {locationTitle && locationDescription && locationPhotoSrcList ? (
                <div className="page_location_theme">
                    <div className="content">
                        <TopNav handleNxtBtn={handleNxtBtn} />
                        <div className="pt-[25px] px-6 pb-12">
                            <p className="text-2xl pb-[11px] text-white font-bold">
                                {locationTitle}
                            </p>
                            <p className="text-sm text-white text-opacity-70">
                                {locationDescription}
                            </p>
                        </div>
                        
                        
                        <Swiper
                            effect={"coverflow"}
                            grabCursor={true}
                            centeredSlides={true}
                            slidesPerView={1.6}
                            coverflowEffect={{
                                scale: 0.85,
                                rotate: 0,
                                stretch: 0,
                                depth: 10,
                                modifier: 1,
                                slideShadows: false,
                            }}
                            pagination={true}
                            modules={[EffectCoverflow, Pagination]}
                            className="mySwiper"
                        >
                            {locationPhotoSrcList.map((_img_url, _idx) => (
                                <SwiperSlide>
                                    <div
                                        className={`image_container ${_idx == selectedPhoto && "selected"}`}
                                        key={_idx}
                                        onClick={() => {
                                            update_selected_photo(_idx);
                                        }}
                                    >
                                        <img
                                            className="image"
                                            alt={`land scape number${_idx}1`}
                                            src={_img_url}
                                        />
                                        <div className="button">{`${_idx+1}번 테마 선택`}</div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            ) : (
                <Loading />
            )}
        </>
    );
}

