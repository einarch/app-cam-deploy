import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import swal from 'sweetalert';
import { useFormik } from "formik";
import { Form, InputGroup, Button, FormGroup, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import logo from './../imagenes/logo-comunidad.PNG'
import Container from "react-bootstrap/Container";
import configData from "../config/config.json";
import { useNavigate } from 'react-router-dom'
import Alert from "react-bootstrap/Alert";
import { UserContext } from '../login/context/UserContext';
import "./Register.css";
import * as Yup from "yup";
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';


const URL_REGISTRAR = configData.REGISTRAR_API_URL;
const URL_BUSCAR = configData.BUSCAR_API_URL;

const enviarDatos = async (url, datos) => {
    const resp = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log(resp);
    const rjson = await resp.json();
    console.log('hola');
    console.log(rjson);

    return rjson;
}



let mensaje = " ";

const Register = ({ children }) => {

    const [isValid, setIsValid] = useState(false);
    const Registrarse = async (e) => {
        setIsValid(false)
        const datos = {
            "nombre": values.nombre,
            "apellido": values.apellido,
            "usuario": values.email,
            "clave": values.password,
            "idRol": generarIdRol(),
            "edad": calcularEdad(),
            "ciudad": values.ciudad,
            "fechaNacimiento": values.fechaNacimiento
        };
        console.log(datos);
        console.log(datos.usuario);
        console.log(datos.clave);
        console.log(datos.nombre);
        console.log(datos.apellido);
        console.log(generarIdRol());
        console.log(datos.fechaNacimiento);
        console.log(calcularEdad());
        console.log(datos.ciudad);
        const respuestaJson = await enviarDatos(URL_BUSCAR, datos);
        console.log(respuestaJson);
        if (respuestaJson.Existe === true) {
            mensaje = respuestaJson.Mensaje;
            setIsValid(true)
            console.log(respuestaJson.Mensaje);
        } else {
            const respuesta1Json = await enviarDatos(URL_REGISTRAR, datos);
            console.log(respuesta1Json);
            setIsValid(false)
        }

    }
    const [state, setstate] = useState(false);

    const paginaI = () => {
        window.location.href = '/';
    }
    const login = () => {
        window.location.href = "/login";
    }
    const toggleBtn = () => {
        setstate(prevState => !prevState);
    }

    const { handleSubmit,resetForm, handleChange, values, touched, errors, handleBlur } = useFormik({

        initialValues: { nombre:"",apellido:"",email: "", password: "", password2: "",ciudad:"",fechaNacimiento:"" },
        onSubmit: (values, { setSubmitting, resetForm }) => {
            Registrarse();
            setSubmitting(true);
            setTimeout(() => {
                resetForm();
                setSubmitting(false);
            }, 500);
        },


        validationSchema: Yup.object().shape({
            nombre: Yup.string()
                .min(3, "Nombre no válido")
                .max(30, "Nombre no válido")
                .required("Introduzca su Nombre")
                .matches(/^[a-zA-Z]+$/, "Caracteres no permitidos"),
            apellido: Yup.string()
                .min(3, "Apellido no válido")
                .max(30, "Apellido no válido")
                .required("Introduzca su Apellido")
                .matches(/^[a-zA-Z ]+$/, "Caracteres no permitidos"),
            email: Yup.string()
                .email("Correo no válido")
                .min(6, "Correo no válido")
                .max(30, "Correo no válido")
                .required("Introduzca su correo")
                .matches(/^[a-z0-9.\s]+@[a-z0-9\s]+\.[a-z0-9.\s]/, "Caracteres no permitidos"),
            password: Yup.string()
                .required("Introduzca su contraseña")
                .min(6, "Contraseña no válida")
                .max(15, "Contraseña no válida")
                .matches(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{6,15}$/, "Caracteres no permitidos"),
            password2: Yup.string()
                .required("Introduzca su contraseña")
                .min(6, "Contraseña no válida")
                .max(15, "Contraseña no válida")
                .matches(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{6,15}$/, "Caracteres no permitidos")

                .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir'),
                fechaNacimiento: Yup.string()
                .required("Introduzca Fecha")  
        })

    })
    const calcularEdad = () => {
        let fechaNacimiento = document.getElementById("fechaNacimiento").value;
        const fechaActual = new Date();
        const anoActual = parseInt(fechaActual.getFullYear());
        const mesActual = parseInt(fechaActual.getMonth()) + 1;
        const diaActual = parseInt(fechaActual.getDate());

        // 2016-07-11
        const anoNacimiento = parseInt(String(fechaNacimiento).substring(0, 4));
        const mesNacimiento = parseInt(String(fechaNacimiento).substring(5, 7));
        const diaNacimiento = parseInt(String(fechaNacimiento).substring(8, 10));

        let edad = anoActual - anoNacimiento;
        if (mesActual < mesNacimiento) {
            edad--;
        } else if (mesActual === mesNacimiento) {
            if (diaActual < diaNacimiento) {
                edad--;
            }
        }
        return edad;

    };

    const generarID = () => {
        var y = 1;
        y++;

        return y;

    };
    const generarIdRol = () => {
        if (calcularEdad() < 40) {
            var x = 2;
        } else
            var x = 1;
        return x;

    };

    return (
        <div className='RegisterPage' >
            <br />
            <Alert show={isValid} variant="danger" style={{ width: "35rem" }}>
                <Alert.Heading>
                    {mensaje}
                    <button type="button" class="btn-close derecha" data-bs-dismiss="alert" aria-label="Close"></button>
                </Alert.Heading>
            </Alert>
            <Container className="RegisterForm d-flex flex-column justify-content-center align-items-center">
                <h3 class="form-title"><i class="fa fa-user"></i> Registrarse</h3>

                <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label htmlFor="text" className="form-label d-flex flex-row justify-content-left">Nombre</Form.Label>
                        <Form.Control className={errors.nombre && touched.nombre && "error"}
                            id="nombre"
                            type="text"
                            name="nombre"
                            placeholder="Ingresa su nombre"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.nombre}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Text className="errorMessModal d-flex flex-row justify-content-center" muted>
                        {errors.nombre && touched.nombre && (
                            <div className="input-feedback">{errors.nombre}</div>
                        )}
                    </Form.Text>
                    <Form.Group>
                        <Form.Label htmlFor="text" className="form-label d-flex flex-row justify-content-left"  >Apellidos</Form.Label>
                        <Form.Control
                            className={errors.apellido && touched.apellido && "error"}
                            id="apellido"
                            type="text"
                            name="apellido"
                            placeholder="Ingresa tus apellidos"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.apellido}
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Text className="errorMessModal d-flex flex-row justify-content-center" muted>
                        {errors.apellido && touched.apellido && (
                            <div className="input-feedback">{errors.apellido}</div>
                        )}
                    </Form.Text>
                    <Form.Group>
                        <Form.Label htmlFor="email" className="form-label d-flex flex-row justify-content-left"  >Email</Form.Label>
                        <Form.Control
                            className={errors.email && touched.email && "error"}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Ingresa tu correo"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                        />
                    </Form.Group>
                    <Form.Text className="errorMessModal d-flex flex-row justify-content-center" muted>
                        {errors.email && touched.email && (
                            <div className="input-feedback">{errors.email}</div>
                        )}
                    </Form.Text>
                    <Form.Group>
                        <Form.Label htmlFor="password" className="form-label d-flex flex-row justify-content-left" >Contraseña</Form.Label>
                        <InputGroup>
                            <Form.Control
                                className={errors.password && touched.password && "error"}
                                id="password"
                                type={state ? "text" : "password"}
                                name="password"
                                placeholder="Ingresa su contraseña"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                            />
                            <Button
                                className='button-block'
                                variant="light"
                                onClick={toggleBtn}
                            >
                                {state ?
                                    <AiOutlineEye /> : <AiOutlineEyeInvisible />
                                }

                            </Button>
                        </InputGroup>

                    </Form.Group>
                    <Form.Text className="errorMessModal d-flex flex-row justify-content-center" muted>
                        {errors.password && touched.password && (
                            <div className="input-feedback">{errors.password}</div>
                        )}
                    </Form.Text>
                    <Form.Group className="col-md-12">
                        <Form.Label htmlFor="password" className="form-label d-flex flex-row justify-content-left">Confirmar Contraseña</Form.Label>
                        <InputGroup>
                            <Form.Control
                                className={errors.password2 && touched.password2 && "error"}
                                id="password2"
                                type={state ? "text" : "password"}
                                name="password2"
                                placeholder="Ingresa su contraseña"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password2}
                            />
                            <Button
                                className='button-block'
                                variant="light"
                                onClick={toggleBtn}
                            >
                                {state ?
                                    <AiOutlineEye align="center" /> : <AiOutlineEyeInvisible align="center" />
                                }

                            </Button>
                        </InputGroup>
                    </Form.Group>
                    <Form.Text className="errorMessModal d-flex flex-row justify-content-center" muted>
                        {errors.password2 && touched.password2 && (
                            <div className="input-feedback">{errors.password2}</div>
                        )}
                    </Form.Text>
                    <Row className="col-md-13 mb-3">
                        <Form.Group as={Col} md="7">
                            <Form.Label htmlFor="password" id="ciudad" className="form-label d-flex flex-row justify-content-left" >Fecha de Nacimiento</Form.Label>
                            <Form.Control type="date"
                                min="1950-01-01"
                                max="2004-12-31"
                                onChange={handleChange}
                                onBlur={handleBlur} id="fechaNacimiento"
                                name="fechaNacimiento"
                                value={values.fechaNacimiento} />
                                <Form.Text className="errorMessModal d-flex flex-row col-11 justify-content-center" muted>
                        {errors.fechaNacimiento && touched.fechaNacimiento && (
                            <div className="input-feedback">{errors.fechaNacimiento}</div>
                        )}
                    </Form.Text>
                        </Form.Group>
                        
                    <Form.Group as={Col} md="5" >
                            <Form.Label className="form-label d-flex flex-row justify-content-left">Ciudad</Form.Label>
                            <Form.Select
                                onChange={handleChange}
                                onBlur={handleBlur}
                                id="ciudad"
                                name="ciudad"
                                type="text"
                                value={values.ciudad} >
                                <option value="Cochabamba">Cochabamba</option>
                                <option value="La Paz">La Paz</option>
                                <option value="Santa Cruz">Santa Cruz</option>
                                <option value="Pando">Pando</option>
                                <option value="Beni">Beni</option>
                                <option value="Oruro">Oruro</option>
                                <option value="Potosi">Potosi</option>
                                <option value="Sucre">Sucre</option>
                                <option value="Tarija">Tarija</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <div className="d-flex flex-row align-items-center justify-content-center">
                        <button
                            className="btn btn-success col-4 m-1"
                            type="submit"
                            as="Input"
                            onClick={handleSubmit} >
                            Registrarse
                        </button>
                        <button
                            className="btn btn-secondary col-4 m-1"
                            onClick={paginaI}
                            href="../components/PaginaInicio"
                        >Cancelar
                        </button>
                    </div>
                </Form>
            </Container >
            <br />
        </div >
    )
}

export default Register;