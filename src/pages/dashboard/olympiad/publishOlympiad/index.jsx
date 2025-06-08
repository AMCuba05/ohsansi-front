import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { ArrowLeft } from "lucide-react";
import {API_URL} from "../../../../Constants/Utils.js";

const PublishOlympiad = () => {
    const { id: olympicId } = useParams();
    const navigate = useNavigate();
    const [olympiadData, setOlympiadData] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        start_date: '',
        end_date: '',
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
                const res = await axios.get(`${API_URL}/api/olympiads/getOlympicInfo/${olympicId}`);
                const data = res.data;
                setOlympiadData(data);
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    price: data.price?.toFixed(2) || '',
                    start_date: data.Start_date || '',
                    end_date: data.End_date || '',
                    presentation: '',
                    requirements: '',
                    awards: '',
                    contacts: '',
                });
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
        const requiredFields = ['title', 'description', 'price', 'start_date', 'end_date', 'presentation', 'requirements', 'awards', 'contacts'];
        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = 'Campo requerido';
            }
        });
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
            await axios.patch(`${API_URL}/api/olympiads/${olympicId}/publish`, {
                Title: formData.title,
                Description: formData.description,
                Price: parseFloat(formData.price),
                Start_date: formData.start_date,
                End_date: formData.end_date,
                Presentation: formData.presentation,
                Requirements: formData.requirements,
                awards: formData.awards,
                Contacts: formData.contacts,
                status: true,
            });
            setSuccessMessage('Olimpiada publicada exitosamente.');
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

                {/* TÍTULO */}
                <div className="mb-3">
                    <label className="form-label">Título</label>
                    <input
                        type="text"
                        name="title"
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                        value={formData.title}
                        onChange={handleChange}
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
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
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>

                {/* PRECIO */}
                <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input
                        type="number"
                        step="0.01"
                        name="price"
                        className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                        value={formData.price}
                        onChange={handleChange}
                    />
                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                </div>

                {/* FECHAS */}
                <div className="mb-3">
                    <label className="form-label">Fecha de Inicio</label>
                    <input
                        type="date"
                        name="start_date"
                        className={`form-control ${errors.start_date ? 'is-invalid' : ''}`}
                        value={formData.start_date}
                        onChange={handleChange}
                    />
                    {errors.start_date && <div className="invalid-feedback">{errors.start_date}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Fecha de Fin</label>
                    <input
                        type="date"
                        name="end_date"
                        className={`form-control ${errors.end_date ? 'is-invalid' : ''}`}
                        value={formData.end_date}
                        onChange={handleChange}
                    />
                    {errors.end_date && <div className="invalid-feedback">{errors.end_date}</div>}
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
