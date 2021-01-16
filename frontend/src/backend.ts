import { getFromURL } from "./network"
import { Line3 } from "./Data3D"
import { DataMetaDat, isDataMetaDat, isVectorRange, VectorRange } from "./MetaData"

const backendURL = 'https://ardatatest.azurewebsites.net'


async function getVectorDataFromURL(url: string): Promise<Array<Line3>> {
	return await getFromURL<Array<Line3>>(
		url,
		(value): value is Array<Line3> => value instanceof Array,
		e => {
			if (e) console.log(e)
			return []
		}
	)
}

export default {
	// Static files
	markerPattern: `${backendURL}/data/hiro.patt`,
	cameraParameters: `${backendURL}/data/camera_para.dat`,
	kokilleTransformation: `${backendURL}/data/kokilleTransformation.json`,
	markerPositioning: `${backendURL}/data/positioning.json`,
	vectorRange: `${backendURL}/data/vectorLengthRange.json`,
	kokilleModelPath: `${backendURL}/data/model/`,

	// Dynamic files
	data: `${backendURL}/api/data/v2`,
	metaData: `${backendURL}/api/data/meta`,

	/**
	 * Get vector data, of vectors near given plain.
	 * @param limit defines result limit
	 * @param x x value of point on plain
	 * @param y y value of point on plain
	 * @param z z value of point on plain
	 * @param n1 x value of normal vector of plain
	 * @param n2 y value of normal vector of plain
	 * @param n3 z value of normal vector of plain
	 */

	async getVectorData(
		limit: number,
		x?: number,
		y?: number,
		z?: number,
		n1?: number,
		n2?: number,
		n3?: number
	): Promise<Array<Line3>> {
		const url = new URL(this.data)
		url.searchParams.append('limit', limit.toString())
		if (x || y || n1 || n2 || n3) {
			if (x && y && z && n1 && n2 && n3) {
				url.searchParams.append('x', x.toString())
				url.searchParams.append('y', y.toString())
				url.searchParams.append('z', z.toString())
				url.searchParams.append('n1', n1.toString())
				url.searchParams.append('n2', n2.toString())
				url.searchParams.append('n3', n3.toString())
			} else {
				throw "Specifiy all x,y,z,n1,n2,n3 parameters or none of them"
			}
		}
		return getVectorDataFromURL(url.toString())
	},

	/**
	 * Get all vector data
	 */
	// async getAllVectorData(limit: number): Promise<Array<Line3>> {
	// 	const url = new URL(this.data)
	// 	url.searchParams.append('limit',)

	// 	return getVectorDataFromURL(url.toString())
	// },

	async getMetaData(): Promise<DataMetaDat> {
		return await getFromURL(this.metaData, isDataMetaDat, 'throw')
	},

	async getVectorLengthRange(): Promise<VectorRange> {
		return await getFromURL<VectorRange>(this.vectorRange, isVectorRange, e => {
			if (e) console.log(e)
			return {
				min: 0,
				max: Number.POSITIVE_INFINITY
			}
		})
	}
} as const
