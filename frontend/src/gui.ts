import Backend from './backend'
import { Plain3 } from './Data3D'

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
    private readonly openFilterMenu: HTMLButtonElement = document.getElementById("openFilterMenu") as HTMLButtonElement
    private readonly closeFilterMenu: HTMLButtonElement = document.getElementById("closeFilterMenu") as HTMLButtonElement
    private readonly controllerWrapper: HTMLDivElement = document.getElementById("filterControlDisplay") as HTMLDivElement
    private readonly filterCbx: HTMLInputElement = document.getElementById("toggleFilter") as HTMLInputElement


    get filterPlain(): Plain3 {
        return new Plain3(
			+this.sliderX.value,
			+this.sliderY.value,
			+this.sliderZ.value,
			+this.inputRotX.value,
			+this.inputRotZ.value
		)
    }

    get filterEnabled(): boolean {
        return this.filterCbx.checked
    }

    constructor() {

        Backend.getMetaData().then(metaData => {
            this.sliderX.min = Math.floor(metaData.xMin - 0.05 * (Math.abs(metaData.xMin) + Math.abs(metaData.xMax))).toString()
            this.sliderY.min = Math.floor(metaData.yMin - 0.05 * (Math.abs(metaData.yMin) + Math.abs(metaData.yMax))).toString()
            this.sliderZ.min = Math.floor(metaData.zMin - 0.05 * (Math.abs(metaData.zMin) + Math.abs(metaData.zMax))).toString()
            this.sliderX.max = Math.ceil(metaData.xMax + 0.05 * (Math.abs(metaData.xMax) + Math.abs(metaData.xMin))).toString()
            this.sliderY.max = Math.ceil(metaData.yMax + 0.05 * (Math.abs(metaData.yMax) + Math.abs(metaData.yMin))).toString()
            this.sliderZ.max = Math.ceil(metaData.zMax + 0.05 * (Math.abs(metaData.zMax) + Math.abs(metaData.zMin))).toString()

            //set default value of sliders in the middle of its range
            this.sliderX.value = ((+this.sliderX.max - +this.sliderX.min) / 2 + +this.sliderX.min).toFixed(2)
            this.sliderY.value = ((+this.sliderY.max - +this.sliderY.min) / 2 + +this.sliderY.min).toFixed(2)
            this.sliderZ.value = ((+this.sliderZ.max - +this.sliderZ.min) / 2 + +this.sliderZ.min).toFixed(2)

            //update value displays
            this.sliderX.oninput!(new Event(""))
            this.sliderY.oninput!(new Event(""))
            this.sliderZ.oninput!(new Event(""))
        })

        this.openFilterMenu.onclick = () => {
            this.controllerWrapper.style.visibility = ""
        }

        this.closeFilterMenu.onclick = () => {
            this.controllerWrapper.style.visibility = "hidden"
        }

        //init display with default value
        this.displayX.textContent = this.sliderX.value.toString()
        this.displayY.textContent = this.sliderY.value.toString()
        this.displayZ.textContent = this.sliderZ.value.toString()

        // Update display when slider changes
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
            this.inputRotX.value = Gui.normaliseAngle(+this.inputRotX.value).toString()
        }
        this.inputRotZ.onchange = () => {
            this.inputRotZ.value = Gui.normaliseAngle(+this.inputRotZ.value).toString()
        }
    }

    private static normaliseAngle(angle: number): number {
        // Convert input to -180° - 180° range
        let normalisedAngle: number = (angle % 360 + 360) % 360;
        if (normalisedAngle > 180) {
            normalisedAngle -= 360
        }

        return normalisedAngle
    }
}
