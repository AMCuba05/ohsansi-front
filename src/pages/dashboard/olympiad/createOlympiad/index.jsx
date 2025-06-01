import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {API_URL} from "../../../../Constants/Utils.js";

const CreateOlympiad = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        start_date: '',
        end_date: ''
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'El título es obligatorio.';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'La descripción es obligatoria.';
        }

        if (!formData.price) {
            newErrors.price = 'El precio es obligatorio.';
        } else if (!/^\d+$/.test(formData.price)) {
            newErrors.price = 'El precio debe ser un número entero positivo.';
        }

        if (!formData.start_date) {
            newErrors.start_date = 'La fecha de inicio es obligatoria.';
        } else if (formData.start_date < today) {
            newErrors.start_date = 'La fecha de inicio no puede ser en el pasado.';
        }

        if (!formData.end_date) {
            newErrors.end_date = 'La fecha de fin es obligatoria.';
        } else if (formData.start_date && formData.end_date < formData.start_date) {
            newErrors.end_date = 'La fecha de fin no puede ser anterior a la fecha de inicio.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await axios.post(`${API_URL}/api/olympiads`, formData);
            setSuccessMessage('¡Olimpiada registrada correctamente.!');
            setTimeout(() => navigate('/dashboard/olympiad'), 1500);
        } catch (err) {
            const backendErrors = {};

            // Verificamos si hay errores de validación desde el backend
            if (err.response && err.response.data && err.response.data.errors) {
                const errorData = err.response.data.errors;
                Object.keys(errorData).forEach(field => {
                    backendErrors[field] = errorData[field][0];
                });
            } else {
                backendErrors.api = 'Error inesperado al crear la olimpiada.';
            }

            setErrors(backendErrors);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Crear Olimpiada</h1>

            {errors.api && <div className="alert alert-danger">{errors.api}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">

                {/* TÍTULO */}
                <div className="mb-3">
                    <label className="form-label">Título</label>
                    <input
                        type="text"
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>

                {/* DESCRIPCIÓN */}
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>

                {/* PRECIO */}
                <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input
                        type="number"
                        className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                    />
                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                </div>

                {/* FECHA DE INICIO */}
                <div className="mb-3">
                    <label className="form-label">Fecha de inicio</label>
                    <input
                        type="date"
                        className={`form-control ${errors.start_date ? 'is-invalid' : ''}`}
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        min={today}
                    />
                    {errors.start_date && <div className="invalid-feedback">{errors.start_date}</div>}
                </div>

                {/* FECHA DE FIN */}
                <div className="mb-3">
                    <label className="form-label">Fecha de fin</label>
                    <input
                        type="date"
                        className={`form-control ${errors.end_date ? 'is-invalid' : ''}`}
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        min={formData.start_date || today}
                    />
                    {errors.end_date && <div className="invalid-feedback">{errors.end_date}</div>}
                </div>

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">Crear</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateOlympiad;
