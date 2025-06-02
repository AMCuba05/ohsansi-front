import React, { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../../Constants/Utils.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";
import {ArrowLeft} from "lucide-react";
import {Button} from "react-bootstrap";
import {Alert} from "reactstrap"; // Keep for custom styles if needed

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
    "6to Secundaria",
];

const AreaCategories = () => {
    const navigate = useNavigate();
    const { id: areaId } = useParams();
    const [categories, setCategories] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: "", range_course: [] });
    const [formMessage, setFormMessage] = useState({ text: "", type: "" });

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/area/${areaId}/categories`);
            setCategories(res.data.categorias);
        } catch (err) {
            console.error("Error fetching categories:", err);
            setFormMessage({
                text: "Error al cargar las categorías.",
                type: "danger",
            });
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
                    : [...prev.range_course, course],
            };
        });
    };

    const handleCreateCategory = async () => {
        if (!newCategory.name || newCategory.range_course.length === 0) {
            setFormMessage({
                text: "Por favor, ingrese un nombre y seleccione al menos un curso.",
                type: "danger",
            });
            return;
        }

        try {
            await axios.post(`${API_URL}/api/categories`, {
                ...newCategory,
                area_id: parseInt(areaId),
            });
            setFormMessage({
                text: "¡Categoría creada con éxito!",
                type: "success",
            });
            setNewCategory({ name: "", range_course: [] });
            fetchCategories();
        } catch (error) {
            setFormMessage({
                text: error.response?.data?.errors?.name?.[0] || "Error al crear la categoría.",
                type: "danger",
            });
        }
    };


    const closeModal = () => {
        setShowAddModal(false);
        setFormMessage({ type: "", text: "" });
    };

    return (
        <div className="container my-4">
            <Button
                variant="link"
                onClick={() => navigate(-1)}
                className="mb-3 p-0 d-flex align-items-center text-decoration-none"
            >
                <ArrowLeft size={18} className="me-2" />
                Volver
            </Button>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Categorías del Área</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAddModal(true)}
                >
                    + Añadir Nueva Categoría
                </button>
            </div>

            <div className="table-responsive">
                {formMessage.text && !showAddModal && (
                    <Alert color={formMessage.type === "success" ? "success" : "danger"}>
                        {formMessage.text}
                    </Alert>
                )}
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                    <tr>
                        <th>Nombre</th>
                        <th>Rango de Cursos</th>
                        <th>Área Asociada</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <tr key={cat.id}>
                                <td>{cat.name}</td>
                                <td>{cat.range_course.join(", ")}</td>
                                <td>{cat.area.name}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">
                                No hay categorías disponibles
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="addCategoryModal"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addCategoryModal">
                                    Nueva Categoría
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setFormMessage({ text: "", type: "" });
                                    }}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                {formMessage.text && (
                                    <div className={`alert alert-${formMessage.type}`}>
                                        {formMessage.text}
                                    </div>
                                )}
                                <div className="mb-3">
                                    <label htmlFor="categoryName" className="form-label">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="categoryName"
                                        placeholder="Nombre de la categoría"
                                        value={newCategory.name}
                                        onChange={(e) =>
                                            setNewCategory({ ...newCategory, name: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Rango de Cursos</label>
                                    <div className="row">
                                        {allCourses.map((course) => (
                                            <div key={course} className="col-6 mb-2">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={course}
                                                        checked={newCategory.range_course.includes(course)}
                                                        onChange={() => handleCheckboxChange(course)}
                                                    />
                                                    <label className="form-check-label" htmlFor={course}>
                                                        {course}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setFormMessage({ text: "", type: "" });
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleCreateCategory}
                                >
                                    Crear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AreaCategories;