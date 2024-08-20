import React from "react";
import "./base.scss";
import PhotoStudio from "./views/PhotoStudio/PhotoStudio";
import Succeed from "./views/Succeed/Succeed";
import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import NewEvent from "./views/NewEvent/NewEvent";
import UpdateLogo from "./views/UpdateLogo/UpdateLogo";
import UploadLogo from "./views/UploadLogo/UploadLogo";
import Gallary from "./views/Gallary/Gallary";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PhotoStudio />}></Route>
            <Route path="/:eventID" element={<PhotoStudio />} />
            <Route path="/succeed" element={<Succeed />}></Route>
            <Route path="/admin/newEvent" element={<NewEvent />}></Route>
            <Route path="/admin/logo/:event_name" element={<UploadLogo />}></Route>
            <Route path="/admin/gallary/:event_name" element={<Gallary/>}/>
          </Routes></BrowserRouter>

      </header>
    </div>
  );
}

export default App;