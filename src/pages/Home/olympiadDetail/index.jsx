import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import {ArrowLeft} from "lucide-react";
import {Button} from "react-bootstrap";

const OlympiadDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [olympiad, setOlympiad] = useState(null);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resInfo = await axios.get(`https://willypaz.dev/projects/ohsansi-api/api/olympics/getOlympicInfo/${id}`);
                console.log(resInfo.data);
                setOlympiad(resInfo.data);

                const resAreas = await axios.get(`https://willypaz.dev/projects/ohsansi-api/api/olimpiadas-categorias/${id}/areas-categories`);
                console.log(resAreas.data)
                setAreas(resAreas.data.areas);
            } catch (err) {
                console.error('Error al obtener datos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div className="container mt-4 text-center">Cargando información de la olimpiada...</div>;
    }

    if (!olympiad) {
        return <div className="container mt-4 alert alert-danger">No se encontró la olimpiada.</div>;
    }

    return (
        <div className="container mt-4">
            <Button
                variant="link"
                onClick={() => navigate(-1)}
                className="mb-3 p-0 d-flex align-items-center text-decoration-none"
            >
                <ArrowLeft size={18} className="me-2" />
                Volver
            </Button>
            <h1 className="mb-4">{olympiad.title}</h1>

            <div className="card p-4 shadow-sm">
                {/* Descripción */}
                <div className="mb-4">
                    <h5 className="text-primary">Presentación</h5>
                    <p>{olympiad.presentation}</p>
                </div>

                <div className="mb-4">
                    <h5 className="text-primary">Descripcion</h5>
                    <p>{olympiad.description}</p>
                </div>

                {/* Participantes */}
                <div className="mb-4">
                    <h5 className="text-primary">Participantes</h5>
                    <p>Estudiantes del Subsistema de Educación Regular del Estado Plurinacional de Bolivia, en las
                        siguientes áreas:</p>
                    <table className="table table-bordered">
                        <thead className="table-light">
                        <tr>
                            <th>Área</th>
                            <th>Año de escolaridad</th>
                        </tr>
                        </thead>
                        <tbody>
                        {areas.map((area) => (

                            <tr key={area.area.id}>
                                <td>{area.area.name}</td>
                                <td>
                                    {area.categories.map((category) => (
                                        <>
                                            {category.range_course?.join(', ')}
                                            <br/>
                                        </>
                                    ))}
                                </td>
                            </tr>

                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Requisitos */}
                <div className="mb-4">
                    <h5 className="text-primary">Requisitos</h5>
                    <p>{olympiad.requirements}</p>
                </div>

                {/* Fechas importantes */}
                <div className="mb-4">
                    <h5 className="text-primary">Fechas importantes</h5>
                    <p><strong>Inicio:</strong> {olympiad.Start_date}</p>
                    <p><strong>Fin:</strong> {olympiad.End_date}</p>
                </div>

                {/* Premios */}
                <div className="mb-4">
                    <h5 className="text-primary">Premios</h5>
                    <p>{olympiad.awards}</p>
                </div>

                {/* Información de contacto */}
                <div className="mb-4">
                    <h5 className="text-primary">Información de contacto</h5>
                    <p>{olympiad.contact}</p>
                </div>

                {/* Precio */}
                <div className="mb-2">
                    <h6><strong>Precio:</strong> Bs {parseFloat(olympiad.price / 100).toFixed(2)}</h6>
                </div>
            </div>
        </div>
    );
};

export default OlympiadDetail;
