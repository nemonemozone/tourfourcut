import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import TopNav from "../PhotoStudio/components/TopNav";
import { useNavigate } from "react-router-dom";
import Location from "../../types/location";
import "./Home.scss";

export default function Home(): React.ReactElement {
    const [locationListInfo, setLocationListInfo] = useState<Location[]>([]);
    const [myLocation, setMyLocation] = useState<any>(null);
    const [myAddress, setMyAddress] = useState<string | null>(null);

    const fetch_my_location = () => {
        //현재 내 위치와 주소를 불러옵니다.
        const location = "";
        const address = "인하로 100 인하대학교 하이테크 센터";
        setMyAddress(address);
        setMyLocation(location);
        return location;
    };

    const fetch_location_list_info = (my_location: string) => {
        //내 위치로부터 3km 반경 내에 있는 관광지들의 정보를 불러옵니다.
        const mock_data: Location[] = [
            {
                location_ID: "locationID1",
                title: "익선동 한옥거리",
                distance: "1.2km",
                img_url:
                    "http://tong.visitkorea.or.kr/cms/resource/23/2947523_image2_1.jpg",
            },
            {
                location_ID: "locationID2",
                title: "경복궁",
                distance: "2.5km",
                img_url:
                    "http://tong.visitkorea.or.kr/cms/resource/23/2947523_image2_1.jpg",
            },
            {
                location_ID: "locationID3",
                title: "북촌 한옥마을",
                distance: "1.8km",
                img_url:
                    "http://tong.visitkorea.or.kr/cms/resource/23/2947523_image2_1.jpg",
            },
        ];
        setLocationListInfo(mock_data);
    };

    useEffect(() => {
        const init = async () => {
            const my_location = await fetch_my_location();
            fetch_location_list_info(my_location);
        };
        init();
    }, []);

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

function DinnerCard({ location }) {
    const navigate = useNavigate();

    const handle_location_clicked = (locationID: string) => {
        navigate(`/location/${locationID}`);
    };

    return (
        <>
            <div
                className="comp_location"
                onClick={() => handle_location_clicked(location.location_ID)}
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
