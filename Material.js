var clone = require('clone');
var defaults = require('lodash.defaults');
var __uniformsShared = {
	"fullness": { type: 'f', value: 1 },
	"color": { type: 'c', value: new THREE.Color(1, 1, 1) },
	"alphaCenter": { type: 'f', value: 1 },
	"alphaEdge": { type: 'f', value: 0 },
	"alphaGammaPower": { type: 'f', value: 2.2 },
	"radius": { type: 'f', value: 1 }
};


var __vertexShader = [
	"uniform float radius;",
	"uniform float fullness;",
	"varying vec2 vUv;",
	"void main() {",
	"	float y = position.y * fullness;",
	"	float adjustedY = y + 1.5707963267948966;",
	"	float cosdY = cos(adjustedY);",
	"	vec3 newPosition = vec3(cosdY, sin(adjustedY), 0.0);",
	"	newPosition.x = sin(position.x) * cosdY;",
	"	newPosition.z = cos(position.x) * cosdY;",
	// "	newPosition.z = cos(cosdY) * newPosition.x;",
	"	newPosition *= radius;",
	"	vUv = uv;",
	"	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);",
	"}"
].join("\n");

var __fragmentShader = [
	"uniform vec3 color;",
	"uniform float alphaCenter;",
	"uniform float alphaEdge;",
	"uniform float alphaGammaPower;",
	"varying vec2 vUv;",
	"void main() {",
	"	float alpha = mix(alphaCenter, alphaEdge, pow(vUv.y, alphaGammaPower));",
	"	gl_FragColor = vec4(color, alpha);",
	"}"
].join("\n");


function RetractableSphereMaterial(params) {
	params = params || {};
	var defaultParams = {
		uniforms: clone(__uniformsShared),
		fragmentShader: __fragmentShader,
		vertexShader: __vertexShader,
		transparent: true,
		radius: 1,
		side: THREE.DoubleSide,
		// wireframe: true
	};
	defaults(params, defaultParams);
	params.uniforms.radius.value = params.radius;
	THREE.ShaderMaterial.call(this, params);
}

RetractableSphereMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);

module.exports = RetractableSphereMaterial;