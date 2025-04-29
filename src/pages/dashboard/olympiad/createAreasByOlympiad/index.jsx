import React, { useEffect, useState } from 'react';
import { Form, Button, Table, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import {useParams} from "react-router-dom";

const OlympiadAreasCategories = () => {
    const { id: olympicId } = useParams();
    const [areas, setAreas] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [associations, setAssociations] = useState([]);
    const [errors, setErrors] = useState({});
    const [loadingAreas, setLoadingAreas] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Cargar áreas al montar el componente
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

    // Cargar categorías cuando se selecciona un área
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

            // Obtener detalles del área y categoría seleccionadas
            const area = areas.find((a) => a.id === parseInt(selectedArea));
            const category = categories.find((c) => c.id === parseInt(selectedCategory));

            // Agregar la nueva asociación a la lista
            setAssociations((prev) => [
                ...prev,
                {
                    areaName: area.name,
                    categoryName: category.name,
                    rangeCourse: category.range_course.join(', '),
                },
            ]);

            // Limpiar selecciones
            setSelectedArea('');
            setSelectedCategory('');
            setCategories([]);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const backendErrors = error.response.data.errors;
                const formattedErrors = {};
                for (const key in backendErrors) {
                    formattedErrors[key] = backendErrors[key][0];
                }
                setErrors(formattedErrors);
            } else {
                setErrors({ form: 'Error al asociar el área y la categoría.' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mt-4">
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
            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    <th>Área</th>
                    <th>Nombre de Categoría</th>
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
                    associations.map((assoc, index) => (
                        <tr key={index}>
                            <td>{assoc.areaName}</td>
                            <td>{assoc.categoryName}</td>
                            <td>{assoc.rangeCourse}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </Table>
        </div>
    );
};

export default OlympiadAreasCategories;
