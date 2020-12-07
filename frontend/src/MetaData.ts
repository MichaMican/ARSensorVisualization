function hasNumber(value: any, property: string) : boolean {
	return property in value
		&& typeof value[property] === 'number'
}


export interface DataMetaDat {
	xMax: number,
	yMax: number,
	zMax: number,
	xMin: number,
	yMin: number,
	zMin: number,
	totalVectors: number
}

export function isDataMetaDat(value: any) : value is DataMetaDat {
	return hasNumber(value, 'xMax')
		&& hasNumber(value, 'yMax')
		&& hasNumber(value, 'zMax')
		&& hasNumber(value, 'xMin')
		&& hasNumber(value, 'yMin')
		&& hasNumber(value, 'zMin')
		&& hasNumber(value, 'totalVectors')
}


export interface VectorRange {
	min: number,
	max: number
}

export function isVectorRange(value: any) : value is VectorRange {
	return hasNumber(value, 'min')
		&& hasNumber(value, 'max')
}
