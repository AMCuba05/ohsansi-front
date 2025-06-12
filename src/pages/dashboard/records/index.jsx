import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { grades, provincies, states } from '../../../Constants/Provincies.js';
import { API_URL } from '../../../Constants/Utils.js';

const Records = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    const [filters, setFilters] = useState({
        department: '',
        province: '',
        area_id: '',
        course: '',
        olympiad_id: '',
        gender: '',
        birthdate_from: '',
        birthdate_to: ''
    });

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dateError, setDateError] = useState(null);

    const [options, setOptions] = useState({
        departments: states,
        provinces: provincies,
        areas: [],
        categories: grades,
        olympiads: [],
        genders: ['M', 'F']
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));

        // Validar fechas
        if (name === 'birthdate_from' || name === 'birthdate_to') {
            const fromDate = name === 'birthdate_from' ? value : filters.birthdate_from;
            const toDate = name === 'birthdate_to' ? value : filters.birthdate_to;

            if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
                setDateError('La fecha de fin no puede ser anterior a la fecha de inicio');
            } else {
                setDateError(null);
            }
        }
    };

    const clearFilters = () => {
        setFilters({
            department: '',
            province: '',
            area_id: '',
            category: '',
            olympiad_id: '',
            gender: '',
            birthdate_from: '',
            birthdate_to: ''
        });
        setDateError(null);
        fetchData(1);
    };

    const fetchData = async (page = 1) => {
        if (dateError) return; // Prevenir fetch si las fechas son inválidas
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page,
                itemsPerPage,
                ...Object.fromEntries(
                    Object.entries(filters).filter(([_, v]) => v !== '' && v !== null)
                )
            }).toString();

            const res = await axios.get(`${API_URL}/api/filter?${params}`);
            console.log(res.data);
            const { data: list, total, per_page, from } = res.data;

            if (!Array.isArray(list)) {
                throw new Error('La respuesta de la API no contiene una lista válida de registros');
            }

            setData(list || []);
            setTotalPages(Math.ceil(total / per_page) || 1);
            setCurrentPage(page);
        } catch (err) {
            console.error('Error al obtener registros:', err);
            setError(`No se pudieron cargar los registros: ${err.message}. Por favor, intenta de nuevo.`);
        } finally {
            setLoading(false);
        }
    };

    const fetchSelectOptions = async () => {
        try {
            const [areasRes, olympiadsRes] = await Promise.all([
                axios.get(`${API_URL}/api/areas`),
                axios.get(`${API_URL}/api/olympiads`)
            ]);

            setOptions(prev => ({
                ...prev,
                areas: areasRes.data.areas || [],
                olympiads: olympiadsRes.data.data || []
            }));

        } catch (err) {
            console.error('Error al cargar opciones de selección:', err);
            setError('No se pudieron cargar las opciones de filtro. Por favor, intenta de nuevo.');
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Reporte de Inscripciones', 14, 16);

        autoTable(doc, {
            startY: 20,
            head: [['#', 'Nombre', 'Departamento', 'Provincia', 'Área', 'Categoría', 'Olimpiada', 'Género']],
            body: data.map((item, idx) => [
                idx + 1,
                item.competitor || `${item.names || ''} ${item.last_names || ''}`.trim() || '-',
                item.school_department || '-',
                item.school_province || '-',
                item.selected_areas?.map(a => a.area || '').join(', ') || '-',
                item.selected_areas?.map(a => a.category || '').join(', ') || '-',
                item.olympiad || '-',
                item.gender || '-'
            ])
        });

        doc.save('reporte_inscripciones.pdf');
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data.map((item, idx) => ({
            '#': idx + 1,
            Nombre: item.competitor || `${item.names || ''} ${item.last_names || ''}`.trim() || '-',
            Departamento: item.school_department || '-',
            Provincia: item.school_province || '-',
            Área: item.selected_areas?.map(a => a.area || '').join(', ') || '-',
            Categoría: item.selected_areas?.map(a => a.category || '').join(', ') || '-',
            Olimpiada: item.olympiad || '-',
            Género: item.gender || '-'
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Inscripciones');
        XLSX.writeFile(workbook, 'reporte_inscripciones.xlsx');
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            fetchData(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => Number(prev + 1));
            fetchData(currentPage + 1);
        }
    };

    useEffect(() => {
        fetchSelectOptions();
    }, []);

    useEffect(() => {
        fetchData(currentPage);
    }, [filters]);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Registros de Inscripciones</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {dateError && <div className="alert alert-warning">{dateError}</div>}

            <Form className="mb-4">
                <Row>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Departamento</Form.Label>
                            <Form.Select name="department" value={filters.department} onChange={handleChange}>
                                <option value="">Todos</option>
                                {options.departments.map(dep => (
                                    <option key={dep.id} value={dep}>{dep}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Provincia</Form.Label>
                            <Form.Select name="province" value={filters.province} onChange={handleChange}>
                                <option value="">Todas</option>
                                {options.provinces.map(prov => (
                                    <option key={prov.id} value={prov}>{prov}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Área</Form.Label>
                            <Form.Select name="area_id" value={filters.area_id} onChange={handleChange}>
                                <option value="">Todas</option>
                                {options.areas.map(area => (
                                    <option key={area.id} value={area.id}>{area.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Curso</Form.Label>
                            <Form.Select name="course" value={filters.course} onChange={handleChange}>
                                <option value="">Todas</option>
                                {options.categories.map(cat => (
                                    <option key={cat.id} value={cat}>{cat}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Olimpiada</Form.Label>
                            <Form.Select name="olympiad_id" value={filters.olympiad_id} onChange={handleChange}>
                                <option value="">Todas</option>
                                {options.olympiads.map(oli => (
                                    <option key={oli.id} value={oli.id}>{oli.title}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Género</Form.Label>
                            <Form.Select name="gender" value={filters.gender} onChange={handleChange}>
                                <option value="">Todos</option>
                                {options.genders.map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Fecha de Nacimiento Desde</Form.Label>
                            <Form.Control
                                type="date"
                                name="birthdate_from"
                                value={filters.birthdate_from}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Fecha de Nacimiento Hasta</Form.Label>
                            <Form.Control
                                type="date"
                                name="birthdate_to"
                                value={filters.birthdate_to}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <div className="mt-4 d-flex gap-2">
                    <Button variant="primary" onClick={() => fetchData(1)} disabled={dateError}>Buscar</Button>
                    <Button variant="secondary" onClick={clearFilters}>Borrar Filtros</Button>
                    <Button variant="success" onClick={exportToExcel} disabled={!data.length || dateError}>Exportar Excel</Button>
                    <Button variant="danger" onClick={exportToPDF} disabled={!data.length || dateError}>Exportar PDF</Button>
                </div>
            </Form>

            {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
            ) : (
                <>
                    <Table striped bordered responsive>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Departamento</th>
                            <th>Provincia</th>
                            <th>Áreas</th>
                            <th>Categoría</th>
                            <th>Olimpiada</th>
                            <th>Género</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item, idx) => (
                            <tr key={item.id}>
                                <td>{idx + 1}</td>
                                <td>{item.competitor || `${item.names || ''} ${item.last_names || ''}`.trim() || '-'}</td>
                                <td>{item.school_department || '-'}</td>
                                <td>{item.school_province || '-'}</td>
                                <td>{item.selected_areas?.map(a => a.area || '').join(', ') || '-'}</td>
                                <td>{item.selected_areas?.map(a => a.category || '').join(', ') || '-'}</td>
                                <td>{item.olympiad || '-'}</td>
                                <td>{item.gender || '-'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <Button variant="secondary" onClick={handlePrevPage} disabled={currentPage === 1 || dateError}>
                            Anterior
                        </Button>
                        <span>Página {currentPage} de {totalPages}</span>
                        <Button variant="secondary" onClick={handleNextPage} disabled={currentPage === totalPages || dateError}>
                            Siguiente
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Records;