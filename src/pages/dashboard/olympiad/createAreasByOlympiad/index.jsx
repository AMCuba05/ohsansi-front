import React, { useEffect, useState } from 'react';
import { Form, Button, Table, Alert, Spinner } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";

const OlympiadAreasCategories = () => {
    const { id: olympicId } = useParams();
    const navigate = useNavigate();
    const [areas, setAreas] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [associations, setAssociations] = useState([]);
    const [errors, setErrors] = useState({});
    const [loadingAreas, setLoadingAreas] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingAssociations, setLoadingAssociations] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Cargar áreas
    useEffect(() => {
        const fetchAreas = async () => {
            setLoadingAreas(true);
            try {
                const response = await axios.get('https://willypaz.dev/projects/ohsansi-api/api/areas');
                setAreas(response.data.areas);
            } catch (error) {
                console.error('Error al cargar las áreas:', error);
            } finally {
                setLoadingAreas(false);
            }
        };

        fetchAreas();
    }, []);

    // Cargar asociaciones existentes
    useEffect(() => {
        fetchAssociations();
    }, [olympicId]);

    const fetchAssociations = async () => {
        setLoadingAssociations(true);
        try {
            const response = await axios.get(
                `https://willypaz.dev/projects/ohsansi-api/api/olimpiadas-categorias/${olympicId}/areas-categories`
            );
            console.log(response.data.areas)
            setAssociations(response.data.areas); // Se espera que sea un array de áreas con categorías
        } catch (error) {
            console.error('Error al cargar asociaciones:', error);
        } finally {
            setLoadingAssociations(false);
        }
    };

    // Cargar categorías cuando cambia el área
    useEffect(() => {
        const fetchCategories = async () => {
            if (selectedArea) {
                setLoadingCategories(true);
                try {
                    const response = await axios.get(
                        `https://willypaz.dev/projects/ohsansi-api/api/area/${selectedArea}/categories`
                    );
                    setCategories(response.data.categorias);
                } catch (error) {
                    console.error('Error al cargar las categorías:', error);
                } finally {
                    setLoadingCategories(false);
                }
            } else {
                setCategories([]);
            }
        };

        fetchCategories();
    }, [selectedArea]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        if (!selectedArea || !selectedCategory) {
            setErrors({ form: 'Todos los campos son obligatorios.' });
            return;
        }

        setSubmitting(true);
        try {
            await axios.post('https://willypaz.dev/projects/ohsansi-api/api/olimpiadas-categorias', {
                olympic_id: olympicId,
                area_id: selectedArea,
                category_id: selectedCategory,
            });

            // Refrescar lista de asociaciones después de guardar
            await fetchAssociations();

            // Reset de inputs
            setSelectedArea('');
            setSelectedCategory('');
            setCategories([]);
        } catch (error) {
            let xError = error.response.data.message;
            if (xError) {
                const backendErrors = xError;
                setErrors({form: backendErrors});
            } else {
                setErrors({ form: 'Error al asociar el área y la categoría.' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mt-4">
            <Button
                variant="link"
                onClick={() => navigate(-1)}
                className="mb-3 p-0 d-flex align-items-center text-decoration-none"
            >
                <ArrowLeft size={18} className="me-2" />
                Volver
            </Button>
            <h2>Asociar Áreas y Categorías</h2>

            {errors.form && <Alert variant="danger">{errors.form}</Alert>}

            <Form onSubmit={handleSubmit} className="mb-4">
                <Form.Group controlId="areaSelect" className="mb-3">
                    <Form.Label>Área</Form.Label>
                    <Form.Select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        disabled={loadingAreas}
                    >
                        <option value="">Seleccione un área</option>
                        {areas.map((area) => (
                            <option key={area.id} value={area.id}>
                                {area.name}
                            </option>
                        ))}
                    </Form.Select>
                    {errors.area_id && <div className="text-danger">{errors.area_id}</div>}
                </Form.Group>

                <Form.Group controlId="categorySelect" className="mb-3">
                    <Form.Label>Categoría</Form.Label>
                    <Form.Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        disabled={!selectedArea || loadingCategories}
                    >
                        <option value="">Seleccione una categoría</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </Form.Select>
                    {errors.category_id && <div className="text-danger">{errors.category_id}</div>}
                </Form.Group>

                <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? (
                        <>
                            <Spinner animation="border" size="sm" /> Asociando...
                        </>
                    ) : (
                        'Asociar'
                    )}
                </Button>
            </Form>

            <h3>Asociaciones Existentes</h3>
            {loadingAssociations ? (
                <Spinner animation="border" />
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>Área</th>
                        <th>Categoría</th>
                        <th>Rangos</th>
                    </tr>
                    </thead>
                    <tbody>
                    {associations.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="text-center">
                                No hay asociaciones registradas.
                            </td>
                        </tr>
                    ) : (
                        associations.map((area) =>
                            area.categories.map((category) => (
                                <tr key={`${area.id}-${category.id}`}>
                                    <td>{area.area.name}</td>
                                    <td>{category.name}</td>
                                    <td>{category.range_course?.join(', ') || '-'}</td>
                                </tr>
                            ))
                        )
                    )}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default OlympiadAreasCategories;
