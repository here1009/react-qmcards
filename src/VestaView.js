import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './VestaView.css';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { ATOMCONFIGLoader } from './AtomconfigLoader';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { MdFullscreen,MdClose,MdCached,MdArrowDownward,MdArrowUpward,MdArrowBack,MdRefresh,MdArrowForward,MdRotateLeft,MdRotateRight } from 'react-icons/md';
import {Card,Row,Col,Jumbotron,Button,Container,InputGroup,FormControl,Accordion} from 'react-bootstrap';
import {BtnSetting} from './BtnSetting';
//import NB from './c2.config';
import ATOM from './caffeine.config';
//import ATOM from './QD_Si.config';


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
    this.al=[];
    this.atoms=[];
    this.sf= 20;
    this.asf= 0.1;
    this.wb= 3.0;
    this.visualizationType = 2;
    this.bond_depth=0;
    this.max_expand_rcut=6.0;
    this.configfile="";
    this.initScene= function(){
        this.scene = new THREE.Scene();
        this.width = this.gmount.clientWidth;
        this.height = this.gmount.clientHeight;
        console.log(this.gmount);
        console.log(this.width,this.height);
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
        this.camera.position.set(0, 0, 1000);
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
        //
        // var tcontrols = new TransformControls(this.camera, this.renderer.domElement);
        
        
        // tcontrols.attach(this.root);
        // tcontrols.setMode('translate');
        // //tcontrols.setMode('rotate');
        // this.tcontrols=tcontrols;
        // this.scene.add(this.tcontrols);
        // //this.controls.enabled=false;
        // this.tcontrols.addEventListener( 'dragging-changed', function ( event ) {
        //     controls.enabled = !event.value
        //   } );

        /* var objects = [];
        objects.push(this.root);
        for (let i = 0; i < this.scene.children.length; i++) {
            if (this.scene.children[i].isMesh) {
                objects.push(this.scene.children[i]);
            }
        }
          // 初始化拖拽控件
        this.dragControls = new DragControls(objects, this.camera, this.renderer.domElement);
        var _this=this;
        // 鼠标略过事件
        this.dragControls.addEventListener('hoveron', function (event) {
            // 让变换控件对象和选中的对象绑定
            _this.tcontrols.attach(_this.root);           
        });
        this.dragControls.addEventListener('hoveroff', function (event) {
            //_this.tcontrols.detach();
        });
        // 开始拖拽
        this.dragControls.addEventListener('dragstart', function (event) {
            _this.controls.enabled = false;
        });
        // 拖拽结束
        this.dragControls.addEventListener('dragend', function (event) {
            _this.controls.enabled = true;
            
        }); */

        
    };
    this.loadMolecule=function(url,root,root2){
        if(url=="") return;
        this.initzoom=true;
        while (root.children.length > 0) {

            var object = root.children[0];
            object.parent.remove(object);

        }
        while (root2.children.length > 0) {

            var object = root2.children[0];
            object.parent.remove(object);
        }
        var scope = this;
        var offset=this.offset;
        var sf = this.sf;   // position scaling
        var asf = this.asf; // atom size
        var wb = this.wb;  // bond size
        var props={
            bond_depth:scope.bond_depth,
            visualizationType:scope.visualizationType,
            max_expand_rcut:scope.max_expand_rcut,
        };
        //在这个回调函数里操作页面的数据
        this.loader.load(url, props, function (pdb) {

            var geometryAtoms = pdb.geometryAtoms;
            var geometryBonds = pdb.geometryBonds;
            var json = pdb.json;

            var cylinderGeometry = new THREE.CylinderBufferGeometry(wb, wb, 1, 32);
            var sphereGeometry = new THREE.IcosahedronBufferGeometry(1, 3);

            geometryAtoms.computeBoundingBox();
            geometryAtoms.boundingBox.getCenter(offset).negate();

            geometryAtoms.translate(offset.x, offset.y, offset.z);
            geometryBonds.translate(offset.x, offset.y, offset.z);

            var al = json.al;
            scope.al = al.slice();
            scope.atoms = json.atoms.slice();
            var position = new THREE.Vector3();
            var color = new THREE.Color();
            //
            plot_axes();
            if (props.visualizationType == 0) {
                plot_atom();
            }
            else if (props.visualizationType == 1) {
                plot_bond();
            } else if (props.visualizationType == 2) {
                plot_bond();
                plot_atom();
            }
            plot_box();
            //
            var text=document.getElementById('txt_atoms');
            //console.log(text);
            if(text){
                text.value="";
                //No. type x y z color showOrnot
                for(var i=0;i<json.atoms.length;i++){
                    var No=i+1;
                    var type = json.atoms[i][4];
                    var x = json.atoms[i][6];
                    var y = json.atoms[i][7];
                    var z = json.atoms[i][8];
                    var showOrnot = true;
                    //var color=atoms[i]
                    var info=[No,type,x,y,z,showOrnot];
                    text.value=text.value+info.join("\t").toString()+"\n";
                }
                }
            //
            var text=document.getElementById('txt_box');
            //console.log(text);
            if(text){
                text.value="";
                //No. type x y z color showOrnot
                for(var i=0;i<json.al.length;i++){
                    var x = json.al[i][0];
                    var y = json.al[i][1];
                    var z = json.al[i][2];
                    //var color=atoms[i]
                    var info=[x,y,z];
                    text.value=text.value+info.join("\t").toString()+"\n";
                }
            }
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
        this.initCamera();
        this.initLight();
        this.initRenderer();
        this.initControls();
        this.initAxes();
        this.loadfile();
        //this.loadMolecule(ATOM,this.root,this.root2);
        this.loadMolecule(this.configfile,this.root,this.root2);
        // set parameters
        // pass in parameters use scope(not use keyword this)
        // reload file, build geometry
        // if need returned datas, need sync loader.load or check state in loop      
    }
    this.setBondDepth = function(properties){
        //bond search depth
        var props = properties || {};
        if(props.bond_depth!=null){
            this.bond_depth = props.bond_depth; 
        }     
        if(props.max_expand_rcut!=null){
            this.max_expand_rcut = props.max_expand_rcut;
        }
        if(props.visualizationType!=null){
            this.visualizationType = props.visualizationType;
        }
        this.reloadfile();
    }
    this.reloadfile = function(){
        if(this.fileconfig){
            this.loadMolecule(this.fileconfig,this.root,this.root2);
        }
    }
    this.loadfile = function () {
        var scope = this;
        var loader = new THREE.FileLoader();
        loader.load(
            ATOM,
            function (data) {
            },
            // onProgress callback
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },

            // onError callback
            function (err) {
                console.error('An error happened');
            }
        );
    }
    this.setZoom = function(){
        var box = new THREE.Box3();
        box.expandByObject(this.root);
        this.rwidth = box.max.x - box.min.x;
        this.rheight = box.max.y - box.min.y;
        if(isFinite(this.rwidth) && this.initzoom==true){
            this.camera.zoom = 0.6 * this.width / this.rwidth;
            this.camera.updateProjectionMatrix();
            this.initzoom=false;
            // this.tcontrols.size=1/this.camera.zoom;
            // console.log(this.tcontrols.size);
        }
    }
    this.setRotation = function(properties){
        var direction = properties.direction;
        var angle = properties.angle;
        if(direction=='x'){
            this.root.rotation.x+=angle;
            this.root2.rotation.x+=angle;
        }
        if(direction=='y'){
            this.root.rotation.y+=angle;
            this.root2.rotation.y+=angle;
        }
        if(direction=='z'){
            this.root.rotation.z+=angle;
            this.root2.rotation.z+=angle;
        }
    }
    this.initRotation = function(){
        this.root.rotation.x=0;
        this.root2.rotation.x=0;
        this.root.rotation.y=0;
        this.root2.rotation.y=0;
        this.root.rotation.z=0;
        this.root2.rotation.z=0;
    }
    this.render = function () {
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

//var obj1 = new vestaObj();
var obj2 = new vestaObj();

function animate(){
    requestAnimationFrame(animate);
    if(obj2.controls!=null){
        obj2.controls.update();
        obj2.camera2.position.set(obj2.camera.position.x, obj2.camera.position.y, obj2.camera.position.z);
        obj2.camera2.position.setLength(2000);
        obj2.camera2.lookAt(obj2.controls.target);
        obj2.setZoom();
        obj2.render();
        //console.log(obj2.camera.position);
        
    }
}


class VestaModal extends Component {
//    constructor(){
//        super();
//        this.state={
//            bond_depth:0
//        }
//    }
    componentDidMount() {
        obj2.init();
        animate();
        VestaModal.showInstance();
    }
    componentWillUnmount(){
        
    }
    render() {
        return (
            <div>
                    <Row>
                        <Col xs={12} lg={12}>
                        <div
                            id="canvas_vesta_modal"
                            ref={(mount) => { obj2.gmount = mount; }}
                         ></div>
                        <div
                            id="canvas_vesta_axes"
                            ref={(mount) => { obj2.gmount2 = mount }}
                        >
                        </div>
                        </Col>
                        <Col id='side_settings' style={{width:197+"px"}}>
                        <BtnSetting></BtnSetting>
                            
                        </Col>
                    </Row>
                    <Row>

                    </Row>
            </div>
        );
    }

}
VestaModal.showInstance = function() {
    var text=document.getElementById('text_bond_depth');
    if(text){
        text.value=obj2.bond_depth;
    }
    var text=document.getElementById('text_max_expand_rcut');
    if(text){
        text.value=obj2.max_expand_rcut;
    }
    var btn=document.getElementById('btn_bond_depth');
    if(btn){
        btn.addEventListener('click', ()=>{
            var text1=document.getElementById('text_bond_depth');
            var text2=document.getElementById('text_max_expand_rcut');
                obj2.setBondDepth({
                    bond_depth:parseInt(text1.value),
                    max_expand_rcut:parseFloat(text2.value),
                });
        }, false);
    }
    var btn=document.getElementById('btn_showatom');
    if(btn){
    btn.addEventListener('click', ()=>{
            obj2.setBondDepth({
                visualizationType:0,
            });
    }, false);
    }
    var btn=document.getElementById('btn_showbond');
    if(btn){
    btn.addEventListener('click', ()=>{
            obj2.setBondDepth({
                visualizationType:1,
            });
    }, false);
    
    }
    var btn=document.getElementById('btn_showatombond');
    if(btn){
    btn.addEventListener('click', ()=>{
            obj2.setBondDepth({
                visualizationType:2,
            });
    }, false);
    }
    
    var text=document.getElementById('text_rotation');
    if(text){
    text.value=45;
    }
    var btn=document.getElementById('btn_rotateup');
    if(btn){
    btn.addEventListener('click', ()=>{
            var rangle=-parseFloat(text.value)/180*Math.PI;
            //
            var axis = new THREE.Vector3();
            var quaternion = new THREE.Quaternion();
            //
            var _eye = new THREE.Vector3();
            var eyeDirection = new THREE.Vector3();
			var objectUpDirection = new THREE.Vector3();
            var objectSidewaysDirection = new THREE.Vector3();
            var moveDirection = new THREE.Vector3();
            _eye.copy( obj2.camera.position ).sub( obj2.controls.target );
            eyeDirection.copy( _eye ).normalize();
			objectUpDirection.copy( obj2.camera.up ).normalize();
            objectSidewaysDirection.crossVectors(eyeDirection,objectUpDirection ).normalize();
            //moveDirection.copy( objectUpDirection.add( objectSidewaysDirection ) );
            //axis.crossVectors( moveDirection, _eye ).normalize();
            axis.copy(objectSidewaysDirection);
            //console.log(objectSidewaysDirection);
            quaternion.setFromAxisAngle( axis, rangle );
			_eye.applyQuaternion( quaternion );
			obj2.camera.up.applyQuaternion( quaternion );
            //
            obj2.camera.position.copy(_eye);
            obj2.camera.updateProjectionMatrix();
            //
    }, false);
    }
    var btn=document.getElementById('btn_rotatedown');
    if(btn){
    btn.addEventListener('click', ()=>{
        var rangle=+parseFloat(text.value)/180*Math.PI;
        //
        var axis = new THREE.Vector3();
        var quaternion = new THREE.Quaternion();
        //
        var _eye = new THREE.Vector3();
        var eyeDirection = new THREE.Vector3();
        var objectUpDirection = new THREE.Vector3();
        var objectSidewaysDirection = new THREE.Vector3();
        var moveDirection = new THREE.Vector3();
        _eye.copy( obj2.camera.position ).sub( obj2.controls.target );
        eyeDirection.copy( _eye ).normalize();
        objectUpDirection.copy( obj2.camera.up ).normalize();
        objectSidewaysDirection.crossVectors(eyeDirection,objectUpDirection ).normalize();
        //moveDirection.copy( objectUpDirection.add( objectSidewaysDirection ) );
        //axis.crossVectors( moveDirection, _eye ).normalize();
        axis.copy(objectSidewaysDirection);
        //console.log(objectSidewaysDirection);
        quaternion.setFromAxisAngle( axis, rangle );
        _eye.applyQuaternion( quaternion );
        obj2.camera.up.applyQuaternion( quaternion );
        //
        obj2.camera.position.copy(_eye);
        obj2.camera.updateProjectionMatrix();
        //
        //
    }, false);
}
    var btn=document.getElementById('btn_rotatezl');
    if(btn){
    btn.addEventListener('click', ()=>{
        var rangle=-parseFloat(text.value)/180*Math.PI;
        //
        var axis = new THREE.Vector3();
        var quaternion = new THREE.Quaternion();
        //
        var _eye = new THREE.Vector3();
        var eyeDirection = new THREE.Vector3();
        var objectUpDirection = new THREE.Vector3();
        var objectSidewaysDirection = new THREE.Vector3();
        var moveDirection = new THREE.Vector3();
        _eye.copy( obj2.camera.position ).sub( obj2.controls.target );
        eyeDirection.copy( _eye ).normalize();
        axis.copy(eyeDirection);
        //console.log(objectSidewaysDirection);
        quaternion.setFromAxisAngle( axis, rangle );
        _eye.applyQuaternion( quaternion );
        obj2.camera.up.applyQuaternion( quaternion );
        //
        obj2.camera.position.copy(_eye);
        obj2.camera.updateProjectionMatrix();
        //
        //
    }, false);
}
    var btn=document.getElementById('btn_rotatezr');
    if(btn){
    btn.addEventListener('click', ()=>{
        var rangle=parseFloat(text.value)/180*Math.PI;
        //
        var axis = new THREE.Vector3();
        var quaternion = new THREE.Quaternion();
        //
        var _eye = new THREE.Vector3();
        var eyeDirection = new THREE.Vector3();
        var objectUpDirection = new THREE.Vector3();
        var objectSidewaysDirection = new THREE.Vector3();
        var moveDirection = new THREE.Vector3();
        _eye.copy( obj2.camera.position ).sub( obj2.controls.target );
        eyeDirection.copy( _eye ).normalize();
        axis.copy(eyeDirection);
        //console.log(objectSidewaysDirection);
        quaternion.setFromAxisAngle( axis, rangle );
        _eye.applyQuaternion( quaternion );
        obj2.camera.up.applyQuaternion( quaternion );
        //
        obj2.camera.position.copy(_eye);
        obj2.camera.updateProjectionMatrix();
        //
        //
    }, false);
}
    var btn=document.getElementById('btn_rotateleft');
    if(btn){
    btn.addEventListener('click', ()=>{
            var rangle=parseFloat(text.value)/180*Math.PI;
            var oripos = obj2.camera.position;
            //
            var axis = obj2.camera2.up.clone();
            var quaternion = new THREE.Quaternion();
            quaternion.setFromAxisAngle( axis, rangle );
            var vector = oripos.clone();
            vector.applyQuaternion( quaternion);
            obj2.camera.position.copy(vector);
            obj2.camera.updateProjectionMatrix();
            //console.log(obj2.camera.up);
    }, false);
}
    var btn=document.getElementById('btn_rotateright');
    if(btn){
    btn.addEventListener('click', ()=>{
            var rangle=-parseFloat(text.value)/180*Math.PI;
            var oripos = obj2.camera.position;
            //
            var axis = obj2.camera2.up.clone();
            var quaternion = new THREE.Quaternion();
            quaternion.setFromAxisAngle( axis, rangle );
            var vector = oripos.clone();
            vector.applyQuaternion( quaternion);
            obj2.camera.position.copy(vector);
            obj2.camera.updateProjectionMatrix();
    }, false);
}
    var btn=document.getElementById('btn_rotatemid');
    if(btn){
    btn.addEventListener('click', ()=>{
            obj2.controls.reset();
            //obj2.tcontrols.detach();
            //obj2.tcontrols.attach(obj2.root);
            obj2.initzoom=true;
            //obj2.setZoom();
            //obj2.camera.updateProjectionMatrix();
            //console.log(obj2.root.position);
            obj2.root.position.copy(new THREE.Vector3(0,0,0));
            //console.log(obj2.root.rotation);
            obj2.root.rotation.x=0;
            obj2.root.rotation.y=0;
            obj2.root.rotation.z=0;
            obj2.root.scale.x=1.0;
            obj2.root.scale.y=1.0;
            obj2.root.scale.z=1.0;
            
    }, false);
}
    var btn=document.getElementById('btn_a');
    if(btn){
    btn.addEventListener('click', ()=>{
            obj2.controls.reset();
            //obj2.tcontrols.detach();
            //obj2.tcontrols.attach(obj2.root);
            obj2.initzoom=true;
            //obj2.setZoom();
            //obj2.camera.updateProjectionMatrix();
            //console.log(obj2.root.position);
            obj2.root.position.copy(new THREE.Vector3(0,0,0));
            //console.log(obj2.root.rotation);
            obj2.root.rotation.x=0;
            obj2.root.rotation.y=0;
            obj2.root.rotation.z=0;
            //
            var quaternion = new THREE.Quaternion();
            //
            var _eye = new THREE.Vector3();
            var eyeDirection = new THREE.Vector3();
            _eye.copy( obj2.camera.position ).sub( obj2.controls.target );
            eyeDirection.copy( _eye ).normalize();
            //
            var al = obj2.al;
            var [x,y,z] = [1,0,0];
            var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
            var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
            var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
            var axis = new THREE.Vector3(fx, fy, fz);
            //
            quaternion.setFromUnitVectors(eyeDirection,axis.normalize());
            _eye.applyQuaternion( quaternion );
            obj2.camera.up.applyQuaternion( quaternion );
            //
            obj2.camera.position.copy(_eye);
            obj2.camera.updateProjectionMatrix();
            //
    }, false);
}
    var btn=document.getElementById('btn_astar');
    if(btn){
    btn.addEventListener('click', ()=>{
            obj2.controls.reset();
            //obj2.tcontrols.detach();
            //obj2.tcontrols.attach(obj2.root);
            obj2.initzoom=true;
            //obj2.setZoom();
            //obj2.camera.updateProjectionMatrix();
            //console.log(obj2.root.position);
            obj2.root.position.copy(new THREE.Vector3(0,0,0));
            //console.log(obj2.root.rotation);
            obj2.root.rotation.x=0;
            obj2.root.rotation.y=0;
            obj2.root.rotation.z=0;
            //
            var quaternion = new THREE.Quaternion();
            //
            var _eye = new THREE.Vector3();
            var eyeDirection = new THREE.Vector3();
            _eye.copy( obj2.camera.position ).sub( obj2.controls.target );
            eyeDirection.copy( _eye ).normalize();
            //
            var al = obj2.al;
            var [x,y,z] = [-1,0,0];
            var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
            var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
            var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
            var axis = new THREE.Vector3(fx, fy, fz);
            //
            quaternion.setFromUnitVectors(eyeDirection,axis.normalize());
            _eye.applyQuaternion( quaternion );
            obj2.camera.up.applyQuaternion( quaternion );
            //
            obj2.camera.position.copy(_eye);
            obj2.camera.updateProjectionMatrix();
            //
    }, false);
}
    var btn=document.getElementById('btn_b');
    if(btn){
    btn.addEventListener('click', ()=>{
            obj2.controls.reset();
            //obj2.tcontrols.detach();
            //obj2.tcontrols.attach(obj2.root);
            obj2.initzoom=true;
            //obj2.setZoom();
            //obj2.camera.updateProjectionMatrix();
            //console.log(obj2.root.position);
            obj2.root.position.copy(new THREE.Vector3(0,0,0));
            //console.log(obj2.root.rotation);
            obj2.root.rotation.x=0;
            obj2.root.rotation.y=0;
            obj2.root.rotation.z=0;
            //
            var quaternion = new THREE.Quaternion();
            //
            var _eye = new THREE.Vector3();
            var eyeDirection = new THREE.Vector3();
            _eye.copy( obj2.camera.position ).sub( obj2.controls.target );
            eyeDirection.copy( _eye ).normalize();
            //
            var al = obj2.al;
            var [x,y,z] = [0,1,0];
            var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
            var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
            var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
            var axis = new THREE.Vector3(fx, fy, fz);
            //
            quaternion.setFromUnitVectors(eyeDirection,axis.normalize());
            _eye.applyQuaternion( quaternion );
            obj2.camera.up.applyQuaternion( quaternion );
            //
            obj2.camera.position.copy(_eye);
            obj2.camera.updateProjectionMatrix();
            //
    }, false);
}
    var btn=document.getElementById('btn_bstar');
    if(btn){
    btn.addEventListener('click', ()=>{
            obj2.controls.reset();
            //obj2.tcontrols.detach();
            //obj2.tcontrols.attach(obj2.root);
            obj2.initzoom=true;
            //obj2.setZoom();
            //obj2.camera.updateProjectionMatrix();
            //console.log(obj2.root.position);
            obj2.root.position.copy(new THREE.Vector3(0,0,0));
            //console.log(obj2.root.rotation);
            obj2.root.rotation.x=0;
            obj2.root.rotation.y=0;
            obj2.root.rotation.z=0;
            //
            var quaternion = new THREE.Quaternion();
            //
            var _eye = new THREE.Vector3();
            var eyeDirection = new THREE.Vector3();
            _eye.copy( obj2.camera.position ).sub( obj2.controls.target );
            eyeDirection.copy( _eye ).normalize();
            //
            var al = obj2.al;
            var [x,y,z] = [0,-1,0];
            var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
            var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
            var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
            var axis = new THREE.Vector3(fx, fy, fz);
            //
            quaternion.setFromUnitVectors(eyeDirection,axis.normalize());
            _eye.applyQuaternion( quaternion );
            obj2.camera.up.applyQuaternion( quaternion );
            //
            obj2.camera.position.copy(_eye);
            obj2.camera.updateProjectionMatrix();
            //
    }, false);
}
    var btn=document.getElementById('btn_c');
    if(btn){
    btn.addEventListener('click', ()=>{
            obj2.controls.reset();
            //obj2.tcontrols.detach();
            //obj2.tcontrols.attach(obj2.root);
            obj2.initzoom=true;
            //obj2.setZoom();
            //obj2.camera.updateProjectionMatrix();
            //console.log(obj2.root.position);
            obj2.root.position.copy(new THREE.Vector3(0,0,0));
            //console.log(obj2.root.rotation);
            obj2.root.rotation.x=0;
            obj2.root.rotation.y=0;
            obj2.root.rotation.z=0;
            //
            var quaternion = new THREE.Quaternion();
            //
            var _eye = new THREE.Vector3();
            var eyeDirection = new THREE.Vector3();
            _eye.copy( obj2.camera.position ).sub( obj2.controls.target );
            eyeDirection.copy( _eye ).normalize();
            //
            var al = obj2.al;
            var [x,y,z] = [0,0,1];
            var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
            var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
            var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
            var axis = new THREE.Vector3(fx, fy, fz);
            //
            quaternion.setFromUnitVectors(eyeDirection,axis.normalize());
            _eye.applyQuaternion( quaternion );
            obj2.camera.up.applyQuaternion( quaternion );
            //
            obj2.camera.position.copy(_eye);
            obj2.camera.updateProjectionMatrix();
            //
    }, false);
}
    var btn=document.getElementById('btn_cstar');
    if(btn){
    btn.addEventListener('click', ()=>{
            obj2.controls.reset();
            //obj2.tcontrols.detach();
            //obj2.tcontrols.attach(obj2.root);
            obj2.initzoom=true;
            //obj2.setZoom();
            //obj2.camera.updateProjectionMatrix();
            //console.log(obj2.root.position);
            obj2.root.position.copy(new THREE.Vector3(0,0,0));
            //console.log(obj2.root.rotation);
            obj2.root.rotation.x=0;
            obj2.root.rotation.y=0;
            obj2.root.rotation.z=0;
            
            //
            var quaternion = new THREE.Quaternion();
            //
            var _eye = new THREE.Vector3();
            var eyeDirection = new THREE.Vector3();
            _eye.copy( obj2.camera.position ).sub( obj2.controls.target );
            eyeDirection.copy( _eye ).normalize();
            //
            var al = obj2.al;
            var [x,y,z] = [0,0,-1];
            var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
            var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
            var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
            var axis = new THREE.Vector3(fx, fy, fz);
            //
            quaternion.setFromUnitVectors(eyeDirection,axis.normalize());
            _eye.applyQuaternion( quaternion );
            obj2.camera.up.applyQuaternion( quaternion );
            //
            obj2.camera.position.copy(_eye);
            obj2.camera.updateProjectionMatrix();
            //
    }, false);
    }
    
    const electron = window.electron; 
    const ipc = electron.ipcRenderer;
//
    ipc.send('get-file-data');
    ipc.on('loaded-file', function (event, file) {
        var path = require("path");
        //console.log(file);
        if(file){
            var fileconfig=path.normalize(file);
            obj2.fileconfig=fileconfig;
            obj2.reloadfile();
        }
    });
    //
    const selectDirBtn = document.getElementById('btn_select');
    if(selectDirBtn){
    selectDirBtn.addEventListener('click', function (event) {
        ipc.send('open-file-dialog')
    });
    
    ipc.on('selected-file', function (event, file) {
        var path = require("path");
        //console.log(file);
        if(file.filePaths){
            var fileconfig=path.normalize(file.filePaths[0]);
            obj2.fileconfig=fileconfig;
            obj2.reloadfile();
        }
    });
    var fs=require('fs'),
    textarea=document.getElementById("txt_atoms"),
    holder=document.getElementById("vesta");
    holder.ondragenter=holder.ondragover=function(event){
        // 重写ondragover 和 ondragenter 使其可放置
        event.preventDefault();

        //holder.className("holder-ondrag");
        //holder.innerText="Release Mouse";
    };

    holder.ondragleave=function(event){
        event.preventDefault();
        
        //holder.className(" ");
        //holder.innerText="Please Drag sth. in here";
    };

    holder.ondrop=function(event){
        // 调用 preventDefault() 来避免浏览器对数据的默认处理
        //（drop 事件的默认行为是以链接形式打开） 
        event.preventDefault();
        
        var file=event.dataTransfer.files[0];
        console.log(file.path);
        var path = require("path");
        var fileconfig=path.normalize(file.path);
        obj2.fileconfig=fileconfig;
        obj2.reloadfile();
    }

}
}




export {VestaModal};