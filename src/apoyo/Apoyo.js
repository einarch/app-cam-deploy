import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import { useFormik, useField, useFormikContext } from "formik";
import * as Yup from "yup";
import './../apoyo/Apoyo.css';
import avatar from '../imagenes/avatar.jpg';
import configData from "../config/config.json";

const Apoyo = ({ children }) => {

    const baseUrl = configData.VOLUNTEERS_API_URL;
    const [data, setData] = useState([]);

    const peticionGet = async () => {
        await axios.get(baseUrl)
            .then(response => {
                setData(response.data);
            }).catch(error => {
                console.log(error);
            })
    }
    const { handleSubmit, handleChange, values, touched, errors, handleBlur } = useFormik({

        initialValues: { telefono: "", dias: "", tipo: "", description: "" },
        onSubmit: (values, { setSubmitting }, { resetForm }) => {
            setTimeout(() => {
                console.log("Logging in", values);
                setSubmitting(false);
            }, 500);

            resetForm({ values: '' });
        },

        validationSchema: Yup.object().shape({
            telefono: Yup.number()
            .typeError("Solo se admiten numeros")
                .required("Este campo es requerido")
                .min(4000000, `minimo 7 digitos porfavor`)
                .positive( `minimo positivos`),
            dias: Yup.string()
            .required("Este campo es requerido")
            .min(4, "Dias de la semana porfavor")
            .max(80, "Dias de la semana porfavor"),
            tipo: Yup.string()
                .required("Este campo es requerido")
                .min(4, "El tipo de ayuda debe tener minimo 4 caracteres")
                .max(255, "El tipo de ayuda debe tener máximo 255 caracteres"),
            description: Yup.string()
                .min(4, "El motivo debe tener minimo 4 caracteres")
                .max(400, "El motivo debe tener máximo 400 caracteres"),

        })
    })
    useEffect(() => {
        peticionGet();
    }, [])

    return (
        <><div>
            <br />
            <br />
            <br />
        </div><>
                <br />
                <br />
                <h2 className="title"> Voluntarios de Apoyo</h2>
                <br />
                <Container className="d-flex flex-row justify-content-end">
                    <button type="button" className="btn m-2 btn-primary" data-bs-toggle="modal" data-bs-target="#createActivity">Ser voluntario</button>
                </Container>
                <div align="center">
                    <div className="modal fade" id="createActivity" tabIndex="-1" aria-hidden="true" aria-labelledby="modalTitle" data-bs-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modalColor d-flex flex-row justify-content-center">
                                    <h2 className="modal-title"><b>VOLUNTARIOS DE CORAZON</b></h2>
                                </div>
                                <div className="modal-body tam p-3 modalColor ">
                                    <Form id="createActivityForm" className="row g-3" onSubmit={handleSubmit}>
                                        <Form.Group className="col-md-12">
                                            <Form.Label className="form-label textModal d-flex flex-row align-items-left">Telefono</Form.Label>
                                            <Form.Control
                                                type="text"
                                                id="telefono"
                                                name="telefono"
                                                className={errors.telefono && touched.telefono && "error"}
                                                class="form-control"
                                                placeholder="Ingrese el nombre de la actividad"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.telefono}
                                            />
                                            <Form.Text className="errorMessModal d-flex flex-row" muted>
                                                {errors.telefono && touched.telefono && (
                                                    <div className="input-feedback">{errors.telefono}</div>
                                                )}
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group className="col-md-12">
                                            <Form.Label className="form-label textModal d-flex flex-row align-items-left">Dias disponibles</Form.Label>
                                            <Form.Control
                                                type="text"
                                                id="dias"
                                                name="dias"
                                                className={errors.dias && touched.dias && "error"}
                                                class="form-control"
                                                placeholder="Ingrese el nombre de la actividad"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.dias}
                                            />
                                            <Form.Text className="errorMessModal d-flex flex-row" muted>
                                                {errors.dias && touched.dias && (
                                                    <div className="input-feedback">{errors.dias}</div>
                                                )}
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group className="col-md-12">
                                            <Form.Label className="form-label textModal d-flex flex-row align-items-left">Tipo de apoyo</Form.Label>
                                            <Form.Control
                                                type="text"
                                                id="tipo"
                                                name="tipo"
                                                className={errors.tipo && touched.tipo && "error"}
                                                class="form-control"
                                                placeholder="Ingrese el nombre de la actividad"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.tipo}
                                            />
                                            <Form.Text className="errorMessModal d-flex flex-row" muted>
                                                {errors.tipo && touched.tipo && (
                                                    <div className="input-feedback">{errors.tipo}</div>
                                                )}
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group className="col-md-12">
                                            <Form.Label className="form-label textModal d-flex flex-row align-items-left">Motivacion</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
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
                                    </Form>
                                </div>
                                <div className="model-footer col-12 modalColor" align="center">
                                    <button type="button" class="btn btn-secondary col-3 m-2" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="submit" class="btn btn-success col-3 m-2" data-bs-dismiss="modal" >Crear</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Container className="p-4 mb-4">
                    {data.map(apoyo => {
                        return (
                            <Card id="cardItem" key={apoyo.TELEFONOV} className="text-left">
                                <Card.Body>
                                    <Card.Text className='d-flex flex-row'>
                                        <div className='col-sm-2 d-flex flex-column align-items-center justify-content-center '>
                                            <img src={avatar} className="rounded-circle" height="120" width="120"></img>
                                        </div>
                                        <div className="col-sm-10 d-flex flex-column align-items-left justify-content-center ">
                                            <h3 className="cardItemUserName mt-0 mb-1"><b>{apoyo.NOMBRE} {apoyo.APELLIDO}</b></h3>
                                            <br></br>
                                            <h4 className="cardItemTitle">{apoyo.CIUDAD} &emsp; &ensp; <b>Teléfono:</b>{apoyo.TELEFONOV} </h4>
                                            <br></br>
                                            <h4 className="cardItemTitle"><b>Días Disponibles:</b> {apoyo.DIASDISPONIBLES}</h4>
                                        </div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        )
                    }
                    )}
                </Container>
            </></>
    );
}

export default Apoyo;
