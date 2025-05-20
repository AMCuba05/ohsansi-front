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
    const [seleccionadas, setSeleccionadas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReceipt, setShowReceipt] = useState(false);
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

    const boletaData = {
        nombre: `${registerData.legal_tutor?.names || ''} ${registerData.legal_tutor?.last_names || ''}`,
        ci: registerData.legal_tutor?.ci || '',
        fechaPago: Date.now().toString(),
        detalles: [{ concepto: `Inscripción Olimpiada: ${registerData.olympic_name || ''}`, monto: 15 }],
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

    const handleCheckArea = (id) => {
        console.log('Area checked:', id); // Debug: Log the area ID being checked
        if (seleccionadas.includes(id)) {
            setSeleccionadas(seleccionadas.filter((item) => item !== id));
            // Remove categories associated with this area
            setCategorias(
                categorias.filter((catId) => {
                    const area = areas.find((a) => a.id === id);
                    return !area?.categories?.some((category) => category.id === catId);
                })
            );
        } else if (seleccionadas.length < 2) {
            setSeleccionadas([...seleccionadas, id]);
        }
        console.log('Updated seleccionadas:', seleccionadas); // Debug: Log updated seleccionadas
    };

    const handleCheckCategory = (categoryId, areaId) => {
        console.log('Category checked:', { categoryId, areaId }); // Debug: Log category selection
        if (categorias.includes(categoryId)) {
            setCategorias(categorias.filter((item) => item !== categoryId));
        } else if (categorias.length < seleccionadas.length) {
            setCategorias([...categorias, categoryId]);
        }
    };

    const filterAreasByCourse = (areas, courseToFind) => {
        if (!courseToFind) return areas;
        return areas
            .map((area) => ({
                ...area,
                categories: area.categories?.filter((category) =>
                    category.range_course?.includes(courseToFind)
                ) || [],
            }))
            .filter((area) => area.categories?.length > 0);
    };

    const submitTest = async () => {
        try {
            console.log('Submitting data:', convertAreasToSelectedFormat(seleccionadas)); // Debug: Log submission data
            await axios.post(`${API_URL}/api/olympiads/${registerData.olympic_id}/inscriptions/${registerData.inscription_id}/selected-areas`, {
                selected_areas: convertAreasToSelectedFormat(seleccionadas),
            });
            setShowReceipt(true);
            stepsState.next()
        } catch (error) {
            console.error('Submission error:', error);
            alert('Error al enviar la inscripción. Verifica los datos.');
        }
    };

    const convertAreasToSelectedFormat = (areaIds) => {
        return areaIds.map((areaId) => ({
            area_id: areaId,
            category_id: categorias.find((catId) =>
                areas.find((a) => a.id === areaId)?.olympiad_categories?.some((c) => c.id === catId)
            ),
        }));
    };

    // Filter areas based on student's course, if available
    const filteredAreas = registerData.competitor?.course
        ? filterAreasByCourse(areas, registerData.competitor.course)
        : areas;

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
                <h2 className="mb-3 mt-4">Paso 8: Ya puedes descargar la boleta de pago</h2>
                <p className="text-muted mb-4">
                    Presenta esta boleta de pagos en las cajas facultativas de la universidad, siempre puedes regresar a est pantalla con los datos del responsable del pago
                </p>
                <div className="mt-3">
                    <PDFDownloadLink
                        document={<PaymentReceipt data={boletaData}/>}
                        fileName="boleta_pago.pdf"
                    >
                        {({loading}) => (loading ? 'Generando PDF...' : 'Descargar Boleta de pago')}
                    </PDFDownloadLink>
                </div>
            </div>
        </div>
    );
};
