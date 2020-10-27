declare module 'ar' {
	import {
		Camera,
		EventDispatcher,
		Matrix4,
		Object3D,
		Renderer
	} from 'three'

	class ArToolkitSource {
		parameters: ArSourceParameters

		ready: boolean
		domElement?: HTMLVideoElement | HTMLImageElement | null

		constructor(parameters: ArSourceParameters)

		init(
			onReady?: () => any,
			onError?: (error: {
				name?: string,
				message: string
			}) => any
		): this


		hasMobileTorch(): boolean
		
		/**
		 * Toggle the flash/torch of the mobile fun if applicable.
		 * @see Great post about it {@link https://www.oberhofer.co/mediastreamtrack-and-its-capabilities/}
		 */
		toggleMobileTorch(): void


		domElementWidth(): number
		domElementHeight(): number

		onResizeElement(): void

		copyElementSizeTo(otherElement: HTMLElement): void

		onResize(
			arToolkitContext: ArToolkitContext,
			renderer: Renderer,
			camera: Camera
		): void
	}
	
	class ArToolkitContext extends EventDispatcher {
		static readonly REVISION: String

		static baseURL: String

		parameters: ArContextParameters

		arController?: any
		arucoContext?: any

		constructor(
			parameters: ArContextParameters
		)

		/**
		 * Create a default camera for this trackingBackend
		 * @param trackingBackend - the tracking to user
		 * @return the created camera
		 */
		static createDefaultCamera(trackingBackend: String): Camera

		init(onCompleted: () => any): void
		update(srcElement: HTMLVideoElement | HTMLImageElement): Boolean

		addMarker(arMarkerControls: ArMarkerControls): void
		removeMarker(arMarkerControls: ArMarkerControls): void

		getProjectionMatrix(): Matrix4
	}

	abstract class ArBaseControls extends EventDispatcher {
		id: number
		object3d: Object3D

		constructor(
			object3d: Object3D
		)
		
		abstract name(): string
		abstract update(): void
	}

	class ArMarkerControls extends ArBaseControls {
		context: ArToolkitContext
		parameters: ArMarkerControlsParameters

		constructor(
			context: ArToolkitContext,
			object3d: Object3D,
			parameters: ArMarkerControlsParameters
		)

		name(): string
		update(): void
		dispose(): void
		
		/**
		 * When you actually got a new modelViewMatrix, you need to perfom a whole bunch
		 * of things. it is done here.
		 */
		updateWithModelViewMatrix(
			modelViewMatrix: Matrix4
		): void
	}

	interface ArSourceParameters {
		/**
		 * type of source
		 */
		sourceType?: 'webcam' | 'image' | 'video'

		/**
		 * url of the source - valid if sourceType = image|video
		 */
		sourceUrl?: String

		/**
		 * Device id of the camera to use (optional)
		 */
		deviceId?: String | String[]

		/**
		 * resolution width of at which we initialize in the source image
		 */
		sourceWidth?: Number

		/**
		 * resolution height of at which we initialize in the source image
		 */
		sourceHeight?: Number

		/**
		 * resolution width displayed for the source
		 */
		displayWidth?: Number
		
		/**
		 * resolution height displayed for the source
		 */
		displayHeight?: Number
	}

	interface ArContextParameters {
		/**
		 * AR backend
		 */
		trackingBackend?: 'artoolkit' | 'aruco'

		/**
		 * debug - true if one should display artoolkit debug canvas, false otherwise
		 */
		debug?: Boolean

		/**
		 * the mode of detection
		 */
		detectionMode?: 'color' | 'color_and_matrix' | 'mono' | 'mono_and_matrix'
		
		/**
		 * type of matrix code - valid iif detectionMode end with 'matrix'
		 */
		matrixCodeType?: '3x3' | '3x3_HAMMING63' | '3x3_PARITY65' | '4x4' | '4x4_BCH_13_9_3' | '4x4_BCH_13_5_5'

		/**
		 * url of the camera parameters
		 */
		cameraParametersUrl?: String

		/**
		 * tune the maximum rate of pose detection in the source image
		 */
		maxDetectionRate?: Number

		/**
		 * resolution width of at which we detect pose in the source image
		 */
		canvasWidth?: Number
		
		/**
		 * resolution height of at which we detect pose in the source image
		 */
		canvasHeight?: Number

		/**
		 * the patternRatio inside the artoolkit marker - artoolkit only
		 */
		patternRatio?: Number

		/**
		 * Labeling mode for markers
		 * 
		 * black_region: Black bordered markers on a white background
		 * 
		 * white_region: White bordered markers on a black background
		 */
		labelingMode?: 'black_region' | 'white_region'

		/**
		 * enable image smoothing or not for canvas copy
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled}
		 */
		imageSmoothingEnabled?: Boolean
	}

	interface ArMarkerControlsParameters {
		/**
		 * size of the marker in meter
		 */
		size?: Number

		/**
		 * type of marker
		 */
		type?: 'pattern' | 'barcode' | 'unknown'

		/**
		 * url of the pattern - IIF type='pattern'
		 */
		patternUrl?: String

		/**
		 * value of the barcode - IIF type='barcode'
		 */
		barcodeValue?: Number

		/**
		 * change matrix mode
		 */
		changeMatrixMode?: 'modelViewMatrix' | 'cameraTransformMatrix'

		/**
		 * minimal confidence in the marker recognition - between [0, 1] - default to 0.6
		 */
		minConfidence?: Number

		/**
		 * turn on/off camera smoothing
		 */
		smooth?: Boolean

		/**
		 * number of matrices to smooth tracking over, more = smoother but slower follow
		 */
		smoothCount?: Number

		/**
		 * distance tolerance for smoothing, if smoothThreshold # of matrices are under tolerance, tracking will stay still
		 */
		smoothTolerance?: Number

		/**
		 * threshold for smoothing, will keep still unless enough matrices are over tolerance
		 */
		smoothThreshold?: Number
	}
}
