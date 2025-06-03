import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import OCR6DigitVerifier from "../components/OCRComponent/OCR6DigitVerifier.jsx";

const Payment = () => {
    const [ci, setCi] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [boletas, setBoletas] = useState([]);
    const [comprobantes, setComprobantes] = useState({});

    const buscarBoletas = () => {
        // Simulación: aquí iría una llamada al backend
        const resultados = [
            { id: 1, nombre: "Juan Pérez", status: "pendiente", curso: "Matemáticas" },
            { id: 2, nombre: "Juan Pérez", status: "pendiente", curso: "Física" },
        ];
        setBoletas(resultados);
    };

    const manejarArchivo = (id, archivo) => {
        setComprobantes(prev => ({ ...prev, [id]: archivo }));
    };

    const subirComprobante = (id) => {
        const archivo = comprobantes[id];
        if (!archivo) {
            alert("Por favor selecciona un archivo antes de subir.");
            return;
        }

        // Aquí iría la lógica real para subir el archivo
        console.log(`Subiendo comprobante para boleta ${id}:`, archivo);
        alert("Comprobante subido correctamente (simulado).");
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Subir Comprobante de Pago</h2>
            <div className="container mt-5">
                <h2>Selecciona una foto o captura del comprobante de pago</h2>
                <p>Asegúrate que el número de la orden de pago sea visible en la foto</p>
                <OCR6DigitVerifier targetNumber={'408846'} />
            </div>
            <div className="mb-3 row">
                <div className="col-md-6">
                    <label htmlFor="ci" className="form-label">CI</label>
                    <input
                        type="text"
                        id="ci"
                        className="form-control"
                        value={ci}
                        onChange={e => setCi(e.target.value)}
                        placeholder="Introduce tu CI"
                    />
                </div>

                <div className="col-md-6">
                    <label htmlFor="fechaNacimiento" className="form-label">Fecha de nacimiento</label>
                    <input
                        type="date"
                        id="fechaNacimiento"
                        className="form-control"
                        value={fechaNacimiento}
                        onChange={e => setFechaNacimiento(e.target.value)}
                    />
                </div>
            </div>

            <button className="btn btn-primary mb-4" onClick={buscarBoletas}>
                Buscar Boletas
            </button>

            {boletas.length > 0 && (
                <div className="card">
                    <div className="card-header">
                        Boletas Pendientes
                    </div>
                    <ul className="list-group list-group-flush">
                        {boletas.map(boleta => (
                            <li key={boleta.id} className="list-group-item">
                                <p><strong>Curso:</strong> {boleta.curso}</p>
                                <p><strong>Estado:</strong> {boleta.status}</p>
                                <div className="mb-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-control"
                                        onChange={e => manejarArchivo(boleta.id, e.target.files[0])}
                                    />
                                </div>
                                <button
                                    className="btn btn-success"
                                    onClick={() => subirComprobante(boleta.id)}
                                >
                                    Subir Comprobante
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Payment;
