import React, { useState } from 'react';
import { useSteps } from 'react-step-builder';
import {FormControl, ProgressBar, Accordion, Card, Spinner, Form, Dropdown} from 'react-bootstrap';
import axios from "axios";
import { useRegisterContext } from "../../../../Context/RegisterContext.js";
import {grades, provincies, schools, states} from "../../../../Constants/Provincies.js";
import {API_URL} from "../../../../Constants/Utils.js";


export const SecondStep = () => {
    const stepsState = useSteps()
    const { registerData, setRegisterData } = useRegisterContext()
    const [found, setFound] = useState(false)
    const [hasBeenQueried, setHasBeenQueried] = useState(false)
    const [olympiads, setOlympiads] = useState()
    const [loading, setLoading] = useState(false)

    const [selected, setSelected] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedSchool, setSelectedSchool] = useState(null);

    const handleSelect = (index) => {
        setSelected(grades[index]);
    };

    const handleSelectState = (index) => {
        setSelectedState(states[index]);
    };

    const handleSelectProvince = (index) => {
        setSelectedProvince(provincies[index]);
    };

    const handleSelectSchool = (index) => {
        setSelectedSchool(schools[index]);
    };

    const submit = () => {
        setRegisterData({
            ...registerData,
            competitor: {
                ...registerData.competitor,
                school_data: {
                    name: selectedSchool,
                    department: selectedState,
                    province: selectedProvince,
                    course: selected
                },
            }
        })
        stepsState.next()
    }

    const storeSchoolData = async () => {
        try {
            await axios.post(`${API_URL}/api/inscription/olympic/multiple`, {
                school: {
                    department: selectedState,
                    name: selectedSchool,
                    province: selectedProvince,
                },
            }, {
                headers: {
                    Identity: JSON.stringify(registerData.identity),
                    Step: 1
                }
            })
            setRegisterData({
                ...registerData,
                competitor: {
                    ...registerData.competitor,
                    school_data: {
                        name: selectedSchool,
                        department: selectedState,
                        province: selectedProvince,
                    },
                }
            })
            stepsState.next()
        } catch (e) {
            console.log(e)
        }
    }

    function validate() {
        if (selectedState == null) return false;
        if (selectedSchool == null) return false;
        return selectedProvince != null;

    }

    return (
        <div className="container d-flex justify-content-center">
            <div className="card p-4" >
                <span>Paso {stepsState.current} de {stepsState.total} </span>
                <ProgressBar
                    now={stepsState.progress * 100}
                    label={`${Math.round(stepsState.progress * 100)}%`}
                    animated
                    striped
                    variant={"success"}
                    style={{ height: '1.5rem', fontSize: '0.9rem' }}
                />
                <h2 className="mb-3 mt-4">Paso 3: Datos Académicos</h2>
                <p className="text-muted mb-4">
                    Completa la siguiente información académica del estudiante. Estos datos nos permiten clasificar adecuadamente su participación en la olimpiada según su nivel educativo, institución y ubicación.
                </p>

                <form>
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <Form.Group className="d-flex align-items-center mt-3">
                            <Form.Label className="me-3 mb-0 w-25">Departamento:</Form.Label>
                            <Dropdown onSelect={handleSelectState}>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    {selectedState ? selectedState : 'Seleccionar Departamento'}
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
                    )}

                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <Form.Group className="d-flex align-items-center mt-3">
                            <Form.Label className="me-3 mb-0 w-25">Provincia:</Form.Label>
                            <Dropdown onSelect={handleSelectProvince}>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    {selectedProvince ? selectedProvince : 'Seleccionar Provincia'}
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
                    )}

                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <Form.Group className="d-flex align-items-center mt-3">
                            <Form.Label className="me-3 mb-0 w-25">Colegio:</Form.Label>
                            <Dropdown onSelect={handleSelectSchool}>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    {selectedSchool ? selectedSchool : 'Seleccionar Colegio'}
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
                    )}
                    {/*Mover el grado a la info de estudiante*/}


                    {hasBeenQueried && !found ? <p className="text-danger">Carnet no encontrado, ingresa los datos manualmente</p> : null}
                    {hasBeenQueried && found ?  <p className="text-success">Datos cargados correctamente.</p> : null}

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
    )
}
