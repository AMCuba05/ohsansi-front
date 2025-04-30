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
import Olympiads from "./pages/dashboard/olympiad/index.jsx";
import CreateOlympiad from "./pages/dashboard/olympiad/createOlympiad/index.jsx";
import OlympiadAreasCategories from "./pages/dashboard/olympiad/createAreasByOlympiad/index.jsx";
import PublishOlympiad from "./pages/dashboard/olympiad/publishOlympiad/index.jsx";
import Home from "./pages/Home/index.jsx";
import OlympiadDetail from "./pages/Home/olympiadDetail/index.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/olympiad/:id" element={<OlympiadDetail />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="inscripcion-sencilla" replace />} />
                    <Route path="inscripcion-sencilla" element={<RegisterSingle />} />
                    <Route path="inscripcion-multiple" element={<RegisterMultiple />} />
                    <Route path="inscripcion-excel" element={<RegisterExcel />} />
                    <Route path="areas" element={<Areas />} />
                    <Route path="areas/:id/categories" element={<AreaCategories />} />
                    <Route path="olympiad" element={<Olympiads />} />
                    <Route path="createOlympiad" element={<CreateOlympiad/>} />
                    <Route path="olympiad/:id/associate" element={<OlympiadAreasCategories/>} />
                    <Route path="olympiad/:id/publish" element={<PublishOlympiad/>} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
