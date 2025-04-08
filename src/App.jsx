import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import DashboardLayout from "./pages/dashboard/index.jsx";
import Register from "./pages/dashboard/register/index.jsx";
import Areas from "./pages/dashboard/areas/index.jsx";
import AreaCategories from "./pages/dashboard/areas/categories/index.jsx";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="inscripciones" replace />} />
                    <Route path="inscripciones" element={<Register />} />
                    <Route path="areas" element={<Areas />} />
                    <Route path="areas/:id/categories" element={<AreaCategories />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
