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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FyV3JhcHBlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvVGhyZWVVdGlsLnRzIiwid2VicGFjazovLy8uL3NyYy9zY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQy9FQSxNQUFhLFNBQVM7SUFLckIsWUFBWSxRQUFRLEVBQUUsTUFBTSxFQUFFLG1CQUFtQjtRQUNoRCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVE7UUFFeEIseUJBQXlCO1FBQ3pCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxNQUFNLENBQUMsZUFBZSxDQUFDO1lBQ2pELFVBQVUsRUFBRyxRQUFRO1NBQ3JCLENBQUM7UUFFRixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJ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RTtRQUVkLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ2Q7QUFDRixDQUFDLEdBQUUsR0FBRyxDQUFDIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3NjcmlwdC50c1wiKTtcbiIsImRlY2xhcmUgY29uc3QgVEhSRUU6IGFueVxuZGVjbGFyZSBjb25zdCBUSFJFRXg6IGFueVxuXG5leHBvcnQgY2xhc3MgQXJXcmFwcGVyIHtcblx0cmVuZGVyZXI6IGFueVxuXHRhclRvb2xraXRTb3VyY2U6IGFueVxuXHRhclRvb2xraXRDb250ZXh0OiBhbnlcblxuXHRjb25zdHJ1Y3RvcihyZW5kZXJlciwgY2FtZXJhLCBjYW1lcmFQYXJhbWV0ZXJzVXJsKSB7XG5cdFx0dGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyXG5cblx0XHQvLyBDcmVhdGUgQXJUb29sa2l0U291cmNlXG5cdFx0dGhpcy5hclRvb2xraXRTb3VyY2UgPSBuZXcgVEhSRUV4LkFyVG9vbGtpdFNvdXJjZSh7XG5cdFx0XHRzb3VyY2VUeXBlIDogJ3dlYmNhbSdcblx0XHR9KVxuXG5cdFx0dGhpcy5hclRvb2xraXRTb3VyY2UuaW5pdCgoKSA9PiB0aGlzLnVwZGF0ZVNpemUoKSlcblxuXG5cdFx0Ly8gQ3JlYXRlIEFyVG9vbGtpdENvbnRleHRcblx0XHR0aGlzLmFyVG9vbGtpdENvbnRleHQgPSBuZXcgVEhSRUV4LkFyVG9vbGtpdENvbnRleHQoe1xuXHRcdFx0Y2FtZXJhUGFyYW1ldGVyc1VybDogY2FtZXJhUGFyYW1ldGVyc1VybCxcblx0XHRcdGRldGVjdGlvbk1vZGU6ICdtb25vJ1xuXHRcdH0pXG5cdFx0XG5cdFx0Ly8gQ29weSBwcm9qZWN0aW9uIG1hdHJpeCB0byBjYW1lcmEgd2hlbiBpbml0aWFsaXphdGlvbiBjb21wbGV0ZVxuXHRcdHRoaXMuYXJUb29sa2l0Q29udGV4dC5pbml0KCgpID0+IHtcblx0XHRcdGNhbWVyYS5wcm9qZWN0aW9uTWF0cml4LmNvcHkodGhpcy5hclRvb2xraXRDb250ZXh0LmdldFByb2plY3Rpb25NYXRyaXgoKSlcblx0XHR9KVxuXG5cdFx0Ly8gSGFuZGxlIHJlc2l6ZSBldmVudFxuXHRcdC8vIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB0aGlzLnVwZGF0ZVNpemUoKSlcblx0fVxuXG5cdHVwZGF0ZVNpemUoKSB7XG5cdFx0dGhpcy5hclRvb2xraXRTb3VyY2Uub25SZXNpemVFbGVtZW50KClcdFxuXHRcdHRoaXMuYXJUb29sa2l0U291cmNlLmNvcHlFbGVtZW50U2l6ZVRvKHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudClcdFxuXHRcdGlmICh0aGlzLmFyVG9vbGtpdENvbnRleHQuYXJDb250cm9sbGVyKSB7XG5cdFx0XHR0aGlzLmFyVG9vbGtpdFNvdXJjZS5jb3B5RWxlbWVudFNpemVUbyh0aGlzLmFyVG9vbGtpdENvbnRleHQuYXJDb250cm9sbGVyLmNhbnZhcylcdFxuXHRcdH1cblx0fVxuXG5cdHVwZGF0ZSgpIHtcblx0XHRpZiAodGhpcy5hclRvb2xraXRTb3VyY2UucmVhZHkpIHtcblx0XHRcdHRoaXMuYXJUb29sa2l0Q29udGV4dC51cGRhdGUodGhpcy5hclRvb2xraXRTb3VyY2UuZG9tRWxlbWVudCk7XG5cdFx0fVxuXHR9XG5cdFxuXHRjcmVhdGVNYXJrZXJSb290KHBhcmVudCwgcGF0dGVyblVybCkge1xuXHRcdGNvbnN0IG1hcmtlclJvb3QgPSBuZXcgVEhSRUUuR3JvdXAoKVxuXHRcdHBhcmVudC5hZGQobWFya2VyUm9vdClcblxuXHRcdGNvbnN0IG1hcmtlckNvbnRyb2xzID0gbmV3IFRIUkVFeC5Bck1hcmtlckNvbnRyb2xzKHRoaXMuYXJUb29sa2l0Q29udGV4dCwgbWFya2VyUm9vdCwge1xuXHRcdFx0dHlwZTogJ3BhdHRlcm4nLFxuXHRcdFx0cGF0dGVyblVybDogcGF0dGVyblVybFxuXHRcdH0pXG5cdFxuXHRcdHJldHVybiBtYXJrZXJSb290XG5cdH1cbn1cbiIsImRlY2xhcmUgY29uc3QgVEhSRUU6IGFueVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVuZGVyZXIocGFyZW50RWxlbWVudCkge1xuXHRjb25zdCByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcblx0XHRhbnRpYWxpYXMgOiB0cnVlLFxuXHRcdGFscGhhOiB0cnVlXG5cdH0pXG5cdFxuXHRyZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcignbGlnaHRncmV5JyksIDApXG5cdHJlbmRlcmVyLnNldFNpemUoNjQwLCA0ODApXG5cdFxuXHRyZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xuXHRyZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnXG5cdHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUubGVmdCA9ICcwcHgnXG5cdFxuXHRwYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpXG5cblx0cmV0dXJuIHJlbmRlcmVyXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVHcm91cChwYXJlbnQpIHtcblx0Y29uc3QgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKVxuXHRwYXJlbnQuYWRkKGdyb3VwKVxuXG5cdHJldHVybiBncm91cFxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlUG9zaXRpb25pbmcocm9vdCwgcG9zaXRpb25pbmdVcmwpIHtcblx0ZmV0Y2gocG9zaXRpb25pbmdVcmwpXG5cdFx0LnRoZW4oKHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpXG5cdFx0fSlcblx0XHQudGhlbigocG9zaXRpb25pbmcpID0+IHtcblx0XHRcdHBvc2l0aW9uaW5nID0gcG9zaXRpb25pbmcgfHwge31cblx0XHRcdFxuXHRcdFx0dHJhbnNsYXRlKHJvb3QsIHBvc2l0aW9uaW5nLnRyYW5zbGF0aW9uKVxuXHRcdFx0c2NhbGUocm9vdCwgcG9zaXRpb25pbmcuc2NhbGUpXG5cdFx0XHRyb3RhdGUocm9vdCwgcG9zaXRpb25pbmcucm90YXRpb24pXG5cdFx0fSlcblx0XHQuY2F0Y2goKGVycm9yKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIkVycm9yOiBcIiArIGVycm9yKVxuXHRcdH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0VmVjdG9yKHZlY3RvciwgZGVmYXVsdHMpIHtcblx0dmVjdG9yID0gdmVjdG9yIHx8IHt9XG5cdGlmICh2ZWN0b3IueCA9PT0gdW5kZWZpbmVkIHx8IHZlY3Rvci54ID09PSBudWxsKSB2ZWN0b3IueCA9IGRlZmF1bHRzLnhcblx0aWYgKHZlY3Rvci55ID09PSB1bmRlZmluZWQgfHwgdmVjdG9yLnkgPT09IG51bGwpIHZlY3Rvci55ID0gZGVmYXVsdHMueVxuXHRpZiAodmVjdG9yLnogPT09IHVuZGVmaW5lZCB8fCB2ZWN0b3IueiA9PT0gbnVsbCkgdmVjdG9yLnogPSBkZWZhdWx0cy56XG5cdHJldHVybiB2ZWN0b3Jcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVGhyZWVWZWN0b3IodmVjdG9yKSB7XG5cdHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMyh2ZWN0b3IueCwgdmVjdG9yLnksIHZlY3Rvci56KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNsYXRlKG9iamVjdCwgdmVjdG9yKSB7XG5cdHZlY3RvciA9IGRlZmF1bHRWZWN0b3IodmVjdG9yLCB7eDogMCwgeTogMCwgejogMH0pXG5cblx0b2JqZWN0LnRyYW5zbGF0ZVgodmVjdG9yLngpXG5cdG9iamVjdC50cmFuc2xhdGVZKHZlY3Rvci55KVxuXHRvYmplY3QudHJhbnNsYXRlWih2ZWN0b3Iueilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJvdGF0ZShvYmplY3QsIHZlY3Rvcikge1xuXHR2ZWN0b3IgPSBkZWZhdWx0VmVjdG9yKHZlY3Rvciwge3g6IDAsIHk6IDAsIHo6IDB9KVxuXG5cdG9iamVjdC5yb3RhdGVYKHZlY3Rvci54KVxuXHRvYmplY3Qucm90YXRlWSh2ZWN0b3IueSlcblx0b2JqZWN0LnJvdGF0ZVoodmVjdG9yLnopXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzY2FsZShvYmplY3QsIHZlY3Rvcikge1xuXHR2ZWN0b3IgPSBkZWZhdWx0VmVjdG9yKHZlY3Rvciwge3g6IDEsIHk6IDEsIHo6IDF9KVxuXG5cdG9iamVjdC5zY2FsZS54ID0gdmVjdG9yLnhcblx0b2JqZWN0LnNjYWxlLnkgPSB2ZWN0b3IueVxuXHRvYmplY3Quc2NhbGUueiA9IHZlY3Rvci56XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtb3ZlQXJyb3coYXJyb3csIHBvcywgZGlyKSB7XG5cdHBvcyA9IGRlZmF1bHRWZWN0b3IocG9zLCB7eDogMCwgeTogMCwgejogMH0pXG5cdGRpciA9IGRlZmF1bHRWZWN0b3IoZGlyLCB7eDogMSwgeTogMSwgejogMX0pXG5cblx0Y29uc3QgcG9zVmVjID0gdG9UaHJlZVZlY3Rvcihwb3MpXG5cdGNvbnN0IGRpclZlYyA9IHRvVGhyZWVWZWN0b3IoZGlyKVxuXHRjb25zdCBsZW5ndGggPSBkaXJWZWMubGVuZ3RoKClcblxuXHRpZiAobGVuZ3RoID4gMCkge1xuXHRcdGFycm93LnBvc2l0aW9uLmNvcHkocG9zVmVjKVxuXHRcdGFycm93LnNldERpcmVjdGlvbihkaXJWZWMpXG5cdFx0YXJyb3cuc2V0TGVuZ3RoKGxlbmd0aCwgMC4yICogbGVuZ3RoKVxuXHR9IGVsc2Uge1xuXHRcdGFycm93LnZpc2libGUgPSBmYWxzZVxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkTW9kZWwoYmFzZVBhdGgsIG1vZGVsUGF0aCwgdGV4dHVyZVBhdGgsIGNhbGxiYWNrKSB7XG5cdGxldCBtdGxMb2FkZXIgPSBuZXcgVEhSRUUuTVRMTG9hZGVyKClcblx0bXRsTG9hZGVyLnNldFRleHR1cmVQYXRoKGJhc2VQYXRoKVxuXHRtdGxMb2FkZXIuc2V0UGF0aChiYXNlUGF0aClcblx0bXRsTG9hZGVyLmxvYWQodGV4dHVyZVBhdGgsIChtYXRlcmlhbHMpID0+IHtcblx0XHRtYXRlcmlhbHMucHJlbG9hZCgpXG5cblx0XHRsZXQgb2JqTG9hZGVyID0gbmV3IFRIUkVFLk9CSkxvYWRlcigpXG5cdFx0b2JqTG9hZGVyLnNldE1hdGVyaWFscyhtYXRlcmlhbHMpXG5cdFx0b2JqTG9hZGVyLnNldFBhdGgoYmFzZVBhdGgpXG5cdFx0b2JqTG9hZGVyLmxvYWQobW9kZWxQYXRoLCBjYWxsYmFjay8qLCBvblByb2dyZXNzLCBvbkVycm9yICovKVxuXHR9KVxufVxuXG4iLCJkZWNsYXJlIGNvbnN0IFRIUkVFOiBhbnlcbmltcG9ydCB7IEFyV3JhcHBlciB9IGZyb20gJy4vQXJXcmFwcGVyJ1xuaW1wb3J0IHtcblx0Y3JlYXRlUmVuZGVyZXIsXG5cdGNyZWF0ZUdyb3VwLFxuXHR1cGRhdGVQb3NpdGlvbmluZyxcblx0bG9hZE1vZGVsLFxuXHRtb3ZlQXJyb3dcbn0gZnJvbSAnLi9UaHJlZVV0aWwnXG5cbmZ1bmN0aW9uIGNyZWF0ZUFycm93Q2xvdWQocGFyZW50LCBjb3VudCwgY29sb3I/KSB7XG5cdGNvbnN0IGFycm93Q2xvdWQgPSBbXVxuXG5cdGlmIChjb2xvciA9PT0gdW5kZWZpbmVkKSBjb2xvciA9IDB4ODg0NDAwXG5cblx0Y29uc3Qgc3RhcnQgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKVxuXHRjb25zdCBkaXJlY3Rpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygxLCAxLCAxKVxuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuXHRcdGNvbnN0IGFycm93ID0gbmV3IFRIUkVFLkFycm93SGVscGVyKGRpcmVjdGlvbiwgc3RhcnQsIGRpcmVjdGlvbi5sZW5ndGgoKSwgY29sb3IpXG5cdFx0YXJyb3cudmlzaWJsZSA9IGZhbHNlXG5cblx0XHRhcnJvd0Nsb3VkLnB1c2goYXJyb3cpXG5cdFx0cGFyZW50LmFkZChhcnJvdylcblx0fVxuXG5cdHJldHVybiBhcnJvd0Nsb3VkXG59XG5cbmZ1bmN0aW9uIHJ1bih1cGRhdGVDYWxsYmFjaykge1xuXHRmdW5jdGlvbiBhbmltYXRlKCkge1xuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKVxuXHRcdFxuXHRcdHVwZGF0ZUNhbGxiYWNrKClcblxuXHRcdGFyV3JhcHBlci51cGRhdGUoKVxuXG5cdFx0cmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpXG5cdH1cblxuXHRhbmltYXRlKClcbn1cblxuY29uc3Qgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKVxuXG5jb25zdCBjYW1lcmEgPSBuZXcgVEhSRUUuQ2FtZXJhKClcbnNjZW5lLmFkZChjYW1lcmEpXG5cbmNvbnN0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHhjY2NjY2MsIDAuNSlcbnNjZW5lLmFkZChhbWJpZW50TGlnaHQpXG5cbmNvbnN0IHJlbmRlcmVyID0gY3JlYXRlUmVuZGVyZXIoZG9jdW1lbnQuYm9keSlcblxuY29uc3QgYXJXcmFwcGVyID0gbmV3IEFyV3JhcHBlcihyZW5kZXJlciwgY2FtZXJhLCAnLi4vZGF0YS9jYW1lcmFfcGFyYS5kYXQnKVxuY29uc3QgbWFya2VyUm9vdCA9IGFyV3JhcHBlci5jcmVhdGVNYXJrZXJSb290KHNjZW5lLCAnLi4vZGF0YS9oaXJvLnBhdHQnKVxuXG5jb25zdCByb290ID0gY3JlYXRlR3JvdXAobWFya2VyUm9vdClcblxuY29uc3QgYXJyb3dDbG91ZCA9IGNyZWF0ZUFycm93Q2xvdWQocm9vdCwgMTAwMDApXG5cbnVwZGF0ZVBvc2l0aW9uaW5nKHJvb3QsICcuLi9kYXRhL3Bvc2l0aW9uaW5nLmpzb24nKVxuXG5sb2FkTW9kZWwoJy4uL2RhdGEvbW9kZWwvJywgJ2tva2lsbGUub2JqJywgJ2tva2lsbGUubXRsJywgKGtva2lsbGUpID0+IHtcblx0cm9vdC5hZGQoa29raWxsZSlcblxuXHR1cGRhdGVQb3NpdGlvbmluZyhrb2tpbGxlLCAnLi4vZGF0YS9rb2tpbGxlVHJhbnNmb3JtYXRpb24uanNvbicpXG59KVxuXG5cbmxldCBwb3NpdGlvbnMgPSBbXVxubGV0IGxhc3RQb3NpdGlvbnMgPSBwb3NpdGlvbnNcblxucnVuKCgpID0+IHtcblx0aWYgKGxhc3RQb3NpdGlvbnMgIT09IHBvc2l0aW9ucykge1xuXHRcdGxhc3RQb3NpdGlvbnMgPSBwb3NpdGlvbnNcblxuXHRcdGNvbnN0IGN1cnJlbnRQb3NpdGlvbnMgPSBwb3NpdGlvbnNcblx0XHRjb25zdCBhcnJvd0NvdW50ID0gYXJyb3dDbG91ZC5sZW5ndGhcblx0XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcnJvd0NvdW50OyBpKyspIHtcblx0XHRcdGNvbnN0IGFycm93ID0gYXJyb3dDbG91ZFtpXVxuXHRcdFx0Y29uc3QgcG9zaXRpb24gPSBjdXJyZW50UG9zaXRpb25zW2ldXG5cdFxuXHRcdFx0aWYgKHBvc2l0aW9uKSB7XG5cdFx0XHRcdGFycm93LnZpc2libGUgPSB0cnVlXG5cdFx0XHRcdG1vdmVBcnJvd1RvVmVjdG9yKGFycm93LCBwb3NpdGlvbilcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFycm93LnZpc2libGUgPSBmYWxzZVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufSlcblxuZnVuY3Rpb24gbW92ZUFycm93VG9WZWN0b3IoYXJyb3csIHZlY3Rvcikge1xuXHRtb3ZlQXJyb3coYXJyb3csIHtcblx0XHR4OiB2ZWN0b3IueCxcblx0XHR5OiB2ZWN0b3IueSxcblx0XHR6OiB2ZWN0b3IuelxuXHR9LCB7XG5cdFx0eDogdmVjdG9yLnhWZWMsXG5cdFx0eTogdmVjdG9yLnlWZWMsXG5cdFx0ejogdmVjdG9yLnpWZWNcblx0fSlcbn1cblxuc2V0SW50ZXJ2YWwoYXN5bmMgKCkgPT4ge1xuXHR0cnkge1xuXHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCdodHRwczovL2FyZGF0YXRlc3QuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpL2RhdGEnKVxuXHRcdHBvc2l0aW9ucyA9IGF3YWl0IHJlc3VsdC5qc29uKClcblx0fSBjYXRjaCAoZSkge1xuXHRcdHBvc2l0aW9ucyA9IFtdXG5cblx0XHRjb25zb2xlLmxvZyhlKVxuXHR9XG59LCA1MDApXG4iXSwic291cmNlUm9vdCI6IiJ9