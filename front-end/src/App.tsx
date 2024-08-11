import React from "react";
import "./base.scss";
import PhotoStudio from "./views/PhotoStudio/PhotoStudio";
import Succeed from "./views/Succeed/Succeed";
import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PhotoStudio />}></Route>
            <Route path="/:eventID" element={<PhotoStudio />} />
            <Route path="/succeed" element={<Succeed />}></Route>
          </Routes></BrowserRouter>

      </header>
    </div>
  );
}

export default App;