import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {API_URL} from "../../../Constants/Utils.js";

const Olympiads = () => {
    const [olympiads, setOlympiads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log(olympiads)
    useEffect(() => {
        axios.get(`${API_URL}/api/olympics`)
            .then(response => {
                setOlympiads(response.data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener las olimpiadas:', error);
                setError('Hubo un error al cargar las olimpiadas');
                setLoading(false);
            });
    }, []);

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Lista de Versiones de Olimpiadas</h1>

            {loading && <p>Cargando olimpiadas...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && (
                <div className="list-group">
                    {olympiads.map((olympiad, index) => (
                        <div key={olympiad.id} className="list-group-item mb-4 p-4 border rounded">
                            <h4 className="mb-2">{olympiad.title}:</h4>
                            <p>{olympiad.description}</p>
                            <div className="d-flex gap-2">
                                <Link to={`/dashboard/olympiad/${olympiad.id}/associate`} className="btn btn-sm btn-outline-secondary">
                                    Asociar Áreas/Categorías
                                </Link>
                                {

                                    <Link to={`/dashboard/olympiad/${olympiad.id}/publish`} className="btn btn-sm btn-outline-success">
                                        Publicar Olimpiada
                                    </Link>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Olympiads;
