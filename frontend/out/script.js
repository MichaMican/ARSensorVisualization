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
const renderer = ThreeUtil_1.createRenderer(document.body);
const arWrapper = new ArWrapper_1.ArWrapper(renderer, camera, 'data/camera_para.dat');
const markerRoot = arWrapper.createMarkerRoot(scene, 'data/hiro.patt');
const root = ThreeUtil_1.createGroup(markerRoot);
const arrowCloud = createArrowCloud(root, 10000);
ThreeUtil_1.updatePositioning(root, 'data/positioning.json');
ThreeUtil_1.loadModel('data/model/', 'kokille.obj', 'kokille.mtl', (kokille) => {
    root.add(kokille);
    ThreeUtil_1.updatePositioning(kokille, 'data/kokilleTransformation.json');
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FyV3JhcHBlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVGhyZWVVdGlsLnRzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQy9FQSxNQUFhLFNBQVM7SUFLckIsWUFBWSxRQUFRLEVBQUUsTUFBTSxFQUFFLG1CQUFtQjtRQUNoRCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVE7UUFFeEIseUJBQXlCO1FBQ3pCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxNQUFNLENBQUMsZUFBZSxDQUFDO1lBQ2pELFVBQVUsRUFBRyxRQUFRO1NBQ3JCLENBQUM7UUFFRixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFHbEQsMEJBQTBCO1FBQzFCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztZQUNuRCxtQkFBbUIsRUFBRSxtQkFBbUI7WUFDeEMsYUFBYSxFQUFFLE1BQU07U0FDckIsQ0FBQztRQUVGLGdFQUFnRTtRQUNoRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUMvQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzFFLENBQUMsQ0FBQztRQUVGLHNCQUFzQjtRQUN0Qiw2REFBNkQ7SUFDOUQsQ0FBQztJQUVELFVBQVU7UUFDVCxJQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRTtRQUN0QyxJQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO1FBQ2hFLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRTtZQUN2QyxJQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1NBQ2pGO0lBQ0YsQ0FBQztJQUVELE1BQU07UUFDTCxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFO1lBQy9CLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM5RDtJQUNGLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsVUFBVTtRQUNsQyxNQUFNLFVBQVUsR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7UUFDcEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7UUFFdEIsTUFBTSxjQUFjLEdBQUcsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLFVBQVUsRUFBRTtZQUNyRixJQUFJLEVBQUUsU0FBUztZQUNmLFVBQVUsRUFBRSxVQUFVO1NBQ3RCLENBQUM7UUFFRixPQUFPLFVBQVU7SUFDbEIsQ0FBQztDQUNEO0FBeERELDhCQXdEQzs7Ozs7Ozs7Ozs7Ozs7OztBQ3pERCxTQUFnQixjQUFjLENBQUMsYUFBYTtJQUMzQyxNQUFNLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUM7UUFDeEMsU0FBUyxFQUFHLElBQUk7UUFDaEIsS0FBSyxFQUFFLElBQUk7S0FDWCxDQUFDO0lBRUYsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztJQUUxQixRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVTtJQUMvQyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSztJQUNyQyxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSztJQUV0QyxhQUFhLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7SUFFOUMsT0FBTyxRQUFRO0FBQ2hCLENBQUM7QUFoQkQsd0NBZ0JDO0FBRUQsU0FBZ0IsV0FBVyxDQUFDLE1BQU07SUFDakMsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFO0lBQy9CLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO0lBRWpCLE9BQU8sS0FBSztBQUNiLENBQUM7QUFMRCxrQ0FLQztBQUVELFNBQWdCLGlCQUFpQixDQUFDLElBQUksRUFBRSxjQUFjO0lBQ3JELEtBQUssQ0FBQyxjQUFjLENBQUM7U0FDbkIsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7UUFDbEIsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFO0lBQ3ZCLENBQUMsQ0FBQztTQUNELElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO1FBQ3JCLFdBQVcsR0FBRyxXQUFXLElBQUksRUFBRTtRQUUvQixTQUFTLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxXQUFXLENBQUM7UUFDeEMsS0FBSyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLFFBQVEsQ0FBQztJQUNuQyxDQUFDLENBQUM7U0FDRCxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtRQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDL0IsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQWZELDhDQWVDO0FBRUQsU0FBZ0IsYUFBYSxDQUFDLE1BQU0sRUFBRSxRQUFRO0lBQzdDLE1BQU0sR0FBRyxNQUFNLElBQUksRUFBRTtJQUNyQixJQUFJLE1BQU0sQ0FBQyxDQUFDLEtBQUssU0FBUyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEtBQUssSUFBSTtRQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUM7SUFDdEUsSUFBSSxNQUFNLENBQUMsQ0FBQyxLQUFLLFNBQVMsSUFBSSxNQUFNLENBQUMsQ0FBQyxLQUFLLElBQUk7UUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDO0lBQ3RFLElBQUksTUFBTSxDQUFDLENBQUMsS0FBSyxTQUFTLElBQUksTUFBTSxDQUFDLENBQUMsS0FBSyxJQUFJO1FBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztJQUN0RSxPQUFPLE1BQU07QUFDZCxDQUFDO0FBTkQsc0NBTUM7QUFFRCxTQUFnQixhQUFhLENBQUMsTUFBTTtJQUNuQyxPQUFPLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBRkQsc0NBRUM7QUFFRCxTQUFnQixTQUFTLENBQUMsTUFBTSxFQUFFLE1BQU07SUFDdkMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDO0lBRWxELE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUMzQixNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDM0IsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzVCLENBQUM7QUFORCw4QkFNQztBQUVELFNBQWdCLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTTtJQUNwQyxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUM7SUFFbEQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN4QixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDekIsQ0FBQztBQU5ELHdCQU1DO0FBRUQsU0FBZ0IsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNO0lBQ25DLE1BQU0sR0FBRyxhQUFhLENBQUMsTUFBTSxFQUFFLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQztJQUVsRCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztJQUN6QixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztJQUN6QixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztBQUMxQixDQUFDO0FBTkQsc0JBTUM7QUFFRCxTQUFnQixTQUFTLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHO0lBQ3hDLEdBQUcsR0FBRyxhQUFhLENBQUMsR0FBRyxFQUFFLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQztJQUM1QyxHQUFHLEdBQUcsYUFBYSxDQUFDLEdBQUcsRUFBRSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUM7SUFFNUMsTUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQztJQUNqQyxNQUFNLE1BQU0sR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDO0lBQ2pDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUU7SUFFOUIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ2YsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNCLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO1FBQzFCLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxNQUFNLENBQUM7S0FDckM7U0FBTTtRQUNOLEtBQUssQ0FBQyxPQUFPLEdBQUcsS0FBSztLQUNyQjtBQUNGLENBQUM7QUFmRCw4QkFlQztBQUVELFNBQWdCLFNBQVMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxRQUFRO0lBQ25FLElBQUksU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRTtJQUNyQyxTQUFTLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQztJQUNsQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztJQUMzQixTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLFNBQVMsRUFBRSxFQUFFO1FBQ3pDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7UUFFbkIsSUFBSSxTQUFTLEdBQUcsSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFO1FBQ3JDLFNBQVMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDO1FBQ2pDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQzNCLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsMkJBQTBCLENBQUM7SUFDOUQsQ0FBQyxDQUFDO0FBQ0gsQ0FBQztBQVpELDhCQVlDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1R0QsaUZBQXVDO0FBQ3ZDLGlGQU1vQjtBQUVwQixTQUFTLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBTTtJQUM5QyxNQUFNLFVBQVUsR0FBRyxFQUFFO0lBRXJCLElBQUksS0FBSyxLQUFLLFNBQVM7UUFBRSxLQUFLLEdBQUcsUUFBUTtJQUV6QyxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDeEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRTVDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDL0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUssQ0FBQztRQUNoRixLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUs7UUFFckIsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7S0FDakI7SUFFRCxPQUFPLFVBQVU7QUFDbEIsQ0FBQztBQUVELFNBQVMsR0FBRyxDQUFDLGNBQWM7SUFDMUIsU0FBUyxPQUFPO1FBQ2YscUJBQXFCLENBQUMsT0FBTyxDQUFDO1FBRTlCLGNBQWMsRUFBRTtRQUVoQixTQUFTLENBQUMsTUFBTSxFQUFFO1FBRWxCLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztJQUMvQixDQUFDO0lBRUQsT0FBTyxFQUFFO0FBQ1YsQ0FBQztBQUVELE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRTtBQUUvQixNQUFNLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDakMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7QUFFakIsTUFBTSxZQUFZLEdBQUcsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUM7QUFDMUQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7QUFFdkIsTUFBTSxRQUFRLEdBQUcsMEJBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBRTlDLE1BQU0sU0FBUyxHQUFHLElBQUkscUJBQVMsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLHNCQUFzQixDQUFDO0FBQ3pFLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUM7QUFFdEUsTUFBTSxJQUFJLEdBQUcsdUJBQVcsQ0FBQyxVQUFVLENBQUM7QUFFcEMsTUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztBQUVoRCw2QkFBaUIsQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLENBQUM7QUFFaEQscUJBQVMsQ0FBQyxhQUFhLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFO0lBQ2xFLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO0lBRWpCLDZCQUFpQixDQUFDLE9BQU8sRUFBRSxpQ0FBaUMsQ0FBQztBQUM5RCxDQUFDLENBQUM7QUFHRixJQUFJLFNBQVMsR0FBRyxFQUFFO0FBQ2xCLElBQUksYUFBYSxHQUFHLFNBQVM7QUFFN0IsR0FBRyxDQUFDLEdBQUcsRUFBRTtJQUNSLElBQUksYUFBYSxLQUFLLFNBQVMsRUFBRTtRQUNoQyxhQUFhLEdBQUcsU0FBUztRQUV6QixNQUFNLGdCQUFnQixHQUFHLFNBQVM7UUFDbEMsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLE1BQU07UUFFcEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNwQyxNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzNCLE1BQU0sUUFBUSxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUVwQyxJQUFJLFFBQVEsRUFBRTtnQkFDYixLQUFLLENBQUMsT0FBTyxHQUFHLElBQUk7Z0JBQ3BCLGlCQUFpQixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUM7YUFDbEM7aUJBQU07Z0JBQ04sS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLO2FBQ3JCO1NBQ0Q7S0FDRDtBQUNGLENBQUMsQ0FBQztBQUVGLFNBQVMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLE1BQU07SUFDdkMscUJBQVMsQ0FBQyxLQUFLLEVBQUU7UUFDaEIsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ1gsRUFBRTtRQUNGLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSTtRQUNkLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSTtRQUNkLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSTtLQUNkLENBQUM7QUFDSCxDQUFDO0FBRUQsV0FBVyxDQUFDLEdBQVMsRUFBRTtJQUN0QixJQUFJO1FBQ0gsTUFBTSxNQUFNLEdBQUcsTUFBTSxLQUFLLENBQUMsK0NBQStDLENBQUM7UUFDM0UsU0FBUyxHQUFHLE1BQU0sTUFBTSxDQUFDLElBQUksRUFBRTtLQUMvQjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1gsU0FBUyxHQUFHLEVBQUU7UUFFZCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztLQUNkO0FBQ0YsQ0FBQyxHQUFFLEdBQUcsQ0FBQyIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9zY3JpcHQudHNcIik7XG4iLCJkZWNsYXJlIGNvbnN0IFRIUkVFOiBhbnlcbmRlY2xhcmUgY29uc3QgVEhSRUV4OiBhbnlcblxuZXhwb3J0IGNsYXNzIEFyV3JhcHBlciB7XG5cdHJlbmRlcmVyOiBhbnlcblx0YXJUb29sa2l0U291cmNlOiBhbnlcblx0YXJUb29sa2l0Q29udGV4dDogYW55XG5cblx0Y29uc3RydWN0b3IocmVuZGVyZXIsIGNhbWVyYSwgY2FtZXJhUGFyYW1ldGVyc1VybCkge1xuXHRcdHRoaXMucmVuZGVyZXIgPSByZW5kZXJlclxuXG5cdFx0Ly8gQ3JlYXRlIEFyVG9vbGtpdFNvdXJjZVxuXHRcdHRoaXMuYXJUb29sa2l0U291cmNlID0gbmV3IFRIUkVFeC5BclRvb2xraXRTb3VyY2Uoe1xuXHRcdFx0c291cmNlVHlwZSA6ICd3ZWJjYW0nXG5cdFx0fSlcblxuXHRcdHRoaXMuYXJUb29sa2l0U291cmNlLmluaXQoKCkgPT4gdGhpcy51cGRhdGVTaXplKCkpXG5cblxuXHRcdC8vIENyZWF0ZSBBclRvb2xraXRDb250ZXh0XG5cdFx0dGhpcy5hclRvb2xraXRDb250ZXh0ID0gbmV3IFRIUkVFeC5BclRvb2xraXRDb250ZXh0KHtcblx0XHRcdGNhbWVyYVBhcmFtZXRlcnNVcmw6IGNhbWVyYVBhcmFtZXRlcnNVcmwsXG5cdFx0XHRkZXRlY3Rpb25Nb2RlOiAnbW9ubydcblx0XHR9KVxuXHRcdFxuXHRcdC8vIENvcHkgcHJvamVjdGlvbiBtYXRyaXggdG8gY2FtZXJhIHdoZW4gaW5pdGlhbGl6YXRpb24gY29tcGxldGVcblx0XHR0aGlzLmFyVG9vbGtpdENvbnRleHQuaW5pdCgoKSA9PiB7XG5cdFx0XHRjYW1lcmEucHJvamVjdGlvbk1hdHJpeC5jb3B5KHRoaXMuYXJUb29sa2l0Q29udGV4dC5nZXRQcm9qZWN0aW9uTWF0cml4KCkpXG5cdFx0fSlcblxuXHRcdC8vIEhhbmRsZSByZXNpemUgZXZlbnRcblx0XHQvLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4gdGhpcy51cGRhdGVTaXplKCkpXG5cdH1cblxuXHR1cGRhdGVTaXplKCkge1xuXHRcdHRoaXMuYXJUb29sa2l0U291cmNlLm9uUmVzaXplRWxlbWVudCgpXHRcblx0XHR0aGlzLmFyVG9vbGtpdFNvdXJjZS5jb3B5RWxlbWVudFNpemVUbyh0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQpXHRcblx0XHRpZiAodGhpcy5hclRvb2xraXRDb250ZXh0LmFyQ29udHJvbGxlcikge1xuXHRcdFx0dGhpcy5hclRvb2xraXRTb3VyY2UuY29weUVsZW1lbnRTaXplVG8odGhpcy5hclRvb2xraXRDb250ZXh0LmFyQ29udHJvbGxlci5jYW52YXMpXHRcblx0XHR9XG5cdH1cblxuXHR1cGRhdGUoKSB7XG5cdFx0aWYgKHRoaXMuYXJUb29sa2l0U291cmNlLnJlYWR5KSB7XG5cdFx0XHR0aGlzLmFyVG9vbGtpdENvbnRleHQudXBkYXRlKHRoaXMuYXJUb29sa2l0U291cmNlLmRvbUVsZW1lbnQpO1xuXHRcdH1cblx0fVxuXHRcblx0Y3JlYXRlTWFya2VyUm9vdChwYXJlbnQsIHBhdHRlcm5VcmwpIHtcblx0XHRjb25zdCBtYXJrZXJSb290ID0gbmV3IFRIUkVFLkdyb3VwKClcblx0XHRwYXJlbnQuYWRkKG1hcmtlclJvb3QpXG5cblx0XHRjb25zdCBtYXJrZXJDb250cm9scyA9IG5ldyBUSFJFRXguQXJNYXJrZXJDb250cm9scyh0aGlzLmFyVG9vbGtpdENvbnRleHQsIG1hcmtlclJvb3QsIHtcblx0XHRcdHR5cGU6ICdwYXR0ZXJuJyxcblx0XHRcdHBhdHRlcm5Vcmw6IHBhdHRlcm5Vcmxcblx0XHR9KVxuXHRcblx0XHRyZXR1cm4gbWFya2VyUm9vdFxuXHR9XG59XG4iLCJkZWNsYXJlIGNvbnN0IFRIUkVFOiBhbnlcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJlbmRlcmVyKHBhcmVudEVsZW1lbnQpIHtcblx0Y29uc3QgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XG5cdFx0YW50aWFsaWFzIDogdHJ1ZSxcblx0XHRhbHBoYTogdHJ1ZVxuXHR9KVxuXHRcblx0cmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoJ2xpZ2h0Z3JleScpLCAwKVxuXHRyZW5kZXJlci5zZXRTaXplKDY0MCwgNDgwKVxuXHRcblx0cmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSdcblx0cmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS50b3AgPSAnMHB4J1xuXHRyZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLmxlZnQgPSAnMHB4J1xuXHRcblx0cGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KVxuXG5cdHJldHVybiByZW5kZXJlclxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlR3JvdXAocGFyZW50KSB7XG5cdGNvbnN0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKClcblx0cGFyZW50LmFkZChncm91cClcblxuXHRyZXR1cm4gZ3JvdXBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVBvc2l0aW9uaW5nKHJvb3QsIHBvc2l0aW9uaW5nVXJsKSB7XG5cdGZldGNoKHBvc2l0aW9uaW5nVXJsKVxuXHRcdC50aGVuKChyZXNwb25zZSkgPT4ge1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKVxuXHRcdH0pXG5cdFx0LnRoZW4oKHBvc2l0aW9uaW5nKSA9PiB7XG5cdFx0XHRwb3NpdGlvbmluZyA9IHBvc2l0aW9uaW5nIHx8IHt9XG5cdFx0XHRcblx0XHRcdHRyYW5zbGF0ZShyb290LCBwb3NpdGlvbmluZy50cmFuc2xhdGlvbilcblx0XHRcdHNjYWxlKHJvb3QsIHBvc2l0aW9uaW5nLnNjYWxlKVxuXHRcdFx0cm90YXRlKHJvb3QsIHBvc2l0aW9uaW5nLnJvdGF0aW9uKVxuXHRcdH0pXG5cdFx0LmNhdGNoKChlcnJvcikgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJFcnJvcjogXCIgKyBlcnJvcilcblx0XHR9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdFZlY3Rvcih2ZWN0b3IsIGRlZmF1bHRzKSB7XG5cdHZlY3RvciA9IHZlY3RvciB8fCB7fVxuXHRpZiAodmVjdG9yLnggPT09IHVuZGVmaW5lZCB8fCB2ZWN0b3IueCA9PT0gbnVsbCkgdmVjdG9yLnggPSBkZWZhdWx0cy54XG5cdGlmICh2ZWN0b3IueSA9PT0gdW5kZWZpbmVkIHx8IHZlY3Rvci55ID09PSBudWxsKSB2ZWN0b3IueSA9IGRlZmF1bHRzLnlcblx0aWYgKHZlY3Rvci56ID09PSB1bmRlZmluZWQgfHwgdmVjdG9yLnogPT09IG51bGwpIHZlY3Rvci56ID0gZGVmYXVsdHMuelxuXHRyZXR1cm4gdmVjdG9yXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1RocmVlVmVjdG9yKHZlY3Rvcikge1xuXHRyZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjModmVjdG9yLngsIHZlY3Rvci55LCB2ZWN0b3Iueilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zbGF0ZShvYmplY3QsIHZlY3Rvcikge1xuXHR2ZWN0b3IgPSBkZWZhdWx0VmVjdG9yKHZlY3Rvciwge3g6IDAsIHk6IDAsIHo6IDB9KVxuXG5cdG9iamVjdC50cmFuc2xhdGVYKHZlY3Rvci54KVxuXHRvYmplY3QudHJhbnNsYXRlWSh2ZWN0b3IueSlcblx0b2JqZWN0LnRyYW5zbGF0ZVoodmVjdG9yLnopXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByb3RhdGUob2JqZWN0LCB2ZWN0b3IpIHtcblx0dmVjdG9yID0gZGVmYXVsdFZlY3Rvcih2ZWN0b3IsIHt4OiAwLCB5OiAwLCB6OiAwfSlcblxuXHRvYmplY3Qucm90YXRlWCh2ZWN0b3IueClcblx0b2JqZWN0LnJvdGF0ZVkodmVjdG9yLnkpXG5cdG9iamVjdC5yb3RhdGVaKHZlY3Rvci56KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2NhbGUob2JqZWN0LCB2ZWN0b3IpIHtcblx0dmVjdG9yID0gZGVmYXVsdFZlY3Rvcih2ZWN0b3IsIHt4OiAxLCB5OiAxLCB6OiAxfSlcblxuXHRvYmplY3Quc2NhbGUueCA9IHZlY3Rvci54XG5cdG9iamVjdC5zY2FsZS55ID0gdmVjdG9yLnlcblx0b2JqZWN0LnNjYWxlLnogPSB2ZWN0b3IuelxufVxuXG5leHBvcnQgZnVuY3Rpb24gbW92ZUFycm93KGFycm93LCBwb3MsIGRpcikge1xuXHRwb3MgPSBkZWZhdWx0VmVjdG9yKHBvcywge3g6IDAsIHk6IDAsIHo6IDB9KVxuXHRkaXIgPSBkZWZhdWx0VmVjdG9yKGRpciwge3g6IDEsIHk6IDEsIHo6IDF9KVxuXG5cdGNvbnN0IHBvc1ZlYyA9IHRvVGhyZWVWZWN0b3IocG9zKVxuXHRjb25zdCBkaXJWZWMgPSB0b1RocmVlVmVjdG9yKGRpcilcblx0Y29uc3QgbGVuZ3RoID0gZGlyVmVjLmxlbmd0aCgpXG5cblx0aWYgKGxlbmd0aCA+IDApIHtcblx0XHRhcnJvdy5wb3NpdGlvbi5jb3B5KHBvc1ZlYylcblx0XHRhcnJvdy5zZXREaXJlY3Rpb24oZGlyVmVjKVxuXHRcdGFycm93LnNldExlbmd0aChsZW5ndGgsIDAuMiAqIGxlbmd0aClcblx0fSBlbHNlIHtcblx0XHRhcnJvdy52aXNpYmxlID0gZmFsc2Vcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9hZE1vZGVsKGJhc2VQYXRoLCBtb2RlbFBhdGgsIHRleHR1cmVQYXRoLCBjYWxsYmFjaykge1xuXHRsZXQgbXRsTG9hZGVyID0gbmV3IFRIUkVFLk1UTExvYWRlcigpXG5cdG10bExvYWRlci5zZXRUZXh0dXJlUGF0aChiYXNlUGF0aClcblx0bXRsTG9hZGVyLnNldFBhdGgoYmFzZVBhdGgpXG5cdG10bExvYWRlci5sb2FkKHRleHR1cmVQYXRoLCAobWF0ZXJpYWxzKSA9PiB7XG5cdFx0bWF0ZXJpYWxzLnByZWxvYWQoKVxuXG5cdFx0bGV0IG9iakxvYWRlciA9IG5ldyBUSFJFRS5PQkpMb2FkZXIoKVxuXHRcdG9iakxvYWRlci5zZXRNYXRlcmlhbHMobWF0ZXJpYWxzKVxuXHRcdG9iakxvYWRlci5zZXRQYXRoKGJhc2VQYXRoKVxuXHRcdG9iakxvYWRlci5sb2FkKG1vZGVsUGF0aCwgY2FsbGJhY2svKiwgb25Qcm9ncmVzcywgb25FcnJvciAqLylcblx0fSlcbn1cblxuIiwiZGVjbGFyZSBjb25zdCBUSFJFRTogYW55XG5pbXBvcnQgeyBBcldyYXBwZXIgfSBmcm9tICcuL0FyV3JhcHBlcidcbmltcG9ydCB7XG5cdGNyZWF0ZVJlbmRlcmVyLFxuXHRjcmVhdGVHcm91cCxcblx0dXBkYXRlUG9zaXRpb25pbmcsXG5cdGxvYWRNb2RlbCxcblx0bW92ZUFycm93XG59IGZyb20gJy4vVGhyZWVVdGlsJ1xuXG5mdW5jdGlvbiBjcmVhdGVBcnJvd0Nsb3VkKHBhcmVudCwgY291bnQsIGNvbG9yPykge1xuXHRjb25zdCBhcnJvd0Nsb3VkID0gW11cblxuXHRpZiAoY29sb3IgPT09IHVuZGVmaW5lZCkgY29sb3IgPSAweDg4NDQwMFxuXG5cdGNvbnN0IHN0YXJ0ID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMClcblx0Y29uc3QgZGlyZWN0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoMSwgMSwgMSlcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcblx0XHRjb25zdCBhcnJvdyA9IG5ldyBUSFJFRS5BcnJvd0hlbHBlcihkaXJlY3Rpb24sIHN0YXJ0LCBkaXJlY3Rpb24ubGVuZ3RoKCksIGNvbG9yKVxuXHRcdGFycm93LnZpc2libGUgPSBmYWxzZVxuXG5cdFx0YXJyb3dDbG91ZC5wdXNoKGFycm93KVxuXHRcdHBhcmVudC5hZGQoYXJyb3cpXG5cdH1cblxuXHRyZXR1cm4gYXJyb3dDbG91ZFxufVxuXG5mdW5jdGlvbiBydW4odXBkYXRlQ2FsbGJhY2spIHtcblx0ZnVuY3Rpb24gYW5pbWF0ZSgpIHtcblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSlcblx0XHRcblx0XHR1cGRhdGVDYWxsYmFjaygpXG5cblx0XHRhcldyYXBwZXIudXBkYXRlKClcblxuXHRcdHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKVxuXHR9XG5cblx0YW5pbWF0ZSgpXG59XG5cbmNvbnN0IHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKClcblxuY29uc3QgY2FtZXJhID0gbmV3IFRIUkVFLkNhbWVyYSgpXG5zY2VuZS5hZGQoY2FtZXJhKVxuXG5jb25zdCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4Y2NjY2NjLCAwLjUpXG5zY2VuZS5hZGQoYW1iaWVudExpZ2h0KVxuXG5jb25zdCByZW5kZXJlciA9IGNyZWF0ZVJlbmRlcmVyKGRvY3VtZW50LmJvZHkpXG5cbmNvbnN0IGFyV3JhcHBlciA9IG5ldyBBcldyYXBwZXIocmVuZGVyZXIsIGNhbWVyYSwgJ2RhdGEvY2FtZXJhX3BhcmEuZGF0JylcbmNvbnN0IG1hcmtlclJvb3QgPSBhcldyYXBwZXIuY3JlYXRlTWFya2VyUm9vdChzY2VuZSwgJ2RhdGEvaGlyby5wYXR0JylcblxuY29uc3Qgcm9vdCA9IGNyZWF0ZUdyb3VwKG1hcmtlclJvb3QpXG5cbmNvbnN0IGFycm93Q2xvdWQgPSBjcmVhdGVBcnJvd0Nsb3VkKHJvb3QsIDEwMDAwKVxuXG51cGRhdGVQb3NpdGlvbmluZyhyb290LCAnZGF0YS9wb3NpdGlvbmluZy5qc29uJylcblxubG9hZE1vZGVsKCdkYXRhL21vZGVsLycsICdrb2tpbGxlLm9iaicsICdrb2tpbGxlLm10bCcsIChrb2tpbGxlKSA9PiB7XG5cdHJvb3QuYWRkKGtva2lsbGUpXG5cblx0dXBkYXRlUG9zaXRpb25pbmcoa29raWxsZSwgJ2RhdGEva29raWxsZVRyYW5zZm9ybWF0aW9uLmpzb24nKVxufSlcblxuXG5sZXQgcG9zaXRpb25zID0gW11cbmxldCBsYXN0UG9zaXRpb25zID0gcG9zaXRpb25zXG5cbnJ1bigoKSA9PiB7XG5cdGlmIChsYXN0UG9zaXRpb25zICE9PSBwb3NpdGlvbnMpIHtcblx0XHRsYXN0UG9zaXRpb25zID0gcG9zaXRpb25zXG5cblx0XHRjb25zdCBjdXJyZW50UG9zaXRpb25zID0gcG9zaXRpb25zXG5cdFx0Y29uc3QgYXJyb3dDb3VudCA9IGFycm93Q2xvdWQubGVuZ3RoXG5cdFxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyb3dDb3VudDsgaSsrKSB7XG5cdFx0XHRjb25zdCBhcnJvdyA9IGFycm93Q2xvdWRbaV1cblx0XHRcdGNvbnN0IHBvc2l0aW9uID0gY3VycmVudFBvc2l0aW9uc1tpXVxuXHRcblx0XHRcdGlmIChwb3NpdGlvbikge1xuXHRcdFx0XHRhcnJvdy52aXNpYmxlID0gdHJ1ZVxuXHRcdFx0XHRtb3ZlQXJyb3dUb1ZlY3RvcihhcnJvdywgcG9zaXRpb24pXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhcnJvdy52aXNpYmxlID0gZmFsc2Vcblx0XHRcdH1cblx0XHR9XG5cdH1cbn0pXG5cbmZ1bmN0aW9uIG1vdmVBcnJvd1RvVmVjdG9yKGFycm93LCB2ZWN0b3IpIHtcblx0bW92ZUFycm93KGFycm93LCB7XG5cdFx0eDogdmVjdG9yLngsXG5cdFx0eTogdmVjdG9yLnksXG5cdFx0ejogdmVjdG9yLnpcblx0fSwge1xuXHRcdHg6IHZlY3Rvci54VmVjLFxuXHRcdHk6IHZlY3Rvci55VmVjLFxuXHRcdHo6IHZlY3Rvci56VmVjXG5cdH0pXG59XG5cbnNldEludGVydmFsKGFzeW5jICgpID0+IHtcblx0dHJ5IHtcblx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9hcmRhdGF0ZXN0LmF6dXJld2Vic2l0ZXMubmV0L2FwaS9kYXRhJylcblx0XHRwb3NpdGlvbnMgPSBhd2FpdCByZXN1bHQuanNvbigpXG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRwb3NpdGlvbnMgPSBbXVxuXG5cdFx0Y29uc29sZS5sb2coZSlcblx0fVxufSwgNTAwKVxuIl0sInNvdXJjZVJvb3QiOiIifQ==