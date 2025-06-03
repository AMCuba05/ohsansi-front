import React, { useState } from 'react';
import { useSteps } from 'react-step-builder';
import { FormControl, ProgressBar, Accordion, Card } from 'react-bootstrap';
import { Search, Check, X, Plus, Trash } from 'lucide-react';
import { Button, InputGroup } from "reactstrap";
import axios from "axios";
import { useRegisterContext } from "../../../../Context/RegisterContext.jsx";
import {grades} from "../../../../Constants/Provincies.js";

const emptyStudent = {
    found: false,
    hasBeenQueried: false,
    name: '',
    lastName: '',
    email: '',
    phone: '',
    ci: '',
    ciExp: '',
    birthDate: '',
    course: '',
    gender: ''
};

export const SecondStep = () => {
    const stepsState = useSteps();
    const { registerData, setRegisterData } = useRegisterContext();
    const [students, setStudents] = useState([ { ...emptyStudent } ]);

    const handleStudentChange = (index, field, value) => {
        const updated = [...students];
        updated[index][field] = value;
        setStudents(updated);
    };

    const validateStudent = (student) => {
        return student.name.trim() && student.lastName.trim() &&
            student.email.trim() && student.phone.trim() &&
            student.ci.trim();
    };

    const validateAll = () => students.every(validateStudent);

    const onSearchStudent = async (index) => {
        const ci = students[index].ci;
        try {
            const { data } = await axios.get(`https://willypaz.dev/projects/ohsansi-api/api/search-student/${ci}`);
            const updated = [...students];
            updated[index].hasBeenQueried = true;

            if (Object.keys(data).length === 0) {
                updated[index].found = false;
            } else {
                updated[index] = {
                    ...updated[index],
                    found: true,
                    name: data.names,
                    lastName: data.last_names,
                    ciExp: data.ci_expedition,
                    birthDate: data.birthdate,
                    email: data.email,
                    phone: data.phone_number,
                    course: data.course,
                    gender: data.gender,
                };
            }

            setStudents(updated);
        } catch (err) {
            const updated = [...students];
            updated[index] = { ...emptyStudent, ci, hasBeenQueried: true, found: false };
            setStudents(updated);
        }
    };

    const addStudent = () => setStudents([...students, { ...emptyStudent }]);
    const removeStudent = (index) => {
        const updated = students.filter((_, i) => i !== index);
        setStudents(updated);
    };

    const submit = () => {
        setRegisterData({
            ...registerData,
            competitors: students.map(s => ({
                ci: Number(s.ci),
                ci_expedition: s.ciExp,
                names: s.name,
                last_names: s.lastName,
                birthdate: s.birthDate,
                email: s.email,
                phone_number: s.phone,
            }))
        });
        stepsState.next();
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
                <h2 className="mb-3 mt-4">Paso 2: Registro de Estudiantes para la Olimpiada {registerData.olympic_name}</h2>
                <p className="text-muted mb-4">
                    Complete los datos de cada estudiante. Puede registrar varios participantes.
                </p>

                <Accordion defaultActiveKey="0" alwaysOpen>
                    {students.map((student, index) => (
                        <Accordion.Item eventKey={index.toString()} key={index}>
                            <Accordion.Header>
                                Estudiante #{index + 1} {student.name && `- ${student.name} ${student.lastName}`}
                            </Accordion.Header>
                            <Accordion.Body>
                                <InputGroup className="mb-3">
                                    <div className="form-label w-100">Carnet de identidad</div>
                                    <FormControl
                                        type="text"
                                        value={student.ci}
                                        onChange={e => handleStudentChange(index, 'ci', e.target.value)}
                                        placeholder="Carnet de identidad"
                                    />
                                    <Button onClick={() => onSearchStudent(index)} variant="outline-secondary">
                                        {student.found ? <Check size={16}/> : <Search size={16}/>}
                                    </Button>
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
                                        value={student.ciExp}
                                        style={{textTransform: 'uppercase'}}
                                        onChange={e => handleStudentChange(index, 'ciExp', e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Nombres</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={student.name}
                                        style={{textTransform: 'uppercase'}}
                                        onChange={e => handleStudentChange(index, 'name', e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Apellidos</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={student.lastName}
                                        style={{textTransform: 'uppercase'}}
                                        onChange={e => handleStudentChange(index, 'lastName', e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Fecha de Nacimiento</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={student.birthDate}
                                        onChange={e => handleStudentChange(index, 'birthDate', e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Correo electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={student.email}
                                        onChange={e => handleStudentChange(index, 'email', e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Teléfono</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        value={student.phone}
                                        onChange={e => handleStudentChange(index, 'phone', e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="grado" className="form-label">Grado</label>
                                    <select
                                        className="form-select"
                                        id="grado"
                                        value={student.course || ''}
                                        onChange={e => handleStudentChange(index, 'course', e.target.value)}
                                    >
                                        <option value="">Selecciona una opción</option>
                                        {grades.map((grade, index) => (
                                            <option key={index} value={grade}>
                                                {grade}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="generoStudent" className="form-label">Género</label>
                                    <select
                                        className="form-select"
                                        id="generoStudent"
                                        value={student.gender}
                                        onChange={e => handleStudentChange(index, 'gender', e.target.value)}
                                    >
                                        <option value="">Selecciona una opción</option>
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                    </select>
                                </div>

                                <div className="text-end">
                                    {students.length > 1 && (
                                        <Button color="danger" onClick={() => removeStudent(index)}>
                                            <Trash size={16}/> Eliminar estudiante
                                        </Button>
                                    )}
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>

                <div className="d-flex justify-content-between mt-4">
                    <Button color="success" onClick={addStudent}>
                        <Plus size={16}/> Agregar Estudiante
                    </Button>

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

export default SecondStep
