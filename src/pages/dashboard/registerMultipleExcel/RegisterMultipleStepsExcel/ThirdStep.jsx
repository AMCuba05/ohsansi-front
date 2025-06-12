import React, { useState } from 'react';
import { useSteps } from 'react-step-builder';
import { FormControl, ProgressBar, InputGroup, Button } from 'react-bootstrap';
import { useRegisterContext } from "../../../../Context/RegisterContext.jsx";
import * as XLSX from "xlsx";
import { Search, Check, X } from 'lucide-react';
import axios from 'axios';
import {API_URL} from "../../../../Constants/Utils.js";

export const ThirdStep = () => {
    const stepsState = useSteps();
    const { registerData, setRegisterData } = useRegisterContext();

    // Excel upload states
    const [fileName, setFileName] = useState('');
    const [excelError, setExcelError] = useState('');
    const [excelSuccess, setExcelSuccess] = useState(false);
    const [excelFile, setExcelFile] = useState(null);

    // Accountable states
    const [ci, setCi] = useState('');
    const [ciExp, setCiExp] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [foundAccountable, setFoundAccountable] = useState(false);
    const [clickOnSearch, setClickOnSearch] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setExcelFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet);

            if (data.length === 0) {
                setExcelError('El archivo está vacío o mal formado.');
                return;
            }
            setExcelSuccess(true);
        };
        reader.readAsBinaryString(file);
    };

    const onSearchAccountable = async () => {
        setClickOnSearch(true);
        try {
            // Assuming an API endpoint to search for accountable
            const response = await axios.get(`${API_URL}/api/search-student/${ci}`)
            if (response.data) {
                setCiExp(response.data.ci_expedition || '');
                setName(response.data.names || '');
                setLastName(response.data.last_names || '');
                setBirthDate(response.data.birthdate || '');
                setEmail(response.data.email || '');
                setPhone(response.data.phone_number || '');
                setGender(response.data.gender || '');
                setFoundAccountable(true);
            } else {
                setFoundAccountable(false);
            }
        } catch (error) {
            setFoundAccountable(false);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/inscription/excel/olympic/${registerData.olympic_id}`,
                { responseType: 'blob' }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'plantilla_estudiante.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            setExcelError('Error al descargar la plantilla');
        }
    };

    const handleSubmit = async () => {
        if (!excelSuccess) {
            setExcelError('Debe subir un archivo Excel válido primero');
            return;
        }

        const formData = new FormData();
        formData.append('file', excelFile);
        formData.append('schoolName', registerData.competitor.school_data.name);
        formData.append('schoolDepartment', registerData.competitor.school_data.department);
        formData.append('schoolProvince', registerData.competitor.school_data.province);
        formData.append('olympiadId', registerData.olympic_id);
        formData.append('accountableCi', ci || '');
        formData.append('accountableBirthdate', birthDate || '');
        formData.append('accountableCiExpedition', ciExp || '');
        formData.append('accountableNames', name || '');
        formData.append('accountableLastNames', lastName || '');
        formData.append('accountableEmail', email || '');
        formData.append('accountablePhoneNumber', phone || '');
        formData.append('accountableGender', gender || '');

        try {
            const response = await axios.post(
                `${API_URL}/inscription/olympic/excel`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
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
            });
            stepsState.next();
        } catch (error) {
            setExcelError('Error al enviar los datos');
        }
    };

    return (
        <div className="container d-flex justify-content-center">
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

                <h2 className="mb-3 mt-4">Paso 4: Subir datos de los estudiante</h2>
                <p className="text-muted mb-4">
                    Descarga la plantilla, complétala y súbela aquí.
                </p>

                <div className="mb-3">
                    <a
                        onClick={handleDownloadTemplate}
                        className="btn btn-outline-primary"
                    >
                        Descargar plantilla Excel
                    </a>
                </div>

                <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">Sube tu archivo Excel</label>
                    <input
                        className="form-control"
                        type="file"
                        accept=".xlsx, .xls"
                        id="formFile"
                        onChange={handleFileUpload}
                    />
                </div>

                {fileName && <p className="text-success">Archivo cargado: {fileName}</p>}
                {excelError && <p className="text-danger">{excelError}</p>}

                {/* Accountable Section */}
                <h2 className="mb-3 mt-4">Paso 5: Información del responsable de pago</h2>
                <p className="text-muted mb-4">
                    Puedes registrar un tutor académico que apoye al estudiante durante la olimpiada. Esta información es opcional
                </p>

                <InputGroup className="mb-3">
                    <div className="form-label w-100">Carnet de identidad del responsable</div>
                    <FormControl
                        type="number"
                        placeholder="Ingresa el carnet de identidad"
                        value={ci}
                        onChange={e => setCi(e.target.value)}
                    />
                    <Button onClick={onSearchAccountable} variant="outline-secondary">
                        {foundAccountable ? <Check size={16}/> : <Search size={16}/>}
                    </Button>
                </InputGroup>
                {!foundAccountable && clickOnSearch ?
                    <p className="text-danger">Carnet no encontrado, ingrese los datos manualmente.</p> :
                    foundAccountable && clickOnSearch ?
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
                        type="button"
                        className="btn btn-primary w-50"
                        onClick={handleSubmit}
                        disabled={!excelSuccess}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};