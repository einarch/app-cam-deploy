import React from "react";
import Container from 'react-bootstrap/Container';

const NavegacionVol = () => {
  return (
    <Container className="p-5 mb-4 bg-ligth rounded-3">
      <ul className="nav nav-pills nav-fill justify-content-center bg-ligth ">
        <li className="nav-item">
          <a className="nav-link btn-lg" aria-current="page" href="/Comunidad">COMUNIDAD</a>
        </li>
        <li className="nav-item">
          <a className="nav-link btn-lg" aria-current="page" href="/Actividades">ACTIVIDADES</a>
        </li>
        <li className="nav-item">
          <a className="nav-link active btn-lg bg-secondary" style={{
                    color: "black" 
                }} aria-current="page" href="/Voluntarios">APOYO</a>
        </li>
      </ul>
    </Container>
  )
}

export default NavegacionVol;