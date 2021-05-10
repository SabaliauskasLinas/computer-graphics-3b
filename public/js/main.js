let scene, camera, renderer, trackballControls, orbitControls, kingFigure;
const init = () => {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);

	const axesHelper = new THREE.AxesHelper( 150 );
    scene.add( axesHelper );

	// const helper = new THREE.CameraHelper( camera );
	// scene.add( helper );

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor(0xEEDFDE, 1)
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;

	document.body.appendChild(renderer.domElement);

	// trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
	orbitControls = new THREE.OrbitControls(camera, document, renderer.domElement);

	camera.position.set(-30,60,-30);
	camera.lookAt(scene.position);

	const spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(-50, 100, -50);
	spotLight.castShadow = true;
	scene.add(spotLight);

	const ambientLight = new THREE.AmbientLight(0x242424);
	scene.add(ambientLight);

	const whiteMaterial = new THREE.MeshLambertMaterial( {color: 0xFFFFFF} );
	const blackMaterial = new THREE.MeshLambertMaterial( {color: 0x000000} );

	var whiteCube = true;
	for (let i = 0; i < 80; i=i+10) {
		for (let j = 0; j < 80; j=j+10) {
			const geometry = new THREE.BoxGeometry( 10, 10, 10 );
			const cube = new THREE.Mesh( geometry, whiteCube ? whiteMaterial : blackMaterial );
			cube.position.set(i,0,j);
			scene.add( cube );
			whiteCube = !whiteCube;
		}
		whiteCube = !whiteCube;
	}

	kingFigure = createKingFigure();
    scene.add(kingFigure);

	const controls = {
		cameraOne: () => showCameraOne(),
		cameraTwo: () => showCameraTwo(),
		cameraThree: () => showCameraThree(),
	}

	var gui = new dat.GUI();
	gui.add(controls, 'cameraOne').name("Camera 1");
	gui.add(controls, 'cameraTwo').name("Camera 2");
	gui.add(controls, 'cameraThree').name("Camera 3");
}

const showCameraOne = () => {
	camera.fov = 50;
	camera.updateProjectionMatrix();
	camera.position.set(-120,90,-120);
}

const showCameraTwo = async () => {
	camera.position.set(-90 ,13,-90);

	for(var fov = 5; fov < 60; fov += 1) {
		await dollyZoom(fov);
	}

	for(var fov = 60; fov > 5; fov -= 1) {
		await dollyZoom(fov);
	}
}

const dollyZoom = async (fov) => {
	let width = 30;

	await sleep(50);
	console.log('fov', fov);
	camera.fov = fov;
	camera.updateProjectionMatrix();
	

	let distance = width / (2 * Math.tan(0.5 * fov * Math.PI / 180));
	camera.position.set(-distance, 13, -distance);
	console.log('distance', camera.position.x);
}

const showCameraThree = () => {
	camera.fov = 50;
	camera.updateProjectionMatrix();
	camera.position.set(40,100,37);
	camera.rotation.y = 90 * Math.PI / 180;
	var tween1 = new TWEEN.Tween( kingFigure.position ).to( new THREE.Vector3( 70, 5.5, 70 ), 2000 );
	var tween2 = new TWEEN.Tween( kingFigure.position ).to( new THREE.Vector3( 0, 5.5, 0 ), 2000 ); 
	tween1.chain( tween2 );
	tween1.start();
}

const createKingFigure = () => {
    const figureMaterial = new THREE.MeshLambertMaterial( {color: '#523A28'} );

	const padGeometry = new THREE.CylinderGeometry( 4, 4, 1, 6 );
    const pad = new THREE.Mesh( padGeometry, figureMaterial );

	const lowerBodyGeometry = new THREE.ConeGeometry( 4, 6, 6 );
    const lowerBody = new THREE.Mesh( lowerBodyGeometry, figureMaterial );
	lowerBody.position.set(0, 3.5, 0);

	const upperBodyGeometry = new THREE.ConeGeometry( 3, 10, 6 );
    const upperBody = new THREE.Mesh( upperBodyGeometry, figureMaterial );
	upperBody.position.set(0, 5.5, 0);

	const neckGeometry = new THREE.CylinderGeometry( 2.5, 2.5, 0.5, 6 );
    const neck = new THREE.Mesh( neckGeometry, figureMaterial );
	neck.position.set(0, 8, 0);

	const headGeometry = new THREE.SphereGeometry( 2, 8, 8, 0, Math.PI * 2, 1.1, 2.7 );
    const head = new THREE.Mesh( headGeometry, figureMaterial );
	head.position.set(0, 10, 0);

	const capGeometry = new THREE.CylinderGeometry( 1.8, 1.8, 0.2, 8 );
    const cap = new THREE.Mesh( capGeometry, figureMaterial );
	cap.position.set(0, 11, 0);

	const crossPadGeometry = new THREE.ConeGeometry( 1.2, 1.2, 6 );
    const crossPad = new THREE.Mesh( crossPadGeometry, figureMaterial );
	crossPad.position.set(0, 11.5, 0);

	const crossVerticalGeometry = new THREE.CylinderGeometry( 0.5, 0.5, 3, 6 );
    const crossVertical = new THREE.Mesh( crossVerticalGeometry, figureMaterial );
	crossVertical.position.set(0, 13, 0);

	const crossHorizontalGeometry = new THREE.CylinderGeometry( 0.5, 0.5, 3, 6 );
    const crossHorizontal = new THREE.Mesh( crossHorizontalGeometry, figureMaterial );
	crossHorizontal.position.set(0, 13, 0);
	crossHorizontal.rotation.x = Math.PI / 2;

	group = new THREE.Object3D();
    group.add( pad );
    group.add( lowerBody );
    group.add( upperBody );
    group.add( neck );
    group.add( head );
    group.add( cap );
    group.add( crossPad );
    group.add( crossVertical );
    group.add( crossHorizontal );

	group.position.set(0, 5.5, 0);

	return group;
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
  }

const render = (time) => {
	TWEEN.update( time );
	orbitControls.target = kingFigure.position
	//camera.lookAt(kingFigure.position);
	orbitControls.update();
	//trackballControls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(render);
}

const onWindowResize = () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

init();
render();