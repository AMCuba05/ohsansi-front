import React, {useEffect, useState} from 'react';
import {useSteps} from 'react-step-builder';
import {Accordion, Alert, Button, Collapse, Form, FormControl, InputGroup, ProgressBar, Spinner} from 'react-bootstrap';
import {Check, Plus, Search, Trash} from 'lucide-react';
import {Button as StrapButton} from "reactstrap";
import axios from "axios";
import {useRegisterContext} from "../../../../Context/RegisterContext.js";
import {grades} from "../../../../Constants/Provincies.js";
import {API_URL} from '../../../../Constants/Utils.js';

const emptyStudent = {
    found: false,
    hasBeenQueried: false,
    foundTeacher: false,
    hasBeenQueriedTeacher: false,
    student: {
        ci: '',
        birthdate: '',
        ci_expedition: '',
        names: '',
        last_names: '',
        email: '',
        phone_number: '',
        gender: '',
        course: ''
    },
    legal_tutor: {
        ci: '',
        birthdate: '',
        ci_expedition: '',
        names: '',
        last_names: '',
        email: '',
        phone_number: '',
        gender: ''
    },
    selected_areas: [],
    selected_categories: [],
    tutors: {} // { areaId: { teacher data } }
};

export const ThirdStep = () => {
    const today = new Date();
    const localDate = today.toLocaleDateString('en-CA');
    const stepsState = useSteps();
    const { registerData, setRegisterData } = useRegisterContext();
    const [students, setStudents] = useState([{ ...emptyStudent }]);
    const [areas, setAreas] = useState([]);
    const [loadingAreas, setLoadingAreas] = useState(true);
    const [errorAreas, setErrorAreas] = useState(null);
    const [openAreas, setOpenAreas] = useState({});
    console.log(areas)
    useEffect(() => {
        setLoadingAreas(true);
        axios
            .get(`${API_URL}/api/olympiads/${registerData.olympic_id}/areas`)
            .then((response) => {
                console.log(response)
                setAreas(response.data.data || []);
                setLoadingAreas(false);
            })
            .catch((error) => {
                console.error('Error fetching areas:', error);
                setErrorAreas('No se pudieron cargar las áreas. Por favor intenta de nuevo.');
                setLoadingAreas(false);
            });
    }, []);

    const handleStudentChange = (index, section, field, value) => {
        const updated = [...students];

        updated[index] = {
            ...updated[index],
            [section]: {
                ...updated[index][section],
                [field]: value,
            },
        };

        setStudents(updated);
    };


    const handleCheckArea = (index, areaId) => {
        const updated = [...students];
        if (updated[index].selected_areas.includes(areaId)) {
            updated[index].selected_areas = updated[index].selected_areas.filter((id) => id !== areaId);
            updated[index].selected_categories = updated[index].selected_categories.filter((catId) => {
                const area = areas.find((a) => a.id === areaId);
                return !area?.olympiadCategories?.some((category) => category.id === catId);
            });
            updated[index].tutors = { ...updated[index].tutors };
            delete updated[index].tutors[areaId];
        } else if (updated[index].selected_areas.length < 2) {
            updated[index].selected_areas = [...updated[index].selected_areas, areaId];
            updated[index].openAreas = { ...updated[index].openAreas, [areaId]: true };
        }
        setStudents(updated);
    };

    const handleCheckCategory = (index, categoryId, areaId) => {
        const updated = [...students];
        if (updated[index].selected_categories.includes(categoryId)) {
            updated[index].selected_categories = updated[index].selected_categories.filter((id) => id !== categoryId);
        } else {
            const area = areas.find((a) => a.id === areaId);
            const existingCat = updated[index].selected_categories.find((catId) =>
                area?.olympiadCategories?.some((c) => c.id === catId)
            );
            if (existingCat) {
                updated[index].selected_categories = updated[index].selected_categories.filter((catId) => catId !== existingCat);
            }
            updated[index].selected_categories = [...updated[index].selected_categories, categoryId];
        }
        setStudents(updated);
    };

    const toggleTutor = (index, areaId) => {
        const updated = [...students];
        updated[index].tutors = {
            ...updated[index].tutors,
            [areaId]: updated[index].tutors[areaId] ? undefined : {
                birthdate: '',
                ci: '',
                ci_expedition: '',
                email: '',
                gender: '',
                names: '',
                last_names: '',
                phone_number: ''
            }
        };
        setStudents(updated);
    };

    const updateTutorData = (index, areaId, field, value) => {
        const updated = [...students];
        updated[index].tutors = {
            ...updated[index].tutors,
            [areaId]: { ...updated[index].tutors[areaId], [field]: value }
        };
        setStudents(updated);
    };

    const validateStudent = (student) => {
        const { student: s, legal_tutor: lt, selected_areas, selected_categories, tutors } = student;
        if (
            !s.ci.trim() || !s.names.trim() || !s.last_names.trim() ||
            !s.email.trim() || !s.phone_number.trim() || !s.gender.trim() ||
            !lt.ci.trim() || !lt.names.trim() || !lt.last_names.trim() ||
            !lt.email.trim() || !lt.phone_number.trim() || !lt.gender.trim() ||
            selected_areas.length === 0 || selected_categories.length === 0
        ) return false;

        for (const areaId of selected_areas) {
            const area = areas.find((a) => a.id === areaId);
            const hasCategory = selected_categories.some((catId) =>
                area?.olympiadCategories?.some((c) => c.id === catId)
            );
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

    const validateAll = () => students.every(validateStudent);

    const onSearchStudent = async (index) => {
        const ci = students[index].student.ci;
        try {
            const { data } = await axios.get(`${API_URL}/api/search-student/${ci}`);
            const updated = [...students];
            updated[index].hasBeenQueried = true;

            if (Object.keys(data).length === 0) {
                updated[index].found = false;
            } else {
                updated[index].student = {
                    ci,
                    birthdate: data.birthdate,
                    ci_expedition: data.ci_expedition,
                    names: data.names,
                    last_names: data.last_names,
                    email: data.email,
                    phone_number: data.phone_number,
                    course: data.course,
                    gender: data.gender,
                };
                updated[index].found = true;
            }
            setStudents(updated);
        } catch (err) {
            const updated = [...students];
            updated[index] = { ...emptyStudent, student: { ...emptyStudent.student, ci }, hasBeenQueried: true, found: false };
            setStudents(updated);
        }
    };

    console.log(students)
    const onSearchTutor = async (index) => {
        const ci = students[index].legal_tutor.ci;
        try {
            const { data } = await axios.get(`${API_URL}/api/search-student/${ci}`);
            const updated = [...students];
            updated[index].hasBeenQueriedTeacher = true;

            if (Object.keys(data).length === 0) {
                updated[index].foundTeacher = false;
            } else {
                updated[index].legal_tutor = {
                    ci,
                    birthdate: data.birthdate,
                    ci_expedition: data.ci_expedition,
                    names: data.names,
                    last_names: data.last_names,
                    email: data.email,
                    phone_number: data.phone_number,
                    course: data.course,
                    gender: data.gender,
                };
                updated[index].foundTeacher = true;
            }
            setStudents(updated);
        } catch (err) {
            const updated = [...students];
            updated[index] = { ...emptyStudent, hasBeenQueriedTeacher: true, foundTeacher: false };
            setStudents(updated);
        }
    };

    const addStudent = () => setStudents([...students, { ...emptyStudent }]);
    const removeStudent = (index) => {
        const updated = students.filter((_, i) => i !== index);
        setStudents(updated);
    };


    const convertAreasToSelectedFormat = (index) => {
        return students[index].selected_areas.map((areaId) => {
            const area = areas.find((a) => a.id === areaId);
            const categoryId = students[index].selected_categories.find((catId) =>
                area?.olympiadCategories?.some((c) => c.id === catId)
            );
            const result = {
                data: {
                    area_id: areaId,
                    category_id: categoryId
                }
            };
            if (students[index].tutors[areaId]) {
                result.teacher = students[index].tutors[areaId];
            }
            return result;
        });
    };

    const submit = async () => {
        try {
            const formattedData = students.map((s, index) => ({
                student: s.student,
                legal_tutor: s.legal_tutor,
                selected_areas: convertAreasToSelectedFormat(index)
            }));
            console.log(formattedData)

            await axios.post(`${API_URL}/api/inscription/olympic/multiple`, formattedData, {
                headers: {
                    Identity: JSON.stringify(registerData.identity),
                    Step: 2
                }
            });
            setRegisterData({
                ...registerData,
                competitors: formattedData
            });
            stepsState.next();
        } catch (err) {
            console.error('Submission error:', err);
        }
    };

    return (
        <div className="container">
            <div className="card p-4">
                <span>Paso {stepsState.current} de {stepsState.total}</span>
                <ProgressBar
                    now={stepsState.progress * 100}
                    label={`${Math.round(stepsState.progress * 100)}%`}
                    animated
                    striped
                    variant={"success"}
                    style={{ height: '1.5rem', fontSize: '0.9rem' }}
                />
                <h2 className="mb-3 mt-4">Paso {stepsState.current}: Registro de Estudiantes para la Olimpiada {registerData.olympic_name}</h2>
                <p className="text-muted mb-4">
                    Complete los datos de cada estudiante, tutor legal y seleccione hasta 2 áreas con sus categorías.
                </p>

                <Accordion defaultActiveKey="0" alwaysOpen>
                    {students.map((student, index) => {
                        return (
                            <Accordion.Item eventKey={index.toString()} key={index}>
                                <Accordion.Header>
                                    Estudiante #{index + 1} {student.student.names && `- ${student.student.names} ${student.student.last_names}`}
                                </Accordion.Header>
                                <Accordion.Body>
                                    {/* Student Information */}
                                    <h5>Datos del Estudiante</h5>
                                    <InputGroup className="mb-3">
                                        <div className="form-label w-100">Carnet de identidad</div>
                                        <FormControl
                                            type="text"
                                            value={student.student.ci}
                                            onChange={e => handleStudentChange(index, 'student', 'ci', e.target.value)}
                                            placeholder="Carnet de identidad"
                                        />
                                        <StrapButton onClick={() => onSearchStudent(index)} variant="outline-secondary">
                                            {student.found ? <Check size={16} /> : <Search size={16} />}
                                        </StrapButton>
                                    </InputGroup>

                                    {student.hasBeenQueried && !student.found && (
                                        <p className="text-danger">Carnet no encontrado, ingrese los datos manualmente.</p>
                                    )}
                                    {student.hasBeenQueried && student.found && (
                                        <p className="text-success">Datos cargados correctamente.</p>
                                    )}

                                    <div className="mb-3">
                                        <label className="form-label">Lugar de Expedición</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={student.student.ci_expedition}
                                            style={{ textTransform: 'uppercase' }}
                                            onChange={e => handleStudentChange(index, 'student', 'ci_expedition', e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Nombres</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={student.student.names}
                                            style={{ textTransform: 'uppercase' }}
                                            onChange={e => handleStudentChange(index, 'student', 'names', e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Apellidos</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={student.student.last_names}
                                            style={{ textTransform: 'uppercase' }}
                                            onChange={e => handleStudentChange(index, 'student', 'last_names', e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Fecha de Nacimiento</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={student.student.birthdate}
                                            max={new Date().toLocaleDateString('en-CA')}
                                            onChange={e => handleStudentChange(index, 'student', 'birthdate', e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Correo electrónico</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={student.student.email}
                                            onChange={e => handleStudentChange(index, 'student', 'email', e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Teléfono</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            value={student.student.phone_number}
                                            onChange={e => handleStudentChange(index, 'student', 'phone_number', e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor={`generoStudent-${index}`} className="form-label">Género</label>
                                        <select
                                            className="form-select"
                                            id={`generoStudent-${index}`}
                                            value={student.student.gender}
                                            onChange={e => handleStudentChange(index, 'student', 'gender', e.target.value)}
                                        >
                                            <option value="">Selecciona una opción</option>
                                            <option value="M">Masculino</option>
                                            <option value="F">Femenino</option>
                                        </select>
                                    </div>

                                    {/* Legal Tutor Information */}
                                    <h5 className="mt-4">Datos del Tutor Legal</h5>
                                    <InputGroup className="mb-3">
                                        <div className="form-label w-100">Carnet de identidad</div>
                                        <FormControl
                                            type="text"
                                            value={student.legal_tutor.ci}
                                            onChange={e => handleStudentChange(index, 'legal_tutor', 'ci', e.target.value)}
                                            placeholder="Carnet de identidad"
                                        />
                                        <StrapButton onClick={() => onSearchTutor(index)} variant="outline-secondary">
                                            {student.foundTeacher ? <Check size={16} /> : <Search size={16} />}
                                        </StrapButton>
                                    </InputGroup>

                                    {student.hasBeenQueriedTeacher && !student.foundTeacher && (
                                        <p className="text-danger">Carnet no encontrado, ingrese los datos manualmente.</p>
                                    )}
                                    {student.hasBeenQueriedTeacher && student.foundTeacher && (
                                        <p className="text-success">Datos cargados correctamente.</p>
                                    )}

                                    <div className="mb-3">
                                        <label className="form-label">Lugar de Expedición</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={student.legal_tutor.ci_expedition}
                                            style={{ textTransform: 'uppercase' }}
                                            onChange={e => handleStudentChange(index, 'legal_tutor', 'ci_expedition', e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Nombres</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={student.legal_tutor.names}
                                            style={{ textTransform: 'uppercase' }}
                                            onChange={e => handleStudentChange(index, 'legal_tutor', 'names', e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Apellidos</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={student.legal_tutor.last_names}
                                            style={{ textTransform: 'uppercase' }}
                                            onChange={e => handleStudentChange(index, 'legal_tutor', 'last_names', e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Fecha de Nacimiento</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            max={new Date().toLocaleDateString('en-CA')}
                                            value={student.legal_tutor.birthdate}
                                            onChange={e => handleStudentChange(index, 'legal_tutor', 'birthdate', e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Correo electrónico</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={student.legal_tutor.email}
                                            onChange={e => handleStudentChange(index, 'legal_tutor', 'email', e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Teléfono</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            value={student.legal_tutor.phone_number}
                                            onChange={e => handleStudentChange(index, 'legal_tutor', 'phone_number', e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor={`generoTutor-${index}`} className="form-label">Género</label>
                                        <select
                                            className="form-select"
                                            id={`generoTutor-${index}`}
                                            value={student.legal_tutor.gender}
                                            onChange={e => handleStudentChange(index, 'legal_tutor', 'gender', e.target.value)}
                                        >
                                            <option value="">Selecciona una opción</option>
                                            <option value="M">Masculino</option>
                                            <option value="F">Femenino</option>
                                        </select>
                                    </div>

                                    {/* Areas and Categories */}
                                    <h5 className="mt-4">Áreas de Participación</h5>
                                    {loadingAreas ? (
                                        <Spinner animation="border" variant="primary" />
                                    ) : errorAreas ? (
                                        <Alert variant="danger">{errorAreas}</Alert>
                                    )  : (
                                        areas.map((area) => (
                                            <div key={area.id} className="mb-3 border rounded p-3">
                                                <Form.Check
                                                    type="checkbox"
                                                    label={area.name || 'Área sin nombre'}
                                                    checked={student.selected_areas.includes(area.id)}
                                                    onChange={() => handleCheckArea(index, area.id)}
                                                    disabled={!student.selected_areas.includes(area.id) && student.selected_areas.length >= 2}
                                                    title={student.selected_areas.length >= 2 && !student.selected_areas.includes(area.id) ? 'Máximo 2 áreas permitidas' : ''}
                                                />
                                                <Collapse in={student.selected_areas.includes(area.id) && (student.openAreas?.[area.id] || false)}>
                                                    <div className="ms-4 mt-2">
                                                        <Button
                                                            variant="link"
                                                            onClick={() => setStudents((prev) => {
                                                                const updated = [...prev];
                                                                updated[index].openAreas = {
                                                                    ...updated[index].openAreas,
                                                                    [area.id]: !updated[index].openAreas?.[area.id]
                                                                };
                                                                return updated;
                                                            })}
                                                            className="p-0 mb-2"
                                                        >
                                                            {student.openAreas?.[area.id] ? 'Ocultar detalles' : 'Mostrar detalles'}
                                                        </Button>
                                                        <h6>Categorías disponibles:</h6>
                                                        {area.olympiadCategories?.length > 0 ? (
                                                            area.olympiadCategories.map((category) => (
                                                                <Form.Check
                                                                    key={category.id}
                                                                    type="checkbox"
                                                                    label={category.name || 'Categoría sin nombre'}
                                                                    checked={student.selected_categories.includes(category.id)}
                                                                    onChange={() => handleCheckCategory(index, category.id, area.id)}
                                                                    disabled={
                                                                        !student.selected_categories.includes(category.id) &&
                                                                        student.selected_categories.some((catId) =>
                                                                            area.olympiadCategories.some((c) => c.id === catId)
                                                                        )
                                                                    }
                                                                    title={
                                                                        student.selected_categories.some((catId) =>
                                                                            area.olympiadCategories.some((c) => c.id === catId)
                                                                        ) && !student.selected_categories.includes(category.id)
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
                                                            checked={!!student.tutors[area.id]}
                                                            onChange={() => toggleTutor(index, area.id)}
                                                            className="mt-3"
                                                        />
                                                        <Collapse in={!!student.tutors[area.id]}>
                                                            <div className="ms-4 mt-2">
                                                                <h6>Datos del Profesor</h6>
                                                                <InputGroup className="mb-2">
                                                                    <FormControl
                                                                        placeholder="Nombres"
                                                                        value={student.tutors[area.id]?.names || ''}
                                                                        onChange={(e) => updateTutorData(index, area.id, 'names', e.target.value)}
                                                                    />
                                                                </InputGroup>
                                                                <InputGroup className="mb-2">
                                                                    <FormControl
                                                                        placeholder="Apellidos"
                                                                        value={student.tutors[area.id]?.last_names || ''}
                                                                        onChange={(e) => updateTutorData(index, area.id, 'last_names', e.target.value)}
                                                                    />
                                                                </InputGroup>
                                                                <InputGroup className="mb-2">
                                                                    <FormControl
                                                                        placeholder="Carnet de Identidad"
                                                                        value={student.tutors[area.id]?.ci || ''}
                                                                        onChange={(e) => updateTutorData(index, area.id, 'ci', e.target.value)}
                                                                    />
                                                                </InputGroup>
                                                                <InputGroup className="mb-2">
                                                                    <FormControl
                                                                        placeholder="Expedición CI (e.g., CB)"
                                                                        value={student.tutors[area.id]?.ci_expedition || ''}
                                                                        onChange={(e) => updateTutorData(index, area.id, 'ci_expedition', e.target.value)}
                                                                    />
                                                                </InputGroup>
                                                                <InputGroup className="mb-2">
                                                                    <FormControl
                                                                        type="date"
                                                                        placeholder="Fecha de Nacimiento"
                                                                        value={student.tutors[area.id]?.birthdate || ''}
                                                                        onChange={(e) => updateTutorData(index, area.id, 'birthdate', e.target.value)}
                                                                    />
                                                                </InputGroup>
                                                                <InputGroup className="mb-2">
                                                                    <FormControl
                                                                        placeholder="Email"
                                                                        type="email"
                                                                        value={student.tutors[area.id]?.email || ''}
                                                                        onChange={(e) => updateTutorData(index, area.id, 'email', e.target.value)}
                                                                    />
                                                                </InputGroup>
                                                                <InputGroup className="mb-2">
                                                                    <FormControl
                                                                        placeholder="Teléfono"
                                                                        value={student.tutors[area.id]?.phone_number || ''}
                                                                        onChange={(e) => updateTutorData(index, area.id, 'phone_number', e.target.value)}
                                                                    />
                                                                </InputGroup>
                                                                <Form.Select
                                                                    className="mb-2"
                                                                    value={student.tutors[area.id]?.gender || ''}
                                                                    onChange={(e) => updateTutorData(index, area.id, 'gender', e.target.value)}
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
                                    {student.selected_areas.length === 2 && (
                                        <Alert variant="info" className="mt-3">
                                            Has seleccionado el máximo de 2 áreas.
                                        </Alert>
                                    )}

                                    <div className="text-end">
                                        {students.length > 1 && (
                                            <StrapButton color="danger" onClick={() => removeStudent(index)}>
                                                <Trash size={16} /> Eliminar estudiante
                                            </StrapButton>
                                        )}
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        );
                    })}
                </Accordion>

                <div className="d-flex justify-content-between mt-4">
                    <StrapButton color="success" onClick={addStudent}>
                        <Plus size={16} /> Agregar Estudiante
                    </StrapButton>

                    <div className="d-flex gap-2">
                        <button
                            disabled={!stepsState.hasPrev}
                            className="btn btn-secondary"
                            onClick={stepsState.prev}
                        >
                            Anterior
                        </button>
                        <button
                            className="btn btn-primary"
                            disabled={!stepsState.hasNext || !validateAll()}
                            onClick={submit}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
