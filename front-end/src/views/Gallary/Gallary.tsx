import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Gallary(): React.ReactElement {
    const event_name = "tourfourcut"
    const GALLARY_API = `${process.env.REACT_APP_API}/files/photo_card/${event_name}`;
    const [pictures64, setPictures64] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPictures = async () => {
        try {
            const response = await fetch(GALLARY_API);
            const pictures = JSON.parse(await response.json());

            if (response.ok) {
                if (0 < pictures.length) {
                    setPictures64(pictures);
                    console.log(response);
                } else {
                    setError("아직 촬영된 사진이 없습니다.");
                    console.log(response);

                }
            } else {
                throw new Error("Failed to fetch pictures");
            }
        } catch (e) {
            console.error("Error: ", e);
            setError("사진을 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPictures();
    }, [GALLARY_API]);

    if (loading) {
        return <div className="page_gallary"><p>Loading...</p></div>;
    }

    else return (
        <div className="page_gallary">
            {error ? (
                <p>{error}</p>
            ) : (
                <div>
                    <p>{event_name}에서 촬영된 사진 목록</p>
                    {pictures64.map((src64, index) => (
                        <img key={index} src={src64} alt={`Gallery image ${index}`} />
                    ))}
                </div>
            )}
        </div>
    );
}
