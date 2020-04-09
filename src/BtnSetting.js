import React, {Component} from 'react';
import './BtnSetting.css';
import {Card,Row,Col,Jumbotron,Button,Container,InputGroup,FormControl,Accordion} from 'react-bootstrap';
import { MdUndo,MdRedo,MdSettingsBackupRestore,MdRemove,MdLinearScale,MdGrain,MdShare,MdMoreHoriz,MdZoomOutMap,MdFullscreen,MdClose,MdCached,MdArrowDownward,MdArrowUpward,MdArrowBack,MdRefresh,MdArrowForward,MdRotateLeft,MdRotateRight } from 'react-icons/md';
import { FiMove } from "react-icons/fi";
import { AiOutlineGateway } from "react-icons/ai";
import { WiMoonAltFull } from "react-icons/wi";
import { TiFolderOpen } from "react-icons/ti";


class BtnSetting extends Component{
    componentDidMount(){
        this.init();
    }
    init=function(){
    var mouseOffsetX=0;
    var mouseOffsetY=0;
    var isDraging=false; 
    var item = document.getElementById('side_settings');
    item.style.left = 100 + "px";
    item.style.top = 0 + "px";
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
                 <Accordion defaultActiveKey="1">
                        <Card>
                            <Accordion.Toggle id='setting-toggle' as={Button} variant="light" eventKey="0">
                            Settings
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                            <Card.Body>
                            {/* <Jumbotron fluid>
                                <Container>

                                </Container>
                            </Jumbotron> */}
                            <InputGroup>
                                <InputGroup.Prepend> 
                                    <Button variant="light" id="btn_bond_depth"><MdZoomOutMap/></Button>   
                                </InputGroup.Prepend>
                                <FormControl id="text_bond_depth" aria-label="set bond search depth)" />
                                <FormControl id="text_max_expand_rcut" aria-label="set bond search depth)" />
                            </InputGroup>
                            <InputGroup>
                                <InputGroup.Prepend>
                                <Button block variant="light" id="btn_showatom"><MdMoreHoriz/></Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend>
                                <Button block variant="light" id="btn_showbond"><MdRemove/></Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend> 
                                    <Button block variant="light" id="btn_showatombond"><MdLinearScale/></Button>
                                </InputGroup.Prepend>
                                {/* <InputGroup.Prepend>
                                <Button block variant="light" id="btn_drag"><FiMove/></Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend>
                                <Button block variant="light" id="btn_rotate"><MdRefresh/></Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend> 
                                    <Button block variant="light" id="btn_scale"><AiOutlineGateway/></Button>
                                </InputGroup.Prepend> */}
                            </InputGroup>
                            <InputGroup>
                                <InputGroup.Prepend>
                                <Button block variant="light" id="btn_a">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="1" viewBox="0 0 20 20" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <text textAnchor="middle" x="50%" y="50%" dy=".35em" className="text" >a+</text>
                                </svg>
                                </Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend>
                                <Button block variant="light" id="btn_b">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="1" viewBox="0 0 20 20" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <text textAnchor="middle" x="50%" y="50%" dy=".35em" className="text" >b+</text>
                                </svg>
                                </Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend> 
                                    <Button block variant="light" id="btn_c">
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="1" viewBox="0 0 20 20" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <text textAnchor="middle" x="50%" y="50%" dy=".35em" className="text" >c+</text>
                                    </svg>
                                    </Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend>
                                <Button block variant="light" id="btn_astar">
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="1" viewBox="0 0 20 20" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <text textAnchor="middle" x="50%" y="50%" dy=".35em" className="text" >a-</text>
                                    </svg>
                                </Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend>
                                <Button block variant="light" id="btn_bstar">
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="1" viewBox="0 0 20 20" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <text textAnchor="middle" x="50%" y="50%" dy=".35em" className="text" >b-</text>
                                    </svg>
                                </Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend> 
                                    <Button block variant="light" id="btn_cstar">
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="1" viewBox="0 0 20 20" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <text textAnchor="middle" x="50%" y="50%" dy=".35em" className="text" >c-</text>
                                    </svg>
                                    </Button>
                                </InputGroup.Prepend>
                            </InputGroup>
                            <InputGroup>
                                <InputGroup.Prepend> 
                                    <Button block variant="light" id="btn_rotateup"><MdArrowUpward/></Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend> 
                                    <Button block variant="light" id="btn_rotatedown"><MdArrowDownward/></Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend> 
                                    <Button block variant="light" id="btn_rotateleft"><MdArrowBack/></Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend> 
                                    <Button block variant="light" id="btn_rotateright"><MdArrowForward/></Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend> 
                                    <Button block variant="light" id="btn_rotatezl"><MdUndo/></Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend> 
                                    <Button block variant="light" id="btn_rotatezr"><MdRedo/></Button>
                                </InputGroup.Prepend>
                                <InputGroup.Prepend> 
                                    <Button block variant="light" id="btn_rotatemid"><MdSettingsBackupRestore/></Button>
                                </InputGroup.Prepend>
                                
                                
                                <FormControl id="text_rotation" aria-label="" />
                            </InputGroup>
                            <InputGroup>
                            <InputGroup.Prepend> 
                                    <Button block variant="light" id="btn_select"><TiFolderOpen/></Button>
                                </InputGroup.Prepend>
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