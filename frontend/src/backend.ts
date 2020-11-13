import { Line3 } from "./Data3D"
import { DataMetaDat } from "./DataMetaDat"

const backendURL = 'https://ardatatest.azurewebsites.net'

async function getVectorDataFromURL(url: string) {
	try {
		const result = await fetch(url)
		const linesJSON = await result.json()

		if (linesJSON instanceof Array) {
			return linesJSON
		}
	} catch (e) {
		console.log(e)
	}
	
	return []
}

export default {
	// Static files
	markerPattern: `${backendURL}/data/hiro.patt`,
	cameraParameters: `${backendURL}/data/camera_para.dat`,
	kokilleTransformation: `${backendURL}/data/kokilleTransformation.json`,
	markerPositioning: `${backendURL}/data/positioning.json`,
	kokilleModelPath: `${backendURL}/data/model/`,

	data: `${backendURL}/api/data/v2`,
	metaData: `${backendURL}/api/data/meta`,

	/**
	 * Get vector data, of vectors near given plain.
	 * @param x x value of point on plain
	 * @param y y value of point on plain
	 * @param z z value of point on plain
	 * @param n1 x value of normal vector of plain
	 * @param n2 y value of normal vector of plain
	 * @param n3 z value of normal vector of plain
	 */
	async getVectorData(x: number, y: number, z:number, n1: number, n2: number, n3: number): Promise<Array<Line3>> {
		const url = new URL(this.data)
		url.searchParams.append('x', x.toString())
		url.searchParams.append('y', y.toString())
		url.searchParams.append('z', z.toString())
		url.searchParams.append('n1', n1.toString())
		url.searchParams.append('n2', n2.toString())
		url.searchParams.append('n3', n3.toString())

		return getVectorDataFromURL(url.toString())
	},

	/**
	 * Get all vector data
	 */
	async getAllVectorData(): Promise<Array<Line3>> {
		return getVectorDataFromURL(this.data)
    },
    
    async getMetaData(): Promise<DataMetaDat> {
        const result = await fetch(this.metaData)
        const metaJSON = await result.json()
        return metaJSON
    }
} as const
