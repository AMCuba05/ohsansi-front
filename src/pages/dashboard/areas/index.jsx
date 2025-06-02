// components/AreasComponent.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
    Table,
    Alert,
} from "reactstrap";
import { API_URL } from "../../../Constants/Utils.js";

const AreasComponent = () => {
    const [areas, setAreas] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newArea, setNewArea] = useState({ name: "", description: "", price: "" });
    const [formMessage, setFormMessage] = useState({ type: "", text: "" });
    const navigate = useNavigate();

    useEffect(() => {
        fetchAreas();
    }, []);

    const fetchAreas = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/areas`);
            setAreas(response.data.areas || []);
        } catch (error) {
            console.error("Error al obtener las áreas:", error);
            setFormMessage({ type: "error", text: "Error al cargar las áreas." });
        }
    };

    const handleCreateArea = async () => {
        const { name, description, price } = newArea;

        // Validación de campos
        if (!name || !description) {
            setFormMessage({ type: "error", text: "El nombre y la descripción son obligatorios." });
            return;
        }

        try {
            await axios.post(`${API_URL}/api/areas`, newArea);
            setFormMessage({ type: "success", text: "¡Área creada con éxito!" });
            fetchAreas();
            setNewArea({ name: "", description: "", price: "" });
        } catch (error) {
            console.log(error.response.data)
            if (
                error.response &&
                error.response.data &&
                error.response.data.errors &&
                error.response.data.errors.name &&
                error.response.data.errors.name[0] === "El área ya existe."
            ) {
                setFormMessage({ type: "error", text: "El área ya existe." });
            } else {
                setFormMessage({ type: "error", text: "Error al crear el área." });
            }
        }
    };

    const closeModal = () => {
        setShowAddModal(false);
        setFormMessage({ type: "", text: "" });
        setNewArea({ name: "", description: "", price: "" });
    };

    const handleNavigateToCategories = (areaId) => {
        navigate(`/dashboard/areas/${areaId}/categories`);
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Áreas</h2>
                <Button color="primary" onClick={() => setShowAddModal(true)}>
                    Crear Nueva Área
                </Button>
            </div>

            {formMessage.text && !showAddModal && (
                <Alert color={formMessage.type === "success" ? "success" : "danger"}>
                    {formMessage.text}
                </Alert>
            )}

            <Table responsive striped bordered className="mt-3">
                <thead className="table-dark">
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {areas.length > 0 ? (
                    areas.map((area) => (
                        <tr key={area.id}>
                            <td>{area.name}</td>
                            <td>{area.description}</td>
                            <td>
                                <Button
                                    color="info"
                                    size="sm"
                                    onClick={() => handleNavigateToCategories(area.id)}
                                >
                                    Gestionar Categorías
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" className="text-center">
                            No hay áreas disponibles
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>

            <Modal isOpen={showAddModal} toggle={closeModal}>
                <ModalHeader toggle={closeModal}>Nueva Área</ModalHeader>
                <ModalBody>
                    {formMessage.text && (
                        <Alert color={formMessage.type === "success" ? "success" : "danger"}>
                            {formMessage.text}
                        </Alert>
                    )}
                    <Form>
                        <FormGroup>
                            <Label for="areaName">Nombre</Label>
                            <Input
                                type="text"
                                id="areaName"
                                placeholder="Nombre del área"
                                value={newArea.name}
                                onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="areaDescription">Descripción</Label>
                            <Input
                                type="textarea"
                                id="areaDescription"
                                placeholder="Descripción del área"
                                value={newArea.description}
                                onChange={(e) => setNewArea({ ...newArea, description: e.target.value })}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={closeModal}>
                        Cancelar
                    </Button>
                    <Button color="primary" onClick={handleCreateArea}>
                        Crear
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default AreasComponent;