// components/Pages/Areas.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Table,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import FeedbackModal from "../register/Modal/index.jsx";

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
        if (newArea.price > 999 || newArea.price < 0) {
            setModalSuccess(false);
            setMessage("Error al crear el área, verifique el precio.");
            setShowModal(true);
            return;
        }

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
        if (editArea.price > 999 || editArea.price < 0) {
            setModalSuccess(false);
            setMessage("Error al actualizar el área, verifique el precio.");
            setShowModal(true);
            return;
        }

        try {
            const price = { price: editArea.price };
            await axios.patch(`https://willypaz.dev/projects/ohsansi-api/api/areas/${editArea.id}/pricing`, price);
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
        <Container className="my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Áreas Registradas</h2>
                <Button color="primary" onClick={() => setShowAddModal(true)}>
                    + Añadir Nueva Área
                </Button>
            </div>

            <Table bordered hover responsive>
                <thead className="table-light">
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {areas.map((area) => (
                    <tr key={area.id}>
                        <td>{area.name}</td>
                        <td>{area.description}</td>
                        <td>
                            <Button color="warning" size="sm" onClick={() => openEditModal(area)}>
                                Editar
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Modal isOpen={showAddModal} toggle={() => setShowAddModal(false)}>
                <ModalHeader toggle={() => setShowAddModal(false)}>Nueva Área</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup  style={{textAlign: "start"}}>
                            <Label>Nombre</Label>
                            <Input
                                type="text"
                                value={newArea.name}
                                onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup  style={{textAlign: "start"}}>
                            <Label>Descripción</Label>
                            <Input
                                type="textarea"
                                value={newArea.description}
                                onChange={(e) => setNewArea({ ...newArea, description: e.target.value })}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={handleCreateArea}>
                        Crear
                    </Button>{" "}
                    <Button color="secondary" onClick={() => setShowAddModal(false)}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Modal: Editar Área */}
            <Modal isOpen={showEditModal} toggle={() => setShowEditModal(false)}>
                <ModalHeader toggle={() => setShowEditModal(false)}>Editar Área</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label>Nombre</Label>
                            <Input value={editArea.name} disabled />
                        </FormGroup>
                        <FormGroup>
                            <Label>Descripción</Label>
                            <Input type="textarea" value={editArea.description} disabled />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={handleEditArea}>
                        Guardar
                    </Button>{" "}
                    <Button color="secondary" onClick={() => setShowEditModal(false)}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Modal de confirmación */}
            {showModal && (
                <FeedbackModal success={modalSuccess} onClose={() => setShowModal(false)}>
                    {message}
                </FeedbackModal>
            )}
        </Container>
    );
};

export default Areas;
