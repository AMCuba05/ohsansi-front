import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar/index.jsx";
import "./index.scss"

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === "/dashboard") {
            navigate("/dashboard/inscripciones", { replace: true });
        }
    }, [location, navigate]);

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <Sidebar />
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;