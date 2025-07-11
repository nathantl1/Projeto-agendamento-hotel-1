import React, { useState } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import inst1 from '../../assets/inst.svg';
import userimg from '../../assets/user.png';
import './Header.css';


const Header = ({ onFilterChange }) => {

  const filtros = ['Tudo', 'Hotel Tecnológico', 'IF Maker', 'Sala'];
  

  const [filtroAtivo, setFiltroAtivo] = useState('Tudo');

  const handleFiltroClick = (filtro) => {
    setFiltroAtivo(filtro);

    if (onFilterChange) {
      onFilterChange(filtro);
    }
  };

  return (
    <div className='header-container'>
  
      <Navbar expand="lg" className="bg-body-tertiary main-navbar">
        <Container>
          <Navbar.Brand href="#home">
            <img src={inst1} alt="Logo IF" className="navbar-logo" />
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link href="#user-profile">
              <img src={userimg} alt="Perfil do Usuário" className="user-icon" />
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="filter-buttons-container">
        {filtros.map((filtro) => (
          <Button id='btnfiltro'
            key={filtro}
            className={`filter-button ${filtroAtivo === filtro ? 'active' : ''}`}
            onClick={() => handleFiltroClick(filtro)}
          >
            {filtro}
          </Button>
        ))}
      </Container>
    </div>
  );
};

export default Header;
