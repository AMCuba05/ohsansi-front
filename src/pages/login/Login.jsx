import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.scss";
import { API_URL } from "../../Constants/Utils";

const Login = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(`${API_URL}/api/login`, {
                email: data.email,
                password: data.password,
            });

            const { token, user } = response.data;

            // Guarda el token (puedes usar sessionStorage si prefieres)
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            navigate("/dashboard");
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Credenciales inválidas");
            } else {
                setErrorMessage("Ocurrió un error inesperado. Intenta de nuevo.");
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    {errorMessage && <p className="error-text">{errorMessage}</p>}
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            id="email"
                            type="email"
                            className={`input ${errors.email ? "input-error" : ""}`}
                            {...register("email", { required: "Este campo es obligatorio" })}
                        />
                        {errors.email && <span className="error-text">{errors.email.message}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            className={`input ${errors.password ? "input-error" : ""}`}
                            {...register("password", { required: "Este campo es obligatorio" })}
                        />
                        {errors.password && <span className="error-text">{errors.password.message}</span>}
                    </div>
                    <button type="submit" className="login-button">Ingresar</button>
                </form>
            </div>
        </div>
    );
};

export default Login;