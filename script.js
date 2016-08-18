'use strict';
/* global THREE */
let renderer;
let baseScene;
let baseCamera;
let uiScene;
let uiCamera;
let sphere;
const uiElements = {};


function render(){
	sphere.rotation.x += 0.005;
	sphere.rotation.y += 0.005;
	renderer.clear();
	renderer.render(baseScene, baseCamera);
	renderer.clearDepth();
	renderer.render(uiScene, uiCamera);
	requestAnimationFrame(render);
}


function resize(width, height){
	baseCamera.aspect = width / height;
	baseCamera.updateProjectionMatrix();

	const halfWidth = 0.5 * width;
	const halfHeight = 0.5 * height;
	uiCamera.left = -halfWidth;
	uiCamera.right = halfWidth;
	uiCamera.top = halfHeight;
	uiCamera.bottom = -halfHeight;
	uiCamera.updateProjectionMatrix();

	for (const id in uiElements){
		const element = uiElements[id];
		let x = 0;
		let y = 0;
		switch(element.align){
			case 'left':
				x = -halfWidth + (0.5 * element.width);
			break;
			case 'right':
				x = halfWidth - (0.5 * element.width);
			break;
		}
		switch(element.valign){
			case 'top':
				y = halfHeight - (0.5 * element.height);
			break;
			case 'bottom':
				y = -halfHeight + (0.5 * element.height);
			break;
		}
		element.mesh.position.x = x;
		element.mesh.position.y = y;
	}

	renderer.setSize(width, height);
}


function addUiElement({id, width, height, color, align, valign}){
	const mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(width, height),
		new THREE.MeshBasicMaterial({color})
	);
	uiScene.add(mesh);
	uiElements[id] = {mesh, width, height, align, valign};
}


function setupBase(width, height){
	baseScene = new THREE.Scene();
	baseCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 500);
	baseCamera.position.set(0, 0, 8);

	const orbit = new THREE.OrbitControls(baseCamera, renderer.domElement);
	orbit.enableZoom = false;

	const light0 = new THREE.PointLight(0xffffff, 1, 0);
	light0.position.set(0, 200, 0);
	baseScene.add(light0);

	const light1 = new THREE.PointLight(0xffffff, 1, 0);
	light1.position.set(100, 200, 100);
	baseScene.add(light1);

	const light2 = new THREE.PointLight(0xffffff, 1, 0);
	light2.position.set(-100, -200, -100);
	baseScene.add(light2);

	baseScene.add(new THREE.AmbientLight(0x000000));

	sphere = new THREE.Mesh(
		new THREE.SphereGeometry(5, 16, 16),
		new THREE.MeshPhongMaterial({
			color: 0x156289,
			emissive: 0x072534,
			side: THREE.DoubleSide,
			shading: THREE.FlatShading
		})
	);
	baseScene.add(sphere);
}


function setupUI(halfWidth, halfHeight){
	uiScene = new THREE.Scene();
	uiCamera = new THREE.OrthographicCamera(-halfWidth, halfWidth, halfHeight, -halfHeight, 1, 10);
	uiCamera.position.set(0, 0, 10);
	addUiElement({
		id: 'top-left',
		width: 100,
		height: 100,
		color: 0xff0000,
		align: 'left',
		valign: 'top'
	});
	addUiElement({
		id: 'top-right',
		width: 100,
		height: 100,
		color: 0x00ff00,
		align: 'right',
		valign: 'top'
	});
	addUiElement({
		id: 'bottom-left',
		width: 100,
		height: 100,
		color: 0x0000ff,
		align: 'left',
		valign: 'bottom'
	});
	addUiElement({
		id: 'bottom-right',
		width: 100,
		height: 100,
		color: 0xffff00,
		align: 'right',
		valign: 'bottom'
	});
	addUiElement({
		id: 'center-left',
		width: 100,
		height: 100,
		color: 0x00ffff,
		align: 'left',
		valign: 'center'
	});
	addUiElement({
		id: 'center-right',
		width: 100,
		height: 100,
		color: 0xff00ff,
		align: 'right',
		valign: 'center'
	});
	addUiElement({
		id: 'top-center',
		width: 100,
		height: 100,
		color: 0x888888,
		align: 'center',
		valign: 'top'
	});
	addUiElement({
		id: 'bottom-center',
		width: 100,
		height: 100,
		color: 0xdddddd,
		align: 'center',
		valign: 'bottom'
	});
}


function start(){
	const width = 600;
	const height = 400;

	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setClearColor(0x000000); // needed for the HUD render
	renderer.autoClear = false;
	renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);

	setupBase(width, height);
	setupUI(0.5 * width, 0.5 * height);
	resize(width, height);
	render();
}


start();
