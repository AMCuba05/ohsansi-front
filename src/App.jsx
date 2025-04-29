import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import DashboardLayout from "./pages/dashboard/index.jsx";
import RegisterSingle from "./pages/dashboard/register/index.jsx";
import RegisterMultiple from "./pages/dashboard/registerMultiple/index.jsx";
import RegisterExcel from "./pages/dashboard/registerMultipleExcel/index.jsx";
import Areas from "./pages/dashboard/areas/index.jsx";
import AreaCategories from "./pages/dashboard/areas/categories/index.jsx";
import "./assets/scss/theme.scss";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="inscripcion-sencilla" replace />} />
                    <Route path="inscripcion-sencilla" element={<RegisterSingle />} />
                    <Route path="inscripcion-multiple" element={<RegisterMultiple />} />
                    <Route path="inscripcion-excel" element={<RegisterExcel />} />
                    <Route path="areas" element={<Areas />} />
                    <Route path="areas/:id/categories" element={<AreaCategories />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
