import React, { useState, useEffect } from 'react';
import  { Component } from 'react';
import ReactDOM from 'react-dom';
import './Vesta.css';
import Head_logo from './head.svg';
import Vesta_view from './VestaView'
import {VestaViewModal} from './VestaView'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ButtonToolbar, Container, Row, Col } from 'react-bootstrap';
import { ButtonGroup, Tab, Nav } from 'react-bootstrap';
import { Card, CardColumns } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import {ThreeTestView, ThreeTestViewModal} from './ThreeTestView'

class ThreeTest extends Component {
    render() {
        return (
            <div>
                <Card>
                    <Card.Header>
                        <Row>
                            <Col>
                            </Col>
                            <Button variant="outline-warning" onClick={() => {
                               ThreeTestModal.showInstance({
                                    isShow: true
                                });
                            }} id="set_btn">Z</Button>
                        </Row>

                    </Card.Header>
                    <Card.Body>
                        <ThreeTestView></ThreeTestView>
                    </Card.Body>
                </Card>
            </div >
        );
    }

}

class ThreeTestModal extends Component {
    render() {
        return (
            <div>
                <Card>
                    <Card.Header>
                        <Row>
                            <Col>
                            </Col>
                            <Button variant="outline-warning" onClick={() => {
                                ThreeTestModal.removeInstance();
                            }} id="set_btn">Z</Button>
                        </Row>

                    </Card.Header>
                    <Card.Body>
                        <ThreeTestViewModal></ThreeTestViewModal>
                    </Card.Body>
                </Card>
            </div>
        );
    }

}
ThreeTestModal.showInstance = function(properties) {
    if (!document.getElementById("tt-full")) {
        let props = properties || {};
        let div = document.createElement('div');
        div.setAttribute('id', 'tt-full');
        let st='position:fixed;z-index:10000;top:0px;left:0px;width:100%;';
        div.setAttribute('style', st);
        document.body.appendChild(div);
        ReactDOM.render(React.createElement(ThreeTestModal, props), div);
    }
}
ThreeTestModal.removeInstance = function() {
    if(document.getElementById("tt-full")) {
        document.getElementById('tt-full').remove();
    }
}
export default ThreeTest;
