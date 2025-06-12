import React, {useState} from 'react';
import {useSteps} from 'react-step-builder'
import {FormControl, ProgressBar} from 'react-bootstrap'
import { Search, Check, X } from 'lucide-react';
import {Button, InputGroup} from "reactstrap";
import axios from "axios";
import {useRegisterContext} from "../../../../Context/RegisterContext.jsx";
import {API_URL} from "../../../../Constants/Utils.js";

export const NewFourthStep = ({setBoletaData}) => {
    const today = new Date();
    const localDate = today.toLocaleDateString('en-CA');
    const stepsState = useSteps()
    const { registerData, setRegisterData } = useRegisterContext()
    const [name, setName] = useState("")
    const [gender, setGender] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [ci, setCi] = useState("")
    const [ciExp, setCiExp] = useState("")
    const [birthDate, setBirthDate] = useState('');
    const [clickOnSearch, setClickOnSearch] = useState(false);
    const [foundAccountable, setFoundAccountable] = useState(false);


    const validate = () => {
        if (!name.trim()) return false;
        if (!lastName.trim()) return false;
        if (!email.trim()) return false;
        if (!phone.trim()) return false;
        if (!ci.trim()) return false;

        return true;
    }

    const storeAccountable = async () => {
        try {
            await axios.post(`${API_URL}/api/inscription/olympic/multiple`,
                {
                    accountable: {
                        ci: ci,
                        ci_expedition: ciExp,
                        names: name,
                        last_names: lastName,
                        birthdate: birthDate,
                        email: email,
                        phone_number: phone,
                        gender: gender
                    }
                }, {
                    headers: {
                        Identity: JSON.stringify(registerData.identity),
                        Step: 3
                    }
                }).then((response) => {
                setRegisterData({
                    ...registerData,
                    responsable: {
                        ci: ci,
                        ci_expedition: ciExp,
                        names: name,
                        last_names: lastName,
                        birthdate: birthDate,
                        email: email,
                        phone_number: phone
                    },
                    boleta: response.data.data.boleta
                })
            })

            alert("La pre inscripcion se ha realizado con exito")
            stepsState.next()
        } catch (e) {
            console.log(e)
        }
    }

    const onSearchAccountable = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/search-student/${ci}`);
            setClickOnSearch(true)
            if(data.names){
                setFoundAccountable(true)
                setCiExp(data.ci_expedition)
                setName(data.names)
                setLastName(data.last_names)
                setBirthDate(data.birthdate)
                setEmail(data.email)
                setPhone(data.phone_number)
                setGender(data.gender)
            }else {
                setFoundAccountable(false)
                setCiExp("")
                setName("")
                setLastName("")
                setBirthDate("")
                setEmail("")
                setPhone("")
                setGender("")
            }
        } catch (err) {
            setFoundAccountable(false)
            console.log(err)
        }
    };

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
                <h2 className="mb-3 mt-4">Paso 5: Información del responsable de pago</h2>
                <p className="text-muted mb-4">
                    Puedes registrar un tutor académico que apoye al estudiante durante la olimpiada. Esta información es opcional
                </p>

                <form>
                    <InputGroup className="mb-3">
                        <div className="form-label w-100">Carnet de identidad del responsable</div>
                        <FormControl
                            type="number"
                            placeholder="Ingresa el carnet de identidad"
                            aria-label="Carnet de identidad del tutor"
                            value={ci}
                            onChange={e => setCi(e.target.value)}
                        />
                        <Button onClick={onSearchAccountable} variant="outline-secondary">
                            {foundAccountable ? <Check size={16}/> : <Search size={16}/>}
                        </Button>
                    </InputGroup>
                    {!foundAccountable && clickOnSearch ?
                        <p className="text-danger">Carnet no encontrado, ingrese los datos
                            manualmente.</p> : foundAccountable && clickOnSearch?
                            <p className="text-success">Datos cargados correctamente.</p> : null
                    }
                    <div className="mb-3">
                        <label htmlFor="exp" className="form-label">Lugar de Expedición</label>
                        <input
                            type="text"
                            className="form-control"
                            id="exp"
                            placeholder="Lugar de Expedición"
                            value={ciExp}
                            style={{textTransform: 'uppercase'}}
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
                            style={{textTransform: 'uppercase'}}
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
                            style={{textTransform: 'uppercase'}}
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
                            max={new Date().toLocaleDateString('en-CA')}
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
                            type="number"
                            className="form-control"
                            id="telefono"
                            placeholder="+591 70000000"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="genero" className="form-label">Género</label>
                        <select
                            className="form-select"
                            id="genero"
                            value={gender}
                            onChange={e => setGender(e.target.value)}
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
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
                            disabled={ !validate()}
                            type="button"
                            className="btn btn-primary w-50"
                            onClick={async () => await storeAccountable()}
                        >
                            Siguiente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
