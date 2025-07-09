import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import App from "./App"; // App will render the board UI
// import "./index.css";

const token = localStorage.getItem("token");

ReactDOM.createRoot(document.getElementById("root")).render(
<React.StrictMode>
<BrowserRouter>
<Routes>
{/* Always redirect root to login */}
<Route path="/" element={<Navigate to="/login" />} />

{/* Public routes */}
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />

{/* Protected route */}
<Route path="/board" element={token ? <App /> : <Navigate to="/login" />} />
</Routes>
</BrowserRouter>
</React.StrictMode>
);