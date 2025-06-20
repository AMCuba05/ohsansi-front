import axios from 'axios';
import { useEffect, useState } from 'react';
import { Dropdown, Form, ProgressBar, Spinner } from 'react-bootstrap';
import { useSteps } from 'react-step-builder';
import {
    grades,
    provincies,
    schools,
    states,
} from '../../../../Constants/Provincies.js';
import { API_URL } from '../../../../Constants/Utils.js';
import { useRegisterContext } from '../../../../Context/RegisterContext.js';

export const NewFirstStep = () => {
    const emptySchool = {
        name: '',
        department: '',
        province: '',
        course: '',
    };
    const defaultBlockedFields = {
        name: false,
        department: false,
        province: false,
        course: false,
    };
    const stepsState = useSteps();
    const { registerData, setRegisterData } = useRegisterContext();
    const [schoolData, setSchoolData] = useState(emptySchool);
    const [blockedFields, setBlockedFields] = useState(defaultBlockedFields);

    useEffect(() => {
        if (!registerData.competitor?.school_data) return;
        const { school_data } = registerData.competitor;
        setSchoolData({
            name: school_data.name,
            department: school_data.department,
            province: school_data.province,
            course: school_data.course,
        });
        setBlockedFields({
            name: !!school_data.name,
            department: !!school_data.department,
            province: !!school_data.province,
            course: false,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelectState = (index) => {
        setSchoolData({ ...schoolData, department: states[index] });
    };

    const handleSelectProvince = (index) => {
        setSchoolData({ ...schoolData, province: provincies[index] });
    };

    const handleSelectSchool = (index) => {
        setSchoolData({ ...schoolData, name: schools[index] });
    };

    const handleSelectGrade = (index) => {
        setSchoolData({ ...schoolData, course: grades[index] });
    };

    const storeSchoolData = async () => {
        const { olympic_id, inscription_id } = registerData;
        const url = `${API_URL}/api/olympiads/${olympic_id}/inscriptions/${inscription_id}/schools`;
        const response = await axios
            .post(url, schoolData)
            .catch((err) => err.response);
        if (response.status === 409) {
            const { errors } = response.data;
            let msg = '';
            Object.keys(errors).forEach((key) => {
                msg += `${key}: ${errors[key].join(', ')}`;
            });
            alert(msg);
            return;
        }
        if (response.status !== 200) {
            let msg = 'Hubo un error al registrar la escuela\n';
            msg += `Detalles: \n${JSON.stringify(response.data)}`;
            alert(msg);
            return;
        }

        const school = response.data.data;
        setRegisterData({
            ...registerData,
            competitor: {
                ...registerData.competitor,
                school_data: school,
            },
        });
        stepsState.next();
    };

    function validate() {
        return Object.values(schoolData).every((value) => !!value.trim());
    }

    return (
        <div className="container d-flex justify-content-center">
            <div className="card p-4">
                <span>
                    Paso {stepsState.current} de {stepsState.total}{' '}
                </span>
                <ProgressBar
                    now={stepsState.progress * 100}
                    label={`${Math.round(stepsState.progress * 100)}%`}
                    animated
                    striped
                    variant={'success'}
                    style={{ height: '1.5rem', fontSize: '0.9rem' }}
                />
                <h2 className="mb-3 mt-4">Paso 3: Datos Académicos</h2>
                <p className="text-muted mb-4">
                    Completa la siguiente información académica del estudiante.
                    Estos datos nos permiten clasificar adecuadamente su
                    participación en la olimpiada según su nivel educativo,
                    institución y ubicación.
                </p>

                <form>
                    <Form.Group className="d-flex align-items-center mt-3">
                        <Form.Label className="me-3 mb-0 w-25">
                            Departamento:
                        </Form.Label>
                        <Dropdown onSelect={handleSelectState}>
                            <Dropdown.Toggle
                                disabled={blockedFields.department}
                                variant="primary"
                                id="dropdown-basic"
                            >
                                {schoolData.department
                                    ? schoolData.department
                                    : 'Seleccionar Departamento'}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {states.map((state, index) => (
                                    <Dropdown.Item key={index} eventKey={index}>
                                        {state}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>

                    <Form.Group className="d-flex align-items-center mt-3">
                        <Form.Label className="me-3 mb-0 w-25">
                            Provincia:
                        </Form.Label>
                        <Dropdown onSelect={handleSelectProvince}>
                            <Dropdown.Toggle
                                disabled={blockedFields.province}
                                variant="primary"
                                id="dropdown-basic"
                            >
                                {schoolData.province
                                    ? schoolData.province
                                    : 'Seleccionar Provincia'}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {provincies.map((province, index) => (
                                    <Dropdown.Item key={index} eventKey={index}>
                                        {province}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                    <Form.Group className="d-flex align-items-center mt-3">
                        <Form.Label className="me-3 mb-0 w-25">
                            Colegio:
                        </Form.Label>
                        <Dropdown onSelect={handleSelectSchool}>
                            <Dropdown.Toggle
                                disabled={blockedFields.name}
                                variant="primary"
                                id="dropdown-basic"
                            >
                                {schoolData.name
                                    ? schoolData.name
                                    : 'Seleccionar Colegio'}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {schools.map((school, index) => (
                                    <Dropdown.Item key={index} eventKey={index}>
                                        {school}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                    <Form.Group className="d-flex align-items-center mt-3">
                        <Form.Label className="me-3 mb-0 w-25">
                            Grado:
                        </Form.Label>
                        <Dropdown onSelect={handleSelectGrade}>
                            <Dropdown.Toggle
                                disabled={blockedFields.course}
                                variant="primary"
                                id="dropdown-basic"
                            >
                                {schoolData.course
                                    ? schoolData.course
                                    : 'Seleccionar Colegio'}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {grades.map((school, index) => (
                                    <Dropdown.Item key={index} eventKey={index}>
                                        {school}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>

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
                            disabled={!stepsState.hasNext || !validate()}
                            type="button"
                            className="btn btn-primary w-50"
                            onClick={async () => await storeSchoolData()}
                        >
                            Siguiente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
