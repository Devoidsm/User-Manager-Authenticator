//Imports
import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
//Main Header Function
export default function Header({ isLoggedIn }) {
  function LogOutHandler(){
    window.localStorage.clear();
    window.localStorage.setItem('isLoggedIn', JSON.stringify(false))
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        {/* When logged in show Main Components, when not logged in show login page*/}
        {isLoggedIn ?
        <Navbar.Brand href="#Main">Repo Manager</Navbar.Brand> : <Navbar.Brand href="#Main">CoolTech User Authenication</Navbar.Brand>}
        <Nav>
          {/*When logged in, display a LogOut link back to the login page*/}
          {isLoggedIn && <a href="/" className="headerText" onClick={LogOutHandler}>Logout</a>}
        </Nav>
      </Container>
    </Navbar>
  )
}
