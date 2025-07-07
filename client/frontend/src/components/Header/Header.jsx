import React from 'react'
import "./header.css"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import inst1 from '../../assets/inst.svg'
import userimg from '../../assets/user.png'
const Header = () => {
  return (
    <div className='container-lg'> 
        <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand className='navbar' href="#home"><img src={inst1}></img></Navbar.Brand>
            <Nav.Link href="#contact"><img src={userimg}></img></Nav.Link>
      </Container>
    </Navbar>
    </div>
  )
}

export default Header