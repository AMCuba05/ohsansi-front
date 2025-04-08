// components/Pages/Inscripciones.jsx
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { Trash2, PlusCircle } from "lucide-react";
import Modal from "./Modal/index.jsx";
import "./index.scss";

const Inscripciones = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(true);
    const [message, setMessage] = useState("");
    const [method, setMethod] = useState("manual");
    const [areas, setAreas] = useState([]);
    const [excelFile, setExcelFile] = useState(null);

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
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
                const response = await axios.get("https://willypaz.dev/projects/ohsansi-api/api/areas");
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
                "https://willypaz.dev/projects/ohsansi-api/api/inscriptions",
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

    const handleExcelChange = (e) => {
        const file = e.target.files[0];
        setExcelFile(file);
    };

    const handleExcelSubmit = async () => {
        if (!excelFile) return;
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result.split(",")[1];
            const data = {
                excel: base64,
                legal_tutor: watch("legal_tutor"),
                academic_tutor: watch("academic_tutor"),
            };
            try {
                await axios.post(
                    "https://willypaz.dev/projects/ohsansi-api/api/inscriptions/excel",
                    data
                );
                setModalSuccess(true);
                setMessage("¡Excel subido correctamente!");
                setShowModal(true);
            } catch (err) {
                setModalSuccess(false);
                setMessage("Error al subir el Excel");
                setShowModal(true);
            }
        };
        reader.readAsDataURL(excelFile);
    };

    return (
        <div className="inscripciones-container">
            <h2>Formulario de Inscripción</h2>

            <div className="selector-metodo">
                <button
                    className={`metodo-btn ${method === "manual" ? "active" : ""}`}
                    onClick={() => setMethod("manual")}
                >
                    Añadir Competidores Manualmente
                </button>
                <button
                    className={`metodo-btn ${method === "excel" ? "active" : ""}`}
                    onClick={() => setMethod("excel")}
                >
                    Subir Competidores por Excel
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="formulario">
                <div className="tutores-wrapper">
                    <div className="tutor-block">
                        <h3>Tutor Legal</h3>
                        <input {...register("legal_tutor.ci", { required: true })} placeholder="CI" />
                        <input {...register("legal_tutor.ci_expedition", { required: true })} placeholder="Lugar de Expedición" />
                        <input {...register("legal_tutor.names", { required: true })} placeholder="Nombres" />
                        <input {...register("legal_tutor.last_names", { required: true })} placeholder="Apellidos" />
                        <input type="date" {...register("legal_tutor.birthdate", { required: true })} />
                        <input {...register("legal_tutor.email", { required: true })} placeholder="Email" />
                        <input {...register("legal_tutor.phone_number", { required: true })} placeholder="Teléfono" />
                    </div>

                    <div className="tutor-block">
                        <h3>Tutor Académico</h3>
                        <input {...register("academic_tutor.ci", { required: true })} placeholder="CI" />
                        <input {...register("academic_tutor.ci_expedition", { required: true })} placeholder="Lugar de Expedición" />
                        <input {...register("academic_tutor.names", { required: true })} placeholder="Nombres" />
                        <input {...register("academic_tutor.last_names", { required: true })} placeholder="Apellidos" />
                        <input type="date" {...register("academic_tutor.birthdate", { required: true })} />
                        <input {...register("academic_tutor.email", { required: true })} placeholder="Email" />
                        <input {...register("academic_tutor.phone_number", { required: true })} placeholder="Teléfono" />
                    </div>
                </div>

                {method === "manual" && (
                    <>
                        <h3>Competidores</h3>
                        {fields.map((field, index) => {
                            const selected = watch(`competitors.${index}.selected_areas`) || [];
                            return (
                                <div key={field.id} className="competidor-card">
                                    <h4>Competidor {index + 1}</h4>
                                    <div className="competidor-grid">
                                        <input {...register(`competitors.${index}.ci`, { required: true })} placeholder="CI" />
                                        <input {...register(`competitors.${index}.ci_expedition`, { required: true })} placeholder="Lugar de Expedición" />
                                        <input {...register(`competitors.${index}.names`, { required: true })} placeholder="Nombres" />
                                        <input {...register(`competitors.${index}.last_names`, { required: true })} placeholder="Apellidos" />
                                        <input type="date" {...register(`competitors.${index}.birthdate`, { required: true })} />
                                        <input {...register(`competitors.${index}.email`)} placeholder="Email" />
                                        <input {...register(`competitors.${index}.phone_number`)} placeholder="Teléfono" />
                                        <input {...register(`competitors.${index}.school_data.name`)} placeholder="Nombre del Colegio" />
                                        <input {...register(`competitors.${index}.school_data.department`)} placeholder="Departamento" />
                                        <input {...register(`competitors.${index}.school_data.province`)} placeholder="Provincia" />
                                        <input {...register(`competitors.${index}.school_data.course`)} placeholder="Curso" />
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
                    </>
                )}

                {method === "excel" && (
                    <div className="excel-upload">
                        <h3>Sube el archivo Excel</h3>
                        <input type="file" accept=".xlsx,.xls" onChange={handleExcelChange} />
                        <button
                            type="button"
                            className="submit-btn"
                            onClick={handleExcelSubmit}
                            disabled={!excelFile}
                        >
                            Enviar Excel
                        </button>
                    </div>
                )}

                {method === "manual" && (
                    <button type="submit" className="submit-btn">
                        Enviar Inscripción
                    </button>
                )}
            </form>

            {showModal && (
                <Modal success={modalSuccess} onClose={() => {
                    setShowModal(false)
                    if(modalSuccess){ window.location.reload();}
                }}>
                    {message}
                </Modal>
            )}
        </div>
    );
};

export default Inscripciones;