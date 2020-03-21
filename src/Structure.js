import React from 'react';
import './Structure.css';
import {VestaModal} from './VestaView';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ButtonToolbar, Container, Row, Col } from 'react-bootstrap';
import { ButtonGroup, Tab, Nav } from 'react-bootstrap';
import { Card, CardColumns } from 'react-bootstrap';

function Structure() {
    return (
        <div>
            <Row>
                <Col>
                <CardColumns id='vesta_container'>
                    <VestaModal></VestaModal>
                </CardColumns>
                </Col>
            </Row>
        </div>

    );
}

export default Structure;
