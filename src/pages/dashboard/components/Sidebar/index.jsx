import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Home, Layers, LogOut, Menu, Newspaper, ChevronDown, ChevronRight, UserRoundPen } from "lucide-react";
import "./index.scss";

const Sidebar = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [inscripcionesOpen, setInscripcionesOpen] = useState(false);
    const [olympiadOpen, setOlympiadOpen] = useState(false);
    const [recordsOpen, setRecordsOpen] = useState(false);

    // Check for token in localStorage
    const token = localStorage.getItem("token");

    // Detect mobile screen size and manage collapsed state
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (mobile) {
                setMenuOpen(false); // Close menu on mobile
                setCollapsed(false); // Reset collapsed state on mobile
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const toggleMenu = () => {
        if (isMobile) {
            setMenuOpen(!menuOpen);
        } else {
            setCollapsed(!collapsed);
        }
    };

    return (
        <div className={`sidebar-menu ${isMobile ? "mobile" : ""} ${menuOpen ? "open" : ""} ${!isMobile && collapsed ? "collapsed" : ""}`}>
            <div className="sidebar-header">
                <button className="toggle-button" onClick={toggleMenu}>
                    <Menu size={20} color="white" />
                </button>
                {((isMobile && !menuOpen) || (!isMobile && !collapsed)) && <h4 className="sidebar-title">Oh Sansi</h4>}
            </div>

            <nav className={menuOpen || !isMobile ? "visible" : ""}>
                {/* Home - Always visible */}
                <NavLink
                    to="Home"
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                    onClick={() => isMobile && setMenuOpen(false)}
                >
                    <Layers size={18} /> {(!isMobile && !collapsed) || (isMobile && menuOpen) ? <span>Home</span> : null}
                </NavLink>

                {/* Inscripciones - Always visible */}
                <button
                    className={`nav-link ${inscripcionesOpen ? "active" : ""}`}
                    onClick={() => setInscripcionesOpen(!inscripcionesOpen)}
                >
                    <UserRoundPen size={18} /> {(!isMobile && !collapsed) || (isMobile && menuOpen) ? <span>Inscripciones</span> : null}
                    {((!isMobile && !collapsed) || (isMobile && menuOpen)) &&
                        (inscripcionesOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
                </button>

                {inscripcionesOpen && ((!isMobile && !collapsed) || (isMobile && menuOpen)) && (
                    <div className="submenu">
                        <NavLink
                            to="inscripcion-sencilla"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                            onClick={() => isMobile && setMenuOpen(false)}
                        >
                            <span className="sidebar-span">Inscripción Sencilla</span>
                        </NavLink>
                        <NavLink
                            to="inscripcion-multiple"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                            onClick={() => isMobile && setMenuOpen(false)}
                        >
                            <span className="sidebar-span">Inscripción Múltiple (Manual)</span>
                        </NavLink>
                        <NavLink
                            to="inscripcion-excel"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                            onClick={() => isMobile && setMenuOpen(false)}
                        >
                            <span className="sidebar-span">Inscripción Múltiple (Importar Excel)</span>
                        </NavLink>
                        <NavLink
                            to="payments"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                            onClick={() => isMobile && setMenuOpen(false)}
                        >
                            <span className="sidebar-span">Completar Pago de Inscripción</span>
                        </NavLink>
                    </div>
                )}

                {/* Restricted sections - Only visible if token exists */}
                {token && (
                    <>
                        <button
                            className={`nav-link ${olympiadOpen ? "active" : ""}`}
                            onClick={() => setOlympiadOpen(!olympiadOpen)}
                        >
                            <Newspaper size={18} /> {(!isMobile && !collapsed) || (isMobile && menuOpen) ? <span>Olimpiadas</span> : null}
                            {((!isMobile && !collapsed) || (isMobile && menuOpen)) &&
                                (olympiadOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
                        </button>

                        {olympiadOpen && ((!isMobile && !collapsed) || (isMobile && menuOpen)) && (
                            <div className="submenu">
                                <NavLink
                                    to="olympiad"
                                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                                    onClick={() => isMobile && setMenuOpen(false)}
                                >
                                    <span className="sidebar-span">Versiones</span>
                                </NavLink>
                                <NavLink
                                    to="createOlympiad"
                                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                                    onClick={() => isMobile && setMenuOpen(false)}
                                >
                                    <span className="sidebar-span">Crear Olimpiada</span>
                                </NavLink>
                            </div>
                        )}

                        <button
                            className={`nav-link ${recordsOpen ? "active" : ""}`}
                            onClick={() => setRecordsOpen(!recordsOpen)}
                        >
                            <Newspaper size={18} /> {(!isMobile && !collapsed) || (isMobile && menuOpen) ? <span>Registros</span> : null}
                            {((!isMobile && !collapsed) || (isMobile && menuOpen)) &&
                                (recordsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
                        </button>

                        {recordsOpen && ((!isMobile && !collapsed) || (isMobile && menuOpen)) && (
                            <div className="submenu">
                                <NavLink
                                    to="listInscriptions"
                                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                                    onClick={() => isMobile && setMenuOpen(false)}
                                >
                                    <span className="sidebar-span">Estados de inscripción</span>
                                </NavLink>
                                <NavLink
                                    to="records"
                                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                                    onClick={() => isMobile && setMenuOpen(false)}
                                >
                                    <span className="sidebar-span">Reporte de inscritos</span>
                                </NavLink>
                            </div>
                        )}

                        <NavLink
                            to="areas"
                            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                            onClick={() => isMobile && setMenuOpen(false)}
                        >
                            <Layers size={18} /> {(!isMobile && !collapsed) || (isMobile && menuOpen) ? <span>Áreas</span> : null}
                        </NavLink>

                        <button className="nav-link" onClick={handleLogout}>
                            <LogOut size={18} /> {(!isMobile && !collapsed) || (isMobile && menuOpen) ? <span>Cerrar Sesión</span> : null}
                        </button>
                    </>
                )}

                <NavLink
                    to="/login"
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                    onClick={() => isMobile && setMenuOpen(false)}
                >
                    <Layers size={18} /> {(!isMobile && !collapsed) || (isMobile && menuOpen) ? <span>Iniciar Sesión</span> : null}
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;