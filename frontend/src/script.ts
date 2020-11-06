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

const scene = new Scene()

const camera = new Camera()
scene.add(camera)

const ambientLight = new AmbientLight(0xcccccc, 0.5)
scene.add(ambientLight)

const renderer = createRenderer(document.body)

const ar = new ArWrapper(renderer, camera, '../data/camera_para.dat')
const markerRoot = ar.createMarkerRoot(scene, '../data/hiro.patt')

const root = createGroup(markerRoot)

const arrowCloud = createArrowCloud(root, 10000)

updatePositioning(root, '../data/positioning.json')

loadModel('../data/model/', 'kokille.obj', 'kokille.mtl', (kokille) => {
	root.add(kokille)

	updatePositioning(kokille, '../data/kokilleTransformation.json')
})

interface Line3 {
	x?: Number,
	y?: Number,
	z?: Number,
	xVec?: Number,
	yVec?: Number,
	zVec?: Number
}

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
	try {
		const result = await fetch('https://ardatatest.azurewebsites.net/api/data')
		const linesJSON = await result.json()

		if (linesJSON instanceof Array) {
			lines = linesJSON
		}
	} catch (e) {
		lines = []

		console.log(e)
	}
}, 500)
