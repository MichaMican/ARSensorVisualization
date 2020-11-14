import Backend from './backend'
import { Plain3 } from './Data3D'
import { FilterBoxToggleEvent, FilterToggleEvent, GuiEventMap } from './GuiEvents'

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

    private readonly eventTargetDeligate: EventTarget = new EventTarget()

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

    get filterBoxEnabled(): boolean {
        return this.filterEnabled
    }

    constructor() {
        Backend.getMetaData().then(metaData => {
            this.sliderX.min = Math.floor(metaData.xMin - 0.05 * (Math.abs(metaData.xMin) + Math.abs(metaData.xMax))).toString()
            this.sliderY.min = Math.floor(metaData.yMin - 0.05 * (Math.abs(metaData.yMin) + Math.abs(metaData.yMax))).toString()
            this.sliderZ.min = Math.floor(metaData.zMin - 0.05 * (Math.abs(metaData.zMin) + Math.abs(metaData.zMax))).toString()
            this.sliderX.max = Math.ceil(metaData.xMax + 0.05 * (Math.abs(metaData.xMax) + Math.abs(metaData.xMin))).toString()
            this.sliderY.max = Math.ceil(metaData.yMax + 0.05 * (Math.abs(metaData.yMax) + Math.abs(metaData.yMin))).toString()
            this.sliderZ.max = Math.ceil(metaData.zMax + 0.05 * (Math.abs(metaData.zMax) + Math.abs(metaData.zMin))).toString()

            // Set default value of sliders in the middle of its range
            this.sliderX.value = ((+this.sliderX.max - +this.sliderX.min) / 2 + +this.sliderX.min).toFixed(2)
            this.sliderY.value = ((+this.sliderY.max - +this.sliderY.min) / 2 + +this.sliderY.min).toFixed(2)
            this.sliderZ.value = ((+this.sliderZ.max - +this.sliderZ.min) / 2 + +this.sliderZ.min).toFixed(2)

            // Update value displays
            this.sliderX.dispatchEvent(new Event('input'))
            this.sliderY.dispatchEvent(new Event('input'))
            this.sliderZ.dispatchEvent(new Event('input'))
        })

        this.openFilterMenu.addEventListener('click', () => {
            this.controllerWrapper.style.visibility = ""
        })

        this.closeFilterMenu.addEventListener('click', () => {
            this.controllerWrapper.style.visibility = "hidden"
        })

        // Init display with default value
        this.displayX.textContent = this.sliderX.value.toString()
        this.displayY.textContent = this.sliderY.value.toString()
        this.displayZ.textContent = this.sliderZ.value.toString()

        // Update display when slider changes
        this.sliderX.addEventListener('input', () => {
            this.displayX.textContent = this.sliderX.value.toString()
        })

        this.sliderY.addEventListener('input', () => {
            this.displayY.textContent = this.sliderY.value.toString()
        })

        this.sliderZ.addEventListener('input', () => {
            this.displayZ.textContent = this.sliderZ.value.toString()
        })


        this.inputRotX.addEventListener('change', () => {
            this.inputRotX.value = this.normaliseAngle(+this.inputRotX.value).toString()
        })

        this.inputRotZ.addEventListener('change', () => {
            this.inputRotZ.value = this.normaliseAngle(+this.inputRotZ.value).toString()
        })

        // Register events to dispatch
        this.filterCbx.addEventListener('change', () => {
            this.dispatchEvent(new FilterToggleEvent(this.filterEnabled))

            // TODO: register this with the filter-box checkbox, and only fire if it changes, considering filter checkbox
            this.dispatchEvent(new FilterBoxToggleEvent(this.filterBoxEnabled))
        })
    }

    private normaliseAngle(angle: number): number {
        // Convert input to -180° - 180° range
        let normalisedAngle: number = (angle % 360 + 360) % 360;
        if (normalisedAngle > 180) {
            normalisedAngle -= 360
        }

        return normalisedAngle
    }


    addEventListener<K extends keyof GuiEventMap>(type: K, listener: (this: Gui, ev: GuiEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void {
        this.eventTargetDeligate.addEventListener(type, listener as EventListener, options)
    }

    removeEventListener<K extends keyof GuiEventMap>(type: K, listener: (this: Gui, ev: GuiEventMap[K]) => any, options?: boolean | EventListenerOptions): void {
        this.eventTargetDeligate.removeEventListener(type, listener as EventListener, options)
    }

    private dispatchEvent<E extends keyof GuiEventMap>(event: GuiEventMap[E]): boolean {
        return this.eventTargetDeligate.dispatchEvent(event)
    }
}
