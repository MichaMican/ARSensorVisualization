/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/script.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ArWrapper.ts":
/*!**************************!*\
  !*** ./src/ArWrapper.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ArWrapper = void 0;
class ArWrapper {
    constructor(renderer, camera, cameraParametersUrl) {
        this.renderer = renderer;
        // Create ArToolkitSource
        this.arToolkitSource = new THREEx.ArToolkitSource({
            sourceType: 'webcam'
        });
        this.arToolkitSource.init(() => this.updateSize());
        // Create ArToolkitContext
        this.arToolkitContext = new THREEx.ArToolkitContext({
            cameraParametersUrl: cameraParametersUrl,
            detectionMode: 'mono'
        });
        // Copy projection matrix to camera when initialization complete
        this.arToolkitContext.init(() => {
            camera.projectionMatrix.copy(this.arToolkitContext.getProjectionMatrix());
        });
        // Handle resize event
        // window.addEventListener('resize', () => this.updateSize())
    }
    updateSize() {
        this.arToolkitSource.onResizeElement();
        this.arToolkitSource.copyElementSizeTo(this.renderer.domElement);
        if (this.arToolkitContext.arController) {
            this.arToolkitSource.copyElementSizeTo(this.arToolkitContext.arController.canvas);
        }
    }
    update() {
        if (this.arToolkitSource.ready) {
            this.arToolkitContext.update(this.arToolkitSource.domElement);
        }
    }
    createMarkerRoot(parent, patternUrl) {
        const markerRoot = new THREE.Group();
        parent.add(markerRoot);
        const markerControls = new THREEx.ArMarkerControls(this.arToolkitContext, markerRoot, {
            type: 'pattern',
            patternUrl: patternUrl
        });
        return markerRoot;
    }
}
exports.ArWrapper = ArWrapper;


/***/ }),

/***/ "./src/ThreeUtil.ts":
/*!**************************!*\
  !*** ./src/ThreeUtil.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.loadModel = exports.moveArrow = exports.scale = exports.rotate = exports.translate = exports.toThreeVector = exports.defaultVector = exports.updatePositioning = exports.createGroup = exports.createRenderer = void 0;
function createRenderer(parentElement) {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setClearColor(new THREE.Color('lightgrey'), 0);
    renderer.setSize(640, 480);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.left = '0px';
    parentElement.appendChild(renderer.domElement);
    return renderer;
}
exports.createRenderer = createRenderer;
function createGroup(parent) {
    const group = new THREE.Group();
    parent.add(group);
    return group;
}
exports.createGroup = createGroup;
function updatePositioning(root, positioningUrl) {
    fetch(positioningUrl)
        .then((response) => {
        return response.json();
    })
        .then((positioning) => {
        positioning = positioning || {};
        translate(root, positioning.translation);
        scale(root, positioning.scale);
        rotate(root, positioning.rotation);
    })
        .catch((error) => {
        console.log("Error: " + error);
    });
}
exports.updatePositioning = updatePositioning;
function defaultVector(vector, defaults) {
    vector = vector || {};
    if (vector.x === undefined || vector.x === null)
        vector.x = defaults.x;
    if (vector.y === undefined || vector.y === null)
        vector.y = defaults.y;
    if (vector.z === undefined || vector.z === null)
        vector.z = defaults.z;
    return vector;
}
exports.defaultVector = defaultVector;
function toThreeVector(vector) {
    return new THREE.Vector3(vector.x, vector.y, vector.z);
}
exports.toThreeVector = toThreeVector;
function translate(object, vector) {
    vector = defaultVector(vector, { x: 0, y: 0, z: 0 });
    object.translateX(vector.x);
    object.translateY(vector.y);
    object.translateZ(vector.z);
}
exports.translate = translate;
function rotate(object, vector) {
    vector = defaultVector(vector, { x: 0, y: 0, z: 0 });
    object.rotateX(vector.x);
    object.rotateY(vector.y);
    object.rotateZ(vector.z);
}
exports.rotate = rotate;
function scale(object, vector) {
    vector = defaultVector(vector, { x: 1, y: 1, z: 1 });
    object.scale.x = vector.x;
    object.scale.y = vector.y;
    object.scale.z = vector.z;
}
exports.scale = scale;
function moveArrow(arrow, pos, dir) {
    pos = defaultVector(pos, { x: 0, y: 0, z: 0 });
    dir = defaultVector(dir, { x: 1, y: 1, z: 1 });
    const posVec = toThreeVector(pos);
    const dirVec = toThreeVector(dir);
    const length = dirVec.length();
    if (length > 0) {
        arrow.position.copy(posVec);
        arrow.setDirection(dirVec);
        arrow.setLength(length, 0.2 * length);
    }
    else {
        arrow.visible = false;
    }
}
exports.moveArrow = moveArrow;
function loadModel(basePath, modelPath, texturePath, callback) {
    let mtlLoader = new THREE.MTLLoader();
    mtlLoader.setTexturePath(basePath);
    mtlLoader.setPath(basePath);
    mtlLoader.load(texturePath, (materials) => {
        materials.preload();
        let objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(basePath);
        objLoader.load(modelPath, callback /*, onProgress, onError */);
    });
}
exports.loadModel = loadModel;


