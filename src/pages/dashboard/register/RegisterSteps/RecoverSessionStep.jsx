import axios from 'axios';
import { useState } from 'react';
import { FormControl, ProgressBar } from 'react-bootstrap';
import { useSteps } from 'react-step-builder';
import { InputGroup } from 'reactstrap';
import { API_URL } from '../../../../Constants/Utils.js';
import { useRegisterContext } from '../../../../Context/RegisterContext.js';
import { AwardIcon } from 'lucide-react';

const UserRoles = Object.freeze({
    COMPETITOR: 'competitor',
    LEGAL_TUTOR: 'legal_tutor',
    ACCOUNTABLE: 'accountable',
});

export const RecoverSessionStep = () => {
    const stepsState = useSteps();
    const { registerData, setRegisterData } = useRegisterContext();
    const [ci, setCi] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [userRole, setUserRole] = useState(UserRoles.COMPETITOR);

    const [inscriptions, setInscriptions] = useState([]);
    const [selectedInscription, setSelectedInscription] = useState(null);

    const validate = () => {
        return Boolean(ci.trim() && birthDate.trim() && userRole.trim());
    };

    const saveInitialUserInfo = (personalData) => {
        const registerDataToSave = { ...registerData };
        switch (userRole) {
            case UserRoles.COMPETITOR:
                registerDataToSave.competitor = personalData;
                break;
            case UserRoles.LEGAL_TUTOR:
                registerDataToSave.legal_tutor = personalData;
                break;
            case UserRoles.ACCOUNTABLE:
                registerDataToSave.responsable = personalData;
                break;
            default:
                throw new Error('Invalid user role');
        }
        return registerDataToSave;
    };

    const recoverInfo = async () => {
        const url = `${API_URL}/api/olympiads/${registerData.olympic_id}/inscriptions/init`;
        const response = await axios
            .post(url, { ci, birthdate: birthDate })
            .catch((err) => err.response);

        if (response.status !== 200) {
            return {
                personalData: {
                    ci,
                    ci_expedition: '',
                    names: '',
                    last_names: '',
                    birthdate: birthDate,
                    email: '',
                    phone_number: '',
                    gender: '',
                },
                userRole,
            };
        }

        const {
            inscriptions,
            inscription,
            is_accountable,
            is_competitor,
            is_tutor,
            is_teacher: _,
            ...personalData
        } = response.data.data;

        return {
            personalData,
            inscription,
            inscriptions,
            userRole: is_tutor
                ? UserRoles.LEGAL_TUTOR
                : is_accountable
                ? UserRoles.ACCOUNTABLE
                : is_competitor
                ? UserRoles.COMPETITOR
                : null,
        };
    };

    const getInscriptionForm = async () => {
        const {
            personalData,
            inscription,
            inscriptions,
            userRole: role,
        } = await recoverInfo();
        setUserRole(role);
        const initialUserInfo = saveInitialUserInfo(personalData);

        if (role !== UserRoles.COMPETITOR && inscriptions?.length > 0) {
            setInscriptions(inscriptions);
            const inscriptionModal =
                document.getElementById('inscriptionsModal');
            if (inscriptionModal) {
                inscriptionModal.style.display = 'block';
            }
            return;
        }

        onOkModal({ inscriptionData: inscription, initialUserInfo });
    };

    const onCloseModal = () => {
        const inscriptionModal = document.getElementById('inscriptionsModal');
        if (inscriptionModal) {
            inscriptionModal.style.display = 'none';
        }
    };

    const onOkModal = ({ inscriptionData, initialUserInfo }) => {
        initialUserInfo = initialUserInfo ?? {};
        const inscription = selectedInscription ?? inscriptionData ?? {};

        const competitor = inscription.competitor_data
            ? { ...inscription.competitor_data, ...initialUserInfo.competitor }
            : initialUserInfo.competitor;

        const legal_tutor = inscription.legal_tutor?.personal_data
            ? {
                  ...inscription.legal_tutor.personal_data,
                  ...initialUserInfo.legal_tutor,
              }
            : initialUserInfo.legal_tutor;

        const responsable = inscription.accountable?.personal_data
            ? {
                  ...inscription.accountable.personal_data,
                  ...initialUserInfo.responsable,
              }
            : initialUserInfo.responsable;

        if (inscription.school) {
            competitor.school_data = inscription.school;
            competitor.school_data.course = inscription.course;
        }
        if (inscription.selected_areas) {
            competitor.selected_areas = inscription.selected_areas.map(
                (selectedAreas) => {
                    const {
                        id: _,
                        ci: teacherCI,
                        ...academic_tutor
                    } = selectedAreas.teacher?.personal_data ?? {};
                    return {
                        area_id: selectedAreas.area_id,
                        category_id: selectedAreas.category_id,
                        academic_tutor: teacherCI
                            ? {
                                  ...academic_tutor,
                                  ci: String(teacherCI),
                              }
                            : null,
                    };
                },
            );
        }

        setRegisterData({
            ...registerData,
            competitor,
            legal_tutor,
            responsable,
            boleta: inscription.boleta_de_pago,
            inscription_id: inscription.id,
        });
        stepsState.next();
    };

    return (
        <>
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
                        Paso 2: <strong>{registerData.olympic_name}</strong>{' '}
                        <br /> Ingresa sus datos para iniciar o continuar con el
                        proceso de inscripción
                    </h2>
                    <p className="text-muted mb-4" style={{ fontSize: '1rem' }}>
                        Ingrese sus datos personales para iniciar con el proceso
                        de inscripción o retormarlo donde lo dejo previamente.{' '}
                        <br />
                        Si usted en un tutor o responsable de pago de una
                        inscripción, puede ingresar su <strong>
                            CI
                        </strong> y <strong>fecha de nacimiento</strong> para
                        visualizar la información de las inscripciones a la que
                        esté asociado.
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
                            <label
                                htmlFor="fechaNacimiento"
                                className="form-label"
                            >
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

                        <div className="mb-3">
                            <label htmlFor="soy" className="form-label">
                                Soy:
                            </label>
                            <select
                                className="form-select"
                                id="soy"
                                value={userRole}
                                onChange={(e) => setUserRole(e.target.value)}
                            >
                                <option value={UserRoles.COMPETITOR}>
                                    Competidor
                                </option>
                                <option value={UserRoles.LEGAL_TUTOR}>
                                    Tutor legal
                                </option>
                                <option value={UserRoles.ACCOUNTABLE}>
                                    Responsable de pago
                                </option>
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
                                disabled={!stepsState.hasNext || !validate()}
                                type="button"
                                className="btn btn-primary w-50"
                                data-bs-toggle="modal"
                                onClick={async () => await getInscriptionForm()}
                            >
                                Siguiente
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div
                className="modal fade show"
                id="inscriptionsModal"
                tabindex="-1"
                aria-labelledby="inscriptionsModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className="modal-title"
                                id="inscriptionsModalLabel"
                            >
                                Selecciona la inscripcción a continuar
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={onCloseModal}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p className="text-center">
                                Encontramos {inscriptions.length} inscripciones
                                pendientes para ti, ¿cuál deseas continuar?
                            </p>
                            <form>
                                <div className="mb-3">
                                    <label
                                        for="inscriptionId"
                                        className="col-form-label"
                                    >
                                        Selecciona al competidor que deseas
                                        continuar:
                                    </label>
                                    <select
                                        className="form-select"
                                        id="inscriptionId"
                                        value={inscriptions.indexOf(
                                            selectedInscription,
                                        )}
                                        onChange={(e) => {
                                            setSelectedInscription(
                                                inscriptions[e.target.value],
                                            );
                                        }}
                                    >
                                        <option value="">
                                            Selecciona una opción
                                        </option>
                                        {inscriptions.map(
                                            (inscription, index) => (
                                                <option
                                                    key={inscription.id}
                                                    value={index}
                                                >
                                                    {inscription.competitor_data
                                                        .ci == ci
                                                        ? `Yo mi mismo - CI: ${inscription.competitor_data.ci}`
                                                        : `${inscription.competitor_data.last_names} ${inscription.competitor_data.names} - CI: ${inscription.competitor_data.ci}`}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-secondary"
                                onClick={onCloseModal}
                            >
                                Close
                            </button>
                            <button
                                disabled={!selectedInscription}
                                type="button"
                                class="btn btn-primary"
                                onClick={onOkModal}
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
