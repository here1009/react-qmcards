import React, { useState, useEffect } from 'react';
import './Vesta.css';
import Head_logo from './head.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ButtonToolbar, Container, Row, Col } from 'react-bootstrap';
import { ButtonGroup, Tab, Nav } from 'react-bootstrap';
import { Card, CardColumns } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';

function Vesta() {
    const Vesta_view = () => <span>Vesta View</span>
    const Vesta_settings = () => <span>Vesta Settings</span>
    const [show, setShow] = useState(false);
    return (
        <div>
            <Card>
                    <Card.Header>
                        <Row>
                            <Col>
                            </Col>
                            <Button variant="outline-warning" onClick={() => setShow(true)} id="set_btn">Zoom</Button>
                        </Row>

                    </Card.Header>
                    <Card.Body>
                        <Vesta_view></Vesta_view>
                    </Card.Body>
            </Card>
            <Modal
                show={show}
                onHide={() => setShow(false)}
                centered
                dialogClassName="vesta-full-screen"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="title_vesta_modal">
                        Vesta
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Tab.Container defaultActiveKey="view">
                    <Nav variant="tabs" defaultActiveKey="#view">
                        <Nav.Item>
                            <Nav.Link href="#view" as="button" eventKey="view">View</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="#settings" as="button" eventKey="settings">Settings</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content>
                            <Tab.Pane eventKey="view">
                                <Vesta_view></Vesta_view>
                            </Tab.Pane>
                            <Tab.Pane eventKey="settings">
                                <Vesta_settings></Vesta_settings>
                            </Tab.Pane>
                        </Tab.Content>
                </Tab.Container>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Vesta;
