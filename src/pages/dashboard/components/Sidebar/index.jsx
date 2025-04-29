// components/Dashboard/Sidebar.jsx
import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Home, Layers, LogOut, Menu, Newspaper, ChevronDown, ChevronRight } from "lucide-react";
import "./index.scss";

const Sidebar = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [inscripcionesOpen, setInscripcionesOpen] = useState(false);
    const [olympiadOpen, setOlympiadOpen] = useState(false);

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
                {/* Inscripciones principal */}
                <button
                    className={`logout-button ${inscripcionesOpen ? 'active' : ''}`}
                    onClick={() => setInscripcionesOpen(!inscripcionesOpen)}
                >
                    <Newspaper size={18}/> {!collapsed && <span>Inscripciones</span>}
                    {!collapsed && (inscripcionesOpen ? <ChevronDown size={14} style={{marginLeft: 'auto'}}/> :
                        <ChevronRight size={14} style={{marginLeft: 'auto'}}/>)}
                </button>

                {/* Submenú Inscripciones */}
                {inscripcionesOpen && (
                    <div className="submenu">
                        <NavLink to="inscripciones"
                                 className={({isActive}) => isActive ? 'logout-button active' : 'logout-button'}>
                            {!collapsed && <span className={"sidebar-span"}>Inscripción Sencilla</span>}
                        </NavLink>
                        <NavLink to="inscripcion-multiple-manual"
                                 className={({isActive}) => isActive ? 'logout-button active' : 'logout-button'}>
                            {!collapsed && <span className={"sidebar-span"}>Inscripción Múltiple (Manual)</span>}
                        </NavLink>
                        <NavLink to="inscripcion-multiple-excel"
                                 className={({isActive}) => isActive ? 'logout-button active' : 'logout-button'}>
                            {!collapsed &&
                                <span className={"sidebar-span"}>Inscripción Múltiple (Importar Excel)</span>}
                        </NavLink>
                    </div>
                )}

                <button
                    className={`logout-button ${olympiadOpen ? 'active' : ''}`}
                    onClick={() => setOlympiadOpen(!olympiadOpen)}
                >
                    <Newspaper size={18}/> {!collapsed && <span>Olimpiadas</span>}
                    {!collapsed && (olympiadOpen ? <ChevronDown size={14} style={{marginLeft: 'auto'}}/> :
                        <ChevronRight size={14} style={{marginLeft: 'auto'}}/>)}
                </button>

                {olympiadOpen && (
                    <div className="submenu">
                        <NavLink to="olympiad"
                                 className={({isActive}) => isActive ? 'logout-button active' : 'logout-button'}>
                            {!collapsed && <span className={"sidebar-span"}>Versiones</span>}
                        </NavLink>
                        <NavLink to="createOlympiad"
                                 className={({isActive}) => isActive ? 'logout-button active' : 'logout-button'}>
                            {!collapsed && <span className={"sidebar-span"}>Crear Olimpiada</span>}
                        </NavLink>
                    </div>
                )}

                <NavLink to="areas" className={({isActive}) => isActive ? 'logout-button active' : 'logout-button'}>
                    <Layers size={18}/> {!collapsed && <span>Áreas</span>}
                </NavLink>

                <button className="logout-button" onClick={handleLogout}>
                    <LogOut size={18}/> {!collapsed && <span>Cerrar Sesión</span>}
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;
