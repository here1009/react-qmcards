/**
 * 
 * 
 */

import {
	BufferGeometry,
	FileLoader,
	Float32BufferAttribute,
	Loader,
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
		function per_r(a){
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
		function gen_dr_per(a, b) {
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
			//var c=[];
			//c[0]=a[0]+x;
			//c[1]=a[1]+y;
			//c[2]=a[2]+z;
			//var fc=[];
			//fc[0] = al[0][0] * c[0] + al[1][0] * c[1] + al[2][0] * c[2];
			//fc[1] = al[0][1] * c[0] + al[1][1] * c[1] + al[2][1] * c[2];
			//fc[2] = al[0][2] * c[0] + al[1][2] * c[1] + al[2][2] * c[2];
			//return [dis,c,fc];
			return dis;
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
			var colorsBonds = [];

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

				colorsBonds.push( colorsAtoms[ ( start * 3 ) + 0 ] );
				colorsBonds.push( colorsAtoms[ ( start * 3 ) + 1 ] );
				colorsBonds.push( colorsAtoms[ ( start * 3 ) + 2 ] );
				colorsBonds.push( colorsAtoms[ ( end * 3 ) + 0 ] );
				colorsBonds.push( colorsAtoms[ ( end * 3 ) + 1 ] );
				colorsBonds.push( colorsAtoms[ ( end * 3 ) + 2 ] );


			}

			// build geometry

			geometryAtoms.setAttribute( 'position', new Float32BufferAttribute( verticesAtoms, 3 ) );

			geometryAtoms.setAttribute( 'color', new Float32BufferAttribute( colorsAtoms, 3 ) );

			geometryBonds.setAttribute( 'position', new Float32BufferAttribute( verticesBonds, 3 ) );

			geometryBonds.setAttribute( 'color', new Float32BufferAttribute( colorsBonds, 3 ) );

			return build;

		}
		function gen_neigh(atoms,al,natom,fa,ta) {
			var neigh=[];
			var a = fa.slice()
			for (var ib = 0; ib < natom; ib++) {
				for (var i = -1; i <=1; i++) {
					for (var j = -1; j <=1; j++) {
						for (var k = -1; k <=1; k++) {
							var b = [atoms[ib][6]+i, atoms[ib][7]+j, atoms[ib][8]+k];
							var dis = gen_dis_dir(al, a, b);
							var dis_bond = bond_fact * parseFloat(COVR[atoms[ib][5]]) + parseFloat(COVR[ta]);
							if ((Math.abs(dis - dis_bond) < 1.e-5 || dis < dis_bond) && dis > 1.e-5) {
								var tmp = atoms[ib].slice();
								var [x,y,z] = [b[0],b[1],b[2]];
								tmp[6]=x;
								tmp[7]=y;
								tmp[8]=z;
								var fx = al[0][0] * x + al[1][0] * y + al[2][0] * z;
								var fy = al[0][1] * x + al[1][1] * y + al[2][1] * z;
								var fz = al[0][2] * x + al[1][2] * y + al[2][2] * z;
								tmp[0]=fx;
								tmp[1]=fy;
								tmp[2]=fz;
								neigh.push(tmp.slice());
							}
						}
					}
				}
			}
			return neigh.slice();
		}
		function gen_bond_type(atoms,al,natom) {
			var bond_type=new Map();
			for (var i=0;i<natom;i++){
				var ta = atoms[i][5];
				var fa =[atoms[i][6],atoms[i][7],atoms[i][8]];
				var neigh=gen_neigh(atoms,al,natom,fa,ta)
				for(var j=0;j<neigh.length;j++){
					var tb = neigh[j][5];
					if(ta<tb) {
						if(!bond_type.has([ta,tb].toString())){
							bond_type.set([ta,tb].toString(), true);
						}
					}else{
						if(!bond_type.has([tb,ta].toString())) {
							bond_type.set([tb,ta].toString(), true);
						}
					}
				}
			}
			return bond_type;
		}
		function check_in_range(a,l,r){
			var [x,y,z]=[a[0],a[1],a[2]];
			var t1 = (x >= l[0] || Math.abs(x - l[0]) < 1.e-5) && (x <= r[0] || Math.abs(x - r[0]) < 1.e-5);
			var t2 = (y >= l[1] || Math.abs(y - l[1]) < 1.e-5) && (y <= r[1] || Math.abs(y - r[1]) < 1.e-5);
			var t3 = (z >= l[2] || Math.abs(z - l[2]) < 1.e-5) && (z <= r[2] || Math.abs(z - r[2]) < 1.e-5);
			if(t1&&t2&&t3){
				return true;
			}
			return false;
		}
		function check_add_neigh_out_boundary(ia, isec, depth, eleflag) {
			if (depth==0) return;
			for (var m = -1; m <= 1; m++) {
				for (var n = -1; n <= 1; n++) {
					for (var q = -1; q <= 1; q++) {
						var is = isec[0] + m;
						var js = isec[1] + n;;
						var ks = isec[2] + q;
						if (is >= 0 && is < dimx && js >= 0 && js < dimy && ks >= 0 && ks < dimz) {
							var loc_atoms = sec[is][js][ks];
							var [min,max] = sec_min_max[is][js][ks].slice();
							var l = [0, 0, 0];
							var r = [1, 1, 1];
							if (!(check_in_range(min, l, r) && check_in_range(max, l, r))) {
								for (var ias = 0; ias < loc_atoms.length; ias++) {
									var iac = loc_atoms[ias];
									var [x, y, z] = [big_atoms[iac][6], big_atoms[iac][7], big_atoms[iac][8]];
									var t1 = (x >= c1[0] || Math.abs(x - c1[0]) < 1.e-5) && (x <= c2[0] || Math.abs(x - c2[0]) < 1.e-5);
									var t2 = (y >= c1[1] || Math.abs(y - c1[1]) < 1.e-5) && (y <= c2[1] || Math.abs(y - c2[1]) < 1.e-5);
									var t3 = (z >= c1[2] || Math.abs(z - c1[2]) < 1.e-5) && (z <= c2[2] || Math.abs(z - c2[2]) < 1.e-5);
									//
									if (!(t1 && t2 && t3) && in_atoms_flag[iac] == 0) {
										var a = [big_atoms[ia][0], big_atoms[ia][1], big_atoms[ia][2]];
										var b = [big_atoms[iac][0], big_atoms[iac][1], big_atoms[iac][2]];
										var dis = gen_dis(a, b);
										var dis_bond = bond_fact * parseFloat(COVR[big_atoms[ia][5]]) + parseFloat(COVR[big_atoms[iac][5]]);
										//if (big_atoms[ia][5] <= big_atoms[iac][5]) {
											if (dis <= dis_bond || Math.abs(dis - dis_bond) < 1.e-5) {
												atoms.push(big_atoms[iac].slice());
												natom = natom + 1;
												in_atoms_flag[iac] = 1;
												check_add_neigh_out_boundary(iac, insec[iac], depth - 1, eleflag);
												if (eleflag != "") {
													check_add_specitype_neigh_out_boundary(iac, insec[iac], 1, eleflag);
												}
											}
										//}
									}
								}
							}
						}
					}
				}
			}
		}
		function check_add_specitype_neigh_out_boundary(ia, isec, depth, eleflag) {
			if (depth == 0) return;
			for (var m = -1; m <= 1; m++) {
				for (var n = -1; n <= 1; n++) {
					for (var q = -1; q <= 1; q++) {
						var is = isec[0] + m;
						var js = isec[1] + n;;
						var ks = isec[2] + q;
						if (is >= 0 && is < dimx && js >= 0 && js < dimy && ks >= 0 && ks < dimz) {
							var loc_atoms = sec[is][js][ks];
							var [min, max] = sec_min_max[is][js][ks].slice();
							var l = [0, 0, 0];
							var r = [1, 1, 1];
							if (!(check_in_range(min, l, r) && check_in_range(max, l, r))) {
								for (var ias = 0; ias < loc_atoms.length; ias++) {
									var iac = loc_atoms[ias];
									var [x, y, z] = [big_atoms[iac][6], big_atoms[iac][7], big_atoms[iac][8]];
									var t1 = (x >= c1[0] || Math.abs(x - c1[0]) < 1.e-5) && (x <= c2[0] || Math.abs(x - c2[0]) < 1.e-5);
									var t2 = (y >= c1[1] || Math.abs(y - c1[1]) < 1.e-5) && (y <= c2[1] || Math.abs(y - c2[1]) < 1.e-5);
									var t3 = (z >= c1[2] || Math.abs(z - c1[2]) < 1.e-5) && (z <= c2[2] || Math.abs(z - c2[2]) < 1.e-5);
									//
									if (!(t1 && t2 && t3) && in_atoms_flag[iac] == 0) {
										var a = [big_atoms[ia][0], big_atoms[ia][1], big_atoms[ia][2]];
										var b = [big_atoms[iac][0], big_atoms[iac][1], big_atoms[iac][2]];
										var dis = gen_dis(a, b);
										var dis_bond = bond_fact * parseFloat(COVR[big_atoms[ia][5]]) + parseFloat(COVR[big_atoms[iac][5]]);
										if (dis <= dis_bond || Math.abs(dis - dis_bond) < 1.e-5) {
											if (big_atoms[iac][4] == eleflag) {
												atoms.push(big_atoms[iac].slice());
												natom = natom + 1;
												in_atoms_flag[iac] = 1;
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}	

		var CPK = { h: [255, 255, 255], he: [217, 255, 255], li: [204, 128, 255], be: [194, 255, 0], b: [255, 181, 181], c: [144, 144, 144], n: [48, 80, 248], o: [255, 13, 13], f: [144, 224, 80], ne: [179, 227, 245], na: [171, 92, 242], mg: [138, 255, 0], al: [191, 166, 166], si: [240, 200, 160], p: [255, 128, 0], s: [255, 255, 48], cl: [31, 240, 31], ar: [128, 209, 227], k: [143, 64, 212], ca: [61, 255, 0], sc: [230, 230, 230], ti: [191, 194, 199], v: [166, 166, 171], cr: [138, 153, 199], mn: [156, 122, 199], fe: [224, 102, 51], co: [240, 144, 160], ni: [80, 208, 80], cu: [200, 128, 51], zn: [125, 128, 176], ga: [194, 143, 143], ge: [102, 143, 143], as: [189, 128, 227], se: [255, 161, 0], br: [166, 41, 41], kr: [92, 184, 209], rb: [112, 46, 176], sr: [0, 255, 0], y: [148, 255, 255], zr: [148, 224, 224], nb: [115, 194, 201], mo: [84, 181, 181], tc: [59, 158, 158], ru: [36, 143, 143], rh: [10, 125, 140], pd: [0, 105, 133], ag: [192, 192, 192], cd: [255, 217, 143], in: [166, 117, 115], sn: [102, 128, 128], sb: [158, 99, 181], te: [212, 122, 0], i: [148, 0, 148], xe: [66, 158, 176], cs: [87, 23, 143], ba: [0, 201, 0], la: [112, 212, 255], ce: [255, 255, 199], pr: [217, 255, 199], nd: [199, 255, 199], pm: [163, 255, 199], sm: [143, 255, 199], eu: [97, 255, 199], gd: [69, 255, 199], tb: [48, 255, 199], dy: [31, 255, 199], ho: [0, 255, 156], er: [0, 230, 117], tm: [0, 212, 82], yb: [0, 191, 56], lu: [0, 171, 36], hf: [77, 194, 255], ta: [77, 166, 255], w: [33, 148, 214], re: [38, 125, 171], os: [38, 102, 150], ir: [23, 84, 135], pt: [208, 208, 224], au: [255, 209, 35], hg: [184, 184, 208], tl: [166, 84, 77], pb: [87, 89, 97], bi: [158, 79, 181], po: [171, 92, 0], at: [117, 79, 69], rn: [66, 130, 150], fr: [66, 0, 102], ra: [0, 125, 0], ac: [112, 171, 250], th: [0, 186, 255], pa: [0, 161, 255], u: [0, 143, 255], np: [0, 128, 255], pu: [0, 107, 255], am: [84, 92, 242], cm: [120, 92, 227], bk: [138, 79, 227], cf: [161, 54, 212], es: [179, 31, 212], fm: [179, 31, 186], md: [179, 13, 166], no: [189, 13, 135], lr: [199, 0, 102], rf: [204, 0, 89], db: [209, 0, 79], sg: [217, 0, 69], bh: [224, 0, 56], hs: [230, 0, 46], mt: [235, 0, 38], ds: [235, 0, 38], rg: [235, 0, 38], cn: [235, 0, 38], uut: [235, 0, 38], uuq: [235, 0, 38], uup: [235, 0, 38], uuh: [235, 0, 38], uus: [235, 0, 38], uuo: [235, 0, 38] };
		var RAD = {
			h:53,he:31,li:167,be:112,b:87,c:67,n:56,o:48,f:42,ne:38,
			na:190,mg:145,al:118,si:111,p:98,s:88,cl:79,ar:71,
			k:243,ca:194,sc:184,ti:176,v:171,cr:166,mn:161,fe:156,co:152,ni:149,cu:145,zn:142,ga:136,ge:125,as:114,se:103,br:94,kr:88,
			rb:265,sr:219,y:212,zr:206,nb:198,mo:190,tc:183,ru:178,rh:173,pd:169,ag:165,cd:161,in:156,sn:145,sb:133,te:123,i:115,xe:108,
			cs:298,ba:253,hf:208,ta:200,w:193,re:188,ir:180,pt:177,au:174,hg:171,ti:156,pb:154,bi:143,po:135,rn:120,
			pr:247,nd:206,pm:205,sm:238,eu:231,gd:233,tb:225,dy:228,er:226,tm:222,yb:222,lu:217

		};	
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
		var COVR_0 = { 
			1: 0.31, 2: 0.28, 3: 1.28, 4: 0.96, 5: 0.85, 6: 0.76, 7: 0.71, 8: 0.66, 9: 0.57, 10: 0.58,
			11: 1.66, 12: 1.41, 13: 1.21, 14: 1.11, 15: 1.07, 16: 1.05, 17: 1.02, 18: 1.06, 19: 2.03, 20: 1.76,
			21: 1.70, 22: 1.60, 23: 1.53, 24: 1.39, 25: 1.39, 26: 1.32, 27: 1.26, 28: 1.24, 29: 1.32, 30: 1.22,
			31: 1.22, 32: 1.20, 33: 1.19, 34: 1.20, 35: 1.20, 36: 1.16, 37: 2.20, 38: 1.95, 39: 1.90, 40: 1.75,
			41: 1.44, 42: 1.54, 43: 1.47, 44: 1.46, 45: 1.42, 46: 1.39, 47: 1.45, 48: 1.44, 49: 1.42, 50: 1.39,
			51: 1.39, 52: 1.38, 53: 1.39, 54: 1.40, 55: 2.44, 56: 2.15, 57: 2.07, 58: 2.04, 59: 2.03, 60: 2.01,
			61: 1.99, 62: 1.98, 63: 1.98, 64: 1.96, 65: 1.94, 66: 1.92, 67: 1.92, 68: 1.89, 69: 1.90, 70: 1.87,
			71: 1.87, 72: 1.75, 73: 1.70, 74: 1.62, 75: 1.51, 76: 1.44, 77: 1.41, 78: 1.36, 79: 1.36, 80: 1.32,
			81: 1.45, 82: 1.46, 83: 1.48, 84: 1.40, 85: 1.50, 86: 1.50, 87: 2.60, 88: 2.21, 89: 2.15, 90: 2.06,
			91: 2.00, 92: 1.96, 93: 1.90, 94: 1.87, 95: 1.80, 96: 1.69, 97: 0, 98: 0, 99: 0, 100: 0,
			101: 0, 102: 0, 103: 0, 104: 0, 105: 0, 106: 0, 107: 0, 108: 0, 109: 0.31, 110: 0.31,
			111: 0.31, 112: 0.31, 113: 0.31, 114: 0.31, 115: 0.31, 116: 0.31, 117: 0.31, 118: 0.31, 119: 0.31
		};
		var COVR = [
			0.38000,
			0.38000, 0.38000, 1.23000, 0.89000, 0.91000,
			0.77000, 0.75000, 0.73000, 0.71000, 0.71000,
			1.60000, 1.40000, 1.25000, 1.11000, 1.00000,
			1.04000, 0.99000, 0.98000, 2.13000, 1.74000,
			1.60000, 1.40000, 1.35000, 1.40000, 1.40000,
			1.40000, 1.35000, 1.35000, 1.35000, 1.35000,
			1.30000, 1.25000, 1.15000, 1.15000, 1.14000,
			1.12000, 2.20000, 2.00000, 1.85000, 1.55000,
			1.45000, 1.45000, 1.35000, 1.30000, 1.35000,
			1.40000, 1.60000, 1.55000, 1.55000, 1.41000,
			1.45000, 1.40000, 1.40000, 1.31000, 2.60000,
			2.00000, 1.75000, 1.55000, 1.55000, 1.55000,
			1.55000, 1.55000, 1.55000, 1.55000, 1.55000,
			1.55000, 1.55000, 1.55000, 1.55000, 1.55000,
			1.55000, 1.55000, 1.45000, 1.35000, 1.35000,
			1.30000, 1.35000, 1.35000, 1.35000, 1.50000,
			1.90000, 1.80000, 1.60000, 1.55000, 1.55000,
			1.55000, 2.80000, 1.44000, 1.95000, 1.55000,
			1.55000, 1.55000, 1.55000, 1.55000, 1.55000,
			1.55000, 1.55000, 1.55000, 1.55000, 1.55000
		];
	

		var atoms = [];
		var bonds = [];
		var histogram = {};

		var bhash = {};

		var x, y, z, index, e;

		// parse

		var lines = text.split( '\n' );
		// read_atom.config
		// reformat atom.config including bonds
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
			[x,y,z]=per_r(tmp);
			//console.log([x,y,z]);
			
			var fx = al[0][0]*x + al[1][0]*y + al[2][0]*z;
			var fy = al[0][1]*x + al[1][1]*y + al[2][1]*z;
			var fz = al[0][2]*x + al[1][2]*y + al[2][2]*z;
			atoms[i] = [fx,fy,fz,CPK[e],capitalize(e),tatom,x,y,z,RAD[e]];
			
			if (histogram[e] === undefined) {

				histogram[e] = 1;

			} else {

				histogram[e] += 1;

			}
		}
		//bond types
		var bond_fact=1.0;
		//
		var rcut=5.0;
		//expand cell
		var big_al=al.slice();
		big_al[0]=[al[0][0], al[0][1], al[0][2]];
		big_al[1]=[al[1][0], al[1][1], al[1][2]];
		big_al[2]=[al[2][0], al[2][1], al[2][2]];
		//
		var [x, y, z] = [big_al[0][0], big_al[0][1], big_al[0][2]];
		var alx = Math.sqrt(x*x+y*y+z*z);
		var [x,y,z]=[big_al[1][0],big_al[1][1],big_al[1][2]];
		var aly = Math.sqrt(x*x+y*y+z*z);
		var [x,y,z]=[big_al[2][0],big_al[2][1],big_al[2][2]];
		var alz = Math.sqrt(x*x+y*y+z*z);
		//
		var frcutx = rcut/alx;
		var frcuty = rcut/aly;
		var frcutz = rcut/alz;
		var minx = -frcutx;
		var maxx = frcutx+1.0;
		var miny = -frcuty;
		var maxy = frcuty+1.0;
		var minz = -frcutz;
		var maxz = frcutz+1.0;
		//
		var in_atoms_flag=[];
		var big_atoms=[];
		var ori_atoms_index=[];
		var big_natom=0;
		var n1=1;
		var n2=1;
		var n3=1;
		for (var ia = 0; ia < natom; ia++) {
			var atomPos=[atoms[ia][6],atoms[ia][7],atoms[ia][8]];
			for (var i = -n1; i <= n1; i++) {
				for (var j = -n2; j <= n2; j++) {
					for (var k = -n3; k <= n3; k++) {
						var x = atomPos[0] + i;
						var y = atomPos[1] + j;
						var z = atomPos[2] + k;

						var t1 = (x >= minx || Math.abs(x-minx) < 1.e-5) && (x <= maxx || Math.abs(x - maxx) < 1.e-5);
						var t2 = (y >= miny || Math.abs(y-miny) < 1.e-5) && (y <= maxy || Math.abs(y - maxy) < 1.e-5);
						var t3 = (z >= minz || Math.abs(z-minz) < 1.e-5) && (z <= maxz || Math.abs(z - maxz) < 1.e-5);

						if (t1 && t2 && t3) {
							var fx = big_al[0][0] * x + big_al[1][0] * y + big_al[2][0] * z;
							var fy = big_al[0][1] * x + big_al[1][1] * y + big_al[2][1] * z;
							var fz = big_al[0][2] * x + big_al[1][2] * y + big_al[2][2] * z;
							big_atoms[big_natom] = atoms[ia].slice();
							big_atoms[big_natom][0] = fx;
							big_atoms[big_natom][1] = fy;
							big_atoms[big_natom][2] = fz;
							big_atoms[big_natom][6] = x;
							big_atoms[big_natom][7] = y;
							big_atoms[big_natom][8] = z;
							//
							in_atoms_flag[big_natom]=0;

							var lt1 = (x >= 0.0 || Math.abs(x) < 1.e-5) && (x <= 1.0 || Math.abs(x - 1.0) < 1.e-5);
							var lt2 = (y >= 0.0 || Math.abs(y) < 1.e-5) && (y <= 1.0 || Math.abs(y - 1.0) < 1.e-5);
							var lt3 = (z >= 0.0 || Math.abs(z) < 1.e-5) && (z <= 1.0 || Math.abs(z - 1.0) < 1.e-5);
							if(lt1&&lt2&&lt3){
								ori_atoms_index.push(big_natom);
								in_atoms_flag[big_natom]=1;
							}
							big_natom = big_natom + 1;
							//
						}
						
					}
				}
			}
		}
//		natom=0;
//		atoms=[];
		//cut sections		
		var dimx = Math.ceil((alx+2*rcut)/rcut);
		var dimy = Math.ceil((aly+2*rcut)/rcut);
		var dimz = Math.ceil((alz+2*rcut)/rcut);
		//console.log([dimx,dimy,dimz]);
		
		var sec=[];
		var sec_min_max=[];
		for (var i=0;i<dimx;i++){
			sec[i]=[];
			sec_min_max[i]=[];
			for(var j=0;j<dimy;j++){
				sec[i][j] = [];
				sec_min_max[i][j]=[];
				for(var k=0;k<dimz;k++){
					sec[i][j][k] = [];
					sec_min_max[i][j][k] = [];
					var idx=i;
					var idy=j;
					var idz=k;
					var min = [idx * frcutx - frcutx, idy * frcuty - frcuty, idz * frcutz - frcutz];
					var max = [idx * frcutx, idy * frcuty, idz * frcutz];
					sec_min_max[idx][idy][idz] = [min, max];
					//console.log(min, max);
				}
			}
		}
		var insec= [];
		for (var ia =0; ia<big_natom; ia++){
			var [x,y,z]=[big_atoms[ia][6],big_atoms[ia][7],big_atoms[ia][8]];
			var px = (x+frcutx)*alx;
			var py = (y+frcuty)*aly;
			var pz = (z+frcutz)*alz;
			var idx = Math.floor(px/rcut);
			var idy = Math.floor(py/rcut);
			var idz = Math.floor(pz/rcut);
			sec[idx][idy][idz].push(ia);
			insec[ia]=[idx,idy,idz];
		}
		// can flag sec if contain atoms out of boundary
		//cut cell
		var c1 =[0.0,0.0,0.0];
		var c2 =[1.0,1.0,1.0];
		natom=0;
		atoms=[];
		for (var i = 0; i < ori_atoms_index.length; i++) {
			var ia = ori_atoms_index[i];
			atoms.push(big_atoms[ia]);
			natom+=1;
			var isec = insec[ia];
			//if ia's neigh's neigh is H, add the H
			check_add_neigh_out_boundary(ia,isec,3,"H")
		}
		//console.log(big_atoms);
		//atoms=big_atoms.slice();
		//natom=big_natom;
		//al=big_al.slice();

		// calculate bond
		for ( var i=0; i<natom; i ++) {
			var satom=i+1;
			var dis=1.e10;
			var dis_per;
			var dis_bond=0.0;
			var eatom = parseInt("null");	
			var c=[];
			var fc=[];
			var offs = [-0.5, 0.0, 0.0];
			for (var j = 0; j < natom; j ++)
			{
				//
				var a = [atoms[i][0], atoms[i][1], atoms[i][2]];
				var b = [atoms[j][0], atoms[j][1], atoms[j][2]];
				dis = gen_dis(a, b);
				dis_bond = bond_fact*parseFloat(COVR[atoms[i][5]]) + parseFloat(COVR[atoms[j][5]]);
				if ((Math.abs(dis-dis_bond)<1.e-5 || dis < dis_bond) && dis > 1.e-5) {
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
