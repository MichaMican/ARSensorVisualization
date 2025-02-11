import GUI from './gui'
import { isDataMetaDat as isMetaData } from './MetaData'
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
import { getLineLength, Line3 } from './Data3D'
import { Lut } from "three/examples/jsm/math/Lut";


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


// Initialise GUI watchers
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

// Pool of arrows to reposition (as to not have to recreate them every frame)
const arrowCloud = createArrowCloud(root, 10000)

updatePositioning(root, Backend.markerPositioning)

loadModel(Backend.kokilleModelPath, 'kokille.obj', 'kokille.mtl', kokille => {
	root.add(kokille)

	updatePositioning(kokille, Backend.kokilleTransformation)
})

// Color range, mapping vector length to colors
const arrowColors = new Lut('cooltowarm', 255)
	.setMin(0)
	.setMax(Number.POSITIVE_INFINITY)

// Set limits of color mapping, depending on backend's vector length prediction
Backend.getVectorLengthRange().then(vectorRange => {
	arrowColors
		.setMin(vectorRange.min)
		.setMax(vectorRange.max)
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
				arrow.setColor(arrowColors.getColor(getLineLength(line)))
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

Backend.getMetaData().then(metaData => {
	setInterval(async () => {
		if (gui.filterEnabled) {
			const plain = gui.filterPlain

			lines = await Backend.getVectorData(
				metaData.totalVectors,
				plain.x,
				plain.y,
				plain.z,
				plain.nVector.x,
				plain.nVector.y,
				plain.nVector.z
			)
		} else {
			lines = await Backend.getVectorData(metaData.totalVectors);
		}
	}, 500)
}).catch((e) => {
	console.error(e);
})


