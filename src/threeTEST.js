import React from 'react';
import  { Component } from 'react';
import ReactDOM from 'react-dom';
import './Vesta.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button,  Container, Row, Col } from 'react-bootstrap';
import { Card, Jumbotron } from 'react-bootstrap';
import {ThreeTestView, ThreeTestViewModal} from './ThreeTestView'
import { MdFullscreen,MdClose } from 'react-icons/md';

class ThreeTest extends Component {
    render() {
        return (
            <div>
                <Card style={{margin:0,padding:0}}>
                    <Row style={{margin:0,padding:0}}>
                        <Col xs={10} lg={10}>
                        </Col>
                        <Col xs={2} lg={2} style={{ textAlign: "right",margin:0,padding:0 }}>
                            <Button variant="light" onClick={() => {
                               ThreeTestModal.showInstance({
                                    isShow: true
                                });
                            }} id="set_btn"><MdFullscreen/></Button>
                        </Col>
                    </Row>
                    <Card.Body style={{margin:0, padding:0}}>
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
                <Card style={{margin:0,padding:0}}>
                    <Row style={{ margin: 0, padding: 0 }}>
                        <Col xs={10} lg={10}>
                        </Col>
                        <Col xs={2} lg={2} style={{ textAlign: "right", margin: 0, padding: 0 }}>
                            <Button variant="light" onClick={() => {
                                ThreeTestModal.removeInstance();
                            }} id="set_btn"><MdClose/></Button>
                        </Col>
                    </Row>

                    <Row style={{ margin: 0, padding: 0 }}>
                        <Col xs={10} lg={10}>
                        <ThreeTestViewModal></ThreeTestViewModal>
                        </Col>
                        <Col xs={2} lg={2} style={{ textAlign: "middle", margin: 0, padding: 0 }}>
                            <Jumbotron fluid>
                                <Container>
                                    <p>
                                    </p>
                                </Container>
                            </Jumbotron>
                        </Col>
                    </Row>
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
