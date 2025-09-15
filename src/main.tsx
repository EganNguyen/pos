import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Report from "./Report";

import "./index.css";
import Kitchen from "./Kitchen";
import ErrorPage from "./Error";
import LoginPage from "./Login";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/report" element={<Report />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
