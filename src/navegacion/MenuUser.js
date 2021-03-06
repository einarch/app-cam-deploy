import React from "react";
import "./navegacion.css";
import Container from 'react-bootstrap/Container';
import { Navbar, Nav, DropdownButton, Dropdown } from 'react-bootstrap';
import {NavLink, useNavigate} from "react-router-dom";
import logo from '../imagenes/logo-comunidad1.jpg';
import user from '../imagenes/avatar.jpg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLarge } from "@fortawesome/free-solid-svg-icons";
import Apiurl from "../servicios/api";
import { useState, useEffect } from 'react';

const MenuUser = () => {
  const tilde = <span style={{
    fontSize: 35,
    color: "#dbeaed",
    borderRadius: "16"
  }}>
    <FontAwesomeIcon icon={faUserLarge} />
  </span>

  let info= localStorage.getItem("user");
  
  const [usuario, setUsuario] = useState([])
  /*const obtenerDatos = async () => {
    const data = await fetch(Apiurl +"obtenUser.php?id="+id.id)
    const users = await data.json()
    console.log(users)

  }
  useEffect(() => {
    console.log("user effect")
    obtenerDatos()
  }, [])*/
  useEffect(() => {
    fetch(Apiurl+"obtenUser.php?IDUSUARIO="+info)
      .then((response) => {
        return response.json()
      })
      .then((usuario) => {
        setUsuario(usuario)
      })
  }, []);


  const navigate = useNavigate();
  
  //const {logout} = useAuth()
  const logout = () => {
    localStorage.removeItem('user')
}
  const handleClick = () => {
    logout()
    navigate('/')
  };



  return (
    <Navbar collapseOnSelect expand="lg" variant="light" fixed="top"
      style={{
        backgroundColor: "#dbeaed"
      }}
    >
      <Container fluid>
        <Navbar.Brand href={window.location.href}>
          <div className="logo-empresa" >
            <img
              src={logo}
              className="d-inline-block align-top"
              alt="logo de la aplicacion"
            />
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto center-block">
            <NavLink className={({ isActive }) => "nav-link btn-md" + (isActive ? "bg active" : "")}
              to={'/home/comunidad'}
            >COMUNIDAD</NavLink>
            <NavLink className={({ isActive }) => "nav-link btn-md" + (isActive ? "bg active" : "")}
              to={'/home/actividades'}
            >ACTIVIDADES</NavLink>
            <NavLink className={({ isActive }) => "nav-link btn-md" + (isActive ? "bg active" : "")}
              to={'/home/voluntarios'}
            >APOYO</NavLink>
          </Nav>
          <Nav>
            <DropdownButton align="end" title={tilde} id="dropdown-menu-align-end" variant="primary"
            >
              <span>
                <div className="logo-user text-center" >
                  <img
                    src={user}
                  />
                </div>
              </span>
              <Dropdown.Item eventKey="1" disabled className="text-center"
                style={{
                  fontSize: "1rem", color: "black"
                }}
              >{usuario.NOMBRE} {usuario.APELLIDO}</Dropdown.Item>

              <Dropdown.Item eventKey="2" disabled className="text-center"
                style={{
                  fontSize: "1rem", color: "black"
                }}
              >{usuario.EMAIL}</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item eventKey="3" className="text-center bg-secondary" style={{
                fontWeight: "bold",
                fontSize: "1rem",
                color: "white"
              }} onClick={handleClick}
              >CERRAR SESION</Dropdown.Item>
            </DropdownButton>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  )
}

export default MenuUser;