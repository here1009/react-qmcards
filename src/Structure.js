import React from 'react';
import './Structure.css';
import Head_logo from './head.svg';
import Vesta from './Vesta';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ButtonToolbar, Container, Row, Col } from 'react-bootstrap';
import { ButtonGroup, Tab, Nav } from 'react-bootstrap';
import { Card, CardColumns } from 'react-bootstrap';

function Structure() {
    return (
        <div>
            <Row>
                <Col>
                <CardColumns>
                    <Vesta></Vesta>
                    <Vesta></Vesta>
                    <Vesta></Vesta>
                    <Vesta></Vesta>
                    <Vesta></Vesta>
                </CardColumns>
                </Col>
            </Row>
        </div>

    );
}

export default Structure;
