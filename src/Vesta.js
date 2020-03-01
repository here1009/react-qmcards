import React from 'react';
import  { Component } from 'react';
import ReactDOM from 'react-dom';
import './Vesta.css';
import Head_logo from './head.svg';
import Vesta_view from './VestaView'
import {VestaViewModal} from './VestaView'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button,  Container, Row, Col } from 'react-bootstrap';
import { Card, Jumbotron } from 'react-bootstrap';
import { MdFullscreen,MdClose } from 'react-icons/md';

class Vesta extends Component {
    render() {
        return (
            <div>
                <Card style={{margin:0,padding:0}}>
                    <Row style={{margin:0,padding:0}}>
                        <Col xs={10} lg={10}>
                        </Col>
                        <Col xs={2} lg={2} style={{ textAlign: "right",margin:0,padding:0 }}>
                            <Button variant="light" onClick={() => {
                                VestaModal.showInstance({
                                    isShow: true
                                });
                            }} id="set_btn"><MdFullscreen/></Button>
                        </Col>
                    </Row>
                    <Card.Body style={{margin:0, padding:0}}>
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
                <Card style={{margin:0,padding:0}}>
                    <Row style={{ margin: 0, padding: 0 }}>
                        <Col xs={10} lg={10}>
                        </Col>
                        <Col xs={2} lg={2} style={{ textAlign: "right", margin: 0, padding: 0 }}>
                            <Button variant="light" onClick={() => {
                                VestaModal.removeInstance();
                            }} id="set_btn"><MdClose/></Button>
                        </Col>
                    </Row>

                    <Row style={{ margin: 0, padding: 0 }}>
                        <Col xs={10} lg={10}>
                        <VestaViewModal></VestaViewModal>
                        </Col>
                        <Col xs={2} lg={2} style={{ textAlign: "middle", margin: 0, padding: 0 }}>
                            <Jumbotron fluid>
                                <Container>
                                    <p>
                                    </p>
                                </Container>
                            </Jumbotron>
                            <Button block>Button</Button>
                                <Button block>Button</Button>
                                <Button block>Button</Button>
                                <Button block>Button</Button>
                        </Col>
                    </Row>
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
