import GUI from './gui'

import Backend from './backend'

import {
	AmbientLight,
	ArrowHelper as Arrow,
	Camera,
	Color,
	Object3D,
	Scene,
	Vector3
} from 'three'

import {
	createRenderer,
	createGroup,
	updatePositioning,
	loadModel,
	moveArrow
} from './ThreeUtil'

import { ArWrapper } from './ArWrapper'
import { Line3 } from './Line3'


function createArrowCloud(
	parent: Object3D,
	count: number,
	color: Color | string | number = 0x88440
) {
	const arrowCloud = []

	const start = new Vector3(0, 0, 0)
	const direction = new Vector3(1, 1, 1)

	for (let i = 0; i < count; i++) {
		const arrow = new Arrow(direction, start, direction.length(), color)
		arrow.visible = false

		arrowCloud.push(arrow)
		parent.add(arrow)
	}

	return arrowCloud
}

function run(updateCallback: () => void) {
	function animate() {
		requestAnimationFrame(animate)
		
		updateCallback()

		ar.update()

		renderer.render(scene, camera)
	}

	animate()
}


//initialise GUI watchers
const gui = new GUI()


const scene = new Scene()

const camera = new Camera()
scene.add(camera)

const ambientLight = new AmbientLight(0xcccccc, 0.5)
scene.add(ambientLight)

const renderer = createRenderer(gui.canvas)

const ar = new ArWrapper(renderer, camera, Backend.cameraParameters)
const markerRoot = ar.createMarkerRoot(scene, Backend.markerPattern)

const root = createGroup(markerRoot)

const arrowCloud = createArrowCloud(root, 10000)

updatePositioning(root, Backend.markerPositioning)

loadModel(Backend.kokilleModelPath, 'kokille.obj', 'kokille.mtl', (kokille) => {
	root.add(kokille)

	updatePositioning(kokille, Backend.kokilleTransformation)
})

let lines: Array<Line3> = []
let lastLines: Array<Line3> = lines

run(() => {
	if (lastLines !== lines) {
		lastLines = lines

		const currentLines = lines
		const arrowCount = arrowCloud.length
	
		for (let i = 0; i < arrowCount; i++) {
			const arrow = arrowCloud[i]
			const line = currentLines[i]
	
			if (line) {
				arrow.visible = true
				moveArrowToLine(arrow, line)
			} else {
				arrow.visible = false
			}
		}
	}
})

function moveArrowToLine(arrow: Arrow, line: Line3) {
	moveArrow(arrow, {
		x: line.x,
		y: line.y,
		z: line.z
	}, {
		x: line.xVec,
		y: line.yVec,
		z: line.zVec
	})
}

setInterval(async () => {
	const plain = gui.filterPlain

	lines = await Backend.getVectorData(
		plain.x,
		plain.y,
		plain.z,
		plain.nVector.x,
		plain.nVector.y,
		plain.nVector.z
	)
}, 500)
