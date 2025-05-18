import React, {useState} from 'react';
import {useSteps} from 'react-step-builder'
import {FormControl, ProgressBar} from 'react-bootstrap'
import { Search, Check, X } from 'lucide-react';
import {Button, InputGroup} from "reactstrap";
import axios from "axios";
import {useRegisterContext} from "../../../../Context/RegisterContext.jsx";
import {API_URL} from "../../../../Constants/Utils.js";

export const ThirdStep = () => {
    const stepsState = useSteps()
    const [found, setFound] = useState(false)
    const { registerData, setRegisterData } = useRegisterContext()
    const [hasBeenQueried, setHasBeenQueried] = useState(false)
    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [ci, setCi] = useState("")
    const [ciExp, setCiExp] = useState("")
    const [birthDate, setBirthDate] = useState('');
    const validate = () => {
        if (!name.trim()) return false;
        if (!lastName.trim()) return false;
        if (!email.trim()) return false;
        if (!phone.trim()) return false;
        if (!ci.trim()) return false;

        return true;
    }

    const submit = () => {
        setRegisterData({
            ...registerData,
            legal_tutor: {
                ci: Number(ci),
                ci_expedition: ciExp,
                names: name,
                last_names: lastName,
                birthdate: birthDate,
                email: email,
                phone_number: phone
            },
        })
        stepsState.next()
    }

    const onSearchTutor = async () => {
        try {
            const {data} = await axios.get(
                `${API_URL}/api/legal-tutor/${ci}`
            );
            setHasBeenQueried(true)
            const {personal_data} = data
            if (Object.keys(personal_data).length === 0) {
                setFound(false)
            } else {
                setFound(true)
                setName(personal_data.names)
                setLastName(personal_data.last_names)
                setCiExp(personal_data.ci_expedition)
                setBirthDate(personal_data.birthdate)
                setEmail(personal_data.email)
                setPhone(personal_data.phone_number)
            }
        } catch (error) {
            setHasBeenQueried(true)
            setFound(false)
            setName("")
            setLastName("")
            setCiExp("")
            setBirthDate("")
            setEmail("")
            setPhone("")
        }
    };

    return (
        <div className="container d-flex justify-content-center">
            <div className="card p-4">
                <span>Paso {stepsState.current} de {stepsState.total} </span>
                <ProgressBar
                    now={stepsState.progress * 100}
                    label={`${Math.round(stepsState.progress * 100)}%`}
                    animated
                    striped
                    variant={"success"}
                    style={{ height: '1.5rem', fontSize: '0.9rem' }}
                />
                <h2 className="mb-3 mt-4">Paso 3: Información del tutor legal o apoderado</h2>
                <p className="text-muted mb-4">
                    Por favor, ingresa los datos del tutor legal del estudiante para completar su inscripción en la olimpiada. Esta información es necesaria para validar el consentimiento y garantizar la autorización correspondiente.
                </p>

                <form>
                    <InputGroup className="mb-3">
                        <div className="form-label w-100">Carnet de identidad del tutor</div>
                        <FormControl
                            type="text"
                            placeholder="Ingresa el carnet de identidad"
                            aria-label="Carnet de identidad del tutor"
                            value={ci}
                            onChange={e => setCi(e.target.value)}
                        />
                        <Button onClick={onSearchTutor} variant="outline-secondary">
                            {
                                found ? <Check size={16} /> : <Search size={16} />
                            }
                        </Button>
                    </InputGroup>
                    {hasBeenQueried && !found ? <p className="text-danger">Carnet no encontrado, ingresa los datos manualmente</p> : null}
                    {hasBeenQueried && found ?  <p className="text-success">Datos cargados correctamente.</p> : null}

                    {
                        hasBeenQueried ?
                            <>
                                <div className="mb-3">
                                    <label htmlFor="exp" className="form-label">Lugar de Expedición</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="exp"
                                        placeholder="Lugar de Expedición"
                                        value={ciExp}
                                        style={{ textTransform: 'uppercase' }}
                                        onChange={e => setCiExp(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label">Nombres</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre"
                                        placeholder="Nombres"
                                        value={name}
                                        style={{ textTransform: 'uppercase' }}
                                        onChange={e => setName(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="apellido" className="form-label">Apellidos</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="apellido"
                                        placeholder="Apellidos"
                                        value={lastName}
                                        style={{ textTransform: 'uppercase' }}
                                        onChange={e => setLastName(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fechaNacimiento"
                                        value={birthDate}
                                        onChange={e => setBirthDate(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="correo" className="form-label">Correo electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="correo"
                                        placeholder="ejemplo@correo.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="telefono"
                                        placeholder="+591 70000000"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                    />
                                </div>
                            </> : null
                    }

                    <div className="d-flex gap-2">
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
                            type="submit"
                            className="btn btn-primary w-50"
                            onClick={submit}
                        >
                            Siguiente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

