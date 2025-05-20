import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {API_URL} from "../../Constants/Utils.js";

const Home = () => {
    const [olympiads, setOlympiads] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOlympiads = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/olympics`);
                console.log(res);
                const filtered = res.data.Olympics.filter(o => o.status === true || o.status ==='Publico');
                setOlympiads(filtered);
            } catch (err) {
                console.error('Error al cargar las olimpiadas', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOlympiads();
    }, []);

    const handleClick = (id) => {
        navigate(`/olympiad/${id}`);
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-3">Bienvenido al Portal de Olimpiadas</h1>
            <p className="text-muted mb-4">
                Explora las olimpiadas académicas activas. Aquí podrás ver toda la información sobre competencias vigentes,
                incluyendo fechas, requisitos y premios.
            </p>

            {loading ? (
                <div className="text-center">Cargando olimpiadas...</div>
            ) : olympiads.length === 0 ? (
                <div className="alert alert-info">No hay olimpiadas publicadas actualmente.</div>
            ) : (
                <div className="row">
                    {olympiads.map((olymp) => (
                        <div key={olymp.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm" onClick={() => handleClick(olymp.id)} style={{ cursor: 'pointer' }}>
                                <div className="card-body">
                                    <h5 className="card-title">{olymp.title}</h5>
                                    <p className="card-text text-muted">
                                        <strong>Inicio:</strong> {olymp.start_date} <br />
                                        <strong>Fin:</strong> {olymp.end_date}
                                    </p>
                                    <p className="card-text">
                                        {olymp.description.length > 100
                                            ? olymp. description.slice(0, 100) + '...'
                                            : olymp.description}
                                    </p>
                                </div>
                                <div className="card-footer text-end">
                                    <small className="text-primary">Ver más →</small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
