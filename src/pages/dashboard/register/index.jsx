// components/Pages/Inscripciones.jsx
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import "./index.scss";
import {Steps} from "react-step-builder";
import {FirstStep} from "./RegisterSteps/FirstStep.jsx";
import {API_URL} from "../../../Constants/Utils.js";
import {RecoverSessionStep} from "./RegisterSteps/RecoverSessionStep.jsx";
import {LastStep} from "./RegisterSteps/LastStep.jsx";
import {NewFirstStep} from "./RegisterSteps/NewFirstStep.jsx";
import {NewSecondStep} from "./RegisterSteps/NewSecondStep.jsx";
import {NewFourthStep} from "./RegisterSteps/NewFourthStep.jsx";
import {NewThirdStep} from "./RegisterSteps/NewThirdStep.jsx";

const Inscripciones = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(true);
    const [message, setMessage] = useState("");
    const [method, setMethod] = useState("manual");
    const [areas, setAreas] = useState([]);
    const [excelFile, setExcelFile] = useState(null);
    const [boletaData, setBoletaData] = useState({});

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
        <div className="inscripciones-container">
            <Steps>
                <div>
                    <FirstStep/>
                </div>
                <div>
                    <RecoverSessionStep/>
                </div>
                <div>
                    <NewFirstStep/>
                </div>
                <div>
                    <NewSecondStep/>
                </div>
                <div>
                    <NewThirdStep/>
                </div>
                <div>
                    <NewFourthStep setBoletaData={setBoletaData}/>
                </div>
                <div>
                    <LastStep boletaData={boletaData}/>
                </div>
            </Steps>
        </div>
    );
};

export default Inscripciones;
