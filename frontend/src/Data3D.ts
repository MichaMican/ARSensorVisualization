import { Vector3, MathUtils as ThreeMath } from "three"

export interface LoosePoint3 {
	x?: Number | null,
	y?: Number | null,
	z?: Number | null
}

export interface Point3 {
	x: number,
	y: number,
	z: number
}

export interface Line3 {
	x?: number,
	y?: number,
	z?: number,
	xVec?: number,
	yVec?: number,
	zVec?: number
}

export function getLineLength(line: Line3) : number {
	return new Vector3(line.xVec, line.yVec, line.zVec).length()
}

export class Plain3 {
    x: number
    y: number
    z: number
    nVector: Vector3

    constructor(x: number, y: number, z: number, xRot: number, zRot: number) {
        this.x = x
        this.y = y
        this.z = z

        //Vector that points up
        this.nVector = new Vector3(0, 1, 0)
        const xAxis = new Vector3(1, 0, 0)
        const zAxis = new Vector3(0, 0, 1)

        this.nVector.applyAxisAngle(xAxis, ThreeMath.degToRad(xRot))
        this.nVector.applyAxisAngle(zAxis, ThreeMath.degToRad(zRot))
    }
}