/**
 * @author alteredq / http://alteredqualia.com/
 * @author Mugen87 / https://github.com/Mugen87
 */

import {
	BufferGeometry,
	FileLoader,
	Float32BufferAttribute,
	Loader,
	RGBA_ASTC_10x10_Format
} from "three";

var ATOMCONFIGLoader = function ( manager ) {

	Loader.call( this, manager );

};

ATOMCONFIGLoader.prototype = Object.assign( Object.create( Loader.prototype ), {

	constructor: ATOMCONFIGLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new FileLoader( scope.manager );
		loader.setPath( scope.path );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( text ) );

		}, onProgress, onError );

	},

	// Based on CanvasMol PDB parser

	parse: function ( text ) {
		function det(al){
			return al[0][0]*(al[1][1]*al[2][2]-al[1][2]*al[2][1])-al[1][0]*(al[0][1]*al[2][2]-al[0][2]*al[2][1])+al[2][0]*(al[0][1]*al[1][2]-al[0][2]*al[1][1]);
		}
		function matmul(al,p){
			var res=[];
			var [x,y,z]=p.slice();
			var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
			var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
			var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
			res=[fx,fy,fz];
			return res;

		}
		function gen_ali(al){
			var a = al[0][0];
			var d = al[0][1];
			var g = al[0][2];
			var b = al[1][0];
			var e = al[1][1];
			var h = al[1][2];
			var c = al[2][0];
			var f = al[2][1];
			var i = al[2][2];
			var ali=[];
			var dd=det(al);
			ali[0] = [
				(e * i - h * f) / dd,
				(f * g - i * d) / dd,
				(d * h - g * e) / dd
			];
			ali[1] = [
				(-(b * i - h * c)) / dd,
				(-(c * g - i * a)) / dd,
				(-(a * h - g * b)) / dd
			];
			ali[2] = [
				(b * f - c * e) / dd,
				(c * d - a * f) / dd,
				(a * e - b * d) / dd
			];
			return ali;
		}
		function cross_product(a,b){
			var r=[
				a[1]*b[2]-a[2]*b[1],
				a[2]*b[0]-a[0]*b[2],
				a[0]*b[1]-a[1]*b[0]
			];
			return r;
		}
		function dot_product(a,b){
			var r=a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
			return r;
		}
		function fplane(a,n,p){
			var b=[p[0]-a[0],p[1]-a[1],p[2]-a[2]];
			var f=dot_product(n,b);
			return f;
		}
		function check_in_box(al,p){
			var tol=1.e-5;
			for (var i=0;i<3;i++){
				if(Math.abs(p[i])<=tol){
					p[i]=0.0;
				}
			}
			var o1 = [0.0,0.0,0.0];
			var l1 = al[0].slice();
			var l2 = al[1].slice();
			var l3 = al[2].slice();
			//console.log(al);
			var p1=l1.map((v,i)=>o1[i]+v);
			var p2=l2.map((v,i)=>o1[i]+v);
			var p3=l3.map((v,i)=>o1[i]+v);
			//
			var ll=l1.map((v,i)=>v+l2[i]+l3[i]);
			var o2 = ll.slice();
			//
			p1 = l1.map((v,i)=>v+l2[i]);
			p2 = l1.map((v,i)=>v+l3[i]);
			p1 = l2.map((v,i)=>v+l3[i]);
			//
			var l4=p1.map((v,i)=>v-o2[i]);
			var l5=p2.map((v,i)=>v-o2[i]);
			var l6=p3.map((v,i)=>v-o2[i]);
			//
			var pin = [0.5*o2[0],0.5*o2[1],0.5*o2[2]];
			var pin_2= pin.map((v,i)=>v-o2[i]);
			
			//plane1,l1,l2,o1
			var n=cross_product(l1,l2);
			var r1=fplane(o1,n,p);
			var r1_in=fplane(o1,n,pin);
			var f1=(r1*r1_in>0.0 || Math.abs(r1*r1_in)<1.e-5) ?  1:0;
			//plane2,l1,l3,o1
			var n=cross_product(l1,l3);
			var r2=fplane(o1,n,p);
			var r2_in=fplane(o1,n,pin);
			var f2=(r2*r2_in>0.0 || Math.abs(r2*r2_in)<1.e-5) ?  1:0;
			//plane3,l2,l3,o1
			var n=cross_product(l2,l3);
			var r3=fplane(o1,n,p);
			var r3_in=fplane(o1,n,pin);
			var f3=(r3*r3_in>0.0 || Math.abs(r3*r3_in)<1.e-5) ?  1:0;
			//plane4,l4,l5,o2
			var n=cross_product(l4,l5);
			var r4=fplane(o2,n,p);
			var r4_in=fplane(o2,n,pin_2);
			var f4=(r4*r4_in>0.0 || Math.abs(r4*r4_in)<1.e-5) ?  1:0;
			//plane5,l4,l6,o2
			var n=cross_product(l4,l6);
			var r5 = fplane(o2, n, p);
			var r5_in=fplane(o2,n,pin_2);
			var f5=(r5*r5_in>0.0 || Math.abs(r5*r5_in)<1.e-5) ?  1:0;
			//plane6,l5,l6,o2
			var n = cross_product(l5, l6);
			var r6 = fplane(o2, n, p);
			var r6_in=fplane(o2,n,pin_2);
			var f6=(r6*r6_in>0.0 || Math.abs(r6*r6_in)<1.e-5) ?  1:0;
			if(f1&&f2&&f3&&f4&&f5&&f6) {
				return 1;
			}

			return 0;
		}
		function check_in_atom(atoms,natom,a){
			for(var i=0;i<natom;i++){
				var c=[];
				c[0] = atoms[i][0];
				c[1] = atoms[i][1];
				c[2] = atoms[i][2];
				if(gen_dis(a,c)<1.e-5) {
					return 1;
				}

			}
			return 0;

		}
		function per_dr(a){
			var dr=[];
			dr=a.slice();
			for (var i = 0; i < 3; i++) {
				while (dr[i] > 1.0) {
					dr[i] = dr[i] - 1.0;
				}
				while (dr[i] < -0.0) {
					dr[i] = dr[i] + 1.0;
				}
			}
			return dr;
		}
		function gen_dis_per(al, a, b) {
			var dr = []
			dr[0] = a[0] - b[0]
			dr[1] = a[1] - b[1]
			dr[2] = a[2] - b[2]
			for (var i = 0; i < 3; i++) {
				while (dr[i] > 0.5) {
					dr[i] = dr[i] - 1.0;
				}
				while (dr[i] < -0.5) {
					dr[i] = dr[i] + 1.0;
				}
			}
			var x = dr[0];
			var y = dr[1];
			var z = dr[2];
			var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
			var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
			var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
			var dis = fx * fx + fy * fy + fz * fz;
			dis = Math.sqrt(dis);
			var c=[];
			c[0]=a[0]+x;
			c[1]=a[1]+y;
			c[2]=a[2]+z;
			var fc=[];
			fc[0] = al[0][0] * c[0] + al[1][0] * c[1] + al[2][0] * c[2];
			fc[1] = al[0][1] * c[0] + al[1][1] * c[1] + al[2][1] * c[2];
			fc[2] = al[0][2] * c[0] + al[1][2] * c[1] + al[2][2] * c[2];
			return [dis,c,fc];
		}
		function gen_dis_dir(al, a, b) {
			var dr = []
			dr[0] = a[0] - b[0]
			dr[1] = a[1] - b[1]
			dr[2] = a[2] - b[2]
			
			var x = dr[0];
			var y = dr[1];
			var z = dr[2];
			var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
			var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
			var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
			var dis = fx * fx + fy * fy + fz * fz;
			dis = Math.sqrt(dis);
			return dis;
		}
		function gen_dis(a, b) {
			var dr = []
			dr[0] = a[0] - b[0]
			dr[1] = a[1] - b[1]
			dr[2] = a[2] - b[2]
			
			var x = dr[0];
			var y = dr[1];
			var z = dr[2];
			var dis = x * x + y * y + z * z;
			dis = Math.sqrt(dis);
			return dis;
		}

		function trim( text ) {

			return text.replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' );

		}

		function capitalize( text ) {

			return text.charAt( 0 ).toUpperCase() + text.substr( 1 ).toLowerCase();

		}

		function hash( s, e ) {

			return 's' + Math.min( s, e ) + 'e' + Math.max( s, e );

		}

		function parseBond( start, length ) {

			var eatom = parseInt( lines[ i ].substr( start, length ) );

			if ( eatom ) {

				var h = hash( satom, eatom );

				if ( bhash[ h ] === undefined ) {

					bonds.push( [ satom - 1, eatom - 1, 1 ] );
					bhash[ h ] = bonds.length - 1;

				} else {

					// doesn't really work as almost all PDBs
					// have just normal bonds appearing multiple
					// times instead of being double/triple bonds
					// bonds[bhash[h]][2] += 1;

				}

			}

		}

		function buildGeometry() {

			var build = {
				geometryAtoms: new BufferGeometry(),
				geometryBonds: new BufferGeometry(),
				json: {
					atoms: atoms,
					bonds: bonds,
					al: al
				}
			};

			var geometryAtoms = build.geometryAtoms;
			var geometryBonds = build.geometryBonds;

			var i, l;

			var verticesAtoms = [];
			var colorsAtoms = [];
			var verticesBonds = [];

			// atoms

			for ( i = 0, l = atoms.length; i < l; i ++ ) {

				var atom = atoms[ i ];

				var x = atom[ 0 ];
				var y = atom[ 1 ];
				var z = atom[ 2 ];

				verticesAtoms.push( x, y, z );

				var r = atom[ 3 ][ 0 ] / 255;
				var g = atom[ 3 ][ 1 ] / 255;
				var b = atom[ 3 ][ 2 ] / 255;

				colorsAtoms.push( r, g, b );

			}

			// bonds

			for ( i = 0, l = bonds.length; i < l; i ++ ) {

				var bond = bonds[ i ];

				var start = bond[ 0 ];
				var end = bond[ 1 ];

				verticesBonds.push( verticesAtoms[ ( start * 3 ) + 0 ] );
				verticesBonds.push( verticesAtoms[ ( start * 3 ) + 1 ] );
				verticesBonds.push( verticesAtoms[ ( start * 3 ) + 2 ] );

				verticesBonds.push( verticesAtoms[ ( end * 3 ) + 0 ] );
				verticesBonds.push( verticesAtoms[ ( end * 3 ) + 1 ] );
				verticesBonds.push( verticesAtoms[ ( end * 3 ) + 2 ] );

			}

			// build geometry

			geometryAtoms.setAttribute( 'position', new Float32BufferAttribute( verticesAtoms, 3 ) );

			geometryAtoms.setAttribute( 'color', new Float32BufferAttribute( colorsAtoms, 3 ) );

			geometryBonds.setAttribute( 'position', new Float32BufferAttribute( verticesBonds, 3 ) );

			return build;

		}

		var CPK = { h: [ 255, 255, 255 ], he: [ 217, 255, 255 ], li: [ 204, 128, 255 ], be: [ 194, 255, 0 ], b: [ 255, 181, 181 ], c: [ 144, 144, 144 ], n: [ 48, 80, 248 ], o: [ 255, 13, 13 ], f: [ 144, 224, 80 ], ne: [ 179, 227, 245 ], na: [ 171, 92, 242 ], mg: [ 138, 255, 0 ], al: [ 191, 166, 166 ], si: [ 240, 200, 160 ], p: [ 255, 128, 0 ], s: [ 255, 255, 48 ], cl: [ 31, 240, 31 ], ar: [ 128, 209, 227 ], k: [ 143, 64, 212 ], ca: [ 61, 255, 0 ], sc: [ 230, 230, 230 ], ti: [ 191, 194, 199 ], v: [ 166, 166, 171 ], cr: [ 138, 153, 199 ], mn: [ 156, 122, 199 ], fe: [ 224, 102, 51 ], co: [ 240, 144, 160 ], ni: [ 80, 208, 80 ], cu: [ 200, 128, 51 ], zn: [ 125, 128, 176 ], ga: [ 194, 143, 143 ], ge: [ 102, 143, 143 ], as: [ 189, 128, 227 ], se: [ 255, 161, 0 ], br: [ 166, 41, 41 ], kr: [ 92, 184, 209 ], rb: [ 112, 46, 176 ], sr: [ 0, 255, 0 ], y: [ 148, 255, 255 ], zr: [ 148, 224, 224 ], nb: [ 115, 194, 201 ], mo: [ 84, 181, 181 ], tc: [ 59, 158, 158 ], ru: [ 36, 143, 143 ], rh: [ 10, 125, 140 ], pd: [ 0, 105, 133 ], ag: [ 192, 192, 192 ], cd: [ 255, 217, 143 ], in: [ 166, 117, 115 ], sn: [ 102, 128, 128 ], sb: [ 158, 99, 181 ], te: [ 212, 122, 0 ], i: [ 148, 0, 148 ], xe: [ 66, 158, 176 ], cs: [ 87, 23, 143 ], ba: [ 0, 201, 0 ], la: [ 112, 212, 255 ], ce: [ 255, 255, 199 ], pr: [ 217, 255, 199 ], nd: [ 199, 255, 199 ], pm: [ 163, 255, 199 ], sm: [ 143, 255, 199 ], eu: [ 97, 255, 199 ], gd: [ 69, 255, 199 ], tb: [ 48, 255, 199 ], dy: [ 31, 255, 199 ], ho: [ 0, 255, 156 ], er: [ 0, 230, 117 ], tm: [ 0, 212, 82 ], yb: [ 0, 191, 56 ], lu: [ 0, 171, 36 ], hf: [ 77, 194, 255 ], ta: [ 77, 166, 255 ], w: [ 33, 148, 214 ], re: [ 38, 125, 171 ], os: [ 38, 102, 150 ], ir: [ 23, 84, 135 ], pt: [ 208, 208, 224 ], au: [ 255, 209, 35 ], hg: [ 184, 184, 208 ], tl: [ 166, 84, 77 ], pb: [ 87, 89, 97 ], bi: [ 158, 79, 181 ], po: [ 171, 92, 0 ], at: [ 117, 79, 69 ], rn: [ 66, 130, 150 ], fr: [ 66, 0, 102 ], ra: [ 0, 125, 0 ], ac: [ 112, 171, 250 ], th: [ 0, 186, 255 ], pa: [ 0, 161, 255 ], u: [ 0, 143, 255 ], np: [ 0, 128, 255 ], pu: [ 0, 107, 255 ], am: [ 84, 92, 242 ], cm: [ 120, 92, 227 ], bk: [ 138, 79, 227 ], cf: [ 161, 54, 212 ], es: [ 179, 31, 212 ], fm: [ 179, 31, 186 ], md: [ 179, 13, 166 ], no: [ 189, 13, 135 ], lr: [ 199, 0, 102 ], rf: [ 204, 0, 89 ], db: [ 209, 0, 79 ], sg: [ 217, 0, 69 ], bh: [ 224, 0, 56 ], hs: [ 230, 0, 46 ], mt: [ 235, 0, 38 ], ds: [ 235, 0, 38 ], rg: [ 235, 0, 38 ], cn: [ 235, 0, 38 ], uut: [ 235, 0, 38 ], uuq: [ 235, 0, 38 ], uup: [ 235, 0, 38 ], uuh: [ 235, 0, 38 ], uus: [ 235, 0, 38 ], uuo: [ 235, 0, 38 ] };
		var NELE = {
			1: "h ", 2: "he", 3: "li", 4: "be", 5: "b ", 6: "c ", 7: "n ", 8: "o ", 9: "f ", 10: "ne",
			11: "na", 12: "mg", 13: "al", 14: "si", 15: "p ", 16: "s ", 17: "cl", 18: "ar", 19: "k ", 20: "ca",
			21: "sc", 22: "ti", 23: "v ", 24: "cr", 25: "mn", 26: "fe", 27: "co", 28: "ni", 29: "cu", 30: "zn",
			31: "ga", 32: "ge", 33: "as", 34: "se", 35: "br", 36: "kr", 37: "rb", 38: "sr", 39: "y ", 40: "zr",
			41: "nb", 42: "mo", 43: "tc", 44: "ru", 45: "rh", 46: "pd", 47: "ag", 48: "cd", 49: "in", 50: "sn",
			51: "sb", 52: "te", 53: "i ", 54: "xe", 55: "cs", 56: "ba", 57: "la", 58: "ce", 59: "pr", 60: "nd",
			61: "pm", 62: "sm", 63: "eu", 64: "gd", 65: "tb", 66: "dy", 67: "ho", 68: "er", 69: "tm", 70: "yb",
			71: "lu", 72: "hf", 73: "ta", 74: "w ", 75: "re", 76: "os", 77: "ir", 78: "pt", 79: "au", 80: "hg",
			81: "tl", 82: "pb", 83: "bi", 84: "po", 85: "at", 86: "rn", 87: "fr", 88: "ra", 89: "ac", 90: "th",
			91: "pa", 92: "u ", 93: "np", 94: "pu", 95: "am", 96: "cm", 97: "bk", 98: "cf", 99: "es", 100: "fm",
			101: "md", 102: "no", 103: "lr", 104: "rf", 105: "db", 106: "sg", 107: "bh", 108: "hs", 109: "h1", 110: "h2",
			111: "h3", 112: "h4", 113: "h5", 114: "h6", 115: "h7", 116: "h8", 117: "h9", 118: "d0", 119: "d1", 120: "d2",
			121: "d3"
		};
		var COVR = { 
			1: 0.32, 2: 0.93, 3: 1.23, 4: 0.9, 5: 0.82, 6: 0.77, 7: 0.75, 8: 0.73, 9: 0.72, 10: 0.71,
			11: 1.54, 12: 1.36, 13: 1.18, 14: 1.11, 15: 1.06, 16: 1.02, 17: 0.99, 18: 0.98, 19: 2.03, 20: 1.74,
			21: 1.44, 22: 1.32, 23: 1.22, 24: 1.18, 25: 1.17, 26: 1.17, 27: 1.16, 28: 1.15, 29: 1.17, 30: 1.25,
			31: 1.26, 32: 1.22, 33: 1.2, 34: 1.16, 35: 1.14, 36: 1.12, 37: 2.16, 38: 1.91, 39: 1.62, 40: 1.45,
			41: 1.34, 42: 1.3, 43: 1.27, 44: 1.25, 45: 1.25, 46: 1.28, 47: 1.34, 48: 1.48, 49: 1.44, 50: 1.41,
			51: 1.41, 52: 1.36, 53: 1.33, 54: 1.31, 55: 2.35, 56: 1.98, 57: 1.69, 58: 1.65, 59: 1.65, 60: 1.64,
			61: 1.63, 62: 1.62, 63: 1.85, 64: 1.61, 65: 1.59, 66: 1.59, 67: 1.58, 68: 1.57, 69: 1.56, 70: 1.74,
			71: 1.56, 72: 1.44, 73: 1.34, 74: 1.3, 75: 1.28, 76: 1.26, 77: 1.27, 78: 1.3, 79: 1.34, 80: 1.49,
			81: 1.48, 82: 1.47, 83: 1.46, 84: 1.46, 85: 1.45, 86: 0, 87: 0, 88: 0, 89: 0, 90: 1.65,
			91: 0, 92: 1.42, 93: 0, 94: 0, 95: 0, 96: 0, 97: 0, 98: 0, 99: 0, 100: 0,
			101: 0, 102: 0, 103: 0, 104: 0, 105: 0, 106: 0, 107: 0, 108: 0, 109: 0, 110: 0,
			111: 0, 112: 0, 113: 0, 114: 0, 115: 0, 116: 0, 117: 0, 118: 0, 119: 0
		};
	

		var atoms = [];
		var bonds = [];
		var histogram = {};

		var bhash = {};

		var x, y, z, index, e;

		// parse

		var lines = text.split( '\n' );
		// read_atom.config
		// reformat atom.config includinng bonds
		var natom = parseInt(trim(lines[0]));
		var al=[];
		var ial=0;
		for ( var i= 2; i<=4; i ++) {
			var alline=trim(lines[i]).split(/\s+/);
			x = parseFloat(alline[0]);
			y = parseFloat(alline[1]);
			z = parseFloat(alline[2]);
			al[ial]=[x,y,z];
			ial++;
		}
		//positions
		for ( var i = 0,curline=6;  i<natom;i++,curline++){
			var alline=trim(lines[curline]).split(/\s+/);
			var tatom=parseInt(alline[0]);
			var e = trim(NELE[tatom]+" ");
			x = parseFloat(alline[1]);
			y = parseFloat(alline[2]);
			z = parseFloat(alline[3]);
			var tmp=[x,y,z];
			[x,y,z]=per_dr(tmp);
			console.log([x,y,z]);
			
			var fx = al[0][0]*x + al[1][0]*y + al[2][0]*z;
			var fy = al[0][1]*x + al[1][1]*y + al[2][1]*z;
			var fz = al[0][2]*x + al[1][2]*y + al[2][2]*z;
			atoms[i] = [fx,fy,fz,CPK[e],capitalize(e),tatom,x,y,z];
			
			if (histogram[e] === undefined) {

				histogram[e] = 1;

			} else {

				histogram[e] += 1;

			}
		}
		//expand cell
		var n1=3;
		var n2=3;
		var n3=3;
		var big_al=[];
		big_al[0]=[al[0][0]*n1,al[0][1]*n1,al[0][2]*n1];
		big_al[1]=[al[1][0]*n2,al[1][1]*n2,al[1][2]*n2];
		big_al[2]=[al[2][0]*n3,al[2][1]*n3,al[2][2]*n3];
		var big_atoms=[];
		var big_natom=0;
		for (var i=1;i<=n1;i++){
			for(var j=1;j<=n2;j++){
				for(var k=1;k<=n3;k++){
					for(var ia=0;ia<natom;ia++){
						big_atoms[big_natom] = atoms[ia].slice();

						var x = (atoms[ia][6]+i-1)*1.0/n1;
						var y = (atoms[ia][7]+j-1)*1.0/n2;
						var z = (atoms[ia][8]+k-1)*1.0/n3;
						var fx = big_al[0][0] * x + big_al[1][0] * y + big_al[2][0] * z;
						var fy = big_al[0][1] * x + big_al[1][1] * y + big_al[2][1] * z;
						var fz = big_al[0][2] * x + big_al[1][2] * y + big_al[2][2] * z;
						big_atoms[big_natom][0]=fx;
						big_atoms[big_natom][1]=fy;
						big_atoms[big_natom][2]=fz;
						big_atoms[big_natom][6]=x;
						big_atoms[big_natom][7]=y;
						big_atoms[big_natom][8]=z;

						big_natom = big_natom + 1;
					}
				}
			}
		}
		//atoms=big_atoms.slice();
		//natom=big_natom;
		//al=big_al.slice();

		//cut cell
		atoms=[];
		natom=0;
		var sp = [
			al[0][0] + al[1][0] + al[2][0],
			al[0][1] + al[1][1] + al[2][1],
			al[0][2] + al[1][2] + al[2][2]
		];
		for(var i=0;i<big_natom;i++){
			var patom=big_atoms[i].slice();
			var xp=[patom[0],patom[1],patom[2]];
			xp[0]=xp[0]-sp[0];
			xp[1]=xp[1]-sp[1];
			xp[2]=xp[2]-sp[2];
			//console.log(xp);
			//console.log(check_in_box(al,xp));
			if(check_in_box(al,xp)==1) {
				patom[0] =xp[0];
				patom[1] =xp[1];
				patom[2] =xp[2];
				atoms[natom]=patom.slice();
				natom=natom+1;
				var ali=gen_ali(al);
				var fxp=matmul(ali,xp);
				patom[6]=fxp[0];
				patom[7]=fxp[1];
				patom[8]=fxp[2];
			}
		}
		console.log(natom);
		console.log(atoms);
		// calculate bond
		for ( var i=0; i<natom; i ++) {
			var satom=i+1;
			var dis=1.e10;
			var dis_per;
			var dis_bond=0.0;
			var eatom = parseInt("null");	
			var c=[];
			var fc=[];
			for (var j = i+1; j < natom; j ++)
			{
				var a = [atoms[i][0], atoms[i][1], atoms[i][2]];
				var b = [atoms[j][0], atoms[j][1], atoms[j][2]];
				dis = gen_dis(a, b);
				dis_bond = 0.9*parseFloat(COVR[atoms[i][5]]) + parseFloat(COVR[atoms[j][5]]);
				if (dis <= dis_bond) {
					eatom = j + 1;
					var h = hash(satom, eatom);

					if (bhash[h] === undefined) {
						bonds.push([satom - 1, eatom - 1, 1]);
						bhash[h] = bonds.length - 1;
					}
				}
			}
		}
		// build and return geometry
		return buildGeometry();

	}


} );

export { ATOMCONFIGLoader };
