import axios from 'axios';
import { Check, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Collapse, Form, FormControl, ProgressBar } from 'react-bootstrap';
import { useSteps } from 'react-step-builder';
import { Button, InputGroup } from 'reactstrap';
import { API_URL } from '../../../../Constants/Utils.js';
import { useRegisterContext } from '../../../../Context/RegisterContext.js';
import { states } from '../../../../Constants/Provincies.js';

export const NewSecondStep = () => {
    const emptyUserData = {
        ci: '',
        ci_expedition: '',
        names: '',
        last_names: '',
        birthdate: '',
        email: '',
        phone_number: '',
        gender: '',
    };
    const defaultBlockedFields = {
        ci: false,
        ci_expedition: false,
        names: false,
        last_names: false,
        birthdate: false,
        email: false,
        phone_number: false,
        gender: false,
    };

    const stepsState = useSteps();
    const { registerData, setRegisterData } = useRegisterContext();
    const [competitorData, setCompetitorData] = useState({ ...emptyUserData });
    const [legalTutorData, setLegalTutorData] = useState({ ...emptyUserData });
    const [blockedCompetitorFields, setBlockedCompetitorFields] =
        useState(defaultBlockedFields);
    const [blockedLegalTutorFields, setBlockedLegalTutorFields] =
        useState(defaultBlockedFields);

    const [foundStudent, setFoundStudent] = useState(false);
    const [foundTutor, setFoundTutor] = useState(false);
    const [showStudentForm, setShowStudentForm] = useState(true);
    const [showTutorForm, setShowTutorForm] = useState(true);
    const [hasFoundStudent, setHasFoundStudent] = useState(false);
    const [clickOnSerach, setClickOnSerach] = useState(false);
    const [clickOnSearchTutor, setClickOnSearchTutor] = useState(false);

    useEffect(() => {
        if (registerData.competitor?.ci != null) {
            setCompetitorData({ ...emptyUserData, ...registerData.competitor });
            const fields = {};
            Object.keys(registerData.competitor).forEach((key) => {
                fields[key] = Boolean(
                    String(registerData.competitor[key]).trim(),
                );
            });
            setBlockedCompetitorFields(fields);
        }
        if (registerData.legal_tutor?.ci != null) {
            setLegalTutorData({
                ...emptyUserData,
                ...registerData.legal_tutor,
            });
            const fields = {};
            Object.keys(registerData.legal_tutor).forEach((key) => {
                fields[key] = Boolean(
                    String(registerData.legal_tutor[key]).trim(),
                );
            });
            setBlockedLegalTutorFields(fields);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validate = () => {
        return (
            Object.values(competitorData).every((value) => Boolean(value)) &&
            Object.values(legalTutorData).every((value) => Boolean(value))
        );
    };

    const updateCompetitorData = (data) => {
        setCompetitorData((prev) => ({ ...prev, ...data }));
    };

    const updateLegalTutorData = (data) => {
        setLegalTutorData((prev) => ({ ...prev, ...data }));
    };

    const onSearchStudent = async () => {
        try {
            const { data } = await axios.get(
                `${API_URL}/api/search-student/${competitorData.ci}`,
            );
            setClickOnSerach(true);
            if (data.names) {
                setFoundStudent(true);
                setHasFoundStudent(true);
            } else {
                setFoundStudent(false);
                setHasFoundStudent(false);
            }
            setCompetitorData((prev) => ({ ...prev, ...data }));
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setFoundStudent(false);
            setHasFoundStudent(false);
        }
    };
    const onSearchTutor = async () => {
        try {
            const { data } = await axios.get(
                `${API_URL}/api/search-student/${legalTutorData.ci}`,
            );
            setClickOnSearchTutor(true);
            if (data.names) {
                setFoundTutor(true);
            } else {
                setFoundTutor(false);
            }
            setLegalTutorData((prev) => ({ ...prev, ...data }));
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setFoundTutor(false);
        }
    };

    const postCompetitor = async () => {
        const url = `${API_URL}/api/olympiads/${registerData.olympic_id}/inscriptions`;
        const response = await axios
            .post(url, competitorData)
            .catch((err) => err.response);
        if (response.status === 422) {
            let msg = '';
            Object.keys(response.data.errors).forEach((key) => {
                msg = `${key}: ${response.data.errors[key]
                    .map((err) => err)
                    .join(', ')}`;
            });
            alert(msg);
            return;
        }
        if (response.status === 409) {
            alert(JSON.stringify(response.data.errors));
            return;
        }
        const { data } = response;
        return data.data;
    };

    const postLegalTutor = async (inscription) => {
        const url = `${API_URL}/api/olympiads/${registerData.olympic_id}/inscriptions/${inscription.id}/tutors`;
        const response = await axios
            .post(url, legalTutorData)
            .catch((err) => err.response);

        if (response.status === 422) {
            let msg = 'Algo salió mal';
            Object.keys(response.data.errors).forEach((key) => {
                msg = `${key}: ${response.data.errors[key]
                    .map((err) => err)
                    .join(', ')}`;
            });
            alert(msg);
            return;
        }
        if (response.status === 409) {
            return legalTutorData;
        }

        if (response.status !== 201) {
            return;
        }
        const { data } = response;
        return data.data;
    };

    const handleTutorSwitchChange = (e) => {
        const { checked } = e.target;
        const data = checked ? competitorData : emptyUserData;
        setLegalTutorData({ ...data });
    };

    const submit = async () => {
        const competitorResults = await postCompetitor();
        if (!competitorResults) return;
        const { inscription, ...competitor } = competitorResults;

        const tutorResults = await postLegalTutor(inscription);
        if (!tutorResults) return;

        setRegisterData({
            ...registerData,
            inscription_id: inscription.id,
            legal_tutor: tutorResults,
            competitor: { ...registerData.competitor, competitor },
        });
        stepsState.next();
    };

    const goback = () => {
        setRegisterData({
            ...registerData,
            competitor: null,
            legal_tutor: null,
        });
        stepsState.prev();
    };

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
                    Paso {stepsState.current}: Registro de Estudiante para la Olimpiada{' '}
                    {registerData.olympic_name}
                </h2>
                <p className="text-muted mb-4">
                    Complete el siguiente formulario para registrar al
                    estudiante en la Olimpiada {registerData.olympic_name}. Por
                    favor, asegúrese de ingresar correctamente los datos del
                    estudiante, incluyendo nombre completo, edad, institución
                    educativa, y otros detalles requeridos. Esta olimpiada tiene
                    como objetivo promover la competencia sana entre los
                    estudiantes. ¡Buena suerte!
                </p>

                {/* Student Form */}
                <div className="mb-3">
                    <h3
                        className="mb-0"
                        onClick={() => setShowStudentForm(!showStudentForm)}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                        Datos del Estudiante {showStudentForm ? '▼' : '▶'}
                    </h3>

                    <Collapse in={showStudentForm}>
                        <div>
                            <form>
                                <InputGroup className="mb-3">
                                    <div
                                        className="form-label w-100"
                                        style={{ 'webkit-appearance': 'none' }}
                                    >
                                        Carnet de Identidad del estudiante:
                                    </div>
                                    <FormControl
                                        disabled={blockedCompetitorFields.ci}
                                        type="number"
                                        placeholder="Ingresa el carnet de identidad"
                                        aria-label="Carnet de identidad del estudiante"
                                        value={competitorData.ci}
                                        onChange={(e) => {
                                            updateCompetitorData({
                                                ci: e.target.value,
                                            });
                                        }}
                                    />

                                    <Button
                                        disabled={blockedCompetitorFields.ci}
                                        onClick={onSearchStudent}
                                        variant="outline-secondary"
                                    >
                                        {foundStudent ? (
                                            <Check size={16} />
                                        ) : (
                                            <Search size={16} />
                                        )}
                                    </Button>
                                </InputGroup>
                                {!hasFoundStudent && clickOnSerach ? (
                                    <p className="text-danger">
                                        Carnet no encontrado, ingrese los datos
                                        manualmente.
                                    </p>
                                ) : hasFoundStudent && clickOnSerach ? (
                                    <p className="text-success">
                                        Datos cargados correctamente.
                                    </p>
                                ) : null}
                                <div className="mb-3">
                                    <label
                                        htmlFor="expStudent"
                                        className="form-label"
                                    >
                                        Lugar de Expedición
                                    </label>
                                    <select
                                        disabled={
                                            blockedLegalTutorFields.ci_expedition
                                        }
                                        className="form-select"
                                        id="expStudent"
                                        value={competitorData.ci_expedition}
                                        onChange={(e) =>
                                            updateCompetitorData({
                                                ci_expedition: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">
                                            Seleccionar Departamento
                                        </option>
                                        {states.map((state) => (
                                            <option key={state} value={state}>
                                                {state}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="nombreStudent"
                                        className="form-label"
                                    >
                                        Nombres
                                    </label>
                                    <input
                                        disabled={blockedCompetitorFields.names}
                                        type="text"
                                        className="form-control"
                                        id="nombreStudent"
                                        placeholder="Nombres"
                                        value={competitorData.names}
                                        style={{ textTransform: 'uppercase' }}
                                        onChange={(e) => {
                                            updateCompetitorData({
                                                names: e.target.value,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="apellidoStudent"
                                        className="form-label"
                                    >
                                        Apellidos
                                    </label>
                                    <input
                                        disabled={
                                            blockedCompetitorFields.last_names
                                        }
                                        type="text"
                                        className="form-control"
                                        id="apellidoStudent"
                                        placeholder="Apellidos"
                                        value={competitorData.last_names}
                                        style={{ textTransform: 'uppercase' }}
                                        onChange={(e) => {
                                            updateCompetitorData({
                                                last_names: e.target.value,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="fechaNacimientoStudent"
                                        className="form-label"
                                    >
                                        Fecha de Nacimiento del estudiante
                                    </label>
                                    <input
                                        disabled={
                                            blockedCompetitorFields.birthdate
                                        }
                                        type="date"
                                        className="form-control"
                                        id="fechaNacimientoStudent"
                                        value={competitorData.birthdate}
                                        max={new Date().toLocaleDateString(
                                            'en-CA',
                                        )}
                                        onChange={(e) => {
                                            updateCompetitorData({
                                                birthdate: e.target.value,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="correoStudent"
                                        className="form-label"
                                    >
                                        Correo electrónico
                                    </label>
                                    <input
                                        disabled={blockedCompetitorFields.email}
                                        type="email"
                                        className="form-control"
                                        id="correoStudent"
                                        placeholder="ejemplo@correo.com"
                                        value={competitorData.email}
                                        onChange={(e) => {
                                            updateCompetitorData({
                                                email: e.target.value,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="telefonoStudent"
                                        className="form-label"
                                    >
                                        Teléfono
                                    </label>
                                    <input
                                        disabled={
                                            blockedCompetitorFields.phone_number
                                        }
                                        type="text"
                                        className="form-control"
                                        id="telefonoStudent"
                                        placeholder="+591 70000000"
                                        value={competitorData.phone_number}
                                        onChange={(e) => {
                                            updateCompetitorData({
                                                phone_number: e.target.value,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="generoStudent"
                                        className="form-label"
                                    >
                                        Género
                                    </label>
                                    <select
                                        disabled={
                                            blockedCompetitorFields.gender
                                        }
                                        className="form-select"
                                        id="generoStudent"
                                        value={competitorData.gender}
                                        onChange={(e) => {
                                            updateCompetitorData({
                                                gender: e.target.value,
                                            });
                                        }}
                                    >
                                        <option value="">
                                            Selecciona una opción
                                        </option>
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                    </Collapse>
                </div>

                {/* Tutor Form */}
                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h3
                            className="mb-0"
                            onClick={() => setShowTutorForm(!showTutorForm)}
                            style={{ cursor: 'pointer', userSelect: 'none' }}
                        >
                            Datos del Tutor {showTutorForm ? '▼' : '▶'}
                        </h3>
                        {Object.values(competitorData).every(
                            (value) => !!value,
                        ) &&
                            !registerData.legal_tutor && (
                                <Form.Check
                                    type="switch"
                                    label="Ser mi propio tutor?"
                                    onChange={handleTutorSwitchChange}
                                />
                            )}
                    </div>
                    <Collapse in={showTutorForm}>
                        <div>
                            <form>
                                <InputGroup className="mb-3">
                                    <div className="form-label w-100">
                                        Carnet de identidad del tutor
                                    </div>
                                    <FormControl
                                        disabled={blockedLegalTutorFields.ci}
                                        type="number"
                                        placeholder="Ingresa el carnet de identidad"
                                        aria-label="Carnet de identidad del tutor"
                                        value={legalTutorData.ci}
                                        onChange={(e) => {
                                            updateLegalTutorData({
                                                ci: e.target.value,
                                            });
                                        }}
                                    />
                                    <Button
                                        disabled={blockedLegalTutorFields.ci}
                                        onClick={onSearchTutor}
                                        variant="outline-secondary"
                                    >
                                        {foundTutor ? (
                                            <Check size={16} />
                                        ) : (
                                            <Search size={16} />
                                        )}
                                    </Button>
                                </InputGroup>
                                {!foundTutor && clickOnSearchTutor ? (
                                    <p className="text-danger">
                                        Carnet no encontrado, ingrese los datos
                                        manualmente.
                                    </p>
                                ) : foundTutor && clickOnSearchTutor ? (
                                    <p className="text-success">
                                        Datos cargados correctamente.
                                    </p>
                                ) : null}
                                <div className="mb-3">
                                    <label
                                        htmlFor="expTutor"
                                        className="form-label"
                                    >
                                        Lugar de Expedición
                                    </label>
                                    <select
                                        disabled={
                                            blockedLegalTutorFields.ci_expedition
                                        }
                                        className="form-select"
                                        id="expTutor"
                                        value={legalTutorData.ci_expedition}
                                        onChange={(e) =>
                                            updateLegalTutorData({
                                                ci_expedition: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">
                                            Seleccionar Departamento
                                        </option>
                                        {states.map((state) => (
                                            <option key={state} value={state}>
                                                {state}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="nombreTutor"
                                        className="form-label"
                                    >
                                        Nombres
                                    </label>
                                    <input
                                        disabled={blockedLegalTutorFields.names}
                                        type="text"
                                        className="form-control"
                                        id="nombreTutor"
                                        placeholder="Nombres"
                                        value={legalTutorData.names}
                                        style={{ textTransform: 'uppercase' }}
                                        onChange={(e) => {
                                            updateLegalTutorData({
                                                names: e.target.value,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="apellidoTutor"
                                        className="form-label"
                                    >
                                        Apellidos
                                    </label>
                                    <input
                                        disabled={
                                            blockedLegalTutorFields.last_names
                                        }
                                        type="text"
                                        className="form-control"
                                        id="apellidoTutor"
                                        placeholder="Apellidos"
                                        value={legalTutorData.last_names}
                                        style={{ textTransform: 'uppercase' }}
                                        onChange={(e) => {
                                            updateLegalTutorData({
                                                last_names: e.target.value,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="fechaNacimientoTutor"
                                        className="form-label"
                                    >
                                        Fecha de Nacimiento
                                    </label>
                                    <input
                                        disabled={
                                            blockedLegalTutorFields.birthdate
                                        }
                                        type="date"
                                        className="form-control"
                                        id="fechaNacimientoTutor"
                                        value={legalTutorData.birthdate}
                                        max={new Date().toLocaleDateString(
                                            'en-CA',
                                        )}
                                        onChange={(e) => {
                                            updateLegalTutorData({
                                                birthdate: e.target.value,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="correoTutor"
                                        className="form-label"
                                    >
                                        Correo electrónico
                                    </label>
                                    <input
                                        disabled={blockedLegalTutorFields.email}
                                        type="email"
                                        className="form-control"
                                        id="correoTutor"
                                        placeholder="ejemplo@correo.com"
                                        value={legalTutorData.email}
                                        onChange={(e) => {
                                            updateLegalTutorData({
                                                email: e.target.value,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="telefonoTutor"
                                        className="form-label"
                                    >
                                        Teléfono
                                    </label>
                                    <input
                                        disabled={
                                            blockedLegalTutorFields.phone_number
                                        }
                                        type="text"
                                        className="form-control"
                                        id="telefonoTutor"
                                        placeholder="+591 70000000"
                                        value={legalTutorData.phone_number}
                                        onChange={(e) => {
                                            updateLegalTutorData({
                                                phone_number: e.target.value,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="generoTutor"
                                        className="form-label"
                                    >
                                        Género
                                    </label>
                                    <select
                                        disabled={
                                            blockedLegalTutorFields.gender
                                        }
                                        className="form-select"
                                        id="generoTutor"
                                        value={legalTutorData.gender}
                                        onChange={(e) => {
                                            updateLegalTutorData({
                                                gender: e.target.value,
                                            });
                                        }}
                                    >
                                        <option value="">
                                            Selecciona una opción
                                        </option>
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                    </Collapse>
                </div>

                <div className="d-flex gap-2">
                    <button
                        disabled={!stepsState.hasPrev}
                        type="button"
                        className="btn btn-secondary w-50"
                        onClick={goback}
                    >
                        Anterior
                    </button>
                    <button
                        disabled={!stepsState.hasNext || !validate()}
                        type="button"
                        className="btn btn-primary w-50"
                        onClick={async () => await submit()}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};
