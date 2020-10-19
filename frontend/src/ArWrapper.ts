declare const THREE: any
declare const THREEx: any

export class ArWrapper {
	renderer: any
	arToolkitSource: any
	arToolkitContext: any

	constructor(renderer, camera, cameraParametersUrl) {
		this.renderer = renderer

		// Create ArToolkitSource
		this.arToolkitSource = new THREEx.ArToolkitSource({
			sourceType : 'webcam'
		})

		this.arToolkitSource.init(() => this.updateSize())


		// Create ArToolkitContext
		this.arToolkitContext = new THREEx.ArToolkitContext({
			cameraParametersUrl: cameraParametersUrl,
			detectionMode: 'mono'
		})
		
		// Copy projection matrix to camera when initialization complete
		this.arToolkitContext.init(() => {
			camera.projectionMatrix.copy(this.arToolkitContext.getProjectionMatrix())
		})

		// Handle resize event
		// window.addEventListener('resize', () => this.updateSize())
	}

	updateSize() {
		this.arToolkitSource.onResizeElement()	
		this.arToolkitSource.copyElementSizeTo(this.renderer.domElement)	
		if (this.arToolkitContext.arController) {
			this.arToolkitSource.copyElementSizeTo(this.arToolkitContext.arController.canvas)	
		}
	}

	update() {
		if (this.arToolkitSource.ready) {
			this.arToolkitContext.update(this.arToolkitSource.domElement);
		}
	}
	
	createMarkerRoot(parent, patternUrl) {
		const markerRoot = new THREE.Group()
		parent.add(markerRoot)

		const markerControls = new THREEx.ArMarkerControls(this.arToolkitContext, markerRoot, {
			type: 'pattern',
			patternUrl: patternUrl
		})
	
		return markerRoot
	}
}
