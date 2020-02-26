import React, { Component } from 'react';
import './VestaView.css'
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { ATOMCONFIGLoader } from './AtomconfigLoader';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import NB from './c2.config';
import ATOM from './atom5.config';
import { MixOperation } from 'three';

var camera, scene, renderer,labelRenderer;
var controls;
var root;
var gmount;
var sf=40;   // position scaling
var asf=0.2; // atom size
var wb=5.0;  // bond size

var offset = new THREE.Vector3();

var visualizationType = 2;
var loader = new ATOMCONFIGLoader();

var colorSpriteMap = {};

function init() {

    var width = gmount.clientWidth;
    var height = gmount.clientHeight;
    camera =
        new THREE.OrthographicCamera(
            -width,
            width,
            height,
            -height,
            .1,
            5000);


    //camera = new THREE.PerspectiveCamera(70, gmount.clientWidth / gmount.clientHeight, 1, 5000);
    camera.zoom=1;
    camera.position.z = 1000;

    scene = new THREE.Scene();

    var light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(1, 1, 1);
    scene.add(light);

    var light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(-1, -1, -1);
    scene.add(light);

   // var light = new THREE.AmbientLight(0xffffff, 0.3);
    //scene.add(light);

    root = new THREE.Group();
    scene.add(root);
    //
    renderer = new THREE.WebGLRenderer( { antialias: true, alpha:true } );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(gmount.clientWidth, gmount.clientHeight);
    gmount.appendChild(renderer.domElement);
    //
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(gmount.clientWidth, gmount.clientHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    gmount.appendChild(labelRenderer.domElement);
    //
    controls = new TrackballControls(camera, renderer.domElement);
    controls.minDistance = 500;
    controls.maxDistance = 2000;

    //
    loadMolecule(ATOM);
    
    window.addEventListener('resize', onWindowResize, false);
    //
}
function showAtoms() {

}
function showBonds() {

}

function showAtomsBonds() {

}

function loadMolecule(url) {

    while ( root.children.length > 0 ) {

		var object = root.children[ 0 ];
		object.parent.remove( object );

	}

    loader.load(url, function (pdb) {

        var geometryAtoms = pdb.geometryAtoms;
        var geometryBonds = pdb.geometryBonds;
        var json = pdb.json;

        var boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
        var cylinderGeometry = new THREE.CylinderBufferGeometry(wb,wb,1,32);
        var sphereGeometry = new THREE.IcosahedronBufferGeometry(1, 3);

        geometryAtoms.computeBoundingBox();
        geometryAtoms.boundingBox.getCenter(offset).negate();

        geometryAtoms.translate(offset.x, offset.y, offset.z);
        geometryBonds.translate(offset.x, offset.y, offset.z);

        var al = json.al;

        var position = new THREE.Vector3();
        var color = new THREE.Color();

        

        //plot bond
        var start = new THREE.Vector3();
        var end = new THREE.Vector3();
        var mid = new THREE.Vector3();
        var color_start=new THREE.Color();
        var color_end=new THREE.Color();
        positions = geometryBonds.getAttribute('position');
        colors = geometryBonds.getAttribute('color');
        for (var i = 0; i < positions.count; i += 2) {

            start.x = positions.getX(i);
            start.y = positions.getY(i);
            start.z = positions.getZ(i);
            
            color_start.r = colors.getX(i);
            color_start.g = colors.getY(i);
            color_start.b = colors.getZ(i);

            end.x = positions.getX(i + 1);
            end.y = positions.getY(i + 1);
            end.z = positions.getZ(i + 1);

            color_end.r = colors.getX(i+1);
            color_end.g = colors.getY(i+1);
            color_end.b = colors.getZ(i+1);

            mid.x = ( start.x + end.x ) / 2;
            mid.y = ( start.y + end.y ) / 2;
            mid.z = ( start.z + end.z ) / 2;

            start.multiplyScalar(sf);
            end.multiplyScalar(sf);
            mid.multiplyScalar(sf);
            
            
            var material = new THREE.MeshPhongMaterial({color:color_start});
            var object = new THREE.Mesh(cylinderGeometry,material);
            object.position.copy(start);
            object.position.lerp(mid, 0.5);
            
            var direction = new THREE.Vector3().subVectors(mid, start);
            var axis = new THREE.Vector3(0,1,0);
            object.quaternion.setFromUnitVectors(axis,direction.clone().normalize());

            object.scale.set(1,start.distanceTo(mid),1);


            var material = new THREE.MeshPhongMaterial({color:color_end});
            var object2 = new THREE.Mesh(cylinderGeometry,material);
            object2.position.copy(end);
            object2.position.lerp(mid, 0.5);
            
            var direction = new THREE.Vector3().subVectors(mid, end);
            var axis = new THREE.Vector3(0,1,0);
            object2.quaternion.setFromUnitVectors(axis,direction.clone().normalize());

            object2.scale.set(1,end.distanceTo(mid),1);

            root.add(object);
            root.add(object2);

        }
        //plot atoms
        var positions = geometryAtoms.getAttribute('position');
        var colors = geometryAtoms.getAttribute('color');
        for (var i = 0; i < positions.count; i++) {

            position.x = positions.getX(i);
            position.y = positions.getY(i);
            position.z = positions.getZ(i);


            color.r = colors.getX(i);
            color.g = colors.getY(i);
            color.b = colors.getZ(i);
            
            var material = new THREE.MeshPhysicalMaterial({ color: color });

            var atom = json.atoms[i];

            var object = new THREE.Mesh(sphereGeometry, material);
            object.position.copy(position);
            object.position.multiplyScalar(sf);
            if(atom[9]){
                object.scale.multiplyScalar(atom[9] * asf);
            }
            else {
                object.scale.multiplyScalar(25);
            }

            root.add(object);


            var text = document.createElement('div');
            text.className = 'label';
            text.style.color = 'rgb(' + atom[3][0] + ',' + atom[3][1] + ',' + atom[3][2] + ')';
            text.textContent = atom[4];

            var label = new CSS2DObject(text);
            label.position.copy(object.position);
            //root.add(label);
        }
        //plot box
        var box_positions = [
            [0, 0, 0], [0, 0, 1],
            [0, 0, 0], [0, 1, 0],
            [0, 0, 0], [1, 0, 0],
            [1, 0, 0], [1, 1, 0],
            [1, 0, 0], [1, 0, 1],
            [1, 1, 0], [0, 1, 0],
            [1, 1, 0], [1, 1, 1],
            [1, 1, 1], [0, 1, 1],
            [1, 1, 1], [1, 0, 1],
            [0, 1, 1], [0, 0, 1],
            [0, 1, 1], [0, 1, 0],
            [0, 0, 1], [1, 0, 1]
        ];
        for (var i = 0; i < 24; i += 2) {
            var [x, y, z] = box_positions[i];

            var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
            var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
            var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;

            start.x = fx + offset.x;
            start.y = fy + offset.y;
            start.z = fz + offset.z;

            [x, y, z] = box_positions[i + 1];
            var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
            var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
            var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;

            end.x = fx + offset.x;
            end.y = fy + offset.y;
            end.z = fz + offset.z;

            start.multiplyScalar(sf);
            end.multiplyScalar(sf);

            var object = new THREE.Mesh(boxGeometry, new THREE.MeshPhongMaterial(0xffffff));
            object.position.copy(start);
            object.position.lerp(end, 0.5);
            object.scale.set(1, 1, start.distanceTo(end));
            object.lookAt(end);
            root.add(object);
        }
        switch (visualizationType) {

            case 0:
                showAtoms();
                break;
            case 1:
                showBonds();
                break;
            case 2:
                showAtomsBonds();
                break;

        }

    });


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
    labelRenderer.render( scene, camera );

}

function onWindowResize() {

    camera.aspect = gmount.clientWidth / gmount.clientHeight;
    var size=gmount.clientWidth/2;
    camera.left=-size;
    camera.right=size;
    camera.bottom=-size;
    camera.top=size;
    camera.updateProjectionMatrix();

    renderer.setSize(gmount.clientWidth, gmount.clientHeight);
    labelRenderer.setSize(gmount.clientWidth, gmount.clientHeight);
}

class VestaView extends Component {
    componentDidMount() {
        init();
        animate();
    }
    render() {
        return (
            <div
                id="canvas_vesta"
                ref={(mount) => { gmount = mount }}
            >

            </div>
        );
    }
}
class VestaViewModal extends Component {
    componentDidMount() {
        init();
        animate();
    }
    render() {
        return (
            <div
                id="canvas_vesta_modal"
                ref={(mount) => { gmount = mount }}
            >

            </div>
        );
    }
}
export {VestaViewModal};
export default VestaView;