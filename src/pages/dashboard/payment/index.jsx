import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import OCR6DigitVerifier from '../components/OCRComponent/OCR6DigitVerifier.jsx';
import { API_URL } from '../../../Constants/Utils.js';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PaymentReceipt from '../components/PaymentReceipt';

const Payment = () => {
    const [ci, setCi] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [boletas, setBoletas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch boletas from the API
    const buscarBoletas = async () => {
        if (!ci || !fechaNacimiento) {
            setError('Por favor, completa CI y fecha de nacimiento.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_URL}/api/buscar`, {
                params: {
                    ci,
                    birthdate: fechaNacimiento,
                },
            });

            // Handle case where no boletas are found
            if (response.data.boletas.length === 0) {
                setBoletas([]);
                setError('No se encontraron boletas para esta persona.');
                return;
            }

            // Set boletas directly from response
            setBoletas(response.data.boletas);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('Persona no encontrada');
            } else {
                setError('Error al buscar boletas. Intenta de nuevo.');
            }
            console.error(err);
            setBoletas([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle finalize payment after OCR verification
    const handleFinalizePayment = async (boleta, { isMatch, file }) => {
        if (!isMatch) {
            alert(
                `El número de orden ${boleta.numero_orden_de_pago} no se encontró en la imagen.`,
            );
            return;
        }

        if (!file) {
            alert('No se seleccionó ninguna imagen.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Call the verification endpoint
            await axios.post(
                'https://ohsansi.willypaz.dev/api/verificar-comprobante',
                {
                    numero_orden_de_pago: boleta.numero_orden_de_pago,
                },
            );

            // Refetch boletas to update the status
            await buscarBoletas();

            alert('Comprobante verificado y pago actualizado.');
        } catch (err) {
            alert('Error al verificar el comprobante. Intenta de nuevo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Filter boletas by status
    const pendingBoletas = boletas.filter(
        (boleta) => boleta.status === 'pending',
    );
    const paidBoletas = boletas.filter(
        (boleta) => boleta.status === 'completed',
    );

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Subir Comprobante de Pago</h2>

            <p className="mb-4">
                Introduce tu CI y la fecha de nacimiento para visualizar tus
                boletas pendientes.
            </p>

            {/* Input Form */}
            <div className="mb-3 row">
                <div className="col-md-6">
                    <label htmlFor="ci" className="form-label">
                        CI
                    </label>
                    <input
                        type="text"
                        id="ci"
                        className="form-control"
                        value={ci}
                        onChange={(e) => setCi(e.target.value)}
                        placeholder="Introduce tu CI"
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="fechaNacimiento" className="form-label">
                        Fecha de nacimiento
                    </label>
                    <input
                        type="date"
                        id="fechaNacimiento"
                        className="form-control"
                        value={fechaNacimiento}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                    />
                </div>
            </div>

            <button
                className="btn btn-primary mb-4"
                onClick={buscarBoletas}
                disabled={loading}
            >
                {loading ? 'Buscando...' : 'Buscar Boletas'}
            </button>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Pending Boletas Section */}
            {pendingBoletas.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header">Boletas Pendientes</div>
                    <ul className="list-group list-group-flush">
                        {pendingBoletas.map((boleta) => (
                            <li key={boleta.id} className="list-group-item">
                                <p>
                                    <strong>Número de Orden:</strong>{' '}
                                    {boleta.numero_orden_de_pago}
                                </p>
                                <p>
                                    <strong>Concepto:</strong> {boleta.concepto}
                                </p>
                                <p>
                                    <strong>Nombre:</strong> {boleta.nombre}{' '}
                                    {boleta.apellido}
                                </p>
                                <p>
                                    <strong>Total:</strong> ${boleta.total}
                                </p>
                                <p>
                                    <strong>Estado:</strong> Pendiente
                                </p>

                                <PDFDownloadLink
                                    document={<PaymentReceipt data={boleta} />}
                                    style={{ textColor: 'blue' }}
                                    fileName={`boleta_pago_${boleta.numero_orden_de_pago}.pdf`}
                                    onClick={() =>
                                        alert('Descargando boleta...')
                                    }
                                >
                                    {({ loading }) =>
                                        loading
                                            ? 'Generando PDF...'
                                            : 'Descargar Boleta de pago'
                                    }
                                </PDFDownloadLink>

                                <div className="mb-2">
                                    <OCR6DigitVerifier
                                        targetNumber={
                                            boleta.numero_orden_de_pago
                                        }
                                        onFinalize={(result) =>
                                            handleFinalizePayment(
                                                boleta,
                                                result,
                                            )
                                        }
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Paid Boletas Section */}
            {paidBoletas.length > 0 && (
                <div className="card mb-4">
                    <div className="card-header">Boletas Pagadas</div>
                    <ul className="list-group list-group-flush">
                        {paidBoletas.map((boleta) => (
                            <li key={boleta.id} className="list-group-item">
                                <p>
                                    <strong>Número de Orden:</strong>{' '}
                                    {boleta.numero_orden_de_pago}
                                </p>
                                <p>
                                    <strong>Concepto:</strong> {boleta.concepto}
                                </p>
                                <p>
                                    <strong>Nombre:</strong> {boleta.nombre}{' '}
                                    {boleta.apellido}
                                </p>
                                <p>
                                    <strong>Total:</strong> ${boleta.total}
                                </p>
                                <p>
                                    <strong>Estado:</strong> Pago realizado
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {boletas.length === 0 && !loading && !error && (
                <div className="alert alert-info">
                    No se encontraron boletas.
                </div>
            )}
        </div>
    );
};

export default Payment;
