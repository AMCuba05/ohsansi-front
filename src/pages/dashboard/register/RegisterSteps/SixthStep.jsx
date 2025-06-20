import React, { useState, useEffect } from 'react';
import { useSteps } from 'react-step-builder';
import { Form, ProgressBar, Alert, Spinner, Collapse, Button, FormControl, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useRegisterContext } from '../../../../Context/RegisterContext.js';
import PaymentReceipt from '../../components/PaymentReceipt/index.jsx';
import { API_URL } from '../../../../Constants/Utils.js';

export const SixthStep = () => {
    const stepsState = useSteps();
    const { registerData } = useRegisterContext();
    const [areas, setAreas] = useState([]);
    const [seleccionadas, setSeleccionadas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [tutors, setTutors] = useState({}); // { areaId: { teacher data } }
    const [openAreas, setOpenAreas] = useState({}); // Track collapsed state

    const boletaData = {
        nombre: `${registerData.legal_tutor?.names || ''} ${registerData.legal_tutor?.last_names || ''}`,
        ci: registerData.legal_tutor?.ci || '',
        fechaPago: Date.now().toString(),
        detalles: [{ concepto: `Inscripción Olimpiada: ${registerData.olympic_name || ''}`, monto: 15 }],
        total: 15,
    };

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${API_URL}/api/olympiads/10/areas`)
            .then((response) => {
                setAreas(response.data.data || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching areas:', error);
                setError('No se pudieron cargar las áreas. Por favor intenta de nuevo.');
                setLoading(false);
            });
    }, []);

    const handleCheckArea = (id) => {
        if (seleccionadas.includes(id)) {
            setSeleccionadas(seleccionadas.filter((item) => item !== id));
            setCategorias(categorias.filter((catId) => {
                const area = areas.find((a) => a.id === id);
                return !area?.categories?.some((category) => category.id === catId);
            }));
            setTutors((prev) => {
                const newTutors = { ...prev };
                delete newTutors[id];
                return newTutors;
            });
        } else if (seleccionadas.length < 2) {
            setSeleccionadas([...seleccionadas, id]);
            setOpenAreas((prev) => ({ ...prev, [id]: true }));
        }
    };

    const handleCheckCategory = (categoryId, areaId) => {
        if (categorias.includes(categoryId)) {
            setCategorias(categorias.filter((item) => item !== categoryId));
        } else {
            // Remove any existing category for this area
            const area = areas.find((a) => a.id === areaId);
            console.log(area)
            const existingCat = categorias.find((catId) => area?.olympiadCategories?.some((c) => c.id === catId));
            if (existingCat) {
                setCategorias(categorias.filter((catId) => catId !== existingCat));
            }
            setCategorias([...categorias, categoryId]);
        }
    };

    const toggleTutor = (areaId) => {
        setTutors((prev) => ({
            ...prev,
            [areaId]: prev[areaId] ? undefined : {
                birthdate: '',
                ci: '',
                ci_expedition: '',
                email: '',
                gender: '',
                names: '',
                last_names: '',
                phone_number: ''
            }
        }));
    };

    const updateTutorData = (areaId, field, value) => {
        setTutors((prev) => ({
            ...prev,
            [areaId]: { ...prev[areaId], [field]: value }
        }));
    };

    const validate = () => {
        if (seleccionadas.length === 0 || categorias.length === 0) return false;
        for (const areaId of seleccionadas) {
            const area = areas.find((a) => a.id === areaId);
            console.log(area)
            const hasCategory = categorias.some((catId) => area?.olympiadCategories?.some((c) => c.id === catId));
            console.log(hasCategory)
            if (!hasCategory) return false;
            if (tutors[areaId]) {
                const tutor = tutors[areaId];
                if (
                    !tutor.birthdate.trim() ||
                    !tutor.ci.trim() ||
                    !tutor.ci_expedition.trim() ||
                    !tutor.email.trim() ||
                    !tutor.gender.trim() ||
                    !tutor.names.trim() ||
                    !tutor.last_names.trim() ||
                    !tutor.phone_number.trim()
                ) return false;
            }
        }
        return true;
    };

    const filterAreasByCourse = (areas, courseToFind) => {
        if (!courseToFind) return areas;
        return areas
            .map((area) => ({
                ...area,
                categories: area.olympiadCategories?.filter((category) =>
                    category.range_course?.includes(courseToFind)
                ) || []
            }))
            .filter((area) => area.categories?.length > 0);
    };

    const convertAreasToSelectedFormat = () => {
        return seleccionadas.map((areaId) => {
            const area = areas.find((a) => a.id === areaId);
            const categoryId = categorias.find((catId) =>
                area?.categories?.some((c) => c.id === catId)
            );
            const result = {
                data: {
                    area_id: areaId,
                    category_id: categoryId
                }
            };
            if (tutors[areaId]) {
                result.teacher = tutors[areaId];
            }
            return result;
        });
    };

    const submit = async () => {
        try {
            const payload = { selected_areas: convertAreasToSelectedFormat() };
            await axios.post(
                `${API_URL}/api/olympiads/${registerData.olympic_id}/inscriptions/${registerData.inscription_id}/selected-areas`,
                payload
            );
            setShowReceipt(true);
            stepsState.next();
        } catch (error) {
            console.error('Submission error:', error);
            setError('Error al enviar la inscripción. Verifica los datos.');
        }
    };

    const filteredAreas = registerData.competitor?.course
        ? filterAreasByCourse(areas, registerData.competitor.course)
        : areas;

    return (
        <div className="container d-flex justify-content-center">
            <div className="card p-4">
                <span>Paso {stepsState.current} de {stepsState.total}</span>
                <ProgressBar
                    now={stepsState.progress * 100}
                    label={`${Math.round(stepsState.progress * 100)}%`}
                    animated
                    striped
                    variant="success"
                    style={{ height: '1.5rem', fontSize: '0.9rem' }}
                />
                <h2 className="mb-3 mt-4">Paso 6: Selección de Áreas y Categorías</h2>
                <p className="text-muted mb-4">
                    Selecciona hasta 2 áreas y una categoría por área. Opcionalmente, puedes añadir un profesor por área.
                </p>

                <Form>
                    <h5>Selecciona hasta 2 áreas</h5>
                    {loading ? (
                        <Spinner animation="border" variant="primary" />
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : filteredAreas.length === 0 ? (
                        <Alert variant="warning">No hay áreas disponibles para el curso seleccionado.</Alert>
                    ) : (
                        filteredAreas.map((area) => (
                            <div key={area.id} className="mb-3 border rounded p-3">
                                <Form.Check
                                    type="checkbox"
                                    label={area.name || 'Área sin nombre'}
                                    checked={seleccionadas.includes(area.id)}
                                    onChange={() => handleCheckArea(area.id)}
                                    disabled={!seleccionadas.includes(area.id) && seleccionadas.length >= 2}
                                    title={seleccionadas.length >= 2 && !seleccionadas.includes(area.id) ? 'Máximo 2 áreas permitidas' : ''}
                                />
                                <Collapse in={seleccionadas.includes(area.id) && openAreas[area.id]}>
                                    <div className="ms-4 mt-2">
                                        <Button
                                            variant="link"
                                            onClick={() => setOpenAreas((prev) => ({ ...prev, [area.id]: !prev[area.id] }))}
                                            className="p-0 mb-2"
                                        >
                                            {openAreas[area.id] ? 'Ocultar detalles' : 'Mostrar detalles'}
                                        </Button>
                                        <h6>Categorías disponibles:</h6>
                                        {area.olympiadCategories?.length > 0 ? (
                                            area.olympiadCategories.map((category) => (
                                                <Form.Check
                                                    key={category.id}
                                                    type="checkbox"
                                                    label={category.name || 'Categoría sin nombre'}
                                                    checked={categorias.includes(category.id)}
                                                    onChange={() => handleCheckCategory(category.id, area.id)}
                                                    disabled={
                                                        !categorias.includes(category.id) &&
                                                        categorias.some((catId) => area.olympiadCategories.some((c) => c.id === catId))
                                                    }
                                                    title={
                                                        categorias.some((catId) => area.olympiadCategories.some((c) => c.id === catId)) &&
                                                        !categorias.includes(category.id)
                                                            ? 'Solo una categoría por área'
                                                            : ''
                                                    }
                                                />
                                            ))
                                        ) : (
                                            <p>No hay categorías disponibles para esta área.</p>
                                        )}
                                        <Form.Check
                                            type="checkbox"
                                            label="Añadir profesor para esta área"
                                            checked={!!tutors[area.id]}
                                            onChange={() => toggleTutor(area.id)}
                                            className="mt-3"
                                        />
                                        <Collapse in={!!tutors[area.id]}>
                                            <div className="ms-4 mt-2">
                                                <h6>Datos del Profesor</h6>
                                                <InputGroup className="mb-2">
                                                    <FormControl
                                                        placeholder="Nombres"
                                                        value={tutors[area.id]?.names || ''}
                                                        onChange={(e) => updateTutorData(area.id, 'names', e.target.value)}
                                                    />
                                                </InputGroup>
                                                <InputGroup className="mb-2">
                                                    <FormControl
                                                        placeholder="Apellidos"
                                                        value={tutors[area.id]?.last_names || ''}
                                                        onChange={(e) => updateTutorData(area.id, 'last_names', e.target.value)}
                                                    />
                                                </InputGroup>
                                                <InputGroup className="mb-2">
                                                    <FormControl
                                                        placeholder="Carnet de Identidad"
                                                        value={tutors[area.id]?.ci || ''}
                                                        onChange={(e) => updateTutorData(area.id, 'ci', e.target.value)}
                                                    />
                                                </InputGroup>
                                                <InputGroup className="mb-2">
                                                    <FormControl
                                                        placeholder="Expedición CI (e.g., CB)"
                                                        value={tutors[area.id]?.ci_expedition || ''}
                                                        onChange={(e) => updateTutorData(area.id, 'ci_expedition', e.target.value)}
                                                    />
                                                </InputGroup>
                                                <InputGroup className="mb-2">
                                                    <FormControl
                                                        type="date"
                                                        placeholder="Fecha de Nacimiento"
                                                        value={tutors[area.id]?.birthdate || ''}
                                                        onChange={(e) => updateTutorData(area.id, 'birthdate', e.target.value)}
                                                    />
                                                </InputGroup>
                                                <InputGroup className="mb-2">
                                                    <FormControl
                                                        placeholder="Email"
                                                        type="email"
                                                        value={tutors[area.id]?.email || ''}
                                                        onChange={(e) => updateTutorData(area.id, 'email', e.target.value)}
                                                    />
                                                </InputGroup>
                                                <InputGroup className="mb-2">
                                                    <FormControl
                                                        placeholder="Teléfono"
                                                        value={tutors[area.id]?.phone_number || ''}
                                                        onChange={(e) => updateTutorData(area.id, 'phone_number', e.target.value)}
                                                    />
                                                </InputGroup>
                                                <Form.Select
                                                    className="mb-2"
                                                    value={tutors[area.id]?.gender || ''}
                                                    onChange={(e) => updateTutorData(area.id, 'gender', e.target.value)}
                                                >
                                                    <option value="">Seleccionar Género</option>
                                                    <option value="M">Masculino</option>
                                                    <option value="F">Femenino</option>
                                                </Form.Select>
                                            </div>
                                        </Collapse>
                                    </div>
                                </Collapse>
                            </div>
                        ))
                    )}

                    {seleccionadas.length === 2 && (
                        <Alert variant="info" className="mt-3">
                            Has seleccionado el máximo de 2 áreas.
                        </Alert>
                    )}

                    <div className="d-flex gap-2 mt-4">
                        <button
                            disabled={!stepsState.hasPrev}
                            type="button"
                            className="btn btn-secondary w-50"
                            onClick={stepsState.prev}
                        >
                            Anterior
                        </button>
                        <button
                            disabled={!validate()}
                            type="button"
                            className="btn btn-primary w-50"
                            onClick={submit}
                        >
                            Siguiente
                        </button>
                    </div>

                </Form>
            </div>
        </div>
    );
};
