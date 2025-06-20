import React, { useState, useEffect, useMemo } from 'react';
import { useSteps } from 'react-step-builder';
import {
    Form,
    ProgressBar,
    Alert,
    Spinner,
    Collapse,
    Button,
    FormControl,
    InputGroup,
} from 'react-bootstrap';
import axios from 'axios';
import { useRegisterContext } from '../../../../Context/RegisterContext.js';
import { API_URL } from '../../../../Constants/Utils.js';
import { Check, Search } from 'lucide-react';
import { states } from '../../../../Constants/Provincies.js';

export const NewThirdStep = () => {
    const stepsState = useSteps();
    const { registerData, setRegisterData } = useRegisterContext();
    const [areas, setAreas] = useState([]);
    const [seleccionadas, setSeleccionadas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tutors, setTutors] = useState({}); // { areaId: { teacher data } }
    const [openAreas, setOpenAreas] = useState({}); // Track collapsed state
    const [foundTeacher, setFoundTeacher] = useState(false);
    const [clickOnSearch, setClickOnSearch] = useState(false);

    const [registeredAreas, setRegisteredAreas] = useState([]);
    const [blockForm, setBlockForm] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get(
                `${API_URL}/api/olympiads/${registerData.olympic_id}/areas?course=${registerData.competitor.school_data.course}`,
            )
            .then((response) => {
                const totalAreas = response.data.data ?? [];
                setAreas(
                    totalAreas.filter(
                        (area) => area.olympiad_categories.length > 0,
                    ),
                );
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching areas:', error);
                setError(
                    'No se pudieron cargar las áreas. Por favor intenta de nuevo.',
                );
                setLoading(false);
            });
        if (registerData.competitor.selected_areas != null) {
            const { selected_areas } = registerData.competitor;
            const areas = selected_areas.map((area) => area.area_id);
            const cats = selected_areas.map((area) => area.category_id);
            const teachers = selected_areas.reduce(
                (acc, area) => ({
                    ...acc,
                    [area.area_id]: area.academic_tutor,
                }),
                {},
            );
            setRegisteredAreas(areas);
            setSeleccionadas(areas);
            setCategorias(cats);
            setBlockForm(selected_areas.length >= 2);
            setTutors((prev) => ({
                ...prev,
                ...teachers,
            }));

            const initialOpenAreas = areas.reduce(
                (acc, id) => ({
                    ...acc,
                    [id]: true,
                }),
                {},
            );
            setOpenAreas(initialOpenAreas);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSearchTeacher = async (ci, areaId) => {
        try {
            const { data } = await axios.get(
                `${API_URL}/api/search-student/${ci}`,
            );
            setClickOnSearch(true);
            if (data.names) {
                setFoundTeacher(true);
                setTutors(() => ({
                    [areaId]: {
                        ci: ci,
                        birthdate: data.birthdate,
                        ci_expedition: data.ci_expedition,
                        email: data.email,
                        gender: data.gender,
                        names: data.names,
                        last_names: data.last_names,
                        phone_number: data.phone_number,
                    },
                }));
            } else {
                setFoundTeacher(false);
            }
        } catch (err) {
            setFoundTeacher(false);
            console.log(err);
        }
    };

    const handleCheckAreaCategory = (areaId, categoryId) => {
        if (seleccionadas.includes(areaId) && categorias.includes(categoryId)) {
            setSeleccionadas(seleccionadas.filter((area) => area !== areaId));
            setCategorias(categorias.filter((cat) => cat !== categoryId));
            setTutors((prev) => {
                const newTutors = { ...prev };
                delete newTutors[areaId];
                return newTutors;
            });
        } else if (
            seleccionadas.includes(areaId) &&
            !categorias.includes(categoryId)
        ) {
            const areaIndex = seleccionadas.indexOf(areaId);
            setSeleccionadas([
                ...seleccionadas.filter((a) => a !== seleccionadas[areaIndex]),
                areaId,
            ]);
            setCategorias([
                ...categorias.filter((cat) => cat !== categorias[areaIndex]),
                categoryId,
            ]);
        } else if (seleccionadas.length < 2) {
            setSeleccionadas([...seleccionadas, areaId]);
            setCategorias([...categorias, categoryId]);
        }
    };

    const toggleTutor = (areaId) => {
        setClickOnSearch(false);
        setFoundTeacher(false);
        setTutors((prev) => ({
            ...prev,
            [areaId]: prev[areaId]
                ? undefined
                : {
                      birthdate: '',
                      ci: '',
                      ci_expedition: '',
                      email: '',
                      gender: '',
                      names: '',
                      last_names: '',
                      phone_number: '',
                  },
        }));
    };

    const updateTutorData = (areaId, field, value) => {
        setTutors((prev) => ({
            ...prev,
            [areaId]: { ...prev[areaId], [field]: value },
        }));
    };

    const validate = () => {
        if (seleccionadas.length === 0 || categorias.length === 0) return false;
        for (const areaId of seleccionadas) {
            const area = areas.find((a) => a.id === areaId);
            const hasCategory = categorias.some((catId) =>
                area?.olympiadCategories?.some((c) => c.id === catId),
            );
            if (!hasCategory) return false;
            if (tutors[areaId]) {
                const tutor = tutors[areaId];
                if (
                    !tutor.birthdate.trim() ||
                    !String(tutor.ci).trim() ||
                    !tutor.ci_expedition.trim() ||
                    !tutor.email.trim() ||
                    !tutor.gender.trim() ||
                    !tutor.names.trim() ||
                    !tutor.last_names.trim() ||
                    !tutor.phone_number.trim()
                )
                    return false;
            }
        }
        return true;
    };

    const convertAreasToSelectedFormat = () => {
        return seleccionadas.map((areaId) => {
            const area = areas.find((a) => a.id === areaId);
            const categoryId = categorias.find((catId) =>
                area?.olympiadCategories?.some((c) => c.id === catId),
            );
            const result = {
                area_id: areaId,
                category_id: categoryId,
            };
            if (tutors[areaId]) {
                result.academic_tutor = tutors[areaId];
            }
            return result;
        });
    };

    const submit = async () => {
        const payload = { selected_areas: convertAreasToSelectedFormat() };
        const totalRegisteredAreas = registeredAreas.length;
        const payloadSize = payload.selected_areas.length;

        if (totalRegisteredAreas + payloadSize > 2) return stepsState.next();

        const { olympic_id, inscription_id } = registerData;
        const url = `${API_URL}/api/olympiads/${olympic_id}/inscriptions/${inscription_id}/selected-areas`;
        const response = await axios
            .post(url, payload)
            .catch((err) => err.response);

        if (response.status !== 201) {
            if (response.data.errors) {
                let msg = '';
                Object.keys(response.data.errors).forEach((key) => {
                    if (Array.isArray(response.data.errors[key])) {
                        msg += response.data.errors[key][0] + '\n';
                    } else {
                        msg += response.data.errors[key] + '\n';
                    }
                });
                setError(msg);
            } else {
                setError('Error al enviar la inscripción. Verifica los datos.');
            }
            return;
        }

        const { selected_areas } = response.data.data;

        setRegisterData({
            ...registerData,
            competitor: {
                ...registerData.competitor,
                selected_areas,
            },
        });
        stepsState.next();
    };

    const areaCategories = useMemo(() => {
        const areasCategoriesPairs = [];
        areas.forEach((area) => {
            area.olympiad_categories.forEach((category) => {
                areasCategoriesPairs.push({
                    name: `${area.name} - ${category.name}`,
                    areaId: area.id,
                    categoryId: category.id,
                });
            });
        });
        return areasCategoriesPairs;
    }, [areas]);

    return (
        <div className="container d-flex justify-content-center">
            <div className="card p-4">
                <span>
                    Paso {stepsState.current} de {stepsState.total}
                </span>
                <ProgressBar
                    now={stepsState.progress * 100}
                    label={`${Math.round(stepsState.progress * 100)}%`}
                    animated
                    striped
                    variant="success"
                    style={{ height: '1.5rem', fontSize: '0.9rem' }}
                />
                <h2 className="mb-3 mt-4">
                    Paso 5: Selección de Áreas y Categorías
                </h2>
                <p className="text-muted mb-4">
                    Selecciona hasta 2 áreas y una categoría por área.
                    Opcionalmente, puedes añadir un profesor por área.
                </p>

                <Form>
                    <h5>Selecciona hasta 2 áreas</h5>
                    {loading ? (
                        <Spinner animation="border" variant="primary" />
                    ) : areaCategories.length === 0 ? (
                        <Alert variant="warning">
                            No hay áreas disponibles para el curso seleccionado.
                        </Alert>
                    ) : (
                        areaCategories.map((areaCategory) => (
                            <div
                                key={`${areaCategory.areaId} - ${areaCategory.categoryId}`}
                                className="mb-3 border rounded p-3"
                            >
                                <Form.Check
                                    type="checkbox"
                                    label={
                                        areaCategory.name || 'Área sin nombre'
                                    }
                                    checked={
                                        seleccionadas.includes(
                                            areaCategory.areaId,
                                        ) &&
                                        categorias.includes(
                                            areaCategory.categoryId,
                                        )
                                    }
                                    onChange={() => {
                                        handleCheckAreaCategory(
                                            areaCategory.areaId,
                                            areaCategory.categoryId,
                                        );
                                    }}
                                    disabled={
                                        registeredAreas.includes(
                                            areaCategory.areaId,
                                        ) || blockForm
                                    }
                                    title={
                                        seleccionadas.length >= 2 &&
                                        !seleccionadas.includes(
                                            areaCategory.areaId,
                                        )
                                            ? 'Máximo 2 áreas permitidas'
                                            : ''
                                    }
                                />
                                <Collapse
                                    in={
                                        seleccionadas.includes(
                                            areaCategory.areaId,
                                        ) &&
                                        categorias.includes(
                                            areaCategory.categoryId,
                                        )
                                    }
                                >
                                    <div className="ms-4 mt2">
                                        <Button
                                            variant="link"
                                            onClick={() =>
                                                setOpenAreas((prev) => ({
                                                    ...prev,
                                                    [areaCategory.areaId]:
                                                        !prev[
                                                            areaCategory.areaId
                                                        ],
                                                }))
                                            }
                                            className="p-0 mb-2"
                                        >
                                            {openAreas[areaCategory.areaId]
                                                ? 'Ocultar detalles'
                                                : 'Mostrar detalles'}
                                        </Button>
                                        <Form.Check
                                            disabled={
                                                registeredAreas.includes(
                                                    areaCategory.areaId,
                                                ) || blockForm
                                            }
                                            type="checkbox"
                                            label="Añadir profesor para esta área"
                                            checked={
                                                !!tutors[areaCategory.areaId]
                                            }
                                            onChange={() =>
                                                toggleTutor(areaCategory.areaId)
                                            }
                                            className="mt-3"
                                        />
                                        <Collapse
                                            in={!!tutors[areaCategory.areaId]}
                                        >
                                            <div className="ms-4 mt-2">
                                                <h6>Datos del Profesor</h6>
                                                <InputGroup className="mb-2">
                                                    <FormControl
                                                        disabled={
                                                            registeredAreas.includes(
                                                                areaCategory.areaId,
                                                            ) || blockForm
                                                        }
                                                        placeholder="Carnet de Identidad"
                                                        value={
                                                            tutors[
                                                                areaCategory
                                                                    .areaId
                                                            ]?.ci || ''
                                                        }
                                                        onChange={(e) =>
                                                            updateTutorData(
                                                                areaCategory.areaId,
                                                                'ci',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    <Button
                                                        disabled={
                                                            registeredAreas.includes(
                                                                areaCategory.areaId,
                                                            ) || blockForm
                                                        }
                                                        onClick={() =>
                                                            onSearchTeacher(
                                                                tutors[
                                                                    areaCategory
                                                                        .areaId
                                                                ]?.ci,
                                                                areaCategory.areaId,
                                                            )
                                                        }
                                                        variant="outline-secondary"
                                                    >
                                                        {foundTeacher ? (
                                                            <Check size={16} />
                                                        ) : (
                                                            <Search size={16} />
                                                        )}
                                                    </Button>
                                                </InputGroup>
                                                {!foundTeacher &&
                                                clickOnSearch ? (
                                                    <p className="text-danger">
                                                        Carnet no encontrado,
                                                        ingrese los datos
                                                        manualmente.
                                                    </p>
                                                ) : foundTeacher &&
                                                  clickOnSearch ? (
                                                    <p className="text-success">
                                                        Datos cargados
                                                        correctamente.
                                                    </p>
                                                ) : null}
                                                <Form.Select
                                                    disabled={
                                                        registeredAreas.includes(
                                                            areaCategory.areaId,
                                                        ) || blockForm
                                                    }
                                                    className="mb-2"
                                                    value={
                                                        tutors[
                                                            areaCategory.areaId
                                                        ]?.ci_expedition || ''
                                                    }
                                                    onChange={(e) =>
                                                        updateTutorData(
                                                            areaCategory.areaId,
                                                            'ci_expedition',
                                                            e.target.value,
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Seleccionar Departamento
                                                    </option>
                                                    {states.map((state) => (
                                                        <option
                                                            key={state}
                                                            value={state}
                                                        >
                                                            {state}
                                                        </option>
                                                    ))}
                                                </Form.Select>

                                                <InputGroup className="mb-2">
                                                    <FormControl
                                                        disabled={
                                                            registeredAreas.includes(
                                                                areaCategory.areaId,
                                                            ) || blockForm
                                                        }
                                                        placeholder="Nombres"
                                                        style={{
                                                            textTransform:
                                                                'uppercase',
                                                        }}
                                                        value={
                                                            tutors[
                                                                areaCategory
                                                                    .areaId
                                                            ]?.names || ''
                                                        }
                                                        onChange={(e) =>
                                                            updateTutorData(
                                                                areaCategory.areaId,
                                                                'names',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </InputGroup>
                                                <InputGroup className="mb-2">
                                                    <FormControl
                                                        disabled={
                                                            registeredAreas.includes(
                                                                areaCategory.areaId,
                                                            ) || blockForm
                                                        }
                                                        placeholder="Apellidos"
                                                        style={{
                                                            textTransform:
                                                                'uppercase',
                                                        }}
                                                        value={
                                                            tutors[
                                                                areaCategory
                                                                    .areaId
                                                            ]?.last_names || ''
                                                        }
                                                        onChange={(e) =>
                                                            updateTutorData(
                                                                areaCategory.areaId,
                                                                'last_names',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </InputGroup>
                                                <InputGroup className="mb-2">
                                                    <FormControl
                                                        disabled={
                                                            registeredAreas.includes(
                                                                areaCategory.areaId,
                                                            ) || blockForm
                                                        }
                                                        type="date"
                                                        placeholder="Fecha de Nacimiento"
                                                        value={
                                                            tutors[
                                                                areaCategory
                                                                    .areaId
                                                            ]?.birthdate || ''
                                                        }
                                                        onChange={(e) =>
                                                            updateTutorData(
                                                                areaCategory.areaId,
                                                                'birthdate',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </InputGroup>
                                                <InputGroup className="mb-2">
                                                    <FormControl
                                                        disabled={
                                                            registeredAreas.includes(
                                                                areaCategory.areaId,
                                                            ) || blockForm
                                                        }
                                                        placeholder="Email"
                                                        type="email"
                                                        value={
                                                            tutors[
                                                                areaCategory
                                                                    .areaId
                                                            ]?.email || ''
                                                        }
                                                        onChange={(e) =>
                                                            updateTutorData(
                                                                areaCategory.areaId,
                                                                'email',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </InputGroup>
                                                <InputGroup className="mb-2">
                                                    <FormControl
                                                        disabled={
                                                            registeredAreas.includes(
                                                                areaCategory.areaId,
                                                            ) || blockForm
                                                        }
                                                        placeholder="Teléfono"
                                                        value={
                                                            tutors[
                                                                areaCategory
                                                                    .areaId
                                                            ]?.phone_number ||
                                                            ''
                                                        }
                                                        onChange={(e) =>
                                                            updateTutorData(
                                                                areaCategory.areaId,
                                                                'phone_number',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </InputGroup>
                                                <Form.Select
                                                    disabled={
                                                        registeredAreas.includes(
                                                            areaCategory.areaId,
                                                        ) || blockForm
                                                    }
                                                    className="mb-2"
                                                    value={
                                                        tutors[
                                                            areaCategory.areaId
                                                        ]?.gender || ''
                                                    }
                                                    onChange={(e) =>
                                                        updateTutorData(
                                                            areaCategory.areaId,
                                                            'gender',
                                                            e.target.value,
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Seleccionar Género
                                                    </option>
                                                    <option value="M">
                                                        Masculino
                                                    </option>
                                                    <option value="F">
                                                        Femenino
                                                    </option>
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
                    {error ? <Alert variant="danger">{error}</Alert> : null}

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
