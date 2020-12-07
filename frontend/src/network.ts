export async function getFromURL<T>(
	url: string,
	typeCheck: ((value: any) => value is T),
	onError?: 'throw' | ((e?: any) => T)
) : Promise<T> {
	let error = undefined
	
	try {
		const result = await fetch(url)
		const value = await result.json()
		
		if (typeCheck) {
			if (typeCheck(value)) {
				return value
			}
		}
	} catch (e) {
		error = e
	}
	
	if (onError && onError != 'throw') {
		return onError(error)
	} else {
		throw error
	}
}

export async function getJSONFromURL(
	url: string,
	onError?: 'throw' | 'ignore' | ((e?: any) => any)
) : Promise<any> {
	if (!onError || onError == 'ignore') {
		onError = () => undefined
	}
	
	return getFromURL(url, (value: any): value is any => true, onError)
}
