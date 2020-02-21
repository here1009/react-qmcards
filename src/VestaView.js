import React, { Component } from 'react';
import './VestaView.css'
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
//import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader';
import { ATOMCONFIGLoader } from './AtomconfigLoader';
import { CSS3DRenderer, CSS3DObject, CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer';
import Caf from './caffeine.pdb';
import NB from './c2.config';
import ATOM from './atom.config';
import ball from './ball.png';

var camera, scene, renderer;
var controls;
var root;
var gmount;

var objects = [];
var tmpVec1 = new THREE.Vector3();
var tmpVec2 = new THREE.Vector3();
var tmpVec3 = new THREE.Vector3();
var tmpVec4 = new THREE.Vector3();
var offset = new THREE.Vector3();

var visualizationType = 2;

var MOLECULES = {
    "Ethanol": "ethanol.pdb",
    "Aspirin": "aspirin.pdb",
    "Caffeine": "caffeine.pdb",
    "Nicotine": "nicotine.pdb",
    "LSD": "lsd.pdb",
    "Cocaine": "cocaine.pdb",
    "Cholesterol": "cholesterol.pdb",
    "Lycopene": "lycopene.pdb",
    "Glucose": "glucose.pdb",
    "Aluminium oxide": "Al2O3.pdb",
    "Cubane": "cubane.pdb",
    "Copper": "cu.pdb",
    "Fluorite": "caf2.pdb",
    "Salt": "nacl.pdb",
    "YBCO superconductor": "ybco.pdb",
    "Buckyball": "buckyball.pdb",
    //"Diamond": "diamond.pdb",
    "Graphite": "graphite.pdb"
};

var loader = new ATOMCONFIGLoader();
var colorSpriteMap = {};
var baseSprite = document.createElement('img');

function init() {

    camera = new THREE.PerspectiveCamera(70, gmount.clientWidth/gmount.clientHeight, 1, 5000);
    camera.position.z = 1000;

    scene = new THREE.Scene();

    root = new THREE.Object3D();
    scene.add(root);
    //

    renderer = new CSS3DRenderer();
    renderer.setSize(gmount.clientWidth, gmount.clientHeight);
    gmount.appendChild(renderer.domElement);

    //

    controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 5.0;

    //

    baseSprite.onload = function () {

        //loadMolecule(Caf);
        loadMolecule(ATOM);

    };

    baseSprite.src = ball;

    window.addEventListener('resize', onWindowResize, false);
    //
}
function showAtoms() {

    for (var i = 0; i < objects.length; i++) {

        var object = objects[i];

        if (object instanceof CSS3DSprite) {

            object.element.style.display = "";
            object.visible = true;

        } else {

            object.element.style.display = "none";
            object.visible = false;

        }

    }

}
function showBonds() {

    for (var i = 0; i < objects.length; i++) {

        var object = objects[i];

        if (object instanceof CSS3DSprite) {

            object.element.style.display = "none";
            object.visible = false;

        } else {

            object.element.style.display = "";
            object.element.style.height = object.userData.bondLengthFull;
            object.visible = true;

        }

    }

}



function showAtomsBonds() {

    for (var i = 0; i < objects.length; i++) {

        var object = objects[i];

        object.element.style.display = "";
        object.visible = true;

        if (!(object instanceof CSS3DSprite)) {

            object.element.style.height = object.userData.bondLengthShort;

        }

    }

}
function colorify(ctx, width, height, color) {

    var r = color.r, g = color.g, b = color.b;

    var imageData = ctx.getImageData(0, 0, width, height);
    var data = imageData.data;

    for (var i = 0, l = data.length; i < l; i += 4) {

        data[i + 0] *= r;
        data[i + 1] *= g;
        data[i + 2] *= b;

    }

    ctx.putImageData(imageData, 0, 0);

}

function imageToCanvas(image) {

    var width = image.width;
    var height = image.height;

    var canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, width, height);

    return canvas;

}
function loadMolecule(url) {

    for (var i = 0; i < objects.length; i++) {

        var object = objects[i];
        object.parent.remove(object);

    }

    objects = [];

    loader.load(url, function (pdb) {

        var geometryAtoms = pdb.geometryAtoms;
        var geometryBonds = pdb.geometryBonds;
        var json = pdb.json;

        geometryAtoms.computeBoundingBox();
        geometryAtoms.boundingBox.getCenter(offset).negate();

        geometryAtoms.translate(offset.x, offset.y, offset.z);
        geometryBonds.translate(offset.x, offset.y, offset.z);

        var positions = geometryAtoms.getAttribute('position');
        var colors = geometryAtoms.getAttribute('color');

        var position = new THREE.Vector3();
        var color = new THREE.Color();

        var al = json.al;

        for (var i = 0; i < positions.count; i++) {

            position.x = positions.getX(i);
            position.y = positions.getY(i);
            position.z = positions.getZ(i);

            color.r = colors.getX(i);
            color.g = colors.getY(i);
            color.b = colors.getZ(i);

            var atom = json.atoms[i];
            var element = atom[4];

            if (!colorSpriteMap[element]) {

                var canvas = imageToCanvas(baseSprite);
                var context = canvas.getContext('2d');

                colorify(context, canvas.width, canvas.height, color);

                var dataUrl = canvas.toDataURL();

                colorSpriteMap[element] = dataUrl;

            }

            var colorSprite = colorSpriteMap[element];

            var atom = document.createElement('img');
            atom.src = colorSprite;

            var object = new CSS3DSprite(atom);
            object.position.copy(position);
            object.position.multiplyScalar(75);

            object.matrixAutoUpdate = false;
            object.updateMatrix();

            root.add(object);

            objects.push(object);

        }

        positions = geometryBonds.getAttribute('position');

        var start = new THREE.Vector3();
        var end = new THREE.Vector3();

        var box_positions=[
            [0,0,0],[0,0,1],
            [0,0,0],[0,1,0],
            [0,0,0],[1,0,0],
            [1,0,0],[1,1,0],
            [1,0,0],[1,0,1],
            [1,1,0],[0,1,0],
            [1,1,0],[1,1,1],
            [1,1,1],[0,1,1],
            [1,1,1],[1,0,1],
            [0,1,1],[0,0,1],
            [0,1,1],[0,1,0],
            [0,0,1],[1,0,1]
        ];
        for (var i=0;i<24;i+=2) {
           var [x,y,z]=box_positions[i];
            
           var fx = al[0][0]*x + al[1][0]*y + al[2][0]*z;
			var fy = al[0][1]*x + al[1][1]*y + al[2][1]*z;
			var fz = al[0][2]*x + al[1][2]*y + al[2][2]*z;
            
            start.x=fx;
            start.y=fy;
            start.z=fz;

           [x,y,z]=box_positions[i+1];
			var fx = al[0][0]*x + al[1][0]*y + al[2][0]*z;
			var fy = al[0][1]*x + al[1][1]*y + al[2][1]*z;
            var fz = al[0][2]*x + al[1][2]*y + al[2][2]*z;

            end.x = fx;
            end.y = fy;
            end.z = fz;

            start.multiplyScalar(75);
            end.multiplyScalar(75);

            tmpVec1.subVectors(end, start);
            var bondLength = tmpVec1.length()
            //

            var bond = document.createElement('div');
            bond.className = "box-bond";
            bond.style.height = bondLength + "px";

            var object = new CSS3DObject(bond);
            object.position.copy(start);
            object.position.lerp(end, 0.5);

            object.userData.bondLengthShort = bondLength + "px";
            object.userData.bondLengthFull = (bondLength + 55) + "px";

            //

            var axis = tmpVec2.set(0, 1, 0).cross(tmpVec1);
            var radians = Math.acos(tmpVec3.set(0, 1, 0).dot(tmpVec4.copy(tmpVec1).normalize()));

            var objMatrix = new THREE.Matrix4().makeRotationAxis(axis.normalize(), radians);
            object.matrix = objMatrix;
            object.quaternion.setFromRotationMatrix(object.matrix);

            object.matrixAutoUpdate = false;
            object.updateMatrix();

            root.add(object);

            objects.push(object);

            //

            var bond = document.createElement('div');
            bond.className = "box-bond";
            bond.style.height = bondLength + "px";

            var joint = new THREE.Object3D(bond);
            joint.position.copy(start);
            joint.position.lerp(end, 0.5);

            joint.matrix.copy(objMatrix);
            joint.quaternion.setFromRotationMatrix(joint.matrix);

            joint.matrixAutoUpdate = false;
            joint.updateMatrix();

            var object = new CSS3DObject(bond);
            object.rotation.y = Math.PI / 2;

            object.matrixAutoUpdate = false;
            object.updateMatrix();

            object.userData.bondLengthShort = bondLength + "px";
            object.userData.bondLengthFull = (bondLength + 55) + "px";

            object.userData.joint = joint;

            joint.add(object);
            root.add(joint);

            objects.push(object);


        }
        for (var i = 0; i < positions.count; i += 2) {

            start.x = positions.getX(i);
            start.y = positions.getY(i);
            start.z = positions.getZ(i);

            end.x = positions.getX(i + 1);
            end.y = positions.getY(i + 1);
            end.z = positions.getZ(i + 1);

            start.multiplyScalar(75);
            end.multiplyScalar(75);

            tmpVec1.subVectors(end, start);
            var bondLength = tmpVec1.length() - 50;

            //

            var bond = document.createElement('div');
            bond.className = "bond";
            bond.style.height = bondLength + "px";

            var object = new CSS3DObject(bond);
            object.position.copy(start);
            object.position.lerp(end, 0.5);

            object.userData.bondLengthShort = bondLength + "px";
            object.userData.bondLengthFull = (bondLength + 55) + "px";

            //

            var axis = tmpVec2.set(0, 1, 0).cross(tmpVec1);
            var radians = Math.acos(tmpVec3.set(0, 1, 0).dot(tmpVec4.copy(tmpVec1).normalize()));

            var objMatrix = new THREE.Matrix4().makeRotationAxis(axis.normalize(), radians);
            object.matrix = objMatrix;
            object.quaternion.setFromRotationMatrix(object.matrix);

            object.matrixAutoUpdate = false;
            object.updateMatrix();

            root.add(object);

            objects.push(object);

            //

            var bond = document.createElement('div');
            bond.className = "bond";
            bond.style.height = bondLength + "px";

            var joint = new THREE.Object3D(bond);
            joint.position.copy(start);
            joint.position.lerp(end, 0.5);

            joint.matrix.copy(objMatrix);
            joint.quaternion.setFromRotationMatrix(joint.matrix);

            joint.matrixAutoUpdate = false;
            joint.updateMatrix();

            var object = new CSS3DObject(bond);
            object.rotation.y = Math.PI / 2;

            object.matrixAutoUpdate = false;
            object.updateMatrix();

            object.userData.bondLengthShort = bondLength + "px";
            object.userData.bondLengthFull = (bondLength + 55) + "px";

            object.userData.joint = joint;

            joint.add(object);
            root.add(joint);

            objects.push(object);

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

}

function onWindowResize() {

    camera.aspect = gmount.clientWidth/gmount.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(gmount.clientWidth, gmount.clientHeight);
}

class VestaView extends Component {
    componentDidMount()
    {
        init();
        animate();
    }
    render() {
        return (
            <div
                className="canvas_vesta"
                ref={(mount) => { gmount = mount }}
            >

            </div>
        );
    }
}

export default VestaView;