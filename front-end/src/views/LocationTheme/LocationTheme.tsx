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

interface ApiResponseImage {
    response: {
      body: {
        items: {
          item: Array<{
            "contentid": string;
            "originimgurl": string;
          }>;
        };
      };
    };
}

interface ApiResponseDescription {
    response: {
      body: {
        items: {
          item: Array<{
            "contentid": string;
            "overview": string;
          }>;
        };
      };
    };
}

export default function LocationTheme(): React.ReactElement {
    const params = useParams();
    const navigate = useNavigate();
    const [locationID, setLocationID] = useState<string | undefined>(localStorage.getItem("location_ID")!);
    const [locationTitle, setLocationTitle] = useState<string | undefined>(localStorage.getItem("title")!);
    const [locationDescription, setLocationDescription] = useState<
        string | undefined
    >("");
    const [locationPhotoSrcList, setLocationPhotoSrcList] = useState<
        string[] | undefined
    >();
    const [selectedPhoto, setSelectedPhoto] = useState(0);

    const fetch_location_title_description = async (_locationID: string) => {
        //선택한 장소의 설명을 불러옵니다.
        const API_URL = `https://apis.data.go.kr/B551011/KorService1/detailCommon1?MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${_locationID}&defaultYN=Y&firstImageYN=N&areacodeYN=N&catcodeYN=N&addrinfoYN=N&mapinfoYN=N&overviewYN=Y&numOfRows=1&serviceKey=${process.env.REACT_APP_TOUR_API_KEY_ENCODED}`;
        const res = await fetch(API_URL, {
            method: "GET"
        })
            .then(response => response.json())
            .then((data: ApiResponseDescription) => {
                const description = data.response.body.items.item[0].overview;
                // 문자열 중 첫번째 문장만 사용
                const sentences: string[] = description.split('.');
                const trimmedSentence = sentences[0].trim();
                setLocationDescription(trimmedSentence);
            });
    
    };
    const fetch_location_img_src = async (_locationID: string) => {
        //선택한 장소의 사진 데이터 및 정보를 불러옵니다.
        console.log(_locationID);
        const API_URL = `https://apis.data.go.kr/B551011/KorService1/detailImage1?MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${_locationID}&imageYN=Y&subImageYN=Y&numOfRows=20&serviceKey=${process.env.REACT_APP_TOUR_API_KEY_ENCODED}`
        const resPhotoList: string[] = []

        const res = await fetch(API_URL, {
            method: "GET"
        })
            .then((res) => {
                return res;
            })
            .then(response => response.json())
            .then((data: ApiResponseImage) => {
                const items = data.response.body.items.item;
                items.forEach(item => {
                    if (item.originimgurl) {
                        resPhotoList.push(item.originimgurl);
                    }
            });
        })
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
        if (locationID && locationTitle) {
            fetch_location_title_description(locationID!);
            fetch_location_img_src(locationID!);
        }
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
