import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateLogo(): React.ReactElement {
    const params = useParams();
    const title = params.event_name;
    const LOGO_API = `${process.env.REACT_APP_API}/files/logo/${title}`;
    const [logo_list, setLogoList] = useState([]);

    useEffect(() => {
        fetch(LOGO_API)
            .then((res) => res.json())
            .then((data) => {
                if (data.body) {
                    data = JSON.parse(data.body).map((item: any) => `data:image/jpeg;base64,${item.base64}`);
                    return data;
                }
                else return [];
            })
            .then((_res_arr) => {
                setLogoList(_res_arr);
            })

    }, [])

    return (
        <div className="page_update_logo">
            {
                logo_list.map((_logo_obj) => <img src={_logo_obj} alt="logo image" />)
            }
        </div>
    );
}
