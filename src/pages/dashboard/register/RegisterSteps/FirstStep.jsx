import React, {useState, useEffect} from 'react';
import {useSteps} from 'react-step-builder'
import {Dropdown, ProgressBar, Card, Spinner} from 'react-bootstrap'
import axios from "axios";
import {useRegisterContext} from "../../../../Context/RegisterContext.jsx";

export const FirstStep = () => {
    const { registerData, setRegisterData } = useRegisterContext()
    const stepsState = useSteps()
    const [found, setFound] = useState(false)
    const [hasBeenQueried, setHasBeenQueried] = useState(false)
    const [olympiads, setOlympiads] = useState()
    const [loading, setLoading] = useState(true)

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

    const validate = () => {
        if (selected == null) return false;
        return true;
    }

    const submit = () => {
        setRegisterData({
            ...registerData,
            olympic_id: selected.id,
            olympic_name: selected.title
        })
        stepsState.next()
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
                                <Card.Text>
                                    <strong>Precio de inscripción por área:</strong> {selected.price} Bs
                                </Card.Text>
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
                            onClick={submit}
                        >
                            Siguiente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
