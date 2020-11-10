import {
	Camera,
	Group,
	Object3D,
	Renderer
} from 'three'
import {
    ArToolkitSource as ArSource,
    ArToolkitContext as ArContext,
    ArMarkerControls
} from 'ar'

export class ArWrapper {
	private readonly arSource: ArSource
	private readonly arContext: ArContext

	constructor(
		readonly renderer: Renderer,
		camera: Camera,
		cameraParametersUrl: String
	) {
		// Create ArSource
		this.arSource = new ArSource({
			sourceType : 'webcam'
		})

		// Create ArContext
		this.arContext = new ArContext({
			cameraParametersUrl: cameraParametersUrl,
			detectionMode: 'mono'
		})
		
		// Copy projection matrix to camera when initialization complete
		this.arContext.init(() => {
			camera.projectionMatrix.copy(this.arContext.getProjectionMatrix())
		})
		
		// Init ArSource and update DOM element sizes
		this.arSource.init(() => {
			// Give elements time to initialize
			setTimeout(() => this.updateSize(), 2000)
		})

		// Handle window resize
		window.addEventListener('resize', () => this.updateSize())
	}

	updateSize() {
		this.arSource.onResizeElement()
		this.arSource.copyElementSizeTo(this.renderer.domElement)
		if (this.arContext.arController) {
			this.arSource.copyElementSizeTo(this.arContext.arController.canvas)
		}
	}

	update() {
		if (this.arSource.ready && this.arSource.domElement) {
			this.arContext.update(this.arSource.domElement)
		}
	}

	private attachMarkerControls(
		markerRoot: Object3D,
		patternUrl: String
	): ArMarkerControls {
		return new ArMarkerControls(this.arContext, markerRoot, {
			type: 'pattern',
			patternUrl: patternUrl
		})
	}
	
	createMarkerRoot(parent: Object3D, patternUrl: String): Group {
		const markerRoot = new Group()
		parent.add(markerRoot)

		this.attachMarkerControls(markerRoot, patternUrl)
	
		return markerRoot
	}
}
