// components/Pages/Categories.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Modal from "../../register/Modal/index.jsx";
import "./index.scss";

const allCourses = [
    "3ro Primaria",
    "4to Primaria",
    "5to Primaria",
    "6to Primaria",
    "1ro Secundaria",
    "2do Secundaria",
    "3ro Secundaria",
    "4to Secundaria",
    "5to Secundaria",
    "6to Secundaria"
];

const AreaCategories = () => {
    const { id: areaId } = useParams();
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(true);
    const [message, setMessage] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: "", range_course: [] });

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`https://willypaz.dev/projects/ohsansi-api/api/categories/area/${areaId}`);
            setCategories(res.data.categorias);
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [areaId]);

    const handleCheckboxChange = (course) => {
        setNewCategory((prev) => {
            const exists = prev.range_course.includes(course);
            return {
                ...prev,
                range_course: exists
                    ? prev.range_course.filter((c) => c !== course)
                    : [...prev.range_course, course]
            };
        });
    };

    const handleCreateCategory = async () => {
        try {
            await axios.post("https://willypaz.dev/projects/ohsansi-api/api/", {
                ...newCategory,
                area_id: parseInt(areaId)
            });
            setModalSuccess(true);
            setMessage("¡Categoría creada con éxito!");
            setShowModal(true);
            setShowAddModal(false);
            setNewCategory({ name: "", range_course: [] });
            fetchCategories();
        } catch (error) {
            setModalSuccess(false);
            setMessage("Error al crear la categoría.");
            setShowModal(true);
        }
    };

    return (
        <div className="categories-container">
            <h2>Categorías del Área</h2>
            <button className="add-btn" onClick={() => setShowAddModal(true)}>+ Añadir Nueva Categoría</button>

            <table className="categories-table">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Rango de Cursos</th>
                    <th>Area asociada</th>
                </tr>
                </thead>
                <tbody>
                {categories.map((cat) => (
                    <tr key={cat.id}>
                        <td>{cat.name}</td>
                        <td>{cat.range_course.join(", ")}</td>
                        <td>{cat.area.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {showAddModal && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h3>Nueva Categoría</h3>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        />
                        <div className="checkboxes">
                            {allCourses.map((course) => (
                                <label key={course}>
                                    <input
                                        type="checkbox"
                                        checked={newCategory.range_course.includes(course)}
                                        onChange={() => handleCheckboxChange(course)}
                                    />
                                    {course}
                                </label>
                            ))}
                        </div>
                        <div className="modal-buttons">
                            <button onClick={handleCreateCategory}>Crear</button>
                            <button onClick={() => setShowAddModal(false)}>Cancelar</button>
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

export default AreaCategories;