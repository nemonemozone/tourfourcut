import React from "react";
import QRCode from "react-qr-code";

export default function EventList():React.ReactElement{
    const eventID = "aaa";
    const href_event = `${process.env.REACT_APP_WEB_HREF}/${eventID}`;
    return(
        <div className="page_event_list">
            <QRCode
                value={href_event}
                fgColor="#0000FF"
             />
        </div>
    )
}