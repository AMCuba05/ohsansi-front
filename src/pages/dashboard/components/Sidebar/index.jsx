// components/Dashboard/Sidebar.jsx
import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Home, Layers, LogOut, Menu } from "lucide-react";
import "./index.scss";

const Sidebar = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        navigate("/");
    };

    return (
        <div className={`sidebar-menu ${collapsed ? "collapsed" : ""}`}>
            <div className="sidebar-header">
                <button className="toggle-button" onClick={() => setCollapsed(!collapsed)}>
                    <Menu size={20} />
                </button>
                {!collapsed && <h4 className="sidebar-title">Oh Sansi</h4>}
            </div>
            <nav>
                <NavLink to="inscripciones" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <Home size={18} /> {!collapsed && <span>Inscripciones</span>}
                </NavLink>
                <NavLink to="areas" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <Layers size={18} /> {!collapsed && <span>Áreas</span>}
                </NavLink>
                <button className="logout-button" onClick={handleLogout}>
                    <LogOut size={18} /> {!collapsed && <span>Cerrar Sesión</span>}
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;
