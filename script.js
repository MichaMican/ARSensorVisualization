function createRenderer() {
	const renderer = new THREE.WebGLRenderer({
		antialias : true,
		alpha: true
	})
	
	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	renderer.setSize(640, 480)
	
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'
	
	document.body.appendChild(renderer.domElement)

	return renderer
}

function createArToolkitSource() {
	const arToolkitSource = new THREEx.ArToolkitSource({
		sourceType : 'webcam'
	})

	function updateSize() {
		arToolkitSource.onResizeElement()	
		arToolkitSource.copyElementSizeTo(renderer.domElement)	
		if (arToolkitContext.arController) {
			arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)	
		}
	}

	arToolkitSource.init(updateSize)
	
	// handle resize event
	window.addEventListener('resize', updateSize)

	return arToolkitSource
}

function createArToolkitContext(cameraParametersUrl) {
	const arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: cameraParametersUrl,
		detectionMode: 'mono'
	})
	
	// copy projection matrix to camera when initialization complete
	arToolkitContext.init(() => {
		camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix())
	})

	return arToolkitContext
}

function createMarkerRoot(root, patternUrl) {
	const markerRoot = new THREE.Group()
	root.add(markerRoot)

	const markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
		type: 'pattern',
		patternUrl: patternUrl
	})

	return markerRoot
}

function createGroup(root) {
	const transformationRoot = new THREE.Group()
	root.add(transformationRoot)

	return transformationRoot
}

function updatePositioning(root, positioningUrl) {
	fetch(positioningUrl)
		.then((response) => {
			return response.json()
		})
		.then((positioning) => {
			positioning = positioning || {}
			
			translate(root, positioning.translation)
			scale(root, positioning.scale)
			rotate(root, positioning.rotation)
		})
		.catch((error) => {
			console.log("Error: " + error)
		})
}

function defaultVector(vector, defaults) {
	vector = vector || {}
	if (vector.x === undefined || vector.x === null) vector.x = defaults.x
	if (vector.y === undefined || vector.y === null) vector.y = defaults.y
	if (vector.z === undefined || vector.z === null) vector.z = defaults.z
	return vector
}

function toThreeVector(vector) {
	return new THREE.Vector3(vector.x, vector.y, vector.z)
}

function translate(object, vector) {
	vector = defaultVector(vector, {x: 0, y: 0, z: 0})

	object.translateX(vector.x)
	object.translateY(vector.y)
	object.translateZ(vector.z)
}

function rotate(object, vector) {
	vector = defaultVector(vector, {x: 0, y: 0, z: 0})

	object.rotateX(vector.x)
	object.rotateY(vector.y)
	object.rotateZ(vector.z)
}

function scale(object, vector) {
	vector = defaultVector(vector, {x: 1, y: 1, z: 1})

	object.scale.x = vector.x
	object.scale.y = vector.y
	object.scale.z = vector.z
}

function moveArrow(arrow, pos, dir) {
	pos = defaultVector(pos, {x: 0, y: 0, z: 0})
	dir = defaultVector(dir, {x: 1, y: 1, z: 1})

	const posVec = toThreeVector(pos)
	const dirVec = toThreeVector(dir)

	arrow.position.copy(posVec)
	arrow.setDirection(dirVec)
	arrow.setLength(dirVec.length())
}

function loadModel(basePath, modelPath, texturePath, callback) {
	let mtlLoader = new THREE.MTLLoader()
	mtlLoader.setTexturePath(basePath)
	mtlLoader.setPath(basePath)
	mtlLoader.load(texturePath, (materials) => {
		materials.preload()

		let objLoader = new THREE.OBJLoader()
		objLoader.setMaterials(materials)
		objLoader.setPath(basePath)
		objLoader.load(modelPath, callback/*, onProgress, onError */)
	})
}

function update(updateCallback) {
	// run update callback
	updateCallback()

	// update artoolkit on every frame
	if (arToolkitSource.ready) {
		arToolkitContext.update(arToolkitSource.domElement);
	}
}

function render() {
	renderer.render(scene, camera);
}

function run(updateCallback) {
	const clock = new THREE.Clock()
	var deltaTime = 0
	var totalTime = 0
	
	function animate() {
		requestAnimationFrame(animate);
		deltaTime = clock.getDelta();
		totalTime += deltaTime;
		update(updateCallback);
		render();
	}

	animate()
}

const scene = new THREE.Scene()

const camera = new THREE.Camera()
scene.add(camera)

const ambientLight = new THREE.AmbientLight(0xcccccc, 0.5)
scene.add(ambientLight)

const renderer = createRenderer()

const arToolkitSource = createArToolkitSource()
const arToolkitContext = createArToolkitContext('data/camera_para.dat')

const markerRoot = createMarkerRoot(scene, 'data/hiro.patt')

const root = createGroup(markerRoot)

const arrowCloud = createArrowCloud(root, 3000)

updatePositioning(root, 'data/positioning.json')

loadModel('data/model/', "kokille.obj", "kokille.mtl", (object) => {
	root.add(object)

	updatePositioning(object, 'data/kokilleTransformation.json')
})

let positions = []
let lastPositions = positions

run(() => {
	const currentPositions = positions
	const arrowCount = arrowCloud.length

	for (let i = 0; i < arrowCount; i++) {
		const arrow = arrowCloud[i]
		const position = currentPositions[i]

		if (position) {
			moveArrowToVector(arrow, position)

			arrow.visible = true
		} else {
			arrow.visible = false
		}
	}
})

function createArrowCloud(root, count, color) {
	const arrowCloud = []

	if (color === undefined) color = 0x884400

	for (let i = 0; i < count; i++) {
		const start = new THREE.Vector3(0, 0, 0)
		const direction = new THREE.Vector3(0, 0.1, 0)

		const arrow = new THREE.ArrowHelper(direction, start, direction.length(), color)

		arrow.visible = false

		arrowCloud.push(arrow)
		root.add(arrow)
	}

	return arrowCloud
}

function moveArrowToVector(arrow, vector) {
	moveArrow(arrow, {
		x: vector.x,
		y: vector.y,
		z: vector.z
	}, {
		x: vector.xVec,
		y: vector.yVec,
		z: vector.zVec
	})
}

setInterval(async () => {
	try {
		const result = await fetch('http://192.168.0.54:5000/api/data')
		positions = await result.json()
	} catch (e) {
		positions = []

		console.log(e)
	}
}, 500)
