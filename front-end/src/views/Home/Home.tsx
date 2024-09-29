import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import TopNav from "./components/TopNav";
import { useNavigate } from "react-router-dom";
import Location from "../../types/location";
import "./Home.scss";

interface Coords {
    latitude: number;
    longitude: number;
}

declare global {
    interface Window {
      kakao: any;
    }
}

interface ApiResponse {
    response: {
      body: {
        items: {
          item: Array<{
            contentid: string;
            title: string;
            dist: string;
            firstimage: string;
          }>;
        }
      };
    };
}

export default function Home(): React.ReactElement {
    const [locationListInfo, setLocationListInfo] = useState<Location[]>([]);
    const [myCoords, setMyCoords] = useState<Coords | null>(null);
    const [myAddress, setMyAddress] = useState<string | null>(null);
    
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setMyCoords({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }, (error) => {
                console.error("Error getting geolocation:", error);
                setMyAddress("인하로 100 인하대학교 하이테크 센터");
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
            setMyAddress("인하로 100 인하대학교 하이테크 센터");
        }
    }, []);

    useEffect(() => {
        if (myCoords) {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2Address(myCoords.longitude, myCoords.latitude, (result: any, status: any) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    setMyAddress(result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name);
                } else {
                    console.error("Failed to get address:", status);
                    setMyAddress("인하로 100 인하대학교 하이테크 센터");
                }
            });
        }
    }, [myCoords]);

    useEffect(() => {
        if (myCoords) {
            fetch_location_list_info(myCoords);
        }
    }, [myCoords]);

    const fetch_location_list_info = async (coords: Coords) => {
        //내 위치로부터 3km 반경 내에 있는 관광지들의 정보를 불러최옵니다.
        const API_URL = `https://apis.data.go.kr/B551011/KorService1/locationBasedList1?MobileOS=ETC&MobileApp=AppTest&numOfRows=30&_type=json&mapX=${coords.longitude}&mapY=${coords.latitude}&radius=3000&contentTypeId=12&serviceKey=${process.env.REACT_APP_TOUR_API_KEY_ENCODED}`
        const resTourSpotList: Location[] = []
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
                    if (item.firstimage) {
                        const distance = parseFloat(item.dist) / 1000;
                        const distance_str = distance.toFixed(1) + "km";
                        resTourSpotList.push({
                            location_ID: item.contentid,
                            title: item.title,
                            distance: distance_str,
                            img_url: item.firstimage
                        });
                    }
            });
        })
        
        setLocationListInfo(resTourSpotList);
        console.log(resTourSpotList);
    };

    return locationListInfo.length > 0 ? (
        <div className="page_home">
            <TopNav />
            <div className="layout">
                <div className="comp_my_location">
                    <div className="flex flex-row">
                        <div className="material-icons text-sm text-[#E44D71]">
                            my_location
                        </div>
                        <p className="pl-2 text-sm text-[#E44D71]">
                            내 주변 투어네컷
                        </p>
                    </div>
                    <p className="font-bold text-2xl pt-2 pb-4">{myAddress}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {locationListInfo.map((_location) => (
                        <DinnerCard location={_location} />
                    ))}
                </div>
            </div>
        </div>
    ) : (
        <Loading />
    );
}

function DinnerCard({ location }: { location: Location }) {
    const navigate = useNavigate();

    const handle_location_clicked = (contentid: string) => {
        navigate(`/location/${contentid}`);
    };

    return (
        <>
            <div
                className="comp_location"
                onClick={() => {
                    localStorage.setItem("location_ID", location.location_ID);
                    localStorage.setItem("title", location.title);
                    handle_location_clicked(location.location_ID);
                }}
                key={location.location_ID}
            >
                <img
                    className="h-auto aspect-square object-cover"
                    alt={location.title}
                    src={location.img_url}
                />
                <div className="pt-2">
                    <div className="flex flex-row">
                        <div className="material-icons text-sm text-[#838383]">
                            near_me
                        </div>
                        <p className="distance">{location.distance}</p>
                    </div>
                    <p className="location_title">{location.title}</p>
                </div>
            </div>
        </>
    );
}
