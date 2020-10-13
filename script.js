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

function update() {
	// update artoolkit on every frame
	if (arToolkitSource.ready) {
		arToolkitContext.update(arToolkitSource.domElement);
	}
}

function render() {
	renderer.render(scene, camera);
}

function run() {
	const clock = new THREE.Clock()
	var deltaTime = 0
	var totalTime = 0
	
	function animate() {
		requestAnimationFrame(animate);
		deltaTime = clock.getDelta();
		totalTime += deltaTime;
		update();
		render();
	}

	animate()
}


function createArrowCloud(root, count, color) {
	const arrowCloud = []

	if (color === undefined) color = 0x884400

	for (let i = 0; i < count; i++) {
		const x = (i % 10) / 10 - 0.5
		const z = (Math.floor(i / 10) % 10) / 10 - 0.5
		const yStart = Math.floor(i / 100) / 10

		const start = new THREE.Vector3(x, yStart, z)
		const direction = new THREE.Vector3(0, 0.1, 0)

		const arrow = new THREE.ArrowHelper(direction, start, direction.length(), color)

		arrowCloud.push(arrow)
		root.add(arrow)
	}

	return arrowCloud
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

const arrows = createArrowCloud(root, 3000)

updatePositioning(root, 'data/positioning.json')

run()


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


var iteration = -2

setInterval(() => {
	iteration++

	for (arrow of arrows) {
		moveArrow(arrow, arrow.position, {
			x: iteration / 100,
			y: 0.1,
			z: iteration / 100
		})
	}
}, 500)


const modelPath = 'data/model/'

let mtlLoader = new THREE.MTLLoader()
mtlLoader.setTexturePath(modelPath)
mtlLoader.setPath(modelPath)
mtlLoader.load("kokille.mtl", (materials) => {
	materials.preload()

    let objLoader = new THREE.OBJLoader()
    objLoader.setMaterials(materials)
    objLoader.setPath(modelPath)
    objLoader.load("kokille.obj", (object) => {
        object.position.y = 0
		root.add(object)
    }/*, onProgress, onError */)
})
