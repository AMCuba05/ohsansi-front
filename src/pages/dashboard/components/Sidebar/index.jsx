// components/Dashboard/Sidebar.jsx
import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Home, Layers, LogOut, Menu, Newspaper, ChevronDown, ChevronRight, UserRoundPen } from "lucide-react";
import "./index.scss";

const Sidebar = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [inscripcionesOpen, setInscripcionesOpen] = useState(false);
    const [olympiadOpen, setOlympiadOpen] = useState(false);
    const [recordsOpen, setRecordsOpen] = useState(false);

    // Check for token in localStorage
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
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
                {/* Home - Always visible */}
                <NavLink
                    to="Home"
                    className={({ isActive }) => (isActive ? "logout-button active" : "logout-button")}
                >
                    <Layers size={18} /> {!collapsed && <span>Home</span>}
                </NavLink>

                {/* Inscripciones - Always visible */}
                <button
                    className={`logout-button`}
                    onClick={() => setInscripcionesOpen(!inscripcionesOpen)}
                >
                    <UserRoundPen size={18} /> {!collapsed && <span>Inscripciones</span>}
                    {!collapsed &&
                        (inscripcionesOpen ? (
                            <ChevronDown size={14} style={{ marginLeft: "auto" }} />
                        ) : (
                            <ChevronRight size={14} style={{ marginLeft: "auto" }} />
                        ))}
                </button>

                {/* Submenú Inscripciones */}
                {inscripcionesOpen && (
                    <div className="submenu">
                        <NavLink
                            to="inscripcion-sencilla"
                            className={({ isActive }) => (isActive ? "logout-button active" : "logout-button")}
                        >
                            {!collapsed && <span className={"sidebar-span"}>Inscripción Sencilla</span>}
                        </NavLink>
                        <NavLink
                            to="inscripcion-multiple"
                            className={({ isActive }) => (isActive ? "logout-button active" : "logout-button")}
                        >
                            {!collapsed && <span className={"sidebar-span"}>Inscripción Múltiple (Manual)</span>}
                        </NavLink>
                        <NavLink
                            to="inscripcion-excel"
                            className={({ isActive }) => (isActive ? "logout-button active" : "logout-button")}
                        >
                            {!collapsed && (
                                <span className={"sidebar-span"}>Inscripción Múltiple (Importar Excel)</span>
                            )}
                        </NavLink>
                        <NavLink
                            to="payments"
                            className={({ isActive }) => (isActive ? "logout-button active" : "logout-button")}
                        >
                            {!collapsed && <span className={"sidebar-span"}>Completar Pago de Inscripción</span>}
                        </NavLink>
                    </div>
                )}

                {/* Restricted sections - Only visible if token exists */}
                {token && (
                    <>
                        <button
                            className={`logout-button ${olympiadOpen ? "active" : ""}`}
                            onClick={() => setOlympiadOpen(!olympiadOpen)}
                        >
                            <Newspaper size={18} /> {!collapsed && <span>Olimpiadas</span>}
                            {!collapsed &&
                                (olympiadOpen ? (
                                    <ChevronDown size={14} style={{ marginLeft: "auto" }} />
                                ) : (
                                    <ChevronRight size={14} style={{ marginLeft: "auto" }} />
                                ))}
                        </button>

                        {olympiadOpen && (
                            <div className="submenu">
                                <NavLink
                                    to="olympiad"
                                    className={({ isActive }) => (isActive ? "logout-button active" : "logout-button")}
                                >
                                    {!collapsed && <span className={"sidebar-span"}>Versiones</span>}
                                </NavLink>
                                <NavLink
                                    to="createOlympiad"
                                    className={({ isActive }) => (isActive ? "logout-button active" : "logout-button")}
                                >
                                    {!collapsed && <span className={"sidebar-span"}>Crear Olimpiada</span>}
                                </NavLink>
                            </div>
                        )}

                        <button
                            className={`logout-button ${recordsOpen ? "active" : ""}`}
                            onClick={() => setRecordsOpen(!recordsOpen)}
                        >
                            <Newspaper size={18} /> {!collapsed && <span>Registros</span>}
                            {!collapsed &&
                                (recordsOpen ? (
                                    <ChevronDown size={14} style={{ marginLeft: "auto" }} />
                                ) : (
                                    <ChevronRight size={14} style={{ marginLeft: "auto" }} />
                                ))}
                        </button>

                        {recordsOpen && (
                            <div className="submenu">
                                <NavLink
                                    to="listInscriptions"
                                    className={({ isActive }) => (isActive ? "logout-button active" : "logout-button")}
                                >
                                    {!collapsed && <span className={"sidebar-span"}>Estados de inscripción</span>}
                                </NavLink>
                                <NavLink
                                    to="records"
                                    className={({ isActive }) => (isActive ? "logout-button active" : "logout-button")}
                                >
                                    {!collapsed && <span className={"sidebar-span"}>Reporte de inscritos</span>}
                                </NavLink>
                            </div>
                        )}

                        <NavLink
                            to="areas"
                            className={({ isActive }) => (isActive ? "logout-button active" : "logout-button")}
                        >
                            <Layers size={18} /> {!collapsed && <span>Áreas</span>}
                        </NavLink>

                        <button className="logout-button" onClick={handleLogout}>
                            <LogOut size={18} /> {!collapsed && <span>Cerrar Sesión</span>}
                        </button>
                    </>
                )}

                <NavLink
                    to="/login"
                    className={({ isActive }) => (isActive ? "logout-button active" : "logout-button")}
                >
                    <Layers size={18} /> {!collapsed && <span>Iniciar Sesión</span>}
                </NavLink>

            </nav>
        </div>
    );
};

export default Sidebar;