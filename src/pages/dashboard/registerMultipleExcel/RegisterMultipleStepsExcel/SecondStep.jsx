import React, { useState } from 'react';
import { useSteps } from 'react-step-builder';
import { ProgressBar } from 'react-bootstrap';
import { useRegisterContext } from '../../../../Context/RegisterContext.jsx';
import * as XLSX from 'xlsx';

export const SecondStep = () => {
    const stepsState = useSteps();
    const { registerData, setRegisterData } = useRegisterContext();

    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet);

            if (data.length === 0) {
                setError('El archivo está vacío o mal formado.');
                return;
            }

            const student = data[0];
            if (!student.ci || !student.names) {
                setError('El archivo no contiene los campos necesarios.');
                return;
            }

            setRegisterData({
                ...registerData,
                competitor: {
                    ci: Number(student.ci),
                    ci_expedition: student.ci_expedition || '',
                    names: student.names || '',
                    last_names: student.last_names || '',
                    birthdate: student.birthdate || '',
                    email: student.email || '',
                    phone_number: student.phone_number || '',
                }
            });

            setFileName(file.name);
            setError('');
            setSuccess(true);
        };
        reader.readAsBinaryString(file);
    };

    const handleNext = () => {
        if (success) {
            stepsState.next();
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
                <h2 className="mb-3 mt-4">Paso 2: Subir datos del estudiante</h2>

                <p className="text-muted mb-4">
                    Descarga la plantilla, complétala y súbela aquí.
                </p>

                <div className="mb-3">
                    <a
                        href="../../../../Constants/plantilla_estudiante.xlsx"
                        download
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
                {error && <p className="text-danger">{error}</p>}

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
                        disabled={!stepsState.hasNext || !success}
                        type="button"
                        className="btn btn-primary w-50"
                        onClick={handleNext}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};
export default SecondStep;