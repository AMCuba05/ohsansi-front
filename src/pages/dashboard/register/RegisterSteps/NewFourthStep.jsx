import axios from 'axios';
import { Check, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FormControl, ProgressBar } from 'react-bootstrap';
import { useSteps } from 'react-step-builder';
import { Button, InputGroup } from 'reactstrap';
import { states } from '../../../../Constants/Provincies.js';
import { API_URL } from '../../../../Constants/Utils.js';
import { useRegisterContext } from '../../../../Context/RegisterContext.js';

const UserRoles = Object.freeze({
    COMPETITOR: 'competitor',
    LEGAL_TUTOR: 'legal_tutor',
    ACCOUNTABLE: 'accountable',
});

export const NewFourthStep = () => {
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

    const stepsState = useSteps();
    const { registerData, setRegisterData } = useRegisterContext();
    const [name, setName] = useState(registerData.responsable?.names ?? '');
    const [gender, setGender] = useState(
        registerData.responsable?.gender ?? '',
    );
    const [lastName, setLastName] = useState(
        registerData.responsable?.last_names ?? '',
    );
    const [email, setEmail] = useState(registerData.responsable?.email ?? '');
    const [phone, setPhone] = useState(
        registerData.responsable?.phone_number ?? '',
    );
    const [ci, setCi] = useState(registerData.responsable?.ci ?? '');
    const [ciExp, setCiExp] = useState(
        registerData.responsable?.ci_expedition ?? '',
    );
    const [birthDate, setBirthDate] = useState(
        registerData.responsable?.birthdate ?? '',
    );
    const [clickOnSearch, setClickOnSearch] = useState(false);
    const [foundAccountable, setFoundAccountable] = useState(false);
    const [blockForm, setBlockForm] = useState(false);
    const [blockCiField] = useState(!!registerData.responsable?.ci);
    const [blockBirthDateField] = useState(
        !!registerData.responsable?.birthdate,
    );

    useEffect(() => {
        if (!registerData.responsable) return;
        setBlockForm(
            Object.values(registerData.responsable).every((value) => !!value),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validate = () => {
        if (!name.trim()) return false;
        if (!lastName.trim()) return false;
        if (!email.trim()) return false;
        if (!phone.trim()) return false;
        if (!String(ci).trim()) return false;

        return true;
    };

    const storeAccountable = async () => {
        if (blockForm) return stepsState.next();

        const { olympic_id, inscription_id } = registerData;
        const url = `${API_URL}/api/olympiads/${olympic_id}/inscriptions/${inscription_id}/accountables`;
        const payload = {
            ci: ci,
            ci_expedition: ciExp,
            names: name,
            last_names: lastName,
            birthdate: birthDate,
            email: email,
            phone_number: phone,
            gender: gender,
        };

        const response = await axios
            .post(url, payload)
            .catch((err) => err.response);

        if (response && response.status !== 201) {
            alert(response.data.errors.details);
            return;
        }

        setRegisterData({
            ...registerData,
            responsable: {
                ci: ci,
                ci_expedition: ciExp,
                names: name,
                last_names: lastName,
                birthdate: birthDate,
                email: email,
                phone_number: phone,
            },
            boleta: response.data.data.boleta,
        });
        alert('La pre inscripcion se ha realizado con exito');
        setBlockForm(true);
        stepsState.next();
    };

    const onSearchAccountable = async () => {
        try {
            const { data } = await axios.get(
                `${API_URL}/api/search-student/${ci}`,
            );
            setClickOnSearch(true);
            if (data.names) {
                setFoundAccountable(true);
                setCiExp(data.ci_expedition);
                setName(data.names);
                setLastName(data.last_names);
                setBirthDate(data.birthdate);
                setEmail(data.email);
                setPhone(data.phone_number);
                setGender(data.gender);
            } else {
                setFoundAccountable(false);
                setCiExp('');
                setName('');
                setLastName('');
                setBirthDate('');
                setEmail('');
                setPhone('');
                setGender('');
            }
        } catch (err) {
            setFoundAccountable(false);
            console.log(err);
        }
    };

    const handleTutorSwitchChange = (e) => {
        const { value } = e.target;
        let data = emptyUserData;
        switch (value) {
            case UserRoles.COMPETITOR:
                data = registerData.competitor;
                break;
            case UserRoles.LEGAL_TUTOR:
                data = registerData.legal_tutor;
                break;
            case UserRoles.ACCOUNTABLE:
                data = registerData.accountable;
                break;
            default:
                break;
        }
        setCi(data.ci);
        setCiExp(data.ci_expedition);
        setName(data.names);
        setLastName(data.last_names);
        setBirthDate(data.birthdate);
        setEmail(data.email);
        setPhone(data.phone_number);
        setGender(data.gender);
    };

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
                <h2 className="mb-3 mt-4">
                    Paso {stepsState.current}: Información del responsable de pago
                </h2>
                <p className="text-muted mb-4">
                    Puedes registrar un tutor académico que apoye al estudiante
                    durante la olimpiada. Esta información es opcional
                </p>

                <div className="d-flex justify-content-between align-items-top mb-2">
                    <h3 className="mb-0 w-50">Datos del Responsable de pago</h3>
                    {!registerData.responsable && (
                        <div className="mb-3">
                            <label
                                htmlFor="responsableSwitch"
                                className="form-label"
                            >
                                Quien realizará el pago?
                            </label>
                            <select
                                className="form-select"
                                id="responsableSwitch"
                                onChange={handleTutorSwitchChange}
                            >
                                <option value="">
                                    Registrar a un Responsable
                                </option>
                                <option value={UserRoles.COMPETITOR}>
                                    El Competidor
                                </option>
                                <option value={UserRoles.LEGAL_TUTOR}>
                                    El Tutor legal
                                </option>
                            </select>
                        </div>
                    )}
                </div>
                <form>
                    <InputGroup className="mb-3">
                        <div className="form-label w-100">
                            Carnet de identidad del responsable
                        </div>
                        <FormControl
                            disabled={blockForm || blockCiField}
                            type="number"
                            placeholder="Ingresa el carnet de identidad"
                            aria-label="Carnet de identidad del tutor"
                            value={ci}
                            onChange={(e) => setCi(e.target.value)}
                        />
                        <Button
                            disabled={blockForm || blockCiField}
                            onClick={onSearchAccountable}
                            variant="outline-secondary"
                        >
                            {foundAccountable ? (
                                <Check size={16} />
                            ) : (
                                <Search size={16} />
                            )}
                        </Button>
                    </InputGroup>
                    {!foundAccountable && clickOnSearch ? (
                        <p className="text-danger">
                            Carnet no encontrado, ingrese los datos manualmente.
                        </p>
                    ) : foundAccountable && clickOnSearch ? (
                        <p className="text-success">
                            Datos cargados correctamente.
                        </p>
                    ) : null}
                    <div className="mb-3">
                        <label htmlFor="exp" className="form-label">
                            Lugar de Expedición
                        </label>
                        <select
                            disabled={blockForm}
                            className="form-select"
                            id="exp"
                            value={ciExp}
                            onChange={(e) => setCiExp(e.target.value)}
                        >
                            <option value="">Seleccionar Departamento</option>
                            {states.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">
                            Nombres
                        </label>
                        <input
                            disabled={blockForm}
                            type="text"
                            className="form-control"
                            id="nombre"
                            placeholder="Nombres"
                            value={name}
                            style={{ textTransform: 'uppercase' }}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="apellido" className="form-label">
                            Apellidos
                        </label>
                        <input
                            disabled={blockForm}
                            type="text"
                            className="form-control"
                            id="apellido"
                            placeholder="Apellidos"
                            value={lastName}
                            style={{ textTransform: 'uppercase' }}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="fechaNacimiento" className="form-label">
                            Fecha de Nacimiento
                        </label>
                        <input
                            disabled={blockForm || blockBirthDateField}
                            type="date"
                            className="form-control"
                            id="fechaNacimiento"
                            value={birthDate}
                            max={new Date().toLocaleDateString('en-CA')}
                            onChange={(e) => setBirthDate(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="correo" className="form-label">
                            Correo electrónico
                        </label>
                        <input
                            disabled={blockForm}
                            type="email"
                            className="form-control"
                            id="correo"
                            placeholder="ejemplo@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="telefono" className="form-label">
                            Teléfono
                        </label>
                        <input
                            disabled={blockForm}
                            type="number"
                            className="form-control"
                            id="telefono"
                            placeholder="+591 70000000"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="genero" className="form-label">
                            Género
                        </label>
                        <select
                            disabled={blockForm}
                            className="form-select"
                            id="genero"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
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
                            disabled={!validate()}
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
    );
};
