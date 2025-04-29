import React, { useState, useEffect } from "react";
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
} from "reactstrap";

const AreasComponent = () => {
    const [areas, setAreas] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newArea, setNewArea] = useState({ name: "", description: "", price: "" });
    const [formMessage, setFormMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchAreas();
    }, []);

    const fetchAreas = async () => {
        try {
            const response = await axios.get("https://willypaz.dev/projects/ohsansi-api/api/areas");
            setAreas(response.data.areas);
        } catch (error) {
            console.error("Error al obtener las áreas:", error);
        }
    };

    const handleCreateArea = async () => {
        const { name, description, price } = newArea;

        // Validación de campos
        if (!name || !description) {
            setFormMessage({ type: "error", text: "Todos los campos son obligatorios." });
            return;
        }

        try {
            await axios.post("https://willypaz.dev/projects/ohsansi-api/api/areas", newArea);
            setFormMessage({ type: "success", text: "¡Área creada con éxito!" });
            fetchAreas();
            setNewArea({ name: "", description: ""});
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.errors &&
                error.response.data.errors.name &&
                error.response.data.errors.name[0] === "El área ya existe"
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

    return (
        <div className="container mt-4">
            <h2>Áreas</h2>
            <Button color="primary" onClick={() => setShowAddModal(true)}>
                Crear Nueva Área
            </Button>

            <Table className="mt-3">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                </tr>
                </thead>
                <tbody>
                {areas.map((area) => (
                    <tr key={area.id}>
                        <td>{area.name}</td>
                        <td>{area.description}</td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Modal isOpen={showAddModal} toggle={closeModal}>
                <ModalHeader toggle={closeModal}>Nueva Área</ModalHeader>
                <ModalBody>
                    {formMessage.text && (
                        <div
                            className={`alert ${
                                formMessage.type === "success" ? "alert-success" : "alert-danger"
                            }`}
                        >
                            {formMessage.text}
                        </div>
                    )}
                    <Form>
                        <FormGroup style={{textAlign: "start"}}>
                            <Label>Nombre</Label>
                            <Input
                                type="text"
                                value={newArea.name}
                                onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                            />
                        </FormGroup>
                        <FormGroup style={{textAlign: "start"}}>
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
