import React from 'react';
import './Structure.css';
import {Vesta} from './VestaView';
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
                    <Vesta id='vesta'></Vesta>
                </CardColumns>
                </Col>
            </Row>
        </div>

    );
}

export default Structure;
