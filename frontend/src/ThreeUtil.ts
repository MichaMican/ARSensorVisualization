import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import {
	ArrowHelper as Arrow,
	Group,
	Object3D,
	Renderer,
	Vector3,
	WebGLRenderer
} from 'three'
import { LoosePoint3, Point3 } from './Data3D'

export function createRenderer(parentElement: Node): Renderer {
	const renderer = new WebGLRenderer({
		antialias : true,
		alpha: true
	})
	
	renderer.setClearColor(0, 0)
	renderer.setSize(640, 480)
	
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'
	
	parentElement.appendChild(renderer.domElement)

	return renderer
}

export function createGroup(parent: Object3D): Group {
	const group = new Group()
	parent.add(group)

	return group
}

export function updatePositioning(root: Object3D, positioningUrl: string): void {
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

export function defaultVector(vector: LoosePoint3, defaults: Point3): Point3 {
	return {
		x: (vector.x !== undefined && vector.x !== null) ? +vector.x : defaults.x,
		y: (vector.y !== undefined && vector.y !== null) ? +vector.y : defaults.y,
		z: (vector.z !== undefined && vector.z !== null) ? +vector.z : defaults.z
	}
}

export function asVector3(vector: Point3): Vector3 {
	return new Vector3(vector.x, vector.y, vector.z)
}

export function translate(object: Object3D, vector: LoosePoint3) {
	const {x, y, z} = defaultVector(vector, {x: 0, y: 0, z: 0})

	object.translateX(x)
	object.translateY(y)
	object.translateZ(z)
}

export function rotate(object: Object3D, vector: LoosePoint3) {
	const {x, y, z} = defaultVector(vector, {x: 0, y: 0, z: 0})

	object.rotateX(x)
	object.rotateY(y)
	object.rotateZ(z)
}

export function scale(object: Object3D, vector: LoosePoint3) {
	const {x, y, z} = defaultVector(vector, {x: 1, y: 1, z: 1})

	object.scale.x = x
	object.scale.y = y
	object.scale.z = z
}

export function moveArrow(arrow: Arrow, pos: LoosePoint3, dir: LoosePoint3) {
	const posVec = asVector3(defaultVector(pos, {x: 0, y: 0, z: 0}))
	const dirVec = asVector3(defaultVector(dir, {x: 1, y: 1, z: 1}))
	const length = dirVec.length()

	if (length > 0) {
		arrow.position.copy(posVec)
		arrow.setDirection(dirVec)
		arrow.setLength(length, 0.2 * length)
	} else {
		arrow.visible = false
	}
}

export function loadModel(
	basePath: string,
	modelPath: string,
	texturePath: string,
	callback: (object: Group) => void
) {
	const mtlLoader = new MTLLoader()
	mtlLoader.setPath(basePath)
	mtlLoader.load(texturePath, materials => {
		materials.preload()

		const objLoader = new OBJLoader()
		objLoader.setMaterials(materials)
		objLoader.setPath(basePath)
		objLoader.load(modelPath, callback)
	})
}

