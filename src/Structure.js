import React from 'react';
import './Structure.css';
import {VestaModal} from './VestaView';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ButtonToolbar, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { ButtonGroup, Tab, Nav } from 'react-bootstrap';
import { Card, CardColumns, FormControl, Accordion } from 'react-bootstrap';
import { RedFormat } from 'three';
import TextareaAutosize from 'react-textarea-autosize';

function Structure() {
    return (
        <div>
            <Row>
                <Col lg={10} id="vesta" style={{margin:"0 auto",}}>
                    <VestaModal></VestaModal>
                </Col>

            </Row>
            <div className='container-fluid'>   
            <Row>
                <Col lg={12} xs={12}>
                    <Accordion defaultActiveKey="0">
                    <Card className="card-header">
                        <Accordion.Toggle as={Card.Header} eventKey="0" className="txt-header">
                        ATOMS
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                               
                            <InputGroup>
                                <TextareaAutosize
                                //rows={4}
                                //value={this.state.value}
                                //onChange={e => this.setState({value: e.target.value})}
                                id="txt_atoms"
                                style={{width:100+"%"}}
                                />
                                {/* <FormControl rows={4} as="textarea" id="txt_atoms" aria-label="With textarea" /> */}
                            </InputGroup>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    </Accordion>
                </Col>   
                <Col lg={6} xs={12}>
                <Accordion defaultActiveKey="0">
                    <Card className="card-header">
                        <Accordion.Toggle as={Card.Header} eventKey="0"className="txt-header">
                        LATTICES
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                            <InputGroup>
                                <TextareaAutosize
                                //rows={4}
                                //value={this.state.value}
                                //onChange={e => this.setState({value: e.target.value})}
                                id="txt_box"
                                style={{width:100+"%"}}
                                />
                                {/* <FormControl rows={4} as="textarea" id="txt_atoms" aria-label="With textarea" /> */}
                            </InputGroup>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                </Col>
                <Col lg={6} xs={12}>
                <Accordion defaultActiveKey="0">
                    <Card className="card-header">
                        <Accordion.Toggle as={Card.Header} eventKey="0"className="txt-header">
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
                    <Card className="card-header">
                        <Accordion.Toggle as={Card.Header} eventKey="0"className="txt-header">
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
