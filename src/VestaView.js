import React, { Component } from 'react';
import './VestaView.css'
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { ATOMCONFIGLoader } from './AtomconfigLoader';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import NB from './c2.config';
import ATOM from './atom5.config';

var camera, scene, renderer,labelRenderer;
var controls;
var root;
var gmount;

var offset = new THREE.Vector3();

var visualizationType = 2;
var loader = new ATOMCONFIGLoader();

var colorSpriteMap = {};

function init() {

    camera = new THREE.PerspectiveCamera(70, gmount.clientWidth / gmount.clientHeight, 1, 5000);
    var size=gmount.clientWidth/2;
    //camera = new THREE.OrthographicCamera(-size, size,-size, size, -1, 5000);
    camera.zoom=1;
    camera.position.z = 1000;

    scene = new THREE.Scene();

    var light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(1, 1, 1);
    scene.add(light);

    var light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(-1, -1, -1);
    scene.add(light);

    var light = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(light);

    root = new THREE.Group();
    scene.add(root);
    //
    renderer = new THREE.WebGLRenderer( { antialias: true } );
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
        var sphereGeometry = new THREE.IcosahedronBufferGeometry(1, 2);

        geometryAtoms.computeBoundingBox();
        geometryAtoms.boundingBox.getCenter(offset).negate();

        geometryAtoms.translate(offset.x, offset.y, offset.z);
        geometryBonds.translate(offset.x, offset.y, offset.z);

        var positions = geometryAtoms.getAttribute('position');
        var colors = geometryAtoms.getAttribute('color');
        var al = json.al;

        var position = new THREE.Vector3();
        var color = new THREE.Color();

        //plot atoms
        positions = geometryAtoms.getAttribute('position');
        for (var i = 0; i < positions.count; i++) {

            position.x = positions.getX(i);
            position.y = positions.getY(i);
            position.z = positions.getZ(i);


            color.r = colors.getX(i);
            color.g = colors.getY(i);
            color.b = colors.getZ(i);
            
            var material = new THREE.MeshPhongMaterial({ color: color });

            var object = new THREE.Mesh(sphereGeometry, material);
            object.position.copy(position);
            object.position.multiplyScalar(75);
            object.scale.multiplyScalar(25);
            root.add(object);

            var atom = json.atoms[i];

            var text = document.createElement('div');
            text.className = 'label';
            text.style.color = 'rgb(' + atom[3][0] + ',' + atom[3][1] + ',' + atom[3][2] + ')';
            text.textContent = atom[4];

            var label = new CSS2DObject(text);
            label.position.copy(object.position);
            //root.add(label);
        }

        //plot bond
        var start = new THREE.Vector3();
        var end = new THREE.Vector3();
        positions = geometryBonds.getAttribute('position');
        for (var i = 0; i < positions.count; i += 2) {

            start.x = positions.getX(i);
            start.y = positions.getY(i);
            start.z = positions.getZ(i);

            end.x = positions.getX(i + 1);
            end.y = positions.getY(i + 1);
            end.z = positions.getZ(i + 1);

            start.multiplyScalar(75);
            end.multiplyScalar(75);

            var object = new THREE.Mesh(boxGeometry, new THREE.MeshPhongMaterial(0xffffff));
            object.position.copy(start);
            object.position.lerp(end, 0.5);
            object.scale.set(5, 5, start.distanceTo(end));
            object.lookAt(end);
            root.add(object);
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

            start.multiplyScalar(75);
            end.multiplyScalar(75);

            var object = new THREE.Mesh(boxGeometry, new THREE.MeshPhongMaterial(0xffffff));
            object.position.copy(start);
            object.position.lerp(end, 0.5);
            object.scale.set(5, 5, start.distanceTo(end));
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

    //camera.aspect = gmount.clientWidth / gmount.clientHeight;
    var size=gmount.clientWidth/2;
    camera.left=-size;
    camera.right=size;
    camera.bottom=-size;
    camera.top=size;
    camera.updateProjectionMatrix();

    renderer.setSize(gmount.clientWidth, gmount.clientHeight);
    //labelRenderer.setSize(gmount.clientWidth, gmount.clientHeight);
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