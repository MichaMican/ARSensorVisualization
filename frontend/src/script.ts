declare const THREE: any
import { ArWrapper } from './ArWrapper'
import {
	createRenderer,
	createGroup,
	updatePositioning,
	loadModel,
	moveArrow
} from './ThreeUtil'

function createArrowCloud(parent, count, color?) {
	const arrowCloud = []

	if (color === undefined) color = 0x884400

	const start = new THREE.Vector3(0, 0, 0)
	const direction = new THREE.Vector3(1, 1, 1)

	for (let i = 0; i < count; i++) {
		const arrow = new THREE.ArrowHelper(direction, start, direction.length(), color)
		arrow.visible = false

		arrowCloud.push(arrow)
		parent.add(arrow)
	}

	return arrowCloud
}

function run(updateCallback) {
	function animate() {
		requestAnimationFrame(animate)
		
		updateCallback()

		arWrapper.update()

		renderer.render(scene, camera)
	}

	animate()
}

const scene = new THREE.Scene()

const camera = new THREE.Camera()
scene.add(camera)

const ambientLight = new THREE.AmbientLight(0xcccccc, 0.5)
scene.add(ambientLight)

const renderer = createRenderer(document.body)

const arWrapper = new ArWrapper(renderer, camera, 'data/camera_para.dat')
const markerRoot = arWrapper.createMarkerRoot(scene, 'data/hiro.patt')

const root = createGroup(markerRoot)

const arrowCloud = createArrowCloud(root, 10000)

updatePositioning(root, 'data/positioning.json')

loadModel('data/model/', 'kokille.obj', 'kokille.mtl', (kokille) => {
	root.add(kokille)

	updatePositioning(kokille, 'data/kokilleTransformation.json')
})


let positions = []
let lastPositions = positions

run(() => {
	if (lastPositions !== positions) {
		lastPositions = positions

		const currentPositions = positions
		const arrowCount = arrowCloud.length
	
		for (let i = 0; i < arrowCount; i++) {
			const arrow = arrowCloud[i]
			const position = currentPositions[i]
	
			if (position) {
				arrow.visible = true
				moveArrowToVector(arrow, position)
			} else {
				arrow.visible = false
			}
		}
	}
})

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
		const result = await fetch('https://ardatatest.azurewebsites.net/api/data')
		positions = await result.json()
	} catch (e) {
		positions = []

		console.log(e)
	}
}, 500)
