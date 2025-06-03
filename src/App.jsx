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
import Records from "./pages/dashboard/records/index.jsx";
import ListOfInscriptions from "./pages/dashboard/listOfInscriptions/index.jsx";
import Payment from "./pages/dashboard/payment/index.jsx";
import EditOlympiad from "./pages/dashboard/olympiad/editOlympiad/index.jsx";
import PrivateRoute from "./Context/PrivateRoute.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard/Home" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="Home" replace />} />
                    <Route path="Home" element={<Home />} />
                    <Route path="Home/olympiad/:id/info" element={<OlympiadDetail />} />
                    <Route path="inscripcion-sencilla" element={<RegisterSingle />} />
                    <Route path="inscripcion-multiple" element={<RegisterMultiple />} />
                    <Route path="inscripcion-excel" element={<RegisterExcel />} />
                    <Route path="areas" element={<Areas />} />
                    <Route path="areas/:id/categories" element={<AreaCategories />} />
                    <Route path="payments" element={<Payment />} />

                    {/* RUTAS PRIVADAS */}
                    <Route element={<PrivateRoute />}>
                        <Route path="records" element={<Records />} />
                        <Route path="listInscriptions" element={<ListOfInscriptions />} />
                        <Route path="createOlympiad" element={<CreateOlympiad />} />
                        <Route path="olympiad/:id/associate" element={<OlympiadAreasCategories />} />
                        <Route path="olympiad/:id/publish" element={<PublishOlympiad />} />
                        <Route path="olympiad/:id/edit" element={<EditOlympiad />} />
                    </Route>

                    <Route path="olympiad" element={<Olympiads />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
