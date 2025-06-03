import React, { useState, useEffect } from 'react';
import { useSteps } from 'react-step-builder';
import { Form, ProgressBar, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useRegisterContext } from '../../../../Context/RegisterContext.jsx';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PaymentReceipt from '../../components/PaymentReceipt/index.jsx';
import { API_URL } from '../../../../Constants/Utils.js';
import {AcademicTutor} from "../../components/AcademicTutor/index.jsx";

export const LastStep = () => {
    const stepsState = useSteps();
    const { registerData } = useRegisterContext();
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [academicTutorData, setAcademicTutorData] = useState({
        ci: '',
        ci_expedition: '',
        names: '',
        last_names: '',
        birthdate: '',
        email: '',
        phone_number: '',
    });
    const [tutors, setTutors] = useState([]);
    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    const boletaData = {
        nombre: `${registerData.responsable?.names || ''} ${registerData.responsable?.last_names || ''}`,
        apellido: `${registerData.responsable?.last_names || ''}`,
        fecha_nacimiento: `${registerData.responsable?.birthdate || ''}`,
        cantidad: 1,
        numero_orden_de_pago: randomNumber,
        concepto:  `Inscripción Olimpiada: ${registerData.olympic_name || ''}`,
        importe: registerData.olympiad.price,
        precio_unitario: registerData.olympiad.price,
        total: 15,
    };

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${API_URL}/api/olympiads/2/areas`)
            .then((response) => {
                console.log('API Response:', response.data.data); // Debug: Log the raw API response
                setAreas(response.data.data || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching areas:', error);
                setError('Failed to load areas. Please try again.');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        setTutors(academicTutorData)
    }, [academicTutorData]);

    const generarBoleta = async () => {
        try {
            await axios.post(`${API_URL}/api/boletas`, boletaData);
            alert("La boleta de pago se genero correctamente")
        } catch (e) {
           console.log(e)
        }
    }

    return (
        <div className="container d-flex justify-content-center">
            <div className="card p-4">
        <span>
          Paso {stepsState.current} de {stepsState.total}
        </span>
                <ProgressBar
                    now={stepsState.progress * 100}
                    label={`${Math.round(stepsState.progress * 100)}%`}
                    animated
                    striped
                    variant="success"
                    style={{height: '1.5rem', fontSize: '0.9rem'}}
                />
                <h2 className="mb-3 mt-4">Paso 7: Ya puedes descargar la boleta de pago</h2>
                <p className="text-muted mb-4">
                    Presenta esta boleta de pagos en las cajas facultativas de la universidad, siempre puedes regresar a est pantalla con los datos del responsable del pago
                </p>
                <div className="mt-3">
                    <PDFDownloadLink
                        document={<PaymentReceipt data={boletaData}/>}
                        fileName="boleta_pago.pdf"
                        onClick={generarBoleta}
                    >
                        {({loading}) => (loading ? 'Generando PDF...' : 'Descargar Boleta de pago')}
                    </PDFDownloadLink>
                </div>
            </div>
        </div>
    );
};
