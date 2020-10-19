declare const THREE: any

export function createRenderer(parentElement) {
	const renderer = new THREE.WebGLRenderer({
		antialias : true,
		alpha: true
	})
	
	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	renderer.setSize(640, 480)
	
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'
	
	parentElement.appendChild(renderer.domElement)

	return renderer
}

export function createGroup(parent) {
	const group = new THREE.Group()
	parent.add(group)

	return group
}

export function updatePositioning(root, positioningUrl) {
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

export function defaultVector(vector, defaults) {
	vector = vector || {}
	if (vector.x === undefined || vector.x === null) vector.x = defaults.x
	if (vector.y === undefined || vector.y === null) vector.y = defaults.y
	if (vector.z === undefined || vector.z === null) vector.z = defaults.z
	return vector
}

export function toThreeVector(vector) {
	return new THREE.Vector3(vector.x, vector.y, vector.z)
}

export function translate(object, vector) {
	vector = defaultVector(vector, {x: 0, y: 0, z: 0})

	object.translateX(vector.x)
	object.translateY(vector.y)
	object.translateZ(vector.z)
}

export function rotate(object, vector) {
	vector = defaultVector(vector, {x: 0, y: 0, z: 0})

	object.rotateX(vector.x)
	object.rotateY(vector.y)
	object.rotateZ(vector.z)
}

export function scale(object, vector) {
	vector = defaultVector(vector, {x: 1, y: 1, z: 1})

	object.scale.x = vector.x
	object.scale.y = vector.y
	object.scale.z = vector.z
}

export function moveArrow(arrow, pos, dir) {
	pos = defaultVector(pos, {x: 0, y: 0, z: 0})
	dir = defaultVector(dir, {x: 1, y: 1, z: 1})

	const posVec = toThreeVector(pos)
	const dirVec = toThreeVector(dir)
	const length = dirVec.length()

	if (length > 0) {
		arrow.position.copy(posVec)
		arrow.setDirection(dirVec)
		arrow.setLength(length, 0.2 * length)
	} else {
		arrow.visible = false
	}
}

export function loadModel(basePath, modelPath, texturePath, callback) {
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

