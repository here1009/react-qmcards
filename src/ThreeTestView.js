import React, { Component } from 'react';
import './ThreeTestView.css'
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
//import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader';
import { ATOMCONFIGLoader } from './AtomconfigLoader';
import { CSS3DRenderer, CSS3DObject, CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer';


class ThreeTestView extends Component{
    render(){
        return(
            <div
                id="three_test"
            >TEST</div>
        );
    }
}

class ThreeTestViewModal extends Component{
    render(){
        return(
            <div
                id="three_test_modal"
            >TEST</div>
        );
    }
}


export {ThreeTestView,ThreeTestViewModal};