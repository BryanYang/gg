import ReactDOM from "react-dom/client";
import axios from "axios";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// 从 Session Storage 中获取 access_token
const accessToken = sessionStorage.getItem("access_token");

// 设置默认的请求头，将 access_token 作为 Bearer Token 传递
axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

if (
  !sessionStorage.getItem("access_token") &&
  !window.location.pathname.startsWith("/login")
) {
  window.location.replace("/login");
} else if (
  sessionStorage.getItem("access_token") &&
  window.location.pathname.startsWith("/login")
) {
  window.location.replace("/");
}

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<App />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
