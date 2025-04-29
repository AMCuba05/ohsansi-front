import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "react-bootstrap";
import {ArrowLeft} from "lucide-react";

const PublishOlympiad = () => {
    const { id: olympicId } = useParams();
    const navigate = useNavigate();
    const [olympiadData, setOlympiadData] = useState(null);
    const [formData, setFormData] = useState({
        presentation: '',
        requirements: '',
        awards: '',
        contacts: '',
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchOlympiadData = async () => {
            try {
                const res = await axios.get(`https://willypaz.dev/projects/ohsansi-api/api/olympics/getOlympicInfo/${olympicId}`);
                setOlympiadData(res.data);
            } catch (error) {
                setErrors({ api: 'Error al cargar la olimpiada.' });
            } finally {
                setLoading(false);
            }
        };
        fetchOlympiadData();
    }, [olympicId]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.presentation) newErrors.presentation = 'Campo requerido';
        if (!formData.requirements) newErrors.requirements = 'Campo requerido';
        if (!formData.awards) newErrors.awards = 'Campo requerido';
        if (!formData.contacts) newErrors.contacts = 'Campo requerido';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSubmitting(true);
        try {
            await axios.patch(`https://willypaz.dev/projects/ohsansi-api/api/olympics/${olympicId}/publish`, {
                Presentation: formData.presentation,
                Requirements: formData.requirements,
                awards: formData.awards,
                Contacts: formData.contacts,
                start_date: olympiadData.Start_date,
                end_date: olympiadData.End_date,
            });
            setSuccessMessage('Olimpiada publicada correctamente.');
        } catch (err) {
            setErrors({ api: 'Error al publicar la olimpiada.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center mt-5">Cargando...</div>;

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
            <h1 className="mb-4">Publicar Olimpiada</h1>

            {errors.api && <div className="alert alert-danger">{errors.api}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                {/* TÍTULO (solo lectura) */}
                <div className="mb-3">
                    <label className="form-label">Título</label>
                    <input
                        type="text"
                        className="form-control"
                        value={olympiadData.title}
                        readOnly
                    />
                </div>


                {/* PRESENTACIÓN */}
                <div className="mb-3">
                    <label className="form-label">Presentación</label>
                    <textarea
                        className={`form-control ${errors.presentation ? 'is-invalid' : ''}`}
                        name="presentation"
                        rows="3"
                        value={formData.presentation}
                        onChange={handleChange}
                    />
                    {errors.presentation && <div className="invalid-feedback">{errors.presentation}</div>}
                </div>

                {/* DESCRIPCIÓN */}
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={olympiadData.description}
                        readOnly
                    />
                </div>

                {/* PRECIO */}
                <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input
                        type="text"
                        className="form-control"
                        value={`$${(olympiadData.price / 100).toFixed(2)}`}
                        readOnly
                    />
                </div>

                {/* FECHAS */}
                <div className="mb-3">
                    <label className="form-label">Fecha de Inicio</label>
                    <input
                        type="text"
                        className="form-control"
                        value={olympiadData.Start_date}
                        readOnly
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Fecha de Fin</label>
                    <input
                        type="text"
                        className="form-control"
                        value={olympiadData.End_date}
                        readOnly
                    />
                </div>

                {/* REQUISITOS */}
                <div className="mb-3">
                    <label className="form-label">Requisitos</label>
                    <textarea
                        className={`form-control ${errors.requirements ? 'is-invalid' : ''}`}
                        name="requirements"
                        rows="3"
                        value={formData.requirements}
                        onChange={handleChange}
                    />
                    {errors.requirements && <div className="invalid-feedback">{errors.requirements}</div>}
                </div>

                {/* PREMIOS */}
                <div className="mb-3">
                    <label className="form-label">Premios</label>
                    <textarea
                        className={`form-control ${errors.awards ? 'is-invalid' : ''}`}
                        name="awards"
                        rows="2"
                        value={formData.awards}
                        onChange={handleChange}
                    />
                    {errors.awards && <div className="invalid-feedback">{errors.awards}</div>}
                </div>

                {/* CONTACTOS */}
                <div className="mb-3">
                    <label className="form-label">Contactos</label>
                    <input
                        type="text"
                        className={`form-control ${errors.contacts ? 'is-invalid' : ''}`}
                        name="contacts"
                        value={formData.contacts}
                        onChange={handleChange}
                    />
                    {errors.contacts && <div className="invalid-feedback">{errors.contacts}</div>}
                </div>

                {/* BOTÓN */}
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Publicando...' : 'Publicar'}
                </button>
            </form>
        </div>
    );
};

export default PublishOlympiad;
