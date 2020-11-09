import {Vector3} from "three"

export function initGui(): void {
    const sliderX = document.getElementById("sliderX") as HTMLInputElement
    const sliderY = document.getElementById("sliderY") as HTMLInputElement
    const sliderZ = document.getElementById("sliderZ") as HTMLInputElement
    const inputRotX = document.getElementById("inputRotX") as HTMLInputElement
    const inputRotZ = document.getElementById("inputRotZ") as HTMLInputElement
    const displayX = document.getElementById("displayX") as HTMLDivElement
    const displayY = document.getElementById("displayY") as HTMLDivElement
    const displayZ = document.getElementById("displayZ") as HTMLDivElement

    //init display with default value
    displayX.textContent = sliderX.value.toString()
    displayY.textContent = sliderY.value.toString()
    displayZ.textContent = sliderZ.value.toString()

    //update display when slider changes
    sliderX.oninput = () => {
        displayX.textContent = sliderX.value.toString()
        updateFilterPlain()
    }
    sliderY.oninput = () => {
        displayY.textContent = sliderY.value.toString()
        updateFilterPlain()
    }
    sliderZ.oninput = () => {
        displayZ.textContent = sliderZ.value.toString()
        updateFilterPlain()
    }

    inputRotX.onchange = () => {
        //convert input to -180° - 180° range
        let xAngle: number = (+inputRotX.value % 360 + 360) % 360;
        if(xAngle > 180){
            xAngle -= 360
        }

        if(xAngle != +inputRotX.value){
            inputRotX.value = xAngle.toString()
        }
        updateFilterPlain()
    }
    inputRotZ.onchange = () => {
        //convert input to -180° - 180° range
        let zAngle: number = (+inputRotZ.value % 360 + 360) % 360;
        if(zAngle > 180){
            zAngle -= 360
        }

        if(zAngle != +inputRotZ.value){
            inputRotZ.value = zAngle.toString()
        }

        updateFilterPlain()
    }

    function updateFilterPlain(): void {
        const plain = new Plain(+sliderX.value, +sliderY.value, +sliderZ.value, +inputRotX.value, +inputRotZ.value)
    }

}

class Plain{
    x: number
    y: number
    z: number
    nVector: Vector3

    constructor(x:number, y:number, z:number, xRot: number, zRot: number){
        this.x = x
        this.y = y
        this.z = z

        //Vector that points up
        this.nVector = new Vector3(0,1,0)
        const xAxis = new Vector3(1,0,0)
        const zAxis = new Vector3(0,0,1)

        this.nVector.applyAxisAngle(xAxis, xRot)
        this.nVector.applyAxisAngle(zAxis, zRot)
    }
}

