import React, { Component } from 'react';
import './ThreeTestView.css'
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

var gmount;
var scene;
var camera;
var controls;
var renderer;


function init() {
    // SCENE
    scene = new THREE.Scene();
    // CAMERAS
    var width = gmount.clientWidth;
    var height = gmount.clientHeight;
        camera =
            // and camera 1 will be Orthographic
            new THREE.OrthographicCamera(
                -width,
                width,
                height,
                -height,
                .1,
                5000);


    // set to same position, and look at the origin
    camera.position.set(0, 0, 1000);
    camera.lookAt(0, 0, 0);

    // set zoom
    camera.zoom = 10;
    camera.updateProjectionMatrix();
    scene.add(camera);

    // point light above the camera
    var light = new THREE.DirectionalLight();
    light.position.set(2, 2, 2);
    camera.add(light);
    
    var light = new THREE.DirectionalLight();
    light.position.set(-2, -2, -2);
    camera.add(light);
    

    // RENDER
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(gmount.clientWidth, gmount.clientHeight);
    gmount.appendChild(renderer.domElement);

   
    {
        const cubeSize = 30;
        const cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' });
        const mesh = new THREE.Mesh(cubeGeo, cubeMat);
        mesh.position.set(4 + 1, 4 / 2, 0);
        scene.add(mesh);
    }
    {
        const sphereRadius = 30;
        const sphereWidthDivisions = 32;
        const sphereHeightDivisions = 16;
        const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
        const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' });
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(-sphereRadius + 1, sphereRadius/2, 0);
        scene.add(mesh);
    }
 //
    controls = new TrackballControls(camera, renderer.domElement);
    controls.minDistance = 500;
    controls.maxDistance = 2000;
    //

    //
   // renderer.render(scene, camera);

}
function animate() {

    requestAnimationFrame(animate);
    controls.update();

    //var time = Date.now() * 0.0004;

    //root.rotation.x = time;
    //root.rotation.y = time * 0.7;

    render();

}

function render() {

    renderer.render(scene, camera);

}

class ThreeTestView extends Component {
    componentDidMount() {
        init();
        animate();
    }
    render() {
        return (
            <div
                id="three_test"
                ref={(mount) => { gmount = mount }}
            ></div>
        );
    }
}

class ThreeTestViewModal extends Component {
    render() {
        return (
            <div
                id="three_test_modal"
                ref={(mount) => { gmount = mount }}
            ></div>
        );
    }
}


export { ThreeTestView, ThreeTestViewModal };