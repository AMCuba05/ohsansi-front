import React, {useState} from 'react';
import {useSteps} from 'react-step-builder'
import {FormControl, ProgressBar} from 'react-bootstrap'
import { Search, Check, X } from 'lucide-react';
import {Button, InputGroup} from "reactstrap";
import axios from "axios";

export const FouthStep = () => {
    const stepsState = useSteps()
    const [found, setFound] = useState(false)
    const [hasBeenQueried, setHasBeenQueried] = useState(false)
    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [ci, setCi] = useState("")

    function validate() {
        if (!name.trim()) return false;
        if (!lastName.trim()) return false;
        if (!email.trim()) return false;
        if (!phone.trim()) return false;
        if (!ci.trim()) return false;

        return true;
    }

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card shadow p-4" style={{ width: '40vw' }}>
                <span>Paso {stepsState.current} de {stepsState.total} </span>
                <ProgressBar
                    now={stepsState.progress * 100}
                    label={`${Math.round(stepsState.progress * 100)}%`}
                    animated
                    striped
                    variant={"success"}
                    style={{ height: '1.5rem', fontSize: '0.9rem' }}
                />
                <h2 className="mb-3 mt-4">Paso 3: Información del tutor académico (Opcional)</h2>
                <p className="text-muted mb-4">
                    Puedes registrar un tutor académico que apoye al estudiante durante la olimpiada. Esta información es opcional
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
                    </InputGroup>
                    {hasBeenQueried && !found ? <p className="text-danger">Carnet no encontrado, ingresa los datos manualmente</p> : null}
                    {hasBeenQueried && found ?  <p className="text-success">Datos cargados correctamente.</p> : null}

                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombres</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nombre"
                            placeholder="Nombres"
                            value={name}
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
                            onChange={e => setLastName(e.target.value)}
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
                            onClick={stepsState.next}
                        >
                            Siguiente
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-link w-100"
                        onClick={stepsState.next}
                    >
                        Omitir
                    </button>
                </form>
            </div>
        </div>
    )
}
