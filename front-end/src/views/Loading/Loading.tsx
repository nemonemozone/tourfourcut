import React, { useEffect, useState } from "react";

import "./Loading.scss";

export default function Loading(): React.ReactElement {
    const [loadingText, setLoadingText] = useState('로딩 중');

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingText((prev) => {
                if (prev === '로딩 중...') return '로딩 중';
                return prev + '.';
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);
    return (
        <div className="page_loading">
            <div className="container_LOGO">
                <img alt="Happics logo" src="/LOGO_Happics.svg" />
            </div>
            <p className="description">{loadingText}</p>
        </div>
    )
}