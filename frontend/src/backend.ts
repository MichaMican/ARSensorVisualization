import { DataMetaDat } from "./DataMetaDat"
import { Line3 } from "./Line3"

const backendURL = 'https://ardatatest.azurewebsites.net'

export const markerPattern = `${backendURL}/data/hiro.patt`
export const cameraParameters = `${backendURL}/data/camera_para.dat`
export const kokilleTransformation = `${backendURL}/data/kokilleTransformation.json`
export const markerPositioning = `${backendURL}/data/positioning.json`
export const kokilleModelPath = `${backendURL}/data/model/`

export const data = `${backendURL}/api/data/v2`
export const metaData = `${backendURL}/api/data/meta`

/**
 * 
 * @param x x value of point on plain
 * @param y y value of point on plain
 * @param z z value of point on plain
 * @param n1 x value of normal vector of plain
 * @param n2 y value of normal vector of plain
 * @param n3 z value of normal vector of plain
 */
export async function getVectorData(x: number, y: number, z:number, n1: number, n2: number, n3: number): Promise<Array<Line3>> {
    try {

        const url = new URL(data)
        url.searchParams.append('x', x.toString())
        url.searchParams.append('y', y.toString())
        url.searchParams.append('z', z.toString())
        url.searchParams.append('n1', n1.toString())
        url.searchParams.append('n2', n2.toString())
        url.searchParams.append('n3', n3.toString())

		const result = await fetch(url.toString())
		const linesJSON = await result.json()

		if (linesJSON instanceof Array) {
			return linesJSON
		}
	} catch (e) {
		console.log(e)
    }
    
    return []
}

export async function getMetaData(): Promise<DataMetaDat> {
    const result = await fetch(metaData)
    const metaJSON = await result.json()
    return metaJSON
}
