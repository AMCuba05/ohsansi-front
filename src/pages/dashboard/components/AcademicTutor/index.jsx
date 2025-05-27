import React, {useState} from 'react';
import { useSteps } from 'react-step-builder';
import { FormControl, ProgressBar } from 'react-bootstrap';
import { Button, InputGroup } from 'reactstrap';

export const AcademicTutor = ({ academicTutorData, setAcademicTutorData }) => {
    const stepsState = useSteps();
    const [tempData, setTempData] = useState({
        ci: '',
        ci_expedition: '',
        names: '',
        last_names: '',
        birthdate: '',
        email: '',
        phone_number: '',
    });

    const handleInputChange = (field, value) => {
        setTempData({
            ...tempData,
            [field]: value,
        });
    };

    const validate = () => {
        if (!tempData.names?.trim()) return false;
        if (!tempData.last_names?.trim()) return false;
        if (!tempData.email?.trim()) return false;
        if (!tempData.phone_number?.trim()) return false;
        if (!tempData.ci?.trim()) return false;
        return true;
    };

    const submit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Ensure ci is converted to a number, if required by the backend
            setAcademicTutorData({
                ...tempData,
                ci: Number(tempData.ci) || tempData.ci,
            });
        }
    };

    return (
        <div className="container d-flex justify-content-center">
            <div className="card p-4">
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
                            value={tempData.ci || ''}
                            onChange={(e) => handleInputChange('ci', e.target.value)}
                        />
                    </InputGroup>
                    <div className="mb-3">
                        <label htmlFor="exp" className="form-label">Lugar de Expedición</label>
                        <input
                            type="text"
                            className="form-control"
                            id="exp"
                            placeholder="Lugar de Expedición"
                            value={tempData.ci_expedition || ''}
                            style={{ textTransform: 'uppercase' }}
                            onChange={(e) => handleInputChange('ci_expedition', e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombres</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nombre"
                            placeholder="Nombres"
                            value={tempData.names || ''}
                            style={{ textTransform: 'uppercase' }}
                            onChange={(e) => handleInputChange('names', e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="apellido" className="form-label">Apellidos</label>
                        <input
                            type="text"
                            className="form-control"
                            id="apellido"
                            placeholder="Apellidos"
                            value={tempData.last_names || ''}
                            style={{ textTransform: 'uppercase' }}
                            onChange={(e) => handleInputChange('last_names', e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento</label>
                        <input
                            type="date"
                            className="form-control"
                            id="fechaNacimiento"
                            value={tempData.birthdate || ''}
                            onChange={(e) => handleInputChange('birthdate', e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="correo" className="form-label">Correo electrónico</label>
                        <input
                            type="email"
                            className="form-control"
                            id="correo"
                            placeholder="ejemplo@correo.com"
                            value={tempData.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="telefono" className="form-label">Teléfono</label>
                        <input
                            type="tel"
                            className="form-control"
                            id="telefono"
                            placeholder="+591 70000000"
                            value={tempData.phone_number || ''}
                            onChange={(e) => handleInputChange('phone_number', e.target.value)}
                        />
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-primary w-100"
                            onClick={submit}
                        >
                            Guardar
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};
