import { set } from "date-fns";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";
import "./LocationTheme.scss";
import TopNav from "./components/TopNav";
import { BedrockRuntimeClient, InvokeModelCommand, InvokeModelCommandInput } from "@aws-sdk/client-bedrock-runtime";


import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
// import required modules
import { EffectCoverflow, Pagination } from "swiper/modules";
import { convertURLtoBase64 } from "../PhotoStudio/components/URLToFileObj";

interface ApiResponse {
    response: {
      body: {
        items: {
          item: Array<{
            "contentid": string;
            "originimgurl": string;
            "imgname": string;
            "smallimageurl": string;
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

    const handleInvoke = async (locationName: string) => {
        // Bedrock 클라이언트 생성
        const client = new BedrockRuntimeClient({ 
            region: "us-east-1",
            credentials: {
                accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY!,
            }
        });

        // 요청 파라미터 설정
        const params: InvokeModelCommandInput = {
            modelId: "anthropic.claude-3-haiku-20240307-v1:0", 
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 300,
                "system": "너는 한국의 관광지에 대해서 80자 이내로 사용자에게 답해줘야 해.  <example> <input> 익선동 </input><output>익선동은 골목과 한옥이 어우러져 아름다운 매력을 풍기는 곳으로, 남녀노소 많은 관광객들이 찾는 핫플레이스로 떠오르고 있다.</output></example>",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": locationName + "에 대해서 80자 이내로 설명해줘."
                            }
                        ]
                    }
                ],
                temperature: 0.7,
                top_p: 1,
            }),
            
        };

        try {
            const command = new InvokeModelCommand(params);
            const data = await client.send(command);
            
            // 응답 처리
            if (data.body) {
                const responseBody = JSON.parse(new TextDecoder().decode(data.body));
                return responseBody.content[0].text;
            } else {
                throw new Error("No response body");
            }
        } catch (error) {
            console.error("Error invoking Bedrock model:", error);
            return "";
        }
    };
    const fetch_location_title_description = async (_locationTitle: string) => {
        //선택한 장소의 설명을 불러옵니다.
        const description = await handleInvoke(_locationTitle); // Bedrock 호출
        setLocationDescription(description);
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
            .then((data: ApiResponse) => {
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
            fetch_location_title_description(locationTitle!);
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

