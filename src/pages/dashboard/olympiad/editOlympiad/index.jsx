import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ArrowLeft} from "lucide-react";
import {Button} from "react-bootstrap";
import { API_URL } from '../../../../Constants/Utils';

const EditOlympiad = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOlympiad = async () => {
            try {
                const resInfo = await axios.get(`${API_URL}/api/olympiads/getOlympicInfo/${id}`);
                setFormData({
                    title: resInfo.data.title || '',
                    description: resInfo.data.description || '',
                    price: resInfo.data.price || ''
                });
                setLoading(false);
            } catch (err) {
                setErrors({ api: 'Error al cargar los datos de la olimpiada.' });
                setLoading(false);
            }
        };
        fetchOlympiad();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.price) {
            newErrors.price = 'El precio es obligatorio.';
        } else if (!/^\d+$/.test(formData.price)) {
            newErrors.price = 'El precio debe ser un número entero positivo.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await axios.patch(`${API_URL}/api/olympiads/${id}/price`, { price: formData.price });
            setSuccessMessage('¡Precio actualizado correctamente!');
            setTimeout(() => navigate('/dashboard/olympiad'), 1500);
        } catch (err) {
            const backendErrors = {};
            if (err.response && err.response.data && err.response.data.errors) {
                const errorData = err.response.data.errors;
                Object.keys(errorData).forEach(field => {
                    backendErrors[field] = errorData[field][0];
                });
            } else {
                backendErrors.api = 'Error inesperado al actualizar el precio.';
            }
            setErrors(backendErrors);
        }
    };

    if (loading) {
        return <div className="container mt-4">Cargando...</div>;
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
            <h1 className="mb-4">Editar Precio de Olimpiada</h1>

            {errors.api && <div className="alert alert-danger">{errors.api}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                {/* TÍTULO */}
                <div className="mb-3">
                    <label className="form-label">Título</label>
                    <input
                        type="text"
                        className="form-control bg-secondary bg-opacity-50"
                        name="title"
                        value={formData.title}
                        readOnly
                    />
                </div>

                {/* DESCRIPCIÓN */}
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                        className="form-control bg-secondary bg-opacity-50"
                        name="description"
                        rows="4"
                        value={formData.description}
                        readOnly
                    ></textarea>
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
                        max="999"
                    />
                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                </div>

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">Actualizar Precio</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/olympiad')}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditOlympiad;