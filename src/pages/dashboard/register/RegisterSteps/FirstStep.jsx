import React, {useState, useEffect} from 'react';
import {useSteps} from 'react-step-builder'
import {Dropdown, ProgressBar, Card, Spinner} from 'react-bootstrap'
import axios from "axios";

export const FirstStep = () => {
    const stepsState = useSteps()
    const [found, setFound] = useState(false)
    const [hasBeenQueried, setHasBeenQueried] = useState(false)
    const [ci, setCi] = useState("")
    const [olympiads, setOlympiads] = useState()
    const [loading, setLoading] = useState(true)

    const olimpiadas = [
        {
            title: 'Olimpiada de Matemáticas',
            description: 'Competencia donde los estudiantes demuestran sus habilidades en resolución de problemas matemáticos de diferentes niveles de dificultad.'
        },
        {
            title: 'Olimpiada de Ciencias',
            description: 'Evento académico donde se evalúan los conocimientos y habilidades en diversas ramas de la ciencia como física, química y biología.'
        },
        {
            title: 'Olimpiada de Informática',
            description: 'Competencia de programación y algoritmos donde los estudiantes resuelven desafíos computacionales utilizando diferentes lenguajes de programación.'
        }
    ];

    const [selected, setSelected] = useState(null);

    const handleSelect = (index) => {
        setSelected(olympiads[index]);
    };

    useEffect(() => {
        axios.get('https://willypaz.dev/projects/ohsansi-api/api/olympics')
            .then(response => {
                setOlympiads(response.data.Olympics);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener las olimpiadas:', error);
                setLoading(false);
            });
    }, []);

    function validate() {
        if (selected == null) return false;
        return true;
    }

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card shadow p-4" style={{ width: '40vw' }}>
                <span>Paso {stepsState.current} de {stepsState.total} </span>
                <ProgressBar
                    now={stepsState.progress * 100}
                    label={`${Math.round(stepsState.progress * 100)}%`}
                    animated
                    striped
                    variant={"success"}
                    style={{ height: '1.5rem', fontSize: '0.9rem' }}
                />
                <h2 className="mb-3 mt-4">Paso 1: Seleccionar Olimpiada</h2>
                <p className="text-muted mb-4">
                    Por favor, seleccione la olimpiada en la que desea inscribir al estudiante. Una vez seleccionada, podrá completar el formulario de registro correspondiente. Podrás elegir la categoría adecuada más adelante en proceso de inscripción.
                </p>

                <form>
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <Dropdown onSelect={handleSelect}>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                {selected ? selected.title : 'Seleccionar Olimpiada'}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {olympiads.map((olympiad, index) => (
                                    <Dropdown.Item key={index} eventKey={index}>
                                        {olympiad.title}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    )}


                    {selected && (
                        <Card className="mt-4">
                            <Card.Body>
                                <Card.Title>{selected.title}</Card.Title>
                                <Card.Text>{selected.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    )}
                    {hasBeenQueried && !found ? <p className="text-danger">Carnet no encontrado, ingresa los datos manualmente</p> : null}
                    {hasBeenQueried && found ?  <p className="text-success">Datos cargados correctamente.</p> : null}

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
                            disabled={!stepsState.hasNext || !validate()}
                            type="submit"
                            className="btn btn-primary w-50"
                            onClick={stepsState.next}
                        >
                            Siguiente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
