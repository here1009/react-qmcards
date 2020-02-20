import React from 'react';
import logo from './logo.svg';
import STRUCTURE from './Structure'
import CALCULATION from './Calculation'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ButtonToolbar, Container, Row, Col } from 'react-bootstrap';
import { ButtonGroup, Tab, Nav, Dropdown } from 'react-bootstrap';
import VestaView from './VestaView'
import Vesta from './Vesta';
function App() {
  return (
    <div className="App">
      <div class="App-area">
        <Tab.Container defaultActiveKey="first">
          <Nav variant="pills" defaultActiveKey="/home" style={{marginBottom:10}}>
            <Nav.Item>
              <Nav.Link href="/home" eventKey="first">Model</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second">Calculation</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="third" disabled>Preference</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="forth" disabled>About</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="first">
              <STRUCTURE />
            </Tab.Pane>
            <Tab.Pane eventKey="second">
              <CALCULATION />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
      <VestaView></VestaView>
    </div>

  );
}

export default App;
