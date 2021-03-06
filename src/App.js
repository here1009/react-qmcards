import React from 'react';
import logo from './logo.svg';
import STRUCTURE from './Structure'
import CALCULATION from './Calculation'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ButtonToolbar, Container, Row, Col } from 'react-bootstrap';
import { ButtonGroup, Tab, Nav, Dropdown, Navbar,NavDropdown } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Calculation from './Calculation';
function App() {
  

  return (
    <Router>
    <div className="App">
      
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="#home" className="App-logo">Config</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Link className="nav-link" role="button" to="/">Model</Link>
          <Link className="nav-link" role="button" to="/calculation">Calculation</Link>
          <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav>
          <Nav.Link href="#deets">More deets</Nav.Link>
          <Nav.Link eventKey={2} href="#memes">
            Dank memes
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
      </div>
      <div style={{width: 90+"%",margin: "0 auto"}}>
      <Switch>
      <Route exact path="/calculation" component={CALCULATION} />
      <Route path="/" component={STRUCTURE} />
      </Switch>
      </div>
    </Router>

  );
}

export default App;
