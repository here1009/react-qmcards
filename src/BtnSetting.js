import React, {Component} from 'react';
import './BtnSetting.css';
import {Card,Row,Col,Jumbotron,Button,Container,InputGroup,FormControl,Accordion} from 'react-bootstrap';
import { MdRemove,MdLinearScale,MdGrain,MdShare,MdMoreHoriz,MdZoomOutMap,MdFullscreen,MdClose,MdCached,MdArrowDownward,MdArrowUpward,MdArrowBack,MdRefresh,MdArrowForward,MdRotateLeft,MdRotateRight } from 'react-icons/md';
class BtnSetting extends Component{
    componentDidMount(){
        this.init();
    }
    init=function(){
    var mouseOffsetX=0;
    var mouseOffsetY=0;
    var isDraging=false; 
    var item = document.getElementById('side_settings');
    item.addEventListener('mousedown',(e)=>
    {
        //console.log(item);
        mouseOffsetX = e.pageX - item.offsetLeft;
        mouseOffsetY = e.pageY - item.offsetTop;
        isDraging = true;
        
    },false);
    document.onmousemove = function(e){
        var e=e||window.event;
        var moveX = 0;
        var moveY = 0;
        if(isDraging===true){
            moveX = e.pageX - mouseOffsetX;
            moveY = e.pageY - mouseOffsetY;
            item.style.left = moveX + "px";
            item.style.top = moveY + "px";         
        }
    }
    document.onmouseup = function(e) {
        isDraging=false;        
    }
    item.addEventListener('touchstart',(e)=>{
        //console.log(item);
        mouseOffsetX = e.touches[0].pageX - item.offsetLeft;
        mouseOffsetY = e.touches[0].pageY - item.offsetTop;
        isDraging = true;
        
        //console.log("TEST",[mouseOffsetX,mouseOffsetY]);
    });
    
    item.addEventListener('touchmove',(e)=>{
        //var e=e||window.event;
        e.preventDefault();
        var moveX = 0;
        var moveY = 0;
        //console.log("TEST2");
        if(isDraging===true){
            moveX = e.touches[0].pageX - mouseOffsetX;
            moveY = e.touches[0].pageY - mouseOffsetY;
            item.style.left = moveX + "px";
            item.style.top = moveY + "px";         
        }
        
    });
    item.addEventListener('touchend',(e)=>{
        isDraging=false;
    });
    }
    render(){
        return(
            <div>
                 <Accordion defaultActiveKey="0">
                        <Card>
                            <Accordion.Toggle id='setting-toggle' as={Button}  eventKey="0">
                            Settings
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                            <Card.Body>
                            <Jumbotron fluid>
                                <Container>

                                </Container>
                            </Jumbotron>
                            <InputGroup>
                                <InputGroup.Prepend> 
                                    <Button variant="outline-primary" id="btn_bond_depth"><MdZoomOutMap/></Button>   
                                </InputGroup.Prepend>
                                <FormControl id="text_bond_depth" aria-label="set bond search depth)" />
                                <FormControl id="text_max_expand_rcut" aria-label="set bond search depth)" />
                            
                                <InputGroup.Prepend>
                                <Button block variant="outline-primary" id="btn_showatom"><MdMoreHoriz/></Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend>
                                <Button block variant="outline-primary" id="btn_showbond"><MdRemove/></Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend> 
                                    <Button block variant="outline-primary" id="btn_showatombond"><MdLinearScale/></Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend> 
                                    <Button block variant="outline-primary" id="btn_rotateup"><MdArrowUpward/></Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend> 
                                    <Button block variant="outline-primary" id="btn_rotateleft"><MdArrowBack/></Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend> 
                                    <Button block variant="outline-primary" id="btn_rotatemid"><MdRefresh/></Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend> 
                                    <Button block variant="outline-primary" id="btn_rotateright"><MdArrowForward/></Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend> 
                                    <Button block variant="outline-primary" id="btn_rotatedown"><MdArrowDownward/></Button>
                                </InputGroup.Prepend>
                                <FormControl id="text_rotation" aria-label="" />
                            </InputGroup>
                            </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        </Accordion>
            </div>
        );
    }
}

export {BtnSetting};