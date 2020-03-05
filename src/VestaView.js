import React, { Component } from 'react';
import './VestaView.css'
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ATOMCONFIGLoader } from './AtomconfigLoader';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import NB from './c2.config';
//import ATOM from './caffeine.config';
import ATOM from './atom2.config';

var vestaObj = function(){
    this.camera = null;
    this.scene= null;
    this.renderer= null;
    this.labelRenderer= null;
    this.controls= null;
    this.root = new THREE.Group();
    this.root2 = new THREE.Group();
    this.offset = new THREE.Vector3();
    this.loader = new ATOMCONFIGLoader();
    this.gmount= null;
    this.gmount2= null;
    this.initzoom=true;
    this.box=new THREE.Box3();
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
        this.camera =
            new THREE.OrthographicCamera(
                -this.width,
                this.width,
                this.height,
                -this.height,
                .1,
                8000);
        this.camera.zoom = 1;
        this.camera.position.set(0, 0, 4000);
        this.camera.updateProjectionMatrix();
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
        this.gmount.style.position="relative";
        //this.gmount.style.backgroundColor="#ff0000";
        this.gmount.style.margin=0;
        this.gmount.style.padding=0;
        this.gmount.appendChild(this.renderer.domElement);
        //
        var labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(this.width, this.height);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0';
        labelRenderer.domElement.style.pointerEvents = 'none';
        this.labelRenderer=labelRenderer;
        this.gmount.appendChild(this.labelRenderer.domElement);
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
    this.loadMolecule=function(url,root,root2){

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
            plot_axes();
            if (visualizationType == 0) {
                plot_atom();
            }
            else if (visualizationType == 1) {
                plot_bond();
            } else if (visualizationType == 2) {
                plot_bond();
                plot_atom();
            }
            plot_box();
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
            function plot_axes(){
                var len=100;
                var len2=80;
                var [x,y,z] = [1,0,0];
                var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
                var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
                var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
                var s1 = Math.sqrt(fx*fx+fy*fy+fz*fz);
                var [x,y,z] = [0,1,0];
                var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
                var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
                var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
                var s2 = Math.sqrt(fx*fx+fy*fy+fz*fz);
                var [x,y,z] = [0,0,1];
                var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
                var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
                var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
                var s3 = Math.sqrt(fx*fx+fy*fy+fz*fz);
                var s = Math.max(s1,s2,s3);
                var lenx = len/s1;
                var lenx2 = len2/s1;
                var leny = len/s2;
                var leny2 = len2/s2;
                var lenz = len/s3;
                var lenz2 = len2/s3;
                //console.log([lenx,leny,lenz]);
                //
                var sphereGeometry = new THREE.IcosahedronBufferGeometry(1, 3);
                var material = new THREE.MeshPhongMaterial({ color: "#dfe6e6" });
                var object = new THREE.Mesh(sphereGeometry, material);
                object.position.copy(new THREE.Vector3(0, 0, 0));
                object.scale.multiplyScalar(10);
                root2.add(object);
                //
                var cylinderGeometry = new THREE.CylinderBufferGeometry(5, 1, 1, 32);
                var material = new THREE.MeshPhongMaterial({ color: "#a51c1c" });
                var object = new THREE.Mesh(cylinderGeometry, material);
                var start = new THREE.Vector3(0, 0, 0);
                var [x,y,z] = [lenx2,0,0];
                var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
                var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
                var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
                var end = new THREE.Vector3(fx, fy, fz)
                var direction = new THREE.Vector3().subVectors(end, start);
                var axis = new THREE.Vector3(0, 1, 0);
                object.quaternion.setFromUnitVectors(axis, direction.clone().normalize());
                object.position.copy(start);
                object.position.lerp(end, 0.5);
                object.scale.set(1, start.distanceTo(end), 1);
                root2.add(object);
                //
                var cylinderGeometry = new THREE.CylinderBufferGeometry(1, 8, 1, 32);
                var material = new THREE.MeshPhongMaterial({ color: "#a51c1c" });
                var object = new THREE.Mesh(cylinderGeometry, material);
                var [x,y,z] = [lenx2,0,0];
                var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
                var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
                var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
                var start = new THREE.Vector3(fx, fy, fz);
                var [x,y,z] = [lenx,0,0];
                var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
                var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
                var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
                var end = new THREE.Vector3(fx, fy, fz);
                var direction = new THREE.Vector3().subVectors(end, start);
                var axis = new THREE.Vector3(0, 1, 0);
                object.position.copy(start);
                object.position.lerp(end, 0.5);
                object.quaternion.setFromUnitVectors(axis, direction.clone().normalize());
                object.scale.set(1, start.distanceTo(end), 1);
                root2.add(object);
                //
                var cylinderGeometry = new THREE.CylinderBufferGeometry(5, 1, 1, 32);
                var material = new THREE.MeshPhongMaterial({ color: "#3f51b5" });
                var object = new THREE.Mesh(cylinderGeometry, material);
                var start = new THREE.Vector3(0, 0, 0);
                var [x,y,z] = [0,leny2,0];
                var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
                var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
                var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
                var end = new THREE.Vector3(fx, fy, fz);
                var direction = new THREE.Vector3().subVectors(end, start);
                var axis = new THREE.Vector3(0, 1, 0);
                object.position.copy(start);
                object.position.lerp(end, 0.5);
                object.quaternion.setFromUnitVectors(axis, direction.clone().normalize());
                object.scale.set(1, start.distanceTo(end), 1);
                root2.add(object);
                //
                var cylinderGeometry = new THREE.CylinderBufferGeometry(1, 8, 1, 32);
                var material = new THREE.MeshPhongMaterial({ color: "#3f51b5" });
                var object = new THREE.Mesh(cylinderGeometry, material);
                var [x,y,z] = [0,leny2,0];
                var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
                var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
                var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
                var start = new THREE.Vector3(fx, fy, fz);
                var [x,y,z] = [0,leny,0];
                var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
                var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
                var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
                var end = new THREE.Vector3(fx, fy, fz);
                var direction = new THREE.Vector3().subVectors(end, start);
                var axis = new THREE.Vector3(0, 1, 0);
                object.quaternion.setFromUnitVectors(axis, direction.clone().normalize());
                object.position.copy(start);
                object.position.lerp(end, 0.5);
                object.scale.set(1, start.distanceTo(end), 1);
                root2.add(object);
                //
                var cylinderGeometry = new THREE.CylinderBufferGeometry(5, 1, 1, 32);
                var material = new THREE.MeshPhongMaterial({ color: "#009688" });
                var object = new THREE.Mesh(cylinderGeometry, material);
                var start = new THREE.Vector3(0, 0, 0);
                var [x,y,z] = [0,0,lenz2];
                var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
                var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
                var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
                var end = new THREE.Vector3(fx, fy, fz);
                var direction = new THREE.Vector3().subVectors(end, start);
                var axis = new THREE.Vector3(0, 1, 0);
                object.quaternion.setFromUnitVectors(axis, direction.clone().normalize());
                object.position.copy(start);
                object.position.lerp(end, 0.5);
                object.scale.set(1, start.distanceTo(end), 1);
                root2.add(object);
                //
                var cylinderGeometry = new THREE.CylinderBufferGeometry(1, 8, 1, 32);
                var material = new THREE.MeshPhongMaterial({ color: "#009688" });
                var object = new THREE.Mesh(cylinderGeometry, material);
                var [x,y,z] = [0,0,lenz2];
                var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
                var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
                var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
                var start = new THREE.Vector3(fx, fy, fz);
                var [x,y,z] = [0,0,lenz];
                var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
                var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
                var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
                var end = new THREE.Vector3(fx, fy, fz);
                var direction = new THREE.Vector3().subVectors(end, start);
                var axis = new THREE.Vector3(0, 1, 0);
                object.quaternion.setFromUnitVectors(axis, direction.clone().normalize());
                object.position.copy(start);
                object.position.lerp(end, 0.5);
                object.scale.set(1, start.distanceTo(end), 1);
                root2.add(object);
            }
        });
        
        
    };
    this.initAxes = function() {
        var len=100;
        var len2=len*0.8;
        //
        this.renderer2 = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer2.setSize(len,len);
        this.gmount2.style.position="absolute";
        //this.gmount2.style.backgroundColor="#000";
        this.gmount2.style.top=(38)+"px";
        this.gmount2.style.left=(0)+"px";
        this.gmount2.style.margin=0;
        this.gmount2.style.padding=0;
        this.gmount2.appendChild(this.renderer2.domElement);
        this.camera2 =
            new THREE.OrthographicCamera(
                -len,
                len,
                len,
                -len,
                .1,
                8000);
        this.scene2 = new THREE.Scene();
        this.camera2.up = this.camera.up;
        this.camera2.updateProjectionMatrix();
        var light = new THREE.DirectionalLight(0xffffff, 0.7);
        light.position.set(1, 1, 1);
        this.scene2.add(light);

        var light = new THREE.DirectionalLight(0xffffff, 0.7);
        light.position.set(-1, -1, -1);
        this.scene2.add(light);

        var light = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene2.add(light);

        this.scene2.add(this.root2);
    };
    this.init= function(){
        //window.onresize = onWindowResize;
        window.addEventListener('resize', ()=>this.onWindowResize(), false);
        this.initScene();
        this.initGroup();
        this.loadMolecule(ATOM,this.root,this.root2);
        this.initCamera();
        this.initLight();
        this.initRenderer();
        this.initControls();
        this.initAxes();
    };
    this.setZoom = function(){
        var box = new THREE.Box3();
        box.expandByObject(this.root);
        this.rwidth = box.max.x - box.min.x;
        this.rheight = box.max.y - box.min.x;
        if(isFinite(this.rwidth) && this.initzoom==true){
            this.camera.zoom = 0.8 * this.width / this.rwidth;
            this.camera.updateProjectionMatrix();
            this.initzoom=false;
        }
    }
    this.render = function () {
        this.setZoom();
        this.renderer.render(this.scene, this.camera);
        this.labelRenderer.render(this.scene, this.camera);
        this.renderer2.render(this.scene2, this.camera2);
    }
    this.onWindowResize=function() {
        var width = this.gmount.clientWidth;
        var height = this.gmount.clientHeight;
        this.width = width;
        this.height = height;
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
                    ref={(mount) => { obj1.gmount = mount;}}
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
                    ref={(mount) => { obj2.gmount2 = mount; }}
                >
                </div>
            </div>
        );
    }
}
export {VestaViewModal};
export default VestaView;