import React, {useState} from 'react';
import {useSteps} from 'react-step-builder'
import {FormControl, ProgressBar} from 'react-bootstrap'
import { Search, Check, X } from 'lucide-react';
import {Button, InputGroup} from "reactstrap";
import axios from "axios";
import {useRegisterContext} from "../../../../Context/RegisterContext.jsx";
import {API_URL} from "../../../../Constants/Utils.js";

export const RecoverSessionStep = () => {
    const stepsState = useSteps()
    const { registerData, setRegisterData } = useRegisterContext()
    console.log(registerData, 'xxx')
    const [ci, setCi] = useState("")
    const [birthDate, setBirthDate] = useState('');

    const validate = () => {
        if (!birthDate.trim()) return false;
        if (!ci.trim()) return false;
        return true;
    }

    const getInscriptionForm = async () => {
            setRegisterData({
                ...registerData,
                identity: {
                    ci: ci,
                    birthdate: birthDate,
                    olympicId: registerData.olympic_id
                },
                olympiad: {
                    id: registerData.olympic_id,
                    price: registerData.olympic_price
                },
            })
            stepsState.next()
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
                <h2 className="mb-3 mt-4">Paso 2: Registro de Estudiante para la Olimpiada {registerData.olympic_name}</h2>
                <p className="text-muted mb-4">
                    Ingrese sus datos personales para iniciar con el proceso de inscripción o retormarlo donde lo dejo previamente
                </p>

                <form>
                    <InputGroup className="mb-3">
                        <div className="form-label w-100">Carnet de Identidad:</div>
                        <FormControl
                            type="text"
                            placeholder="Ingresa el carnet de identidad"
                            aria-label="Carnet de identidad del tutor"
                            value={ci}
                            onChange={e => setCi(e.target.value)}
                        />
                    </InputGroup>
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
                            type="button"
                            className="btn btn-primary w-50"
                            onClick={ async () => await getInscriptionForm()}
                        >
                            Siguiente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
