function initPointLights() {
	addPointLights();
}

function addPointLights() {
	var posX							= 0,
		posY							= 1,
		posZ							= 3,
		color							= 0xffffff;

	lights['pointLights']				= {type: "pointLights", lights: []};
	var pointLightObj					= new PointLight(posX, posY, posZ, color);
	pointLightObj.add();
	lights['pointLights'].lights.push(pointLightObj);
}

function PointLight(posX, posY, posZ, color) {
	this.posX						= posX;
	this.posY						= posY;
	this.posZ						= posZ;
	this.color						= color;

	this.add = function() {
		this.light					= new THREE.PointLight(this.color);
		this.light.position.x		= this.posX;
		this.light.position.y		= this.posY;
		this.light.position.z		= this.posZ;
		scene.add(this.light);
	}
}