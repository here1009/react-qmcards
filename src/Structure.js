import React from 'react';
import './Structure.css';
import {VestaModal} from './VestaView';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ButtonToolbar, Container, Row, Col } from 'react-bootstrap';
import { ButtonGroup, Tab, Nav } from 'react-bootstrap';
import { Card, CardColumns } from 'react-bootstrap';
import { RedFormat } from 'three';

function Structure() {
    return (
        <div>
            <Row>
                <Col>
                <div>
                    <VestaModal></VestaModal>
                    <div style={{background:"red",height:100+"px",width:100+"px", display:"flex"}}></div>
                    </div>
                </Col>
            </Row>
        </div>

    );
}

export default Structure;
