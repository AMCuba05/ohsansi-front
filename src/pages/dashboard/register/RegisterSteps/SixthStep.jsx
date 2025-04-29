import React, {useState, useEffect} from 'react';
import {useSteps} from 'react-step-builder'
import {Dropdown, ProgressBar, Form, Spinner, Alert} from 'react-bootstrap'
import axios from "axios";
import {useRegisterContext} from "../../../../Context/RegisterContext.jsx";
import {PDFDownloadLink} from "@react-pdf/renderer";
import PaymentReceipt from "../../components/PaymentReceipt/index.jsx";

export const SixthStep = () => {
    const stepsState = useSteps()
    const { registerData, setRegisterData } = useRegisterContext()
    const [found, setFound] = useState(false)
    const [showReceipt, setShowReceipt] = useState(false)
    const [areas, setAreas] = useState()
    const [filteredAreas, setFilteredAreas] = useState([])
    const [loading, setLoading] = useState(true)

    const boletaData = {
        nombre: `${registerData.legal_tutor.names} ${registerData.legal_tutor.last_names}`,
        ci: registerData.legal_tutor.ci,
        fechaPago: Date.now().toString(),
        detalles: [
            { concepto: `Incripcion Olimpiada: ${registerData.olympic_name} `, monto: 15 },
        ],
        total: 15,
    };

    const [seleccionadas, setSeleccionadas] = useState([]);
    const handleCheck = (id) => {
        if (seleccionadas.includes(id)) {
            // Si ya está seleccionada, la quitamos
            setSeleccionadas(seleccionadas.filter((item) => item !== id));
        } else if (seleccionadas.length < 2) {
            // Si hay menos de 2, la agregamos
            setSeleccionadas([...seleccionadas, id]);
        }
    };

    useEffect(() => {
        axios.get(`https://willypaz.dev/projects/ohsansi-api/api/olimpiadas-categorias/${registerData.olympic_id}/areas-categories`)
            .then(response => {
                setAreas(response.data);
                setFilteredAreas(filterAreasByCourse(response.data, registerData.competitor.school_data.course))
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener las olimpiadas:', error);
                setLoading(false);
            });
    }, []);

    function filterAreasByCourse(data, courseToFind) {
        return data.areas
            .map(area => {
                const filteredCategories = area.categories
                    .filter(category => category.range_course.includes(courseToFind))
                    .map(category => ({
                        area_id: area.area.id,
                        area_name: area.area.name,
                        category_id: category.id,
                        category_name: category.name,
                    }));

                // Asegurarse de que solo se devuelvan categorías filtradas (sin duplicados)
                return filteredCategories.length > 0 ? filteredCategories : null;
            })
            .flat() // Convertir el array de arrays a un solo array
            .filter(Boolean) // Eliminar valores null o undefined
            .filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t.area_id === value.area_id && t.category_id === value.category_id
                    )) // Filtrar duplicados por area_id y category_id
            );
    }

    const submitTest = async () => {
        try {
            const data = {
                ...registerData,
                competitor: {
                    ...registerData.competitor,
                    selected_areas: convertAreasToSelectedFormat(seleccionadas)
                },
                responsable: registerData.legal_tutor
            }
            await axios.post(
                "https://willypaz.dev/projects/ohsansi-api/api/inscriptions",
                data
            );
            setShowReceipt(true)
            Alert("¡Inscripción exitosa!");

        } catch (error) {
            Alert("Error al enviar la inscripción. Verifica los datos.");
        }

    }

    function getCategoryIdByAreaId(flatArray, areaId) {
        const result = flatArray.filter(item => item.area_id === areaId);
        return result.map(item => item.category_id);
    }

    function convertAreasToSelectedFormat(areaIds) {
        return areaIds.map(areaId => ({
            area_id: areaId,
            category_id: getCategoryIdByAreaId(filteredAreas, areaId)[0],
            academic_tutor: registerData.legal_tutor
        }));
    }

    return (
        <div className="container d-flex justify-content-center">
            <div className="card p-4" >
                <span>Paso {stepsState.current} de {stepsState.total} </span>
                <ProgressBar
                    now={stepsState.progress * 100}
                    label={`${Math.round(stepsState.progress * 100)}%`}
                    animated
                    striped
                    variant={"success"}
                    style={{ height: '1.5rem', fontSize: '0.9rem' }}
                />
                <h2 className="mb-3 mt-4">Paso 6: Selecciona hasta 2 Categorías

                </h2>
                <p className="text-muted mb-4">
                    Puedes elegir una o dos categorías según el perfil del estudiante. Estas categorías definirán las áreas temáticas en las que participará durante la olimpiada. Asegúrate de que las selecciones sean apropiadas para su nivel educativo.
                </p>

                <form>
                    <h5>Selecciona hasta 2 categorías</h5>
                    <Form>
                        {filteredAreas.map((area) => (
                            <Form.Check
                                key={area.area_id}
                                type="checkbox"
                                label={area.area_name}
                                checked={seleccionadas.includes(area.area_id)}
                                onChange={() => handleCheck(area.area_id)}
                                disabled={!seleccionadas.includes(area.area_id) && seleccionadas.length >= 2}
                            />
                        ))}
                    </Form>

                    {seleccionadas.length === 2 && (
                        <Alert variant="info" className="mt-3">
                            Ya seleccionaste 2 categorías.
                        </Alert>
                    )}

                    <div className="d-flex gap-2 mt-4">
                        <button
                            disabled={!stepsState.hasPrev}
                            type="button"
                            className="btn btn-secondary w-50"
                            onClick={stepsState.prev}
                        >
                            Anterior
                        </button>
                        <button
                            disabled={seleccionadas.length > 2 || seleccionadas <= 0}
                            type="button"
                            className="btn btn-primary w-50"
                            onClick={submitTest}
                        >
                            Completar
                        </button>
                    </div>
                    <div>
                        {
                            showReceipt ?
                                <PDFDownloadLink
                                    document={<PaymentReceipt data={boletaData} />}
                                    fileName="boleta_pago.pdf"
                                >
                                    {({ loading }) => (loading ? "Generando PDF..." : "Descargar Boleta")}
                                </PDFDownloadLink> : null
                        }

                    </div>
                </form>
            </div>
        </div>
    )
}
