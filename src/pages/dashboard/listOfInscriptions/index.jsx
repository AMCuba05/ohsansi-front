import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spinner, Form, Row, Col, Alert, Button } from 'react-bootstrap';

const ListOfInscriptions = () => {
    const [inscriptions, setInscriptions] = useState([]);
    const [filteredInscriptions, setFilteredInscriptions] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [totals, setTotals] = useState({ paid: 0, pending: 0 });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const fetchInscriptions = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://willypaz.dev/projects/ohsansi-api/api/inscriptions');
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
        let paid = 0;
        let pending = 0;

        data.forEach(item => {
            const areas = item.inscription?.selected_areas || [];
            const hasPaidAll = areas.length > 0 && areas.every(area => area.paid_at !== null);

            if (hasPaidAll) paid++;
            else pending++;
        });

        setTotals({ paid, pending });
    };

    const fetchByStatus = async (status) => {
        setLoading(true);
        const statusEs = status === 'completed' ? 'completed' : 'pending'
        const data  = inscriptions.filter(i => i.status === statusEs)
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
                        <option value="Pendiente">Pendiente</option>
                        <option value="En proceso">Pagados</option>
                    </Form.Select>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={3}>
                    <Alert variant="success">Pagados: {totals.paid}</Alert>
                </Col>
                <Col md={3}>
                    <Alert variant="warning">Pendientes: {totals.pending}</Alert>
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
                                    <td>{item.status === "completed" ? 'Pagado' : 'Pendiente'}</td>


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