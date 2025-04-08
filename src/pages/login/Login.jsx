
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./Login.scss";

const Login = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);
        navigate("/dashboard");
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
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