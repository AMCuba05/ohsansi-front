// components/Pages/Areas.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "../register/Modal/index.jsx";
import "./index.scss";

const Areas = () => {
    const [areas, setAreas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(true);
    const [message, setMessage] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newArea, setNewArea] = useState({ name: "", description: "", price: "" });
    const [editArea, setEditArea] = useState({ id: null, name: "", description: "", price: "" });

    const navigate = useNavigate();

    const fetchAreas = async () => {
        try {
            const res = await axios.get("https://willypaz.dev/projects/ohsansi-api/api/areas");
            setAreas(res.data.areas);
        } catch (err) {
            console.error("Error fetching areas:", err);
        }
    };

    useEffect(() => {
        fetchAreas();
    }, []);

    const handleCreateArea = async () => {
        try {
            await axios.post("https://willypaz.dev/projects/ohsansi-api/api/areas", newArea);
            setModalSuccess(true);
            setMessage("¡Área creada con éxito!");
            setShowModal(true);
            setShowAddModal(false);
            setNewArea({ name: "", description: "", price: "" });
            fetchAreas();
        } catch (error) {
            setModalSuccess(false);
            setMessage("Error al crear el área.");
            setShowModal(true);
        }
    };

    const openEditModal = (area) => {
        setEditArea(area);
        setShowEditModal(true);
    };

    const handleEditArea = async () => {
        try {
            await axios.put(`https://willypaz.dev/projects/ohsansi-api/api/areas/${editArea.id}`, editArea);
            setModalSuccess(true);
            setMessage("¡Área actualizada con éxito!");
            setShowModal(true);
            setShowEditModal(false);
            fetchAreas();
        } catch (error) {
            setModalSuccess(false);
            setMessage("Error al actualizar el área.");
            setShowModal(true);
        }
    };

    return (
        <div className="areas-container">
            <h2>Áreas Registradas</h2>
            <button className="add-btn" onClick={() => setShowAddModal(true)}>+ Añadir Nueva Área</button>

            <table className="areas-table">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {areas.map((area) => (
                    <tr key={area.id}>
                        <td>{area.name}</td>
                        <td>{area.description}</td>
                        <td>{area.price} Bs</td>
                        <td>
                            <button className="cat-btn" onClick={() => navigate(`/dashboard/areas/${area.id}/categories`)}>
                                Categorías
                            </button>
                            <button className="edit-btn" onClick={() => openEditModal(area)}>Editar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Modal para crear área */}
            {showAddModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h3>Nueva Área</h3>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={newArea.name}
                            onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                        />
                        <textarea
                            placeholder="Descripción"
                            value={newArea.description}
                            onChange={(e) => setNewArea({ ...newArea, description: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Precio"
                            value={newArea.price}
                            onChange={(e) => setNewArea({ ...newArea, price: e.target.value })}
                        />
                        <div className="modal-buttons">
                            <button onClick={handleCreateArea}>Crear</button>
                            <button onClick={() => setShowAddModal(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para editar área */}
            {showEditModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h3>Editar Área</h3>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={editArea.name}
                            onChange={(e) => setEditArea({ ...editArea, name: e.target.value })}
                            disabled
                        />
                        <textarea
                            placeholder="Descripción"
                            value={editArea.description}
                            onChange={(e) => setEditArea({ ...editArea, description: e.target.value })}
                            disabled
                        />
                        <input
                            type="number"
                            placeholder="Precio"
                            value={editArea.price}
                            onChange={(e) => setEditArea({ ...editArea, price: e.target.value })}
                        />
                        <div className="modal-buttons">
                            <button onClick={handleEditArea}>Guardar</button>
                            <button onClick={() => setShowEditModal(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <Modal success={modalSuccess} onClose={() => setShowModal(false)}>
                    {message}
                </Modal>
            )}
        </div>
    );
};

export default Areas;
