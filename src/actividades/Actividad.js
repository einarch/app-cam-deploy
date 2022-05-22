import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { ButtonToolbar, Form, Image } from 'react-bootstrap';
import { useFormik, useField, useFormikContext } from "formik";
import * as Yup from "yup";
import dateFormat, { masks } from "dateformat";
import TextTruncate from 'react-text-truncate';
import './../actividades/Actividad.css';
import avatar from './../imagenes/avatar.jpg'
import actividadDef from './../imagenes/actividadDef.png'
import configData from "../config/config.json";
import { Row, Col, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faClock } from '@fortawesome/free-solid-svg-icons';

const Actividad = ({ children }) => {

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
        setData(data);
    }

    const [selectedFile, setSelectedFile] = useState();
    const [isSelected, setIsSelected] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);

    const getActivitiesURL = configData.ACTIVITIES_API_URL;
    const postActivityURL = configData.CREAR_ACTIVIDAD_API_URL;

    const [data, setData] = useState([]);


    // Configurando fecha minima valida
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var minValidDate = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);

    // Manejando validaciones de todos los campos del formulario de Actividad
    const { handleSubmit, resetForm, handleChange, values, touched, errors, handleBlur, isValid, isSubmitting } = useFormik({
        initialValues: { name: "", dateTimeActivity: "", location: "", description: "" },
        onSubmit: (values, { setSubmitting, resetForm }) => {
            createNewActivity();
            // When button submits form and form is in the process of submitting, submit button is disabled
            setSubmitting(true);

            // Simulate submitting to database, shows us values submitted, resets form
            setTimeout(() => {
                resetForm();
                setSubmitting(false);
            }, 500);
        },

        validationSchema: Yup.object().shape({
            name: Yup.string()
                .required("Este campo es requerido")
                .min(4, "Nombre debe tener minimo 4 caracteres")
                .max(80, "Nombre debe tener maximo 80 caracteres"),
            dateTimeActivity: Yup.date()
                .min(minValidDate, "La hora debe ser posterior a la actual")
                .required("Introduzca una fecha y hora"),
            location: Yup.string()
                .required("Introduzca una ubicación")
                .min(4, "Ubicación debe tener minimo 4 caracteres")
                .max(255, "Ubicación debe tener máximo 255 caracteres"),
            description: Yup.string()
                .min(4, "Descripción debe tener minimo 4 caracteres")
                .max(255, "Descripción debe tener máximo 255 caracteres"),

        })
    })

    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsSelected(true);
    };

    //  Guardar una imagen en un server de imagenes
    const postImage = async () => {
        const formData = new FormData();

        formData.append('file', selectedFile);

        console.log("Selected File: ", selectedFile);
        console.log("File: ", formData);

        var contentLength = JSON.stringify(formData).length;

        const response = await fetch(
            'https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', {
            method: 'POST',
            body: JSON.stringify(formData),
            mode: 'no-cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            }
                .then((response) => response.json())
                .then((result) => {
                    console.log('Success:', result);
                })
                .catch((error) => {
                    console.error('Error:', error);
                })

        });
        const res = await response.json();
        console.log("Imagen Posteada: " + res);
        var imageURL = res.image.url;
        return res;
    };

    // Obtener todas las actividades registradas desde backend
    const getAllActivities = async () => {
        await axios.get(getActivitiesURL)
            .then(response => {
                setData(response.data);
            }).catch(error => {
                console.log(error);
            })
    }

    // Hacer un POST al backend para crear una Actividad
    const postActivity = async (url, datos) => {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(datos),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const res = await response.json();
        return res;
    }

    // Construir una actividad con los datos introducidos
    let userID = localStorage.getItem("user");
    const createNewActivity = async () => {
        var imageURL = postImage();
        const datos = {
            "userID": userID,
            "nombre": values.name,
            "fechaHora": values.dateTimeActivity,
            "ubicacion": values.location,
            "descripcion": values.description,
            "image": imageURL,
        };
        console.log("Actividad: " + JSON.stringify(datos));
        const respuestaJson = await postActivity(postActivityURL, datos);
        console.log("Response: " + respuestaJson);
        window.location = window.location.href;
    }

    const configDateLimits = async () => {
        var tzoffset = (new Date()).getTimezoneOffset() * 60000;
        var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);

        console.log("Fecha: " + localISOTime);
        document.getElementsByName("dateTimeActivity")[0].min = localISOTime;
    }

    const getMonth = (dateIn) => {
        var date = new Date(dateIn);
        var monthName = date.toLocaleString('es-es', { month: 'long' });
        monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        return monthName;
    };

    const getDayNumber = (dateIn) => {
        var date = new Date(dateIn);
        var dayNumber = date.toLocaleString('es-es', { day: 'numeric' });
        dayNumber = dayNumber.charAt(0).toUpperCase() + dayNumber.slice(1);
        return dayNumber;
    };

    const getDayName = (dateIn) => {
        var date = new Date(dateIn);
        var dayName = date.toLocaleString('es-es', { weekday: 'long' });
        dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
        return dayName;
    };

    const getTimeAct = (dateIn) => {
        var date = new Date(dateIn);
        var timeAct = date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        return timeAct;
    };

    useEffect(() => {
        configDateLimits();
        getAllActivities();
    }, [])

    return (
        <><div>
            <br />
            <br />
            <br />
        </div><>
                <br />
                <br />
                <h2 className="sectionTitle">Actividades y Eventos</h2>
                <br />
                <Container className="d-flex flex-row justify-content-end">
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createActivity">Crear</button>
                </Container>
                <div align="center">
                    <div className="modal fade" id="createActivity" tabIndex="-1" aria-hidden="true" aria-labelledby="modalTitle" data-bs-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modalColor d-flex flex-row justify-content-center">
                                    <h3 className="textTitleForm">Crear Actividad</h3>
                                </div>
                                <div className="modal-body tam p-3 modalColor">
                                    <Form id="createActivityForm" className="row g-3" noValidate onSubmit={handleSubmit}>
                                        <Form.Group className="col-md-12">
                                            <Form.Label className="form-label textLabel d-flex flex-row align-items-left">Nombre*</Form.Label>
                                            <Form.Control
                                                type="text"
                                                id="name"
                                                name="name"
                                                className={errors.name && touched.name && "error"}
                                                class="form-control"
                                                placeholder="Ingrese el nombre de la actividad"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.name}
                                                required>
                                            </Form.Control>
                                            <Form.Text className="errorMessModal d-flex flex-row" muted>
                                                {errors.name && touched.name && (
                                                    <div className="input-feedback">{errors.name}</div>
                                                )}
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group className="col-md-12">
                                            <Form.Label className="form-label textLabel d-flex flex-row align-items-left">Fecha y Hora*</Form.Label>
                                            <Form.Control
                                                type="datetime-local"
                                                min="2022-05-14T02:10"
                                                className={errors.dateTimeActivity && touched.dateTimeActivity && "error"}
                                                class="form-control"
                                                id="dateTimeActivity"
                                                name="dateTimeActivity"
                                                placeholder="Ingrese una fecha y hora"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.dateTimeActivity}
                                                required>
                                            </Form.Control>
                                            <Form.Text className="errorMessModal d-flex flex-row" muted>
                                                {errors.dateTimeActivity && touched.dateTimeActivity && (
                                                    <div className="input-feedback">{errors.dateTimeActivity}</div>
                                                )}
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group className="col-md-12">
                                            <Form.Label className="form-label textLabel d-flex flex-row align-items-left">Ubicación*</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                className={errors.location && touched.location && "error"}
                                                class="form-control"
                                                id="location"
                                                name="location"
                                                placeholder="Ingrese una ubicación"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.location}
                                                required>
                                            </Form.Control>
                                            <Form.Text className="errorMessModal d-flex flex-row" muted>
                                                {errors.location && touched.location && (
                                                    <div className="input-feedback">{errors.location}</div>
                                                )}
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group className="col-md-12">
                                            <Form.Label className="form-label textLabel d-flex flex-row align-items-left">Descripción</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                className={errors.description && touched.description && "error"}
                                                class="form-control"
                                                id="description"
                                                name="description"
                                                placeholder="Ingrese una descripción"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.description}>
                                            </Form.Control>
                                            <Form.Text className="errorMessModal d-flex flex-row" muted>
                                                {errors.description && touched.description && (
                                                    <div className="input-feedback">{errors.description}</div>
                                                )}
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group className="col-md-12">
                                            <Form.Label className="form-label textLabel d-flex flex-row align-items-left">Imagen</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="imageFile"
                                                id="imageFile"
                                                onChange={changeHandler}
                                            />
                                        </Form.Group>
                                    </Form>
                                </div>
                                <div className="model-footer col-12 modalColor">
                                    <Form.Text className="d-flex flex-column align-items-center" muted>
                                        {!isValid
                                            && !values.name
                                            && !values.dateTimeActivity
                                            && !values.location
                                            && !values.description ?
                                            <div className="input-feedback">{"Por favor rellene el formulario correctamente"} </div> : null}
                                    </Form.Text>
                                    <button
                                        as="Input"
                                        class="btn btn-secondary col-3 m-2"
                                        data-bs-dismiss="modal"
                                        onClick={resetForm}
                                    >Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        as="Input"
                                        class="btn btn-success col-3 m-2"
                                        data-bs-dismiss={touched.name && !errors.name
                                            && touched.dateTimeActivity && !errors.dateTimeActivity
                                            && touched.location && !errors.location
                                            && touched.description && !errors.description ? "modal" : null}
                                        onClick={handleSubmit}
                                    >Crear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Container className="p-4 mb-4">
                    <Row xs={1} md={3} className="g-4">
                        {Array.from(data).map(actividad => (
                            <Col>
                                <Card key={actividad.FECHAHORAA} className="cardSec text-center">
                                    <div className='cardImageSize mb-3'>
                                        <Card.Img className="cardItemImage" src={actividad.IMAGEN ? actividad.IMAGEN : actividadDef} />
                                    </div>
                                    <Card.Body className="col-sm-12 d-flex flex-column align-items-center justify-content-center">
                                        <Card.Text>
                                            <div className="col-sm-12">
                                                <div className='cardTitleSec'>
                                                    <TextTruncate
                                                        className="cardItmTitle"
                                                        line={2}
                                                        element="h3"
                                                        truncateText="…"
                                                        text={actividad.ACTIVIDAD}
                                                    />
                                                </div>
                                                <div className="cardItmHeaderAct d-flex justify-content-center align-items-center">
                                                    <div className="col-sm-3">
                                                        <img src={avatar} className="rounded-circle" height="60" width="60"></img>
                                                    </div>
                                                    <div className="col-sm-6" >
                                                        <h4 className="cardItmUserName"><b>{actividad.NOMBRE} {actividad.APELLIDO}</b></h4>
                                                    </div>
                                                    <div className="col-sm-4 cartItmDate mb-2" >
                                                        <time class="icon mb-3">
                                                            <em>{getDayName(actividad.FECHAHORAA)}</em>
                                                            <strong>{getMonth(actividad.FECHAHORAA)}</strong>
                                                            <span>{getDayNumber(actividad.FECHAHORAA)}</span>
                                                        </time>
                                                        <FontAwesomeIcon icon={faClock} style={{ color: "#1464b4" }} />
                                                        <span className="cardItmText"><b> {getTimeAct(actividad.FECHAHORAA)}</b></span>
                                                    </div>
                                                </div>
                                                <div className='d-flex flex-row justify-content-center'>
                                                    <FontAwesomeIcon icon={faLocationDot} style={{ color: "#1464b4" }} />
                                                </div>
                                                <TextTruncate
                                                        className="cardItmText"
                                                        line={2}
                                                        element="span"
                                                        truncateText="…"
                                                        text={actividad.UBICACIONA}
                                                    />
                                            </div>
                                        </Card.Text>
                                        <button
                                            class="btn btn-success"
                                            onClick={handleShow}>
                                            Ver detalle
                                        </button>
                                        <Modal
                                            show={show}
                                            onHide={handleClose}
                                            size="lg"
                                            aria-labelledby="contained-modal-title-vcenter"
                                            centered >
                                            <Modal.Header className="d-flex flex-row justify-content-center">
                                                <Modal.Title className="textTitleForm">Detalle de Actividad</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <Row>
                                                    <Col xs={6} md={5}>
                                                        <div className='h-100 d-flex justify-content-center align-items-center'>
                                                            <Image
                                                                src={actividad.IMAGEN ? actividad.IMAGEN : actividadDef}
                                                                className='img-fluid rounded'
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col xs={12} md={7}>
                                                        <h6 className="textLabel label">Nombre: </h6>
                                                        <span className="textInfoModal"> {actividad.NOMBRE} {actividad.APELLIDO}</span>
                                                        <h6 className="textLabel label">Actividad: </h6>
                                                        <span className="textInfoModal"> {actividad.ACTIVIDAD}</span>
                                                        <h6 className="textLabel">Fecha y hora: </h6>
                                                        <span className="textInfoModal">{dateFormat(actividad.FECHAHORAA, "dd/mm/yyyy h:MM TT")}</span>
                                                        <h6 className="textLabel">Ubicación: </h6>
                                                        <span className="textInfoModal">{actividad.UBICACIONA}</span>
                                                        <h6 className="textLabel">Descripción: </h6>
                                                        <span className="textInfoModal">{actividad.DESCRIPCIONA}</span>
                                                    </Col>
                                                </Row>

                                            </Modal.Body>
                                            <Modal.Footer>
                                                <button className="btn btn-primary" onClick={handleClose}>
                                                    Cerrar
                                                </button>
                                            </Modal.Footer>
                                        </Modal>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </></>
    );
}

export default Actividad;