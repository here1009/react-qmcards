import React, { Component } from 'react';
import './VestaView.css'
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ATOMCONFIGLoader } from './AtomconfigLoader';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import NB from './c2.config';
import ATOM from './ti2o.config';
import {Container,Row,Col} from 'react-bootstrap';
import {Dropdown,DropdownButton,ButtonGroup,Button} from 'react-bootstrap';

var vestaObj = function(){
    this.camera = null;
    this.scene= null;
    this.renderer= null;
    this.labelRenderer= null;
    this.controls= null;
    this.root = new THREE.Group();
    this.offset = new THREE.Vector3();
    this.loader = new ATOMCONFIGLoader();
    this.gmount= null;
    this.gmoutn2= null;
    this.sf= 20;
    this.asf= 0.1;
    this.wb= 3.0;
    this.visualizationType = 2;
    this.initScene= function(){
        this.scene = new THREE.Scene();
        this.width = this.gmount.clientWidth;
        this.height = this.gmount.clientHeight;
    };
    this.initCamera= function(){
        var camera =
            new THREE.OrthographicCamera(
                -this.width,
                this.width,
                this.height,
                -this.height,
                .1,
                8000);
        camera.zoom = 1;
        camera.position.set(0, 0, 4000);
        camera.updateProjectionMatrix();
        this.camera=camera;
    };
    this.initLight= function(){
        var light = new THREE.DirectionalLight(0xffffff, 0.7);
        light.position.set(1, 1, 1);
        this.scene.add(light);

        var light = new THREE.DirectionalLight(0xffffff, 0.7);
        light.position.set(-1, -1, -1);
        this.scene.add(light);

        var light = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(light);
    };
    this.initGroup= function(){
        this.scene.add(this.root);
    };
    this.initRenderer= function(){
        //
        var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(this.width, this.height);
        this.renderer=renderer;
        this.gmount.appendChild(this.renderer.domElement);
        //
        var labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(this.width, this.height);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0';
        labelRenderer.domElement.style.pointerEvents = 'none';
        this.labelRenderer=labelRenderer;
        this.gmount.appendChild(this.labelRenderer.domElement);
        //
        this.renderer2 = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer2.setSize(this.width*0.3,this.width*0.3);
        this.gmount2.style.position="absolute";
        this.gmount2.style.top=(50)+"px";
        this.gmount2.style.left=(50)+"px";
        this.gmount2.appendChild(this.renderer2.domElement);
    };
    this.initControls= function(){
        //
        var controls = new TrackballControls(this.camera, this.renderer.domElement);
        //var controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.minDistance = 500;
        controls.maxDistance = 2000;
        controls.noPan=true;
        this.controls = controls;
    };
    this.loadMolecule= function(url,root){

        while (root.children.length > 0) {

            var object = root.children[0];
            object.parent.remove(object);

        }
        var offset=this.offset;
        var sf = this.sf;   // position scaling
        var asf = this.asf; // atom size
        var wb = this.wb;  // bond size
        var visualizationType = this.visualizationType;
        this.loader.load(url, function (pdb) {

            var geometryAtoms = pdb.geometryAtoms;
            var geometryBonds = pdb.geometryBonds;
            var json = pdb.json;

            var boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
            var cylinderGeometry = new THREE.CylinderBufferGeometry(wb, wb, 1, 32);
            var sphereGeometry = new THREE.IcosahedronBufferGeometry(1, 3);

            geometryAtoms.computeBoundingBox();
            geometryAtoms.boundingBox.getCenter(offset).negate();

            geometryAtoms.translate(offset.x, offset.y, offset.z);
            geometryBonds.translate(offset.x, offset.y, offset.z);

            var al = json.al;

            var position = new THREE.Vector3();
            var color = new THREE.Color();
            //
            if (visualizationType == 0) {
                plot_atom();
                plot_box();
            }
            else if (visualizationType == 1) {
                plot_bond();
                plot_box();
            } else if (visualizationType == 2) {
                plot_bond();
                plot_atom();
                plot_box();
            }
            //
            function plot_bond() {
                //plot bond
                var start = new THREE.Vector3();
                var end = new THREE.Vector3();
                var mid = new THREE.Vector3();
                var color_start = new THREE.Color();
                var color_end = new THREE.Color();
                var positions = geometryBonds.getAttribute('position');
                var colors = geometryBonds.getAttribute('color');
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

                    color_end.r = colors.getX(i + 1);
                    color_end.g = colors.getY(i + 1);
                    color_end.b = colors.getZ(i + 1);

                    mid.x = (start.x + end.x) / 2;
                    mid.y = (start.y + end.y) / 2;
                    mid.z = (start.z + end.z) / 2;

                    start.multiplyScalar(sf);
                    end.multiplyScalar(sf);
                    mid.multiplyScalar(sf);

                    var material = new THREE.MeshPhongMaterial({ color: color_start });
                    var object = new THREE.Mesh(cylinderGeometry, material);
                    object.position.copy(start);
                    object.position.lerp(mid, 0.5);

                    var direction = new THREE.Vector3().subVectors(mid, start);
                    var axis = new THREE.Vector3(0, 1, 0);
                    object.quaternion.setFromUnitVectors(axis, direction.clone().normalize());

                    object.scale.set(1, start.distanceTo(mid), 1);

                    var material = new THREE.MeshPhongMaterial({ color: color_end });
                    var object2 = new THREE.Mesh(cylinderGeometry, material);
                    object2.position.copy(end);
                    object2.position.lerp(mid, 0.5);

                    var direction = new THREE.Vector3().subVectors(mid, end);
                    var axis = new THREE.Vector3(0, 1, 0);
                    object2.quaternion.setFromUnitVectors(axis, direction.clone().normalize());

                    object2.scale.set(1, end.distanceTo(mid), 1);

                    root.add(object);
                    root.add(object2);
                }
            };
            //plot atoms
            function plot_atom() {
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
                    if (atom[9]) {
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
            }
            function plot_box() {
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
                var start = new THREE.Vector3();
                var end = new THREE.Vector3();
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

                    var lineGeometry = new THREE.Geometry();
                    lineGeometry.vertices.push(
                        start.clone(),
                        end.clone()
                    );
                    color.r = 0;
                    color.g = 0;
                    color.b = 0;
                    var lineMaterial = new THREE.LineBasicMaterial({ color: color });
                    var object = new THREE.Line(lineGeometry, lineMaterial);
                   // console.log([start,end]);
                    root.add(object);
                }
            }
        });

    };
    this.plot_axes = function() {
        this.camera2 =
            new THREE.OrthographicCamera(
                -this.width,
                this.width,
                this.height,
                -this.height,
                .1,
                8000);
        this.scene2 = new THREE.Scene();
        this.camera2.up = this.camera.up;
        this.camera2.updateProjectionMatrix();
        var len = this.width*0.5;
        //
        var dir = new THREE.Vector3(1, 0, 0);
        dir.normalize();
        var origin = new THREE.Vector3(0, 0, 0);
        var length = len;
        var hex = 0xff0000;
        var arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
        this.scene2.add(arrowHelper);
        //
        var dir = new THREE.Vector3(0, 1, 0);
        dir.normalize();
        var origin = new THREE.Vector3(0, 0, 0);
        var length = len;
        var hex = 0x00ff00;
        var arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
        this.scene2.add(arrowHelper);
        //
        var dir = new THREE.Vector3(0, 0, 1);
        dir.normalize();
        var origin = new THREE.Vector3(0, 0, 0);
        var length = len;
        var hex = 0x0000ff;
        var arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
        this.scene2.add(arrowHelper);
    };
    this.init= function(){
        //window.onresize = onWindowResize;
        window.addEventListener('resize', ()=>this.onWindowResize(), false);
        this.initScene();
        this.initCamera();
        this.initLight();
        this.initGroup();
        this.initRenderer();
        this.initControls();
        this.loadMolecule(ATOM,this.root);
        this.plot_axes();
    };
    this.render= function () {
        this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);
        this.renderer2.render(this.scene2, this.camera2);
    }
    this.onWindowResize=function() {
        var width = this.gmount.clientWidth;
        var height = this.gmount.clientHeight;
        this.camera.left = -width;
        this.camera.right = width;
        this.camera.bottom = -height;
        this.camera.top = height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        //this.renderer2.setSize(width, height);
        this.labelRenderer.setSize(width, height);
    }
}