/***/ }),

/***/ "./src/gui.ts":
/*!********************!*\
  !*** ./src/gui.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.initGui = void 0;
function initGui() {
    const slider = document.getElementById("slider");
    const display = document.getElementById("display");
    if (slider) {
        //init display with default value
        if (display) {
            display.textContent = slider.value.toString();
        }
        //update display when slider changes
        slider.oninput = () => {
            if (display) {
                display.textContent = slider.value.toString();
            }
        };
    }
}
exports.initGui = initGui;


/***/ }),

/***/ "./src/script.ts":
/*!***********************!*\
  !*** ./src/script.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const gui_1 = __webpack_require__(/*! ./gui */ "./src/gui.ts");
const ArWrapper_1 = __webpack_require__(/*! ./ArWrapper */ "./src/ArWrapper.ts");
const ThreeUtil_1 = __webpack_require__(/*! ./ThreeUtil */ "./src/ThreeUtil.ts");
function createArrowCloud(parent, count, color) {
    const arrowCloud = [];
    if (color === undefined)
        color = 0x884400;
    const start = new THREE.Vector3(0, 0, 0);
    const direction = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < count; i++) {
        const arrow = new THREE.ArrowHelper(direction, start, direction.length(), color);
        arrow.visible = false;
        arrowCloud.push(arrow);
        parent.add(arrow);
    }
    return arrowCloud;
}
function run(updateCallback) {
    function animate() {
        requestAnimationFrame(animate);
        updateCallback();
        arWrapper.update();
        renderer.render(scene, camera);
    }
    animate();
}
const scene = new THREE.Scene();
const camera = new THREE.Camera();
scene.add(camera);
const ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
scene.add(ambientLight);
const renderer = ThreeUtil_1.createRenderer(document.getElementById("canvas"));
const arWrapper = new ArWrapper_1.ArWrapper(renderer, camera, '../data/camera_para.dat');
const markerRoot = arWrapper.createMarkerRoot(scene, '../data/hiro.patt');
const root = ThreeUtil_1.createGroup(markerRoot);
const arrowCloud = createArrowCloud(root, 10000);
ThreeUtil_1.updatePositioning(root, '../data/positioning.json');
ThreeUtil_1.loadModel('../data/model/', 'kokille.obj', 'kokille.mtl', (kokille) => {
    root.add(kokille);
    ThreeUtil_1.updatePositioning(kokille, '../data/kokilleTransformation.json');
});
let positions = [];
let lastPositions = positions;
run(() => {
    if (lastPositions !== positions) {
        lastPositions = positions;
        const currentPositions = positions;
        const arrowCount = arrowCloud.length;
        for (let i = 0; i < arrowCount; i++) {
            const arrow = arrowCloud[i];
            const position = currentPositions[i];
            if (position) {
                arrow.visible = true;
                moveArrowToVector(arrow, position);
            }
            else {
                arrow.visible = false;
            }
        }
    }
});
function moveArrowToVector(arrow, vector) {
    ThreeUtil_1.moveArrow(arrow, {
        x: vector.x,
        y: vector.y,
        z: vector.z
    }, {
        x: vector.xVec,
        y: vector.yVec,
        z: vector.zVec
    });
}
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield fetch('https://ardatatest.azurewebsites.net/api/data');
        positions = yield result.json();
    }
    catch (e) {
        positions = [];
        console.log(e);
    }
}), 500);
gui_1.initGui();


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FyV3JhcHBlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVGhyZWVVdGlsLnRzIiwid2VicGFjazovLy8uL3NyYy9ndWkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjcmlwdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDL0VBLE1BQWEsU0FBUztJQUtyQixZQUFZLFFBQVEsRUFBRSxNQUFNLEVBQUUsbUJBQW1CO1FBQ2hELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUTtRQUV4Qix5QkFBeUI7UUFDekIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxlQUFlLENBQUM7WUFDakQsVUFBVSxFQUFHLFFBQVE7U0FDckIsQ0FBQztRQUVGLElBQUksQ0FBQyxlQUFlLENBQUMsSUFB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QUNyQjtTQUNEO0tBQ0Q7QUFDRixDQUFDLENBQUM7QUFFRixTQUFTLGlCQUFpQixDQUFDLEtBQUssRUFBRSxNQUFNO0lBQ3ZDLHFCQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2hCLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNYLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNYLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztLQUNYLEVBQUU7UUFDRixDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUk7UUFDZCxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUk7UUFDZCxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUk7S0FDZCxDQUFDO0FBQ0gsQ0FBQztBQUVELFdBQVcsQ0FBQyxHQUFTLEVBQUU7SUFDdEIsSUFBSTtRQUNILE1BQU0sTUFBTSxHQUFHLE1BQU0sS0FBSyxDQUFDLCtDQUErQyxDQUFDO1FBQzNFLFNBQVMsR0FBRyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUU7S0FDL0I7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNYLFNBQVMsR0FBRyxFQUFFO1FBRWQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDZDtBQUNGLENBQUMsR0FBRSxHQUFHLENBQUM7QUFFUCxhQUFPLEVBQUUiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvc2NyaXB0LnRzXCIpO1xuIiwiZGVjbGFyZSBjb25zdCBUSFJFRTogYW55XG5kZWNsYXJlIGNvbnN0IFRIUkVFeDogYW55XG5cbmV4cG9ydCBjbGFzcyBBcldyYXBwZXIge1xuXHRyZW5kZXJlcjogYW55XG5cdGFyVG9vbGtpdFNvdXJjZTogYW55XG5cdGFyVG9vbGtpdENvbnRleHQ6IGFueVxuXG5cdGNvbnN0cnVjdG9yKHJlbmRlcmVyLCBjYW1lcmEsIGNhbWVyYVBhcmFtZXRlcnNVcmwpIHtcblx0XHR0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXJcblxuXHRcdC8vIENyZWF0ZSBBclRvb2xraXRTb3VyY2Vcblx0XHR0aGlzLmFyVG9vbGtpdFNvdXJjZSA9IG5ldyBUSFJFRXguQXJUb29sa2l0U291cmNlKHtcblx0XHRcdHNvdXJjZVR5cGUgOiAnd2ViY2FtJ1xuXHRcdH0pXG5cblx0XHR0aGlzLmFyVG9vbGtpdFNvdXJjZS5pbml0KCgpID0+IHRoaXMudXBkYXRlU2l6ZSgpKVxuXG5cblx0XHQvLyBDcmVhdGUgQXJUb29sa2l0Q29udGV4dFxuXHRcdHRoaXMuYXJUb29sa2l0Q29udGV4dCA9IG5ldyBUSFJFRXguQXJUb29sa2l0Q29udGV4dCh7XG5cdFx0XHRjYW1lcmFQYXJhbWV0ZXJzVXJsOiBjYW1lcmFQYXJhbWV0ZXJzVXJsLFxuXHRcdFx0ZGV0ZWN0aW9uTW9kZTogJ21vbm8nXG5cdFx0fSlcblx0XHRcblx0XHQvLyBDb3B5IHByb2plY3Rpb24gbWF0cml4IHRvIGNhbWVyYSB3aGVuIGluaXRpYWxpemF0aW9uIGNvbXBsZXRlXG5cdFx0dGhpcy5hclRvb2xraXRDb250ZXh0LmluaXQoKCkgPT4ge1xuXHRcdFx0Y2FtZXJhLnByb2plY3Rpb25NYXRyaXguY29weSh0aGlzLmFyVG9vbGtpdENvbnRleHQuZ2V0UHJvamVjdGlvbk1hdHJpeCgpKVxuXHRcdH0pXG5cblx0XHQvLyBIYW5kbGUgcmVzaXplIGV2ZW50XG5cdFx0Ly8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHRoaXMudXBkYXRlU2l6ZSgpKVxuXHR9XG5cblx0dXBkYXRlU2l6ZSgpIHtcblx0XHR0aGlzLmFyVG9vbGtpdFNvdXJjZS5vblJlc2l6ZUVsZW1lbnQoKVx0XG5cdFx0dGhpcy5hclRvb2xraXRTb3VyY2UuY29weUVsZW1lbnRTaXplVG8odGhpcy5yZW5kZXJlci5kb21FbGVtZW50KVx0XG5cdFx0aWYgKHRoaXMuYXJUb29sa2l0Q29udGV4dC5hckNvbnRyb2xsZXIpIHtcblx0XHRcdHRoaXMuYXJUb29sa2l0U291cmNlLmNvcHlFbGVtZW50U2l6ZVRvKHRoaXMuYXJUb29sa2l0Q29udGV4dC5hckNvbnRyb2xsZXIuY2FudmFzKVx0XG5cdFx0fVxuXHR9XG5cblx0dXBkYXRlKCkge1xuXHRcdGlmICh0aGlzLmFyVG9vbGtpdFNvdXJjZS5yZWFkeSkge1xuXHRcdFx0dGhpcy5hclRvb2xraXRDb250ZXh0LnVwZGF0ZSh0aGlzLmFyVG9vbGtpdFNvdXJjZS5kb21FbGVtZW50KTtcblx0XHR9XG5cdH1cblx0XG5cdGNyZWF0ZU1hcmtlclJvb3QocGFyZW50LCBwYXR0ZXJuVXJsKSB7XG5cdFx0Y29uc3QgbWFya2VyUm9vdCA9IG5ldyBUSFJFRS5Hcm91cCgpXG5cdFx0cGFyZW50LmFkZChtYXJrZXJSb290KVxuXG5cdFx0Y29uc3QgbWFya2VyQ29udHJvbHMgPSBuZXcgVEhSRUV4LkFyTWFya2VyQ29udHJvbHModGhpcy5hclRvb2xraXRDb250ZXh0LCBtYXJrZXJSb290LCB7XG5cdFx0XHR0eXBlOiAncGF0dGVybicsXG5cdFx0XHRwYXR0ZXJuVXJsOiBwYXR0ZXJuVXJsXG5cdFx0fSlcblx0XG5cdFx0cmV0dXJuIG1hcmtlclJvb3Rcblx0fVxufVxuIiwiZGVjbGFyZSBjb25zdCBUSFJFRTogYW55XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZW5kZXJlcihwYXJlbnRFbGVtZW50KSB7XG5cdGNvbnN0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe1xuXHRcdGFudGlhbGlhcyA6IHRydWUsXG5cdFx0YWxwaGE6IHRydWVcblx0fSlcblx0XG5cdHJlbmRlcmVyLnNldENsZWFyQ29sb3IobmV3IFRIUkVFLkNvbG9yKCdsaWdodGdyZXknKSwgMClcblx0cmVuZGVyZXIuc2V0U2l6ZSg2NDAsIDQ4MClcblx0XG5cdHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG5cdHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gJzBweCdcblx0cmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gJzBweCdcblx0XG5cdHBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudClcblxuXHRyZXR1cm4gcmVuZGVyZXJcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUdyb3VwKHBhcmVudCkge1xuXHRjb25zdCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpXG5cdHBhcmVudC5hZGQoZ3JvdXApXG5cblx0cmV0dXJuIGdyb3VwXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVQb3NpdGlvbmluZyhyb290LCBwb3NpdGlvbmluZ1VybCkge1xuXHRmZXRjaChwb3NpdGlvbmluZ1VybClcblx0XHQudGhlbigocmVzcG9uc2UpID0+IHtcblx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKClcblx0XHR9KVxuXHRcdC50aGVuKChwb3NpdGlvbmluZykgPT4ge1xuXHRcdFx0cG9zaXRpb25pbmcgPSBwb3NpdGlvbmluZyB8fCB7fVxuXHRcdFx0XG5cdFx0XHR0cmFuc2xhdGUocm9vdCwgcG9zaXRpb25pbmcudHJhbnNsYXRpb24pXG5cdFx0XHRzY2FsZShyb290LCBwb3NpdGlvbmluZy5zY2FsZSlcblx0XHRcdHJvdGF0ZShyb290LCBwb3NpdGlvbmluZy5yb3RhdGlvbilcblx0XHR9KVxuXHRcdC5jYXRjaCgoZXJyb3IpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiRXJyb3I6IFwiICsgZXJyb3IpXG5cdFx0fSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRWZWN0b3IodmVjdG9yLCBkZWZhdWx0cykge1xuXHR2ZWN0b3IgPSB2ZWN0b3IgfHwge31cblx0aWYgKHZlY3Rvci54ID09PSB1bmRlZmluZWQgfHwgdmVjdG9yLnggPT09IG51bGwpIHZlY3Rvci54ID0gZGVmYXVsdHMueFxuXHRpZiAodmVjdG9yLnkgPT09IHVuZGVmaW5lZCB8fCB2ZWN0b3IueSA9PT0gbnVsbCkgdmVjdG9yLnkgPSBkZWZhdWx0cy55XG5cdGlmICh2ZWN0b3IueiA9PT0gdW5kZWZpbmVkIHx8IHZlY3Rvci56ID09PSBudWxsKSB2ZWN0b3IueiA9IGRlZmF1bHRzLnpcblx0cmV0dXJuIHZlY3RvclxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9UaHJlZVZlY3Rvcih2ZWN0b3IpIHtcblx0cmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKHZlY3Rvci54LCB2ZWN0b3IueSwgdmVjdG9yLnopXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2xhdGUob2JqZWN0LCB2ZWN0b3IpIHtcblx0dmVjdG9yID0gZGVmYXVsdFZlY3Rvcih2ZWN0b3IsIHt4OiAwLCB5OiAwLCB6OiAwfSlcblxuXHRvYmplY3QudHJhbnNsYXRlWCh2ZWN0b3IueClcblx0b2JqZWN0LnRyYW5zbGF0ZVkodmVjdG9yLnkpXG5cdG9iamVjdC50cmFuc2xhdGVaKHZlY3Rvci56KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcm90YXRlKG9iamVjdCwgdmVjdG9yKSB7XG5cdHZlY3RvciA9IGRlZmF1bHRWZWN0b3IodmVjdG9yLCB7eDogMCwgeTogMCwgejogMH0pXG5cblx0b2JqZWN0LnJvdGF0ZVgodmVjdG9yLngpXG5cdG9iamVjdC5yb3RhdGVZKHZlY3Rvci55KVxuXHRvYmplY3Qucm90YXRlWih2ZWN0b3Iueilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNjYWxlKG9iamVjdCwgdmVjdG9yKSB7XG5cdHZlY3RvciA9IGRlZmF1bHRWZWN0b3IodmVjdG9yLCB7eDogMSwgeTogMSwgejogMX0pXG5cblx0b2JqZWN0LnNjYWxlLnggPSB2ZWN0b3IueFxuXHRvYmplY3Quc2NhbGUueSA9IHZlY3Rvci55XG5cdG9iamVjdC5zY2FsZS56ID0gdmVjdG9yLnpcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1vdmVBcnJvdyhhcnJvdywgcG9zLCBkaXIpIHtcblx0cG9zID0gZGVmYXVsdFZlY3Rvcihwb3MsIHt4OiAwLCB5OiAwLCB6OiAwfSlcblx0ZGlyID0gZGVmYXVsdFZlY3RvcihkaXIsIHt4OiAxLCB5OiAxLCB6OiAxfSlcblxuXHRjb25zdCBwb3NWZWMgPSB0b1RocmVlVmVjdG9yKHBvcylcblx0Y29uc3QgZGlyVmVjID0gdG9UaHJlZVZlY3RvcihkaXIpXG5cdGNvbnN0IGxlbmd0aCA9IGRpclZlYy5sZW5ndGgoKVxuXG5cdGlmIChsZW5ndGggPiAwKSB7XG5cdFx0YXJyb3cucG9zaXRpb24uY29weShwb3NWZWMpXG5cdFx0YXJyb3cuc2V0RGlyZWN0aW9uKGRpclZlYylcblx0XHRhcnJvdy5zZXRMZW5ndGgobGVuZ3RoLCAwLjIgKiBsZW5ndGgpXG5cdH0gZWxzZSB7XG5cdFx0YXJyb3cudmlzaWJsZSA9IGZhbHNlXG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRNb2RlbChiYXNlUGF0aCwgbW9kZWxQYXRoLCB0ZXh0dXJlUGF0aCwgY2FsbGJhY2spIHtcblx0bGV0IG10bExvYWRlciA9IG5ldyBUSFJFRS5NVExMb2FkZXIoKVxuXHRtdGxMb2FkZXIuc2V0VGV4dHVyZVBhdGgoYmFzZVBhdGgpXG5cdG10bExvYWRlci5zZXRQYXRoKGJhc2VQYXRoKVxuXHRtdGxMb2FkZXIubG9hZCh0ZXh0dXJlUGF0aCwgKG1hdGVyaWFscykgPT4ge1xuXHRcdG1hdGVyaWFscy5wcmVsb2FkKClcblxuXHRcdGxldCBvYmpMb2FkZXIgPSBuZXcgVEhSRUUuT0JKTG9hZGVyKClcblx0XHRvYmpMb2FkZXIuc2V0TWF0ZXJpYWxzKG1hdGVyaWFscylcblx0XHRvYmpMb2FkZXIuc2V0UGF0aChiYXNlUGF0aClcblx0XHRvYmpMb2FkZXIubG9hZChtb2RlbFBhdGgsIGNhbGxiYWNrLyosIG9uUHJvZ3Jlc3MsIG9uRXJyb3IgKi8pXG5cdH0pXG59XG5cbiIsImV4cG9ydCBmdW5jdGlvbiBpbml0R3VpKCk6dm9pZCB7XG4gICAgY29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzbGlkZXJcIikgYXMgSFRNTElucHV0RWxlbWVudFxuICAgIGNvbnN0IGRpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRpc3BsYXlcIilcblxuICAgIGlmKHNsaWRlcil7XG5cbiAgICAgICAgLy9pbml0IGRpc3BsYXkgd2l0aCBkZWZhdWx0IHZhbHVlXG4gICAgICAgIGlmKGRpc3BsYXkpe1xuICAgICAgICAgICAgZGlzcGxheS50ZXh0Q29udGVudCA9IHNsaWRlci52YWx1ZS50b1N0cmluZygpXG4gICAgICAgIH1cblxuICAgICAgICAvL3VwZGF0ZSBkaXNwbGF5IHdoZW4gc2xpZGVyIGNoYW5nZXNcbiAgICAgICAgc2xpZGVyLm9uaW5wdXQgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZihkaXNwbGF5KXtcbiAgICAgICAgICAgICAgICBkaXNwbGF5LnRleHRDb250ZW50ID0gc2xpZGVyLnZhbHVlLnRvU3RyaW5nKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCJkZWNsYXJlIGNvbnN0IFRIUkVFOiBhbnlcbmltcG9ydCB7IGluaXRHdWkgfSBmcm9tICcuL2d1aSdcbmltcG9ydCB7IEFyV3JhcHBlciB9IGZyb20gJy4vQXJXcmFwcGVyJ1xuaW1wb3J0IHtcblx0Y3JlYXRlUmVuZGVyZXIsXG5cdGNyZWF0ZUdyb3VwLFxuXHR1cGRhdGVQb3NpdGlvbmluZyxcblx0bG9hZE1vZGVsLFxuXHRtb3ZlQXJyb3dcbn0gZnJvbSAnLi9UaHJlZVV0aWwnXG5cbmZ1bmN0aW9uIGNyZWF0ZUFycm93Q2xvdWQocGFyZW50LCBjb3VudCwgY29sb3I/KSB7XG5cdGNvbnN0IGFycm93Q2xvdWQgPSBbXVxuXG5cdGlmIChjb2xvciA9PT0gdW5kZWZpbmVkKSBjb2xvciA9IDB4ODg0NDAwXG5cblx0Y29uc3Qgc3RhcnQgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKVxuXHRjb25zdCBkaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygxLCAxLCAxKVxuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuXHRcdGNvbnN0IGFycm93ID0gbmV3IFRIUkVFLkFycm93SGVscGVyKGRpcmVjdGlvbiwgc3RhcnQsIGRpcmVjdGlvbi5sZW5ndGgoKSwgY29sb3IpXG5cdFx0YXJyb3cudmlzaWJsZSA9IGZhbHNlXG5cblx0XHRhcnJvd0Nsb3VkLnB1c2goYXJyb3cpXG5cdFx0cGFyZW50LmFkZChhcnJvdylcblx0fVxuXG5cdHJldHVybiBhcnJvd0Nsb3VkXG59XG5cbmZ1bmN0aW9uIHJ1bih1cGRhdGVDYWxsYmFjaykge1xuXHRmdW5jdGlvbiBhbmltYXRlKCkge1xuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKVxuXHRcdFxuXHRcdHVwZGF0ZUNhbGxiYWNrKClcblxuXHRcdGFyV3JhcHBlci51cGRhdGUoKVxuXG5cdFx0cmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpXG5cdH1cblxuXHRhbmltYXRlKClcbn1cblxuY29uc3Qgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKVxuXG5jb25zdCBjYW1lcmEgPSBuZXcgVEhSRUUuQ2FtZXJhKClcbnNjZW5lLmFkZChjYW1lcmEpXG5cbmNvbnN0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHhjY2NjY2MsIDAuNSlcbnNjZW5lLmFkZChhbWJpZW50TGlnaHQpXG5cbmNvbnN0IHJlbmRlcmVyID0gY3JlYXRlUmVuZGVyZXIoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIikpXG5cbmNvbnN0IGFyV3JhcHBlciA9IG5ldyBBcldyYXBwZXIocmVuZGVyZXIsIGNhbWVyYSwgJy4uL2RhdGEvY2FtZXJhX3BhcmEuZGF0JylcbmNvbnN0IG1hcmtlclJvb3QgPSBhcldyYXBwZXIuY3JlYXRlTWFya2VyUm9vdChzY2VuZSwgJy4uL2RhdGEvaGlyby5wYXR0JylcblxuY29uc3Qgcm9vdCA9IGNyZWF0ZUdyb3VwKG1hcmtlclJvb3QpXG5cbmNvbnN0IGFycm93Q2xvdWQgPSBjcmVhdGVBcnJvd0Nsb3VkKHJvb3QsIDEwMDAwKVxuXG51cGRhdGVQb3NpdGlvbmluZyhyb290LCAnLi4vZGF0YS9wb3NpdGlvbmluZy5qc29uJylcblxubG9hZE1vZGVsKCcuLi9kYXRhL21vZGVsLycsICdrb2tpbGxlLm9iaicsICdrb2tpbGxlLm10bCcsIChrb2tpbGxlKSA9PiB7XG5cdHJvb3QuYWRkKGtva2lsbGUpXG5cblx0dXBkYXRlUG9zaXRpb25pbmcoa29raWxsZSwgJy4uL2RhdGEva29raWxsZVRyYW5zZm9ybWF0aW9uLmpzb24nKVxufSlcblxuXG5sZXQgcG9zaXRpb25zID0gW11cbmxldCBsYXN0UG9zaXRpb25zID0gcG9zaXRpb25zXG5cbnJ1bigoKSA9PiB7XG5cdGlmIChsYXN0UG9zaXRpb25zICE9PSBwb3NpdGlvbnMpIHtcblx0XHRsYXN0UG9zaXRpb25zID0gcG9zaXRpb25zXG5cblx0XHRjb25zdCBjdXJyZW50UG9zaXRpb25zID0gcG9zaXRpb25zXG5cdFx0Y29uc3QgYXJyb3dDb3VudCA9IGFycm93Q2xvdWQubGVuZ3RoXG5cdFxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyb3dDb3VudDsgaSsrKSB7XG5cdFx0XHRjb25zdCBhcnJvdyA9IGFycm93Q2xvdWRbaV1cblx0XHRcdGNvbnN0IHBvc2l0aW9uID0gY3VycmVudFBvc2l0aW9uc1tpXVxuXHRcblx0XHRcdGlmIChwb3NpdGlvbikge1xuXHRcdFx0XHRhcnJvdy52aXNpYmxlID0gdHJ1ZVxuXHRcdFx0XHRtb3ZlQXJyb3dUb1ZlY3RvcihhcnJvdywgcG9zaXRpb24pXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhcnJvdy52aXNpYmxlID0gZmFsc2Vcblx0XHRcdH1cblx0XHR9XG5cdH1cbn0pXG5cbmZ1bmN0aW9uIG1vdmVBcnJvd1RvVmVjdG9yKGFycm93LCB2ZWN0b3IpIHtcblx0bW92ZUFycm93KGFycm93LCB7XG5cdFx0eDogdmVjdG9yLngsXG5cdFx0eTogdmVjdG9yLnksXG5cdFx0ejogdmVjdG9yLnpcblx0fSwge1xuXHRcdHg6IHZlY3Rvci54VmVjLFxuXHRcdHk6IHZlY3Rvci55VmVjLFxuXHRcdHo6IHZlY3Rvci56VmVjXG5cdH0pXG59XG5cbnNldEludGVydmFsKGFzeW5jICgpID0+IHtcblx0dHJ5IHtcblx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hcmRhdGF0ZXN0LmF6dXJld2Vic2l0ZXMubmV0L2FwaS9kYXRhJylcblx0XHRwb3NpdGlvbnMgPSBhd2FpdCByZXN1bHQuanNvbigpXG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRwb3NpdGlvbnMgPSBbXVxuXG5cdFx0Y29uc29sZS5sb2coZSlcblx0fVxufSwgNTAwKVxuXG5pbml0R3VpKCkiXSwic291cmNlUm9vdCI6IiJ9