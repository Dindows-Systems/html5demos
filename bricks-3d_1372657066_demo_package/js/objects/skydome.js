/**
 * Sky dome
 *
 * Not currently used in the project. May be used in the future, but then the code would require refactoring
 * and objectified, like the rest of the objects.
 */

var radius							= 100,
	hSegments						= 64,
	vSegments						= 16;
var vertexShader					= document.getElementById('vertexShader').textContent,
	fragmentShader					= document.getElementById('fragmentShader').textContent;
var uniforms						= {
	topColor	: {type: "c", value: new THREE.Color( 0x0077ff )},
	bottomColor	: {type: "c", value: new THREE.Color( 0xffffff )},
	offset		: {type: "f", value: 33},
	exponent	: {type: "f", value: 0.6}
};
var geometry						= new THREE.SphereGeometry(radius, hSegments, vSegments);
var material						= new THREE.ShaderMaterial({vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide});
objects['skyDome']					= new THREE.Mesh(geometry, material);
scene.add(objects['skyDome']);