import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Link, NavLink, useNavigate} from 'react-router-dom';
import { API_URL } from "../../Constants/Utils.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'animate.css';
import './index.css';
import Olymp1 from "../../assets/images/olymp1.jpg";
import Olymp2 from "../../assets/images/olymp2.jpg";
import Olymp3 from "../../assets/images/olymp3.jpg";

const Home = () => {
    const [olympiads, setOlympiads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFaq, setActiveFaq] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();

    const slides = [
        {
            image: Olymp1,
            alt: "Estudiantes en competencia",
            title: "Competencias Vibrantes",
            caption: "Estudiantes de colegios compitiendo en la edición 2024.",
        },
        {
            image: Olymp2,
            alt: "Premiación O!SanSi",
            title: "Premiación Inolvidable",
            caption: "Ganadores reciben certificados en la UMSS.",
        },
        {
            image: Olymp3,
            alt: "Trabajo en equipo",
            title: "Premios",
            caption: "Medallistas de Olimpiadas ganan acceso directo a la UMSS",
        },
    ];

    useEffect(() => {
        const fetchOlympiads = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/olympiads`);
                const filtered = res.data.data.filter(o => o.status === true || o.status === 'published');
                setOlympiads(filtered);
            } catch (err) {
                console.error('Error al cargar las olimpiadas', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOlympiads();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const handlePrev = () => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const handleClick = (id) => {
        navigate(`/dashboard/Home/olympiad/${id}/info`);
    };

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const faqs = [
        {
            question: '¿Quiénes pueden participar?',
            answer: 'Estudiantes de primaria y secundaria del sistema educativo regular de Bolivia, con cédula de identidad vigente y un tutor, representando a sus colegios.',
        },
        {
            question: '¿Cómo participar?',
            answer: 'Inscríbete a través del sitio oficial de las Olimpiadas San Simón: <a href="https://ohsansi.umss.edu.bo/" target="_blank" rel="noopener noreferrer">ohsansi.umss.edu.bo</a>.',
        },
        {
            question: '¿Dónde se desarrollará la Olimpiada?',
            answer: 'En la Universidad Mayor de San Simón, Facultad de Ciencias y Tecnología, Cochabamba.',
        },
    ];

    return (
        <div className="home-container">

            {/* Hero Section */}
            <section className="hero-section text-center text-white py-5 mb-5">
                <div className="container">
                    <h1 className="display-3 fw-bold mb-4 animate__animated animate__zoomIn">O!SanSi Olimpiadas
                        2025</h1>
                    <p className="lead mb-4 animate__animated animate__fadeIn animate__delay-1s">
                        La Olimpiada de Ciencias O!SanSi, organizada por la UMSS, invita a estudiantes de primaria y
                        secundaria de toda Bolivia a representar a sus colegios en una emocionante competencia de
                        Matemáticas, Física, Química, Biología, Astronomía, Astrofísica, Informática y Robótica.
                    </p>
                    <a href="#olympiads"
                       className="btn btn-primary-home btn-lg mt-3 animate__animated animate__fadeIn animate__delay-2s">Explora
                        las Competencias</a>
                </div>
            </section>

            <section className="gallery-section">
                <div className="container">
                    <h2 className="text-center mb-4 fw-bold text-primary">Momentos Destacados de O!SanSi</h2>
                    <div className="custom-carousel">
                        <div className="carousel-wrapper">
                            {slides.map((slide, index) => (
                                <div
                                    key={index}
                                    className={`carousel-slide ${index === activeIndex ? 'active' : ''}`}
                                >
                                    <img
                                        src={slide.image}
                                        className="d-block w-100 rounded"
                                        alt={slide.alt}
                                    />
                                    <div className="carousel-caption d-none d-md-block">
                                        <h5>{slide.title}</h5>
                                        <p>{slide.caption}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" onClick={handlePrev}>
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Anterior</span>
                        </button>
                        <button className="carousel-control-next" onClick={handleNext}>
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Siguiente</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Objectives Section */}
            <section className="objectives-section py-5 bg-light">
                <div className="container">
                    <h2 className="text-center mb-4 fw-bold text-primary">Objetivos de O!SanSi</h2>
                    <p className="text-center text-muted mb-5 lead">
                        La Olimpiada O!SanSi busca inspirar y desarrollar el talento científico de los estudiantes
                        bolivianos.
                    </p>
                    <div className="row g-4">
                        {[
                            {
                                icon: 'bi-lightbulb',
                                title: 'Fomentar el Interés Científico',
                                description: 'Promover la curiosidad, el aprendizaje lúdico y vocaciones en ciencias entre los jóvenes.',
                            },
                            {
                                icon: 'bi-gem',
                                title: 'Identificar y Estimular Talento',
                                description: 'Proporcionar una plataforma para destacar habilidades y motivar estudios futuros.',
                            },
                            {
                                icon: 'bi-globe',
                                title: 'Promover la Cultura Científica',
                                description: 'Difundir conocimientos y fomentar la participación social en actividades científicas.',
                            },
                            {
                                icon: 'bi-people',
                                title: 'Fortalecer Lazos Educativos',
                                description: 'Establecer comunicación con unidades educativas y dar a conocer las actividades de la UMSS.',
                            },
                        ].map((objective, index) => (
                            <div key={index} className="col-md-4 col-lg-3">
                                <div
                                    className="card h-100 shadow-sm objective-card animate__animated animate__fadeIn animate__delay-1s">
                                    <div className="card-body text-center">
                                        <i className={`bi ${objective.icon} fs-2 text-primary mb-3`}></i>
                                        <h5 className="card-title text-primary">{objective.title}</h5>
                                        <p className="card-text text-muted">{objective.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Olympiads Section */}
            <div className="container py-5" id="olympiads">
                <h2 className="text-center mb-4 fw-bold text-primary">Competencias Disponibles</h2>
                <p className="text-center text-muted mb-5 lead">
                    Organizadas por la Facultad de Ciencias y Tecnología de la UMSS, las Olimpiadas O!SanSi desafían a
                    estudiantes de colegios de toda Bolivia a demostrar su talento en un escenario nacional.
                </p>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-2">Cargando olimpiadas...</p>
                    </div>
                ) : olympiads.length === 0 ? (
                    <div className="alert alert-info text-center" role="alert">
                        No hay olimpiadas publicadas actualmente. ¡Vuelve pronto para más información!
                    </div>
                ) : (
                    <div className="row g-4">
                        {olympiads.map((olymp, index) => (
                            <div key={olymp.id} className="col-md-6 col-lg-4">
                                <div
                                    className={`card h-100 shadow-sm olympiad-card animate__animated animate__fadeInUp animate__delay-${index % 3}s`}
                                    onClick={() => handleClick(olymp.id)}>
                                    <div className="card-img-top text-center py-4 bg-primary text-white">
                                        <i className={`bi ${getIconForCategory(olymp.category)} fs-1`}></i>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title text-primary fw-bold">{olymp.title}</h5>
                                        <p className="card-text text-muted">
                                            <strong>Inicio:</strong> {new Date(olymp.start_date).toLocaleDateString('es-ES')}
                                            <br/>
                                            <strong>Fin:</strong> {new Date(olymp.end_date).toLocaleDateString('es-ES')}
                                            <br/>
                                            <strong>Categoría:</strong> {olymp.category || 'General'}
                                        </p>
                                        <p className="card-text">
                                            {olymp.description.length > 100
                                                ? olymp.description.slice(0, 100) + '...'
                                                : olymp.description}
                                        </p>
                                    </div>
                                    <div className="card-footer bg-transparent border-0 text-end">
                                        <button className="btn btn-outline-primary btn-sm">Ver más →</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            {/* Testimonials Section */}
            <section className="testimonials-section py-5 bg-light">
                <div className="container">
                    <h2 className="text-center mb-4 fw-bold text-primary">Voces de los Participantes</h2>
                    <p className="text-center text-muted mb-5 lead">
                        Escucha lo que dicen los estudiantes que han representado a sus colegios en O!SanSi en la UMSS.
                    </p>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card shadow-sm testimonial-card">
                                <div className="card-body text-center">
                                    <p className="card-text">"Representar a mi colegio en O!SanSi fue un honor. Aprendí
                                        mucho y me motivó a seguir estudiando."</p>
                                    <h6 className="card-title text-primary">María Gonzales</h6>
                                    <p className="text-muted">Colegio San Ignacio, Ganadora de Oro en Matemáticas,
                                        2024</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card shadow-sm testimonial-card">
                                <div className="card-body text-center">
                                    <p className="card-text">"La competencia me inspiró a soñar con una carrera en
                                        informática mientras representaba a mi colegio."</p>
                                    <h6 className="card-title text-primary">Juan Pérez</h6>
                                    <p className="text-muted">Colegio Don Bosco, Participante en Informática, 2024</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card shadow-sm testimonial-card">
                                <div className="card-body text-center">
                                    <p className="card-text">"Competir en la UMSS fue increíble. ¡Quiero volver a
                                        representar a mi colegio!"</p>
                                    <h6 className="card-title text-primary">Ana López</h6>
                                    <p className="text-muted">Colegio Santa Ana, Finalista en Física, 2024</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section py-5">
                <div className="container">
                    <h2 className="text-center mb-4 fw-bold text-primary">Preguntas Frecuentes</h2>
                    <div className="faq-container">
                        {faqs.map((faq, index) => (
                            <div key={index} className="faq-item">
                                <button
                                    className={`faq-button ${activeFaq === index ? 'active' : ''}`}
                                    onClick={() => toggleFaq(index)}
                                >
                                    {faq.question}
                                    <i className={`bi ${activeFaq === index ? 'bi-chevron-up' : 'bi-chevron-down'} ms-2`}></i>
                                </button>
                                <div className={`faq-content ${activeFaq === index ? 'show' : ''}`}>
                                    <p dangerouslySetInnerHTML={{__html: faq.answer}}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta-section text-center text-white py-5">
                <div className="container">
                    <h2 className="mb-4 fw-bold">¡Inscríbete en O!SanSi 2025!</h2>
                    <p className="lead mb-4">
                        Representa a tu colegio en la UMSS y compite en la experiencia científica más emocionante de
                        Bolivia.
                    </p>
                    <NavLink to="/dashboard/inscripcion-sencilla" rel="noopener noreferrer"
                       className="btn btn-primary-home btn-lg">Inscripciones</NavLink>
                </div>
            </section>
        </div>
    );
};

// Helper function to assign icons based on category
const getIconForCategory = (category) => {
    switch (category?.toLowerCase()) {
        case 'matemáticas':
            return 'bi-calculator';
        case 'física':
            return 'bi-gear';
        case 'química':
            return 'bi-flask';
        case 'biología':
            return 'bi-flower1';
        case 'astronomía':
        case 'astrofísica':
            return 'bi-stars';
        case 'informática':
            return 'bi-code-slash';
        case 'robótica':
            return 'bi-robot';
        default:
            return 'bi-book';
    }
};

export default Home;