import React from "react";
import "./base.scss";
import "./output.css";
import PhotoStudio from "./views/PhotoStudio/PhotoStudio";
import Succeed from "./views/Succeed/Succeed";
import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import NewEvent from "./views/NewEvent/NewEvent";
import UpdateLogo from "./views/UpdateLogo/UpdateLogo";
import UploadLogo from "./views/UploadLogo/UploadLogo";
import Gallary from "./views/Gallary/Gallary";
import EventList from "./views/EventList/EventList";
import EventInfo from "./views/EventInfo/EventInfo";
import Home from "./views/Home/Home";
import LocationTheme from "./views/LocationTheme/LocationTheme";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/location/:locationName" element={<LocationTheme />}></Route>
            <Route path="/takePhoto/:eventID" element={<PhotoStudio />} />
            <Route path="/succeed" element={<Succeed />}></Route>
            <Route path="/admin" element={<Gallary />} />
          </Routes></BrowserRouter>
      </header>
    </div>
  );
}

export default App;