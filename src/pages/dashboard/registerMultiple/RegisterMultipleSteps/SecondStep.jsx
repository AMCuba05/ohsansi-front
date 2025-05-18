// components/Pages/Inscripciones.jsx
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { Trash2, PlusCircle } from "lucide-react";
import Modal from "./../Modal/index.jsx";
import "./../index.scss";
import {useRegisterContext} from "../../../../Context/RegisterContext.jsx";
import {Dropdown} from "react-bootstrap";
import {grades, provincies, schools, states} from "../../../../Constants/Provincies.js";
import {API_URL} from "../../../../Constants/Utils.js";

const SecondStep = () => {
    const [showModal, setShowModal] = useState(false);
    const { registerData, setRegisterData } = useRegisterContext()
    const [modalSuccess, setModalSuccess] = useState(true);
    const [message, setMessage] = useState("");
    const [areas, setAreas] = useState([]);

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            olympic_id: registerData.olympic_id,
            competitors: [
                {
                    ci: "",
                    ci_expedition: "",
                    names: "",
                    last_names: "",
                    birthdate: "",
                    email: "",
                    phone_number: "",
                    school_data: {
                        name: "",
                        department: "",
                        province: "",
                        course: "",
                    },
                    selected_areas: [],
                },
            ],
            legal_tutor: {
                ci: "",
                ci_expedition: "",
                names: "",
                last_names: "",
                birthdate: "",
                email: "",
                phone_number: "",
            },
            academic_tutor: {
                ci: "",
                ci_expedition: "",
                names: "",
                last_names: "",
                birthdate: "",
                email: "",
                phone_number: "",
            },
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "competitors" });

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/areas`);
                setAreas(response.data.areas);
            } catch (error) {
                console.error("Error al obtener las áreas:", error);
            }
        };
        fetchAreas();
    }, []);

    const handleAreaSelect = (competitorIndex, areaId) => {
        const current = watch(`competitors.${competitorIndex}.selected_areas`) || [];
        const updated = current.includes(areaId)
            ? current.filter((id) => id !== areaId)
            : current.length < 2
                ? [...current, areaId]
                : current;
        setValue(`competitors.${competitorIndex}.selected_areas`, updated);
    };

    const onSubmit = async (data) => {
        try {
            await axios.post(
                `${API_URL}/api/inscriptions`,
                data
            );
            setModalSuccess(true);
            setMessage("¡Inscripción exitosa!");
            setShowModal(true);
        } catch (error) {
            setModalSuccess(false);
            setMessage("Error al enviar la inscripción. Verifica los datos.");
            setShowModal(true);
        }
    };

    return (
        <>
            <h2>Formulario de Inscripción para: {registerData.olympic_name}</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="formulario">
                <div className="tutores-wrapper">
                    <div className="tutor-block">
                        <h3>Tutor Legal</h3>
                        <input type="number" {...register("legal_tutor.ci", { required: true })} placeholder="CI" />
                        <input {...register("legal_tutor.ci_expedition", { required: true })} placeholder="Lugar de Expedición" />
                        <input {...register("legal_tutor.names", { required: true })} placeholder="Nombres" />
                        <input {...register("legal_tutor.last_names", { required: true })} placeholder="Apellidos" />
                        <input type="date" {...register("legal_tutor.birthdate", { required: true })} />
                        <input {...register("legal_tutor.email", { required: true })} placeholder="Email" />
                        <input type="number" {...register("legal_tutor.phone_number", { required: true })} placeholder="Teléfono" />
                    </div>

                    <div className="tutor-block">
                        <h3>Tutor Académico (Opcional)</h3>
                        <input type="number" {...register("academic_tutor.ci", { required: true })} placeholder="CI" />
                        <input {...register("academic_tutor.ci_expedition", { required: true })} placeholder="Lugar de Expedición" />
                        <input {...register("academic_tutor.names", { required: true })} placeholder="Nombres" />
                        <input {...register("academic_tutor.last_names", { required: true })} placeholder="Apellidos" />
                        <input type="date" {...register("academic_tutor.birthdate", { required: true })} />
                        <input {...register("academic_tutor.email", { required: true })} placeholder="Email" />
                        <input type="number" {...register("academic_tutor.phone_number", { required: true })} placeholder="Teléfono" />
                    </div>
                </div>


                <h3>Competidores</h3>
                {fields.map((field, index) => {
                    const selected = watch(`competitors.${index}.selected_areas`) || [];
                    return (
                        <div key={field.id} className="competidor-card">
                            <h4>Competidor {index + 1}</h4>
                            <div className="competidor-grid">
                                <input type="number" {...register(`competitors.${index}.ci`, { required: true })} placeholder="CI" />
                                <input {...register(`competitors.${index}.ci_expedition`, { required: true })} placeholder="Lugar de Expedición" />
                                <input {...register(`competitors.${index}.names`, { required: true })} placeholder="Nombres" />
                                <input {...register(`competitors.${index}.last_names`, { required: true })} placeholder="Apellidos" />
                                <input type="date" {...register(`competitors.${index}.birthdate`, { required: true })} />
                                <input {...register(`competitors.${index}.email`)} placeholder="Email" />
                                <input type="number" {...register(`competitors.${index}.phone_number`)} placeholder="Teléfono" />
                                <select {...register(`competitors.${index}.school_data.name`, { required: true })}>
                                    <option value="">Nombre del Colegio</option>
                                    {schools.map((school, idx) => (
                                        <option key={idx} value={school}>
                                            {school}
                                        </option>
                                    ))}
                                </select>
                                <select {...register(`competitors.${index}.school_data.department`, { required: true })}>
                                    <option value="">Selecciona un departamento</option>
                                    {states.map((state, idx) => (
                                        <option key={idx} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                                <select {...register(`competitors.${index}.school_data.province`, { required: true })}>
                                    <option value="">Selecciona una provincia</option>
                                    {provincies.map((province, idx) => (
                                        <option key={idx} value={province}>
                                            {province}
                                        </option>
                                    ))}
                                </select>
                                <select {...register(`competitors.${index}.school_data.course`, { required: true })}>
                                    <option value="">Selecciona un curso</option>
                                    {grades.map((course, idx) => (
                                        <option key={idx} value={course}>
                                            {course}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="areas-selector">
                                <p>Selecciona 1 o 2 áreas:</p>
                                <div className="area-list">
                                    {areas.map((area) => (
                                        <label key={area.id} className={`area-option ${selected.includes(area.id) ? "selected" : ""}`}>
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(area.id)}
                                                onChange={() => handleAreaSelect(index, area.id)}
                                            />
                                            {area.name}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="button"
                                className="delete-btn"
                                onClick={() => remove(index)}
                            >
                                <Trash2 size={16} /> Eliminar Competidor
                            </button>
                        </div>
                    );
                })}

                <button
                    type="button"
                    onClick={() =>
                        append({
                            ci: "",
                            ci_expedition: "",
                            names: "",
                            last_names: "",
                            birthdate: "",
                            email: "",
                            phone_number: "",
                            school_data: {
                                name: "",
                                department: "",
                                province: "",
                                course: "",
                            },
                            selected_areas: [],
                        })
                    }
                    className="add-btn"
                >
                    <PlusCircle size={16} /> Añadir Competidor
                </button>



                <button type="submit" className="submit-btn">
                    Enviar Inscripción
                </button>

            </form>

            {showModal && (
                <Modal success={modalSuccess} onClose={() => {
                    setShowModal(false)
                    if(modalSuccess){ window.location.reload();}
                }}>
                    {message}
                </Modal>
            )}
        </>
    );
};

export default SecondStep;