var obj1 = new vestaObj();
var obj2 = new vestaObj();

function animate(){
    requestAnimationFrame(animate);
    if(obj1.controls!=null){
        obj1.controls.update();
        obj1.camera2.position.set(obj1.camera.position.x, obj1.camera.position.y, obj1.camera.position.z);
        obj1.camera2.position.setLength(2000);
        obj1.camera2.lookAt(obj1.controls.target);
        obj1.render();
    }
    if(obj2.controls!=null){
        obj2.controls.update();
        obj2.camera2.position.set(obj2.camera.position.x, obj2.camera.position.y, obj2.camera.position.z);
        obj2.camera2.position.setLength(2000);
        obj2.camera2.lookAt(obj2.controls.target);
        obj2.render();
    }
}


class VestaView extends Component {
    componentDidMount() {
        obj1.init();
        animate();
    }
    render() {
        return (
            <div>
                <div
                    id="canvas_vesta"
                    ref={(mount) => { obj1.gmount = mount }}
                //ref={(mount) => {
                //vestaObj.gmount = mount;
                //    vestaObj.gmount.innerHeight = vestaObj.gmount.clientHeight;
                //    vestaObj.gmount.innerWidth = vestaObj.gmount.clientWidth;
                //}}
                >
                </div>
                <div
                    id="canvas_vesta_axes"
                    ref={(mount) => { obj1.gmount2 = mount }}
                >
                </div>
            </div>
        );
    }
}
class VestaViewModal extends Component {
    componentDidMount() {
        obj2.init();
        animate();
    }
    render() {
        return (
            <div>
                <Container>
                    <Row style={{ width: "100%" }}>
                        <Col xs={10} lg={10}>
                            <div>
                                <div
                                    id="canvas_vesta_modal"
                                    ref={(mount) => { obj2.gmount = mount; }}
                                // ref={(mount) => {
                                // vestaObj.gmount = mount;
                                //     vestaObj.gmount.innerHeight = window.innerHeight;
                                //     vestaObj.gmount.innerWidth = vestaObj.gmount.clientWidth;
                                // }}
                                >

                                </div>
                                <div
                                    id="canvas_vesta_modal_axes"
                                    ref={(mount) => { obj2.gmount2 = mount }}
                                >

                                </div>
                            </div>
                        </Col>
                        <Col xs={2} lg={2} style={{textAlign:"center"}}>
                            <ButtonGroup vertical>
                                <Button>Button</Button>
                                <Button>Button</Button>
                                <Button>Button</Button>
                                <Button>Button</Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
export {VestaViewModal};
export default VestaView;