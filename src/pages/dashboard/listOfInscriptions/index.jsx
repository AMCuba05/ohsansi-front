import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spinner, Form, Row, Col, Alert, Button } from 'react-bootstrap';
import { API_URL } from '../../../Constants/Utils';

const ListOfInscriptions = () => {
    const [inscriptions, setInscriptions] = useState([]);
    const [filteredInscriptions, setFilteredInscriptions] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [totals, setTotals] = useState({ paid: 0, pending: 0 });
    console.log(inscriptions);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const fetchInscriptions = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/inscriptions`);
            const data = response.data || [];
            console.log(response.data)
            setInscriptions(data);
            setFilteredInscriptions(data);
            calculateTotals(data);
        } catch (error) {
            console.error('Error al cargar inscripciones:', error);
        }
        setLoading(false);
    };

    const calculateTotals = (data) => {
        let draft = 0;
        let pending = 0;
        let completed = 0;

        data.forEach(item => {
            const status = item.status;

            if (status === 'draft') {
                draft++;
            } else if (status === 'pending') {
                pending++;
            } else if (status === 'completed') {
                completed++;
            }
        });

        setTotals({ draft, pending, completed });
    };


    const fetchByStatus = async (status) => {
        setLoading(true);

        const data = inscriptions.filter(i => i.status === status);
        setFilteredInscriptions(data);

        setLoading(false);
    };


    useEffect(() => {
        fetchInscriptions();
    }, []);

    const handleStatusChange = (e) => {
        const selected = e.target.value;
        setStatusFilter(selected);
        setCurrentPage(1);
        if (selected) {
            fetchByStatus(selected);
        } else {
            fetchInscriptions();
        }
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        const maxPage = Math.ceil(filteredInscriptions.length / itemsPerPage);
        setCurrentPage(prev => Math.min(prev + 1, maxPage));
    };

    // Paginación lógica
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const paginatedData = filteredInscriptions.slice(startIdx, endIdx);
    const totalPages = Math.ceil(filteredInscriptions.length / itemsPerPage);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Records de Inscripción</h2>

            <Row className="mb-3">
                <Col md={4}>
                    <Form.Select value={statusFilter} onChange={handleStatusChange}>
                        <option value="">Filtrar por estado</option>
                        <option value="draft">No completados</option>
                        <option value="pending">Pendiente</option>
                        <option value="completed">Pagados</option>
                    </Form.Select>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={3}>
                    <Alert variant="success">Pagados: {totals.completed}</Alert>
                </Col>
                <Col md={3}>
                    <Alert variant="warning">Pendientes: {totals.pending}</Alert>
                </Col>
                <Col md={3}>
                    <Alert variant="danger">Inscripcion no completada: {totals.draft}</Alert>
                </Col>
            </Row>

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" />
                </div>
            ) : (
                <>
                    <Table striped bordered hover responsive>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Competidor</th>
                            <th>Responsable</th>
                            <th>Colegio</th>
                            <th>Estado inscripción</th>

                        </tr>
                        </thead>
                        <tbody>
                        {paginatedData.map((item, index) => {
                            const inscription = item.inscription || {};
                            const selectedAreas = inscription.selected_areas || [];
                            const hasPaid = selectedAreas.some(area => area.paid_at);

                            return (
                                <tr key={item.id}>
                                    <td>{startIdx + index + 1}</td>
                                    <td>{item.competitor}</td>
                                    <td>{item.accountable}</td>
                                    <td>{item.school || '-'}</td>
                                    <td>
                                        {item.status === "completed"
                                            ? "Pagado"
                                            : item.status === "pending"
                                                ? "Pendiente"
                                                : "Borrador"}
                                    </td>


                                </tr>
                            );
                        })}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <Button variant="secondary" onClick={handlePrevPage} disabled={currentPage === 1}>
                            Anterior
                        </Button>

                        <span>Página {currentPage} de {totalPages}</span>

                        <Button variant="secondary" onClick={handleNextPage} disabled={currentPage === totalPages}>
                            Siguiente
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ListOfInscriptions;