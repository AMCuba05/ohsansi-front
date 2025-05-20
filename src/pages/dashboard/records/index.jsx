import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {grades, provincies, states} from "../../../Constants/Provincies.js";

const Records = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    const [filters, setFilters] = useState({
        departamento: '',
        provincia: '',
        area: '',
        categoria: '',
        olimpiada: '',
        genero: ''
    });

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Opciones para los selects
    const [options, setOptions] = useState({
        departamentos: [],
        provincias: [],
        areas: [],
        categorias: [],
        olimpiadas: [],
        generos: ['Masculino', 'Femenino', 'Otro']
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const fetchData = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                ...filters,
                page,
                itemsPerPage,
            }).toString();
            const res = await axios.get(`https://willypaz.dev/projects/ohsansi-api/api/filter?${params}`);
            console.log(res)
            const { data: list, total, limit: per_page, page: from } = res.data;
            setData(list || []);
            setTotalPages(Math.ceil(total / per_page));
            setCurrentPage(from);
        } catch (err) {
            console.error('Error al obtener registros:', err);
        }
        setLoading(false);
    };


    const fetchSelectOptions = async () => {
        try {
            const [
                areas,
                categorias,
                olimpiadas
            ] = await Promise.all([

                axios.get('/api/areas'),
                axios.get('/api/categorias'),
                axios.get('/api/olimpiadas')
            ]);

            setOptions({
                ...options,
                departamentos: states,
                provincias: provincies,
                areas: [],
                categorias: grades,
                olimpiadas: [],
            });
        } catch (err) {
            console.error('Error al cargar opciones:', err);
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
                `${item.competitor}`,
                item.department || '',
                item.province || '',
                item.inscription?.selected_areas?.map(a => a.area?.name).join(', ') || '',
                item.inscription?.category?.name || '',
                item.inscription?.olympiad?.name || '',
                item.gender || ''
            ]),
        });

        doc.save('reporte_inscripciones.pdf');
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data.map((item, idx) => ({
            '#': idx + 1,
            Nombre: `${item.names} ${item.last_names}`,
            Email: item.email,
            Departamento: item.department || '',
            Provincia: item.province || '',
            Área: item.inscription?.selected_areas?.map(a => a.area?.name).join(', ') || '',
            Categoría: item.inscription?.category?.name || '',
            Olimpiada: item.inscription?.olympiad?.name || '',
            Género: item.gender || ''
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Inscripciones');
        XLSX.writeFile(workbook, 'reporte_inscripciones.xlsx');
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        const maxPage = Math.ceil(data.length / itemsPerPage);
        setCurrentPage(prev => Math.min(prev + 1, maxPage));
    };

    useEffect(() => {
        fetchSelectOptions();
        fetchData(1);
    }, []);


    return (
        <div className="container mt-4">
            <h2 className="mb-4">Registros de Inscripciones</h2>

            {/* Filtros */}
            <Form className="mb-4">
                <Row>
                    <Col md={4}><Form.Group>
                        <Form.Label>Departamento</Form.Label>
                        <Form.Select name="departamento" value={filters.departamento} onChange={handleChange}>
                            <option value="">Todos</option>
                            {options?.departamentos.map(dep => (
                                <option key={dep.id} value={dep.name}>{dep.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group></Col>

                    <Col md={4}><Form.Group>
                        <Form.Label>Provincia</Form.Label>
                        <Form.Select name="provincia" value={filters.provincia} onChange={handleChange}>
                            <option value="">Todas</option>
                            {options?.provincias?.map(prov => (
                                <option key={prov.id} value={prov.name}>{prov.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group></Col>

                    <Col md={4}><Form.Group>
                        <Form.Label>Área</Form.Label>
                        <Form.Select name="area" value={filters.area} onChange={handleChange}>
                            <option value="">Todas</option>
                            {options?.areas?.map(area => (
                                <option key={area.id} value={area.name}>{area.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group></Col>
                </Row>

                <Row className="mt-3">
                    <Col md={4}><Form.Group>
                        <Form.Label>Categoría</Form.Label>
                        <Form.Select name="categoria" value={filters.categoria} onChange={handleChange}>
                            <option value="">Todas</option>
                            {options?.categorias?.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group></Col>

                    <Col md={4}><Form.Group>
                        <Form.Label>Olimpiada</Form.Label>
                        <Form.Select name="olimpiada" value={filters.olimpiada} onChange={handleChange}>
                            <option value="">Todas</option>
                            {options?.olimpiadas?.map(oli => (
                                <option key={oli.id} value={oli.name}>{oli.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group></Col>

                    <Col md={4}><Form.Group>
                        <Form.Label>Género</Form.Label>
                        <Form.Select name="genero" value={filters.genero} onChange={handleChange}>
                            <option value="">Todos</option>
                            {options?.generos?.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </Form.Select>
                    </Form.Group></Col>
                </Row>

                <div className="mt-4 d-flex gap-2">
                    <Button variant="primary" onClick={() => fetchData(1)}>Buscar</Button>
                    <Button variant="success" onClick={exportToExcel} disabled={!data.length}>Exportar Excel</Button>
                    <Button variant="danger" onClick={exportToPDF} disabled={!data.length}>Exportar PDF</Button>
                </div>
            </Form>

            {/* Resultados */}
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
                            <th>Categorías</th>
                            <th>Olimpiada</th>
                            <th>Género</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item, idx) => (
                            <tr key={item.id}>
                                <td>{idx + 1}</td>
                                <td>{item.competitor}</td>
                                <td>{item.department}</td>
                                <td>{item.province}</td>
                                <td>{item.selected_areas?.map(a => a.area).join(', ')}</td>
                                <td>{item.selected_areas?.map(a => a.category).join(', ')}</td>
                                <td>{item.olympiad}</td>
                                <td>{item.gender}</td>
                            </tr>
                        ))}
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

export default Records;
