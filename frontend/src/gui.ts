import { Vector3, MathUtils as ThreeMath } from "three"

export default class Gui {

    public readonly canvas: HTMLDivElement = document.getElementById("canvas") as HTMLDivElement

    private readonly sliderX: HTMLInputElement = document.getElementById("sliderX") as HTMLInputElement
    private readonly sliderY: HTMLInputElement = document.getElementById("sliderY") as HTMLInputElement
    private readonly sliderZ: HTMLInputElement = document.getElementById("sliderZ") as HTMLInputElement
    private readonly inputRotX: HTMLInputElement = document.getElementById("inputRotX") as HTMLInputElement
    private readonly inputRotZ: HTMLInputElement = document.getElementById("inputRotZ") as HTMLInputElement
    private readonly displayX: HTMLDivElement = document.getElementById("displayX") as HTMLDivElement
    private readonly displayY: HTMLDivElement = document.getElementById("displayY") as HTMLDivElement
    private readonly displayZ: HTMLDivElement = document.getElementById("displayZ") as HTMLDivElement

    get filterPlain(): Plain {
        return new Plain(+this.sliderX.value, +this.sliderY.value, +this.sliderZ.value, +this.inputRotX.value, +this.inputRotZ.value)
    }

    constructor() {
        //init display with default value
        this.displayX.textContent = this.sliderX.value.toString()
        this.displayY.textContent = this.sliderY.value.toString()
        this.displayZ.textContent = this.sliderZ.value.toString()

        //update display when slider changes
        this.sliderX.oninput = () => {
            this.displayX.textContent = this.sliderX.value.toString()
        }
        this.sliderY.oninput = () => {
            this.displayY.textContent = this.sliderY.value.toString()
        }
        this.sliderZ.oninput = () => {
            this.displayZ.textContent = this.sliderZ.value.toString()
        }

        this.inputRotX.onchange = () => {
            this.inputRotX.value = this.normaliseAngle(+this.inputRotX.value).toString()
        }
        this.inputRotZ.onchange = () => {
            this.inputRotZ.value = this.normaliseAngle(+this.inputRotZ.value).toString()
        }
    }

    private normaliseAngle(angle: number): number {
        //convert input to -180° - 180° range
        let normalisedAngle: number = (angle % 360 + 360) % 360;
        if (normalisedAngle > 180) {
            normalisedAngle -= 360
        }

        return normalisedAngle
    }
}



export class Plain {
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

