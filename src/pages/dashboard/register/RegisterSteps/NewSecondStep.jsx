import React, {useEffect, useState} from 'react';
import {useSteps} from 'react-step-builder'
import {Dropdown, Form, FormControl, ProgressBar, Collapse} from 'react-bootstrap'
import { Search, Check, X } from 'lucide-react';
import {Button, InputGroup} from "reactstrap";
import axios from "axios";
import {useRegisterContext} from "../../../../Context/RegisterContext.jsx";
import {API_URL} from "../../../../Constants/Utils.js";

export const NewSecondStep = () => {
    const today = new Date();
    const localDate = today.toLocaleDateString('en-CA'); // 'en-CA' da formato YYYY-MM-DD
    const stepsState = useSteps()
    const { registerData, setRegisterData } = useRegisterContext()
    const [gender, setGender] = useState("")
    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [ci, setCi] = useState("")
    const [ciExp, setCiExp] = useState("")
    const [birthDate, setBirthDate] = useState('');
    const [genderTutor, setGenderTutor] = useState("")
    const [nameTutor, setNameTutor] = useState("")
    const [lastNameTutor, setLastNameTutor] = useState("")
    const [emailTutor, setEmailTutor] = useState("")
    const [phoneTutor, setPhoneTutor] = useState("")
    const [ciTutor, setCiTutor] = useState("")
    const [ciExpTutor, setCiExpTutor] = useState("")
    const [birthDateTutor, setBirthDateTutor] = useState('');
    const [selected, setSelected] = useState(null);
    const [foundStudent, setFoundStudent] = useState(false)
    const [foundTutor, setFoundTutor] = useState(false)
    const [hasBeenQueried, setHasBeenQueried] = useState(false)
    const [showStudentForm, setShowStudentForm] = useState(true);
    const [showTutorForm, setShowTutorForm] = useState(true);
    const [hasFoundStudent, setHasFoundStudent] = useState(false);
    const [clickOnSerach, setClickOnSerach] = useState(false);
    const [clickOnSearchTutor, setClickOnSearchTutor] = useState(false);

    console.log(registerData.legal_tutor != null, registerData.legal_tutor, 'xx')
    useEffect(() => {
        if(registerData.competitor?.ci != null){
            setCi(registerData.competitor.ci + '')
            setCiExp(registerData.competitor.ci_expedition)
            setName(registerData.competitor.names)
            setLastName(registerData.competitor.last_names)
            setBirthDate(registerData.competitor.birthdate)
            setEmail(registerData.competitor.email)
            setPhone(registerData.competitor.phone_number)
            setGender(registerData.competitor.gender)
        }
        if(registerData.legal_tutor?.ci != null){
            setCiTutor(registerData.legal_tutor.ci+ '')
            setCiExpTutor(registerData.legal_tutor.ci_expedition)
            setNameTutor(registerData.legal_tutor.names)
            setLastNameTutor(registerData.legal_tutor.last_names)
            setBirthDateTutor(registerData.legal_tutor.birthdate)
            setEmailTutor(registerData.legal_tutor.email)
            setPhoneTutor(registerData.legal_tutor.phone_number)
            setGenderTutor(registerData.legal_tutor.gender)
        }
    }, []);

    const validate = () => {
        if (!name.trim()) return false;
        if (!lastName.trim()) return false;
        if (!email.trim()) return false;
        if (!phone.trim()) return false;

        if (!gender.trim()) return false;
        return true;
    }

    const onSearchStudent = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/search-student/${ci}`);
            setClickOnSerach(true)
            if(data.names){
                setFoundStudent(true)
                setHasFoundStudent(true)
                setCiExp(data.ci_expedition)
                setName(data.names)
                setLastName(data.last_names)
                setBirthDate(data.birthdate)
                setEmail(data.email)
                setPhone(data.phone_number)
                setGender(data.gender)
            }else {
                setFoundStudent(false)
                setHasFoundStudent(false)
                setCiExp("")
                setName("")
                setLastName("")
                setBirthDate("")
                setEmail("")
                setPhone("")
                setGender("")
            }
        } catch (err) {
            setFoundStudent(false)
            setHasFoundStudent(false)
            console.log(err)
        }
    };
    const onSearchTutor = async () => {
        try {
            const {data} = await axios.get(
                `${API_URL}/api/search-student/${ciTutor}`
            );
            console.log(data)
            setClickOnSearchTutor(true)
            setHasBeenQueried(true)
            if(data.names){
                setFoundTutor(true)
                setCiExpTutor(data.ci_expedition)
                setNameTutor(data.names)
                setLastNameTutor(data.last_names)
                setBirthDateTutor(data.birthdate)
                setEmailTutor(data.email)
                setPhoneTutor(data.phone_number)
                setGenderTutor(data.gender)
            }else {
                setFoundTutor(false)
                setCiExpTutor("")
                setNameTutor("")
                setLastNameTutor("")
                setBirthDateTutor("")
                setEmailTutor("")
                setPhoneTutor("")
                setGenderTutor("")
            }
        } catch (error) {
            setHasBeenQueried(true)
            setFoundTutor(false)
            setCiExpTutor("")
            setNameTutor("")
            setLastNameTutor("")
            setBirthDateTutor("")
            setEmailTutor("")
            setPhoneTutor("")
            setGenderTutor("")
        }
    };

    const submit = async () => {
        try {
            const {data} = await axios.post(
                `${API_URL}/api/inscription/olympic`, {
                    student: {
                        data: {
                            ci: ci,
                            ci_expedition: ciExp,
                            names: name,
                            last_names: lastName,
                            birthdate: birthDate,
                            email: email,
                            phone_number: phone,
                            gender: gender
                        },
                        course: selected
                    },
                    legal_tutor: {
                        ci: ciTutor,
                        ci_expedition: ciExpTutor,
                        names: nameTutor,
                        last_names: lastNameTutor,
                        birthdate: birthDateTutor,
                        email: emailTutor,
                        phone_number: phoneTutor,
                        gender: genderTutor
                    }
                }, {
                    headers: {
                        Identity: JSON.stringify(registerData.identity),
                        Step: 2
                    }
                }
            );
            setRegisterData({
                ...registerData,
                inscription_id: data.data.inscription.id,
                competitor: {
                    ...registerData.competitor,
                    ci: ci,
                    ci_expedition: ciExp,
                    names: name,
                    last_names: lastName,
                    birthdate: birthDate,
                    email: email,
                    phone_number: phone,
                    gender: gender
                },
                legal_tutor: {
                    ci: ciTutor,
                    ci_expedition: ciExpTutor,
                    names: nameTutor,
                    last_names: lastNameTutor,
                    birthdate: birthDateTutor,
                    email: emailTutor,
                    phone_number: phoneTutor,
                    gender: genderTutor
                }
            })
            console.log(data)
            stepsState.next()
        } catch (error) {
            alert(error.response.data.errors)
        }
    }


    return (
        <div className="container d-flex justify-content-center">
            <div className="card p-4">
                <span>Paso {stepsState.current} de {stepsState.total}</span>
                <ProgressBar
                    now={stepsState.progress * 100}
                    label={`${Math.round(stepsState.progress * 100)}%`}
                    animated
                    striped
                    variant="success"
                    style={{height: '1.5rem', fontSize: '0.9rem'}}
                />
                <h2 className="mb-3 mt-4">Paso 4: Registro de Estudiante para la
                    Olimpiada {registerData.olympic_name}</h2>
                <p className="text-muted mb-4">
                    Complete el siguiente formulario para registrar al estudiante en la
                    Olimpiada {registerData.olympic_name}. Por favor, asegúrese de ingresar correctamente los datos del
                    estudiante, incluyendo nombre completo, edad, institución educativa, y otros detalles requeridos.
                    Esta olimpiada tiene como objetivo promover la competencia sana entre los estudiantes. ¡Buena
                    suerte!
                </p>

                {/* Student Form */}
                <div className="mb-3">
                    <h3
                        className="mb-0"
                        onClick={() => setShowStudentForm(!showStudentForm)}
                        style={{cursor: 'pointer', userSelect: 'none'}}
                    >
                        Datos del Estudiante {showStudentForm ? '▼' : '▶'}
                    </h3>
                    <Collapse in={showStudentForm}>
                        <div>
                            <form>
                                <InputGroup className="mb-3">
                                    <div className="form-label w-100" style={{"webkit-appearance": "none"}}>Carnet de Identidad del estudiante:</div>
                                    <FormControl
                                        type="number"
                                        placeholder="Ingresa el carnet de identidad"
                                        aria-label="Carnet de identidad del estudiante"
                                        value={ci}
                                        onChange={e => setCi(e.target.value)}
                                    />

                                    <Button onClick={onSearchStudent} variant="outline-secondary">
                                        {foundStudent ? <Check size={16}/> : <Search size={16}/>}
                                    </Button>
                                </InputGroup>
                                {!hasFoundStudent && clickOnSerach ?
                                    <p className="text-danger">Carnet no encontrado, ingrese los datos
                                        manualmente.</p> : hasFoundStudent && clickOnSerach?
                                    <p className="text-success">Datos cargados correctamente.</p> : null
                                }
                                <div className="mb-3">
                                <label htmlFor="expStudent" className="form-label">Lugar de Expedición</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="expStudent"
                                        placeholder="Lugar de Expedición"
                                        value={ciExp}
                                        style={{textTransform: 'uppercase'}}
                                        onChange={e => setCiExp(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="nombreStudent" className="form-label">Nombres</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombreStudent"
                                        placeholder="Nombres"
                                        value={name}
                                        style={{textTransform: 'uppercase'}}
                                        onChange={e => setName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="apellidoStudent" className="form-label">Apellidos</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="apellidoStudent"
                                        placeholder="Apellidos"
                                        value={lastName}
                                        style={{textTransform: 'uppercase'}}
                                        onChange={e => setLastName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="fechaNacimientoStudent" className="form-label">Fecha de Nacimiento
                                        del estudiante</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fechaNacimientoStudent"
                                        value={birthDate}
                                        max={new Date().toLocaleDateString('en-CA')}
                                        onChange={e => setBirthDate(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="correoStudent" className="form-label">Correo electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="correoStudent"
                                        placeholder="ejemplo@correo.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="telefonoStudent" className="form-label">Teléfono</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="telefonoStudent"
                                        placeholder="+591 70000000"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="generoStudent" className="form-label">Género</label>
                                    <select
                                        className="form-select"
                                        id="generoStudent"
                                        value={gender}
                                        onChange={e => setGender(e.target.value)}
                                    >
                                        <option value="">Selecciona una opción</option>
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
                    <h3
                        className="mb-0"
                        onClick={() => setShowTutorForm(!showTutorForm)}
                        style={{cursor: 'pointer', userSelect: 'none'}}
                    >
                        Datos del Tutor {showTutorForm ? '▼' : '▶'}
                    </h3>
                    <Collapse in={showTutorForm}>
                        <div>
                            <form>
                                <InputGroup className="mb-3">
                                    <div className="form-label w-100">Carnet de identidad del tutor</div>
                                    <FormControl
                                        type="number"
                                        placeholder="Ingresa el carnet de identidad"
                                        aria-label="Carnet de identidad del tutor"
                                        value={ciTutor}
                                        onChange={e => setCiTutor(e.target.value)}
                                    />
                                    <Button onClick={onSearchTutor} variant="outline-secondary">
                                        {foundTutor ? <Check size={16}/> : <Search size={16}/>}
                                    </Button>
                                </InputGroup>
                                {!foundTutor && clickOnSearchTutor ?
                                    <p className="text-danger">Carnet no encontrado, ingrese los datos
                                        manualmente.</p> : foundTutor && clickOnSearchTutor?
                                        <p className="text-success">Datos cargados correctamente.</p> : null
                                }
                                <div className="mb-3">
                                    <label htmlFor="expTutor" className="form-label">Lugar de Expedición</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="expTutor"
                                        placeholder="Lugar de Expedición"
                                        value={ciExpTutor}
                                        style={{textTransform: 'uppercase'}}
                                        onChange={e => setCiExpTutor(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="nombreTutor" className="form-label">Nombres</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombreTutor"
                                        placeholder="Nombres"
                                        value={nameTutor}
                                        style={{textTransform: 'uppercase'}}
                                        onChange={e => setNameTutor(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="apellidoTutor" className="form-label">Apellidos</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="apellidoTutor"
                                        placeholder="Apellidos"
                                        value={lastNameTutor}
                                        style={{textTransform: 'uppercase'}}
                                        onChange={e => setLastNameTutor(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="fechaNacimientoTutor" className="form-label">Fecha de
                                        Nacimiento</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fechaNacimientoTutor"
                                        value={birthDateTutor}
                                        max={new Date().toLocaleDateString('en-CA')}
                                        onChange={e => setBirthDateTutor(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="correoTutor" className="form-label">Correo electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="correoTutor"
                                        placeholder="ejemplo@correo.com"
                                        value={emailTutor}
                                        onChange={e => setEmailTutor(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="telefonoTutor" className="form-label">Teléfono</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="telefonoTutor"
                                        placeholder="+591 70000000"
                                        value={phoneTutor}
                                        onChange={e => setPhoneTutor(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="generoTutor" className="form-label">Género</label>
                                    <select
                                        className="form-select"
                                        id="generoTutor"
                                        value={genderTutor}
                                        onChange={e => setGenderTutor(e.target.value)}
                                    >
                                        <option value="">Selecciona una opción</option>
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
                        onClick={stepsState.prev}
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
    )
}
