import React, { useState, useEffect } from 'react';
import './Vesta.css';
import Head_logo from './head.svg';
import Vesta_view from './VestaView'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ButtonToolbar, Container, Row, Col } from 'react-bootstrap';
import { ButtonGroup, Tab, Nav } from 'react-bootstrap';
import { Card, CardColumns } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';

function Vesta() {
    const Vesta_settings = () => <span>Vesta Settings</span>
    const [show, setShow] = useState(false);
    return (
        <div id="modal_vesta">
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
        </div>
    );
}

export default Vesta;
