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

class Vesta extends Component {
    render() {
        return (
            <div>
                <Card>
                        <Row>
                            <Col xs={10} lg={10}>
                            </Col>
                            <Col xs={2} lg={2} style={{textAlign:"right"}}>
                            <Button variant="outline-warning" onClick={() => {
                               VestaModal.showInstance({
                                    isShow: true
                                });
                            }} id="set_btn">Z</Button>
                            </Col>
                        </Row>
                    <Card.Body>
                        <Vesta_view></Vesta_view>
                    </Card.Body>
                </Card>
            </div >
        );
    }

}

class VestaModal extends Component {
    render() {
        return (
            <div>
                <Card>
                        <Row>
                            <Col xs={10} lg={10}>
                            </Col>
                            <Col xs={2} lg={2} style={{textAlign:"right"}}>
                            <Button variant="outline-warning" onClick={() => {
                                VestaModal.removeInstance();
                            }} id="set_btn">Z</Button>
                            </Col>
                        </Row>

                    <Card.Body>
                        <VestaViewModal></VestaViewModal>
                    </Card.Body>
                </Card>
            </div>
        );
    }

}
VestaModal.showInstance = function(properties) {
    if (!document.getElementById("vesta-full")) {
        let props = properties || {};
        let div = document.createElement('div');
        div.setAttribute('id', 'vesta-full');
        let st='position:fixed;z-index:10000;top:0px;left:0px;width:100%;';
        div.setAttribute('style', st);
        document.body.appendChild(div);
        ReactDOM.render(React.createElement(VestaModal, props), div);
    }
}
VestaModal.removeInstance = function() {
    if(document.getElementById("vesta-full")) {
        document.getElementById('vesta-full').remove();
    }
}
export default Vesta;
