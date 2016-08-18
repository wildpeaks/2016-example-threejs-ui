'use strict';
/* global THREE */
let renderer;
let baseScene;
let baseCamera;
let uiScene;
let uiCamera;
let sphere;


function render(){
	sphere.rotation.x += 0.005;
	sphere.rotation.y += 0.005;
	renderer.clear();
	renderer.render(baseScene, baseCamera);
	renderer.clearDepth();
	renderer.render(uiScene, uiCamera);
	requestAnimationFrame(render);
}


function getMesh({width, height, color, x, y, z}){
	const mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(width, height),
		new THREE.MeshBasicMaterial({color})
	);
	mesh.position.set(x, y, z);
	return mesh;
}


function setupBase(width, height){
	baseScene = new THREE.Scene();
	baseCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 500);
	baseCamera.position.set(0, 0, 20);

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

	sphere = new THREE.Object3D();
	sphere.add(new THREE.LineSegments(
		new THREE.SphereGeometry(5, 16, 16),
		new THREE.LineBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.5
		})
	));
	sphere.add(new THREE.Mesh(
		new THREE.SphereGeometry(5, 16, 16),
		new THREE.MeshPhongMaterial({
			color: 0x156289,
			emissive: 0x072534,
			side: THREE.DoubleSide,
			shading: THREE.FlatShading
		})
	));
	baseScene.add(sphere);
}


function setupUI(halfWidth, halfHeight){
	uiScene = new THREE.Scene();
	uiCamera = new THREE.OrthographicCamera(-halfWidth, halfWidth, halfHeight, -halfHeight, 1, 10);
	uiCamera.position.set(0, 0, 10);

	// Top-right
	uiScene.add(
		getMesh({
			width: 100,
			height: 100,
			color: 0x00ff00,
			x: halfWidth - 50,
			y: halfHeight - 50,
			z: 0
		})
	);

	// Top-left
	uiScene.add(
		getMesh({
			width: 100,
			height: 100,
			color: 0xff0000,
			x: -halfWidth + 50,
			y: halfHeight - 50,
			z: 0
		})
	);

	// Bottom-right
	uiScene.add(
		getMesh({
			width: 100,
			height: 100,
			color: 0x0000ff,
			x: halfWidth - 50,
			y: -halfHeight + 50,
			z: 0
		})
	);

	// Bottom-left
	uiScene.add(
		getMesh({
			width: 100,
			height: 100,
			color: 0xffff00,
			x: -halfWidth + 50,
			y: -halfHeight + 50,
			z: 0
		})
	);
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
	render();
}


start();
