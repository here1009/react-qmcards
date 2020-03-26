import React from 'react';
import './Structure.css';
import {VestaModal} from './VestaView';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ButtonToolbar, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { ButtonGroup, Tab, Nav } from 'react-bootstrap';
import { Card, CardColumns, FormControl, Accordion } from 'react-bootstrap';
import { RedFormat } from 'three';

function Structure() {
    return (
        <div>
            <Row>
                <Col lg={12}>
                    <VestaModal></VestaModal>
                </Col>

            </Row>
            <div class='container-fluid'>   
            <Row>
                <Col lg={12} xs={12} id="txt_atoms">
                    <Accordion defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="1">
                        ATOMS
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>
                                hello ATOMS
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    </Accordion>
                </Col>   
                <Col lg={6} xs={12}>
                <Accordion defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                        LATTICES
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                LATTICES
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                </Col>
                <Col lg={6} xs={12}>
                <Accordion defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                        SYMMETRYS
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                SYMMETRYS
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                </Col>  
                <Col lg={6} xs={12}>
                <Accordion defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                        K-POINT PATH
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                K-POINT PATH
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                </Col>  
                      
            </Row>
  </div>
         </div>

    );
}

export default Structure;
