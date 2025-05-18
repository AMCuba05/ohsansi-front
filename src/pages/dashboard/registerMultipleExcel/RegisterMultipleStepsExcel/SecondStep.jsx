// components/Pages/Inscripciones.jsx
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import Modal from "./../Modal/index.jsx";
import "./../index.scss";
import {API_URL} from "../../../../Constants/Utils.js";

const SecondStep = () => {
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
                    `${API_URL}/api/inscriptions/excel`,
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
        <>
            <h2>Formulario de Inscripción</h2>

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
                        <h3>Tutor Académico</h3>
                        <input type="number" {...register("academic_tutor.ci", { required: true })} placeholder="CI" />
                        <input {...register("academic_tutor.ci_expedition", { required: true })} placeholder="Lugar de Expedición" />
                        <input {...register("academic_tutor.names", { required: true })} placeholder="Nombres" />
                        <input {...register("academic_tutor.last_names", { required: true })} placeholder="Apellidos" />
                        <input type="date" {...register("academic_tutor.birthdate", { required: true })} />
                        <input {...register("academic_tutor.email", { required: true })} placeholder="Email" />
                        <input type="number" {...register("academic_tutor.phone_number", { required: true })} placeholder="Teléfono" />
                    </div>
                </div>



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
