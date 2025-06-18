import React, { useState } from 'react';
import { useSteps } from 'react-step-builder';
import { FormControl, ProgressBar } from 'react-bootstrap';
import { Search, Check, X } from 'lucide-react';
import { Button, InputGroup } from 'reactstrap';
import axios from 'axios';
import { useRegisterContext } from '../../../../Context/RegisterContext.jsx';
import { API_URL } from '../../../../Constants/Utils.js';

export const RecoverSessionStep = () => {
    const stepsState = useSteps();
    const { registerData, setRegisterData } = useRegisterContext();
    const [found, setFound] = useState(false);
    const [hasBeenQueried, setHasBeenQueried] = useState(false);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [ci, setCi] = useState('');
    const [ciExp, setCiExp] = useState('');
    const [birthDate, setBirthDate] = useState('');

    const validate = () => {
        if (!birthDate.trim()) return false;
        if (!ci.trim()) return false;
        return true;
    };

    const getInscriptionForm = async () => {
        try {
            const { data } = await axios.get(
                `${API_URL}/api/inscription/form?ci=${ci}&birthdate=${birthDate}&olympicId=${registerData.olympic_id}&type=single`,
            );
            if (data.data.step != null) {
                if (data.data.step == 1) {
                    setRegisterData({
                        ...registerData,
                        identity: {
                            ci: ci,
                            birthdate: birthDate,
                            olympicId: registerData.olympic_id,
                        },
                        olympiad: {
                            id: registerData.olympic_id,
                            price: data.data.olympiad.price,
                        },
                        competitor: {
                            school_data: {
                                name: data.data.inscription.school.name,
                                department:
                                    data.data.inscription.school.department,
                                province: data.data.inscription.school.province,
                            },
                        },
                    });
                } else if (data.data.step == 2) {
                    // nothing to do here yet
                } else if (data.data.step == 3) {
                    setRegisterData({
                        ...registerData,
                        identity: {
                            ci: ci,
                            birthdate: birthDate,
                            olympicId: registerData.olympic_id,
                        },
                        olympiad: {
                            id: registerData.olympic_id,
                            price: data.data.olympiad.price,
                        },
                        competitor: {
                            ci: data.data.inscription.competitor_data.ci,
                            ci_expedition:
                                data.data.inscription.competitor_data
                                    .ci_expedition,
                            names: data.data.inscription.competitor_data.names,
                            last_names:
                                data.data.inscription.competitor_data
                                    .last_names,
                            birthdate:
                                data.data.inscription.competitor_data.birthdate,
                            email: data.data.inscription.competitor_data.email,
                            gender: data.data.inscription.competitor_data
                                .gender,
                            phone_number:
                                data.data.inscription.competitor_data
                                    .phone_number,
                            school_data: {
                                name: data.data.inscription.school.name,
                                department:
                                    data.data.inscription.school.department,
                                province: data.data.inscription.school.province,
                            },
                            selected_areas:
                                data.data.inscription.selected_areas.map(
                                    (area) => ({
                                        data: {
                                            area_id: area.area_id,
                                            category_id: area.category_id,
                                        },
                                    }),
                                ),
                        },
                        legal_tutor:
                            data.data.inscription.legal_tutor.personal_data,
                    });
                }

                stepsState.next();
            } else {
                setRegisterData({
                    ...registerData,
                    identity: {
                        ci: ci,
                        birthdate: birthDate,
                        olympicId: registerData.olympic_id,
                    },
                    olympiad: {
                        id: registerData.olympic_id,
                        price: data.data.olympiad.price,
                    },
                });
                stepsState.next();
            }
            if (data.data.is_accountable) {
                //stepsState.jump(8)
            } else {
                //stepsState.next()
            }
        } catch (error) {
            console.log('gary fue atrapado');
            setHasBeenQueried(true);
            setFound(false);
            setName('');
            setLastName('');
            setCiExp('');
            setEmail('');
            setPhone('');
            setRegisterData({
                ...registerData,
                identity: {
                    ci: ci,
                    birthdate: birthDate,
                    olympicId: registerData.olympic_id,
                },
                olympiad: {
                    id: registerData.olympic_id,
                    price: registerData.olympic_price,
                },
            });
            stepsState.next();
        }
    };

    const onSearchStudent = async () => {
        try {
            const { data } = await axios.post(
                `${API_URL}/api/olympiads/${registerData.olympic_id}/inscriptions/init`,
                {
                    ci: Number(ci),
                    birthdate: birthDate,
                },
            );
            console.log(ci, birthDate);
            console.log(data);
            if (Object.keys(data).length === 0) {
                setFound(false);
            } else {
                setFound(true);
                setName(data.names);
                setLastName(data.last_names);
                setCiExp(data.ci_expedition);
                setBirthDate(data.birthdate);
                setEmail(data.email);
                setPhone(data.phone_number);
            }
            if (data.data.is_accountable) {
                stepsState.jump(8);
            } else {
                stepsState.next();
            }
        } catch (error) {
            setHasBeenQueried(true);
            setFound(false);
            setName('');
            setLastName('');
            setCiExp('');
            setEmail('');
            setPhone('');
            stepsState.next();
        }
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
                    Paso 2: <strong>{registerData.olympic_name}</strong> <br />{' '}
                    Ingresa sus datos para iniciar o continuar con el proceso de
                    inscripción
                </h2>
                <p className="text-muted mb-4" style={{ fontSize: '1rem' }}>
                    Ingrese sus datos personales para iniciar con el proceso de
                    inscripción o retormarlo donde lo dejo previamente. <br />
                    Si usted en un tutor o responsable de pago de una
                    inscripción, puede ingresar su <strong>CI</strong> y{' '}
                    <strong>fecha de nacimiento</strong> para visualizar la
                    información de las inscripciones a la que esté asociado.
                </p>

                <form>
                    <InputGroup className="mb-3">
                        <div className="form-label w-100">
                            Carnet de Identidad:
                        </div>
                        <FormControl
                            type="text"
                            placeholder="Ingresa el carnet de identidad"
                            aria-label="Carnet de identidad del tutor"
                            value={ci}
                            onChange={(e) => setCi(e.target.value)}
                        />
                    </InputGroup>
                    <div className="mb-3">
                        <label htmlFor="fechaNacimiento" className="form-label">
                            Fecha de Nacimiento
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            id="fechaNacimiento"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
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
                            onClick={async () => await getInscriptionForm()}
                        >
                            Siguiente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
