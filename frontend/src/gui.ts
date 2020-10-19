export function initGui():void {
    const slider = document.getElementById("slider") as HTMLInputElement
    const display = document.getElementById("display")

    if(slider){

        //init display with default value
        if(display){
            display.textContent = slider.value.toString()
        }

        //update display when slider changes
        slider.oninput = () => {
            if(display){
                display.textContent = slider.value.toString()
            }
        }
    }
}