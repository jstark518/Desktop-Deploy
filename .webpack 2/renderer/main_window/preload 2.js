/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/renderer/preload.js":
/*!*********************************!*\
  !*** ./src/renderer/preload.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const {\n  contextBridge,\n  ipcRenderer\n} = __webpack_require__(/*! electron */ \"electron\");\n\ncontextBridge.exposeInMainWorld(\"repo\", {\n  list: () => ipcRenderer.invoke(\"repos.list\"),\n  clone: (url, node) => ipcRenderer.invoke(\"repo.clone\", url, node)\n});\n/*\nnode:  \n*///# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcmVuZGVyZXIvcHJlbG9hZC5qcy5qcyIsIm1hcHBpbmdzIjoiQUFBQSxNQUFNO0VBQUNBLGFBQUQ7RUFBZ0JDO0FBQWhCLElBQStCQyxtQkFBTyxDQUFDLDBCQUFELENBQTVDOztBQUVBRixhQUFhLENBQUNHLGlCQUFkLENBQWdDLE1BQWhDLEVBQXdDO0VBQ3BDQyxJQUFJLEVBQUUsTUFBTUgsV0FBVyxDQUFDSSxNQUFaLENBQW1CLFlBQW5CLENBRHdCO0VBRXBDQyxLQUFLLEVBQUUsQ0FBQ0MsR0FBRCxFQUFNQyxJQUFOLEtBQWVQLFdBQVcsQ0FBQ0ksTUFBWixDQUFtQixZQUFuQixFQUFpQ0UsR0FBakMsRUFBc0NDLElBQXRDO0FBRmMsQ0FBeEM7QUFJQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kZXNrdG9wLWRlcGxveS8uL3NyYy9yZW5kZXJlci9wcmVsb2FkLmpzPzhjYjAiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qge2NvbnRleHRCcmlkZ2UsIGlwY1JlbmRlcmVyfSA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTtcblxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZChcInJlcG9cIiwge1xuICAgIGxpc3Q6ICgpID0+IGlwY1JlbmRlcmVyLmludm9rZShcInJlcG9zLmxpc3RcIiksXG4gICAgY2xvbmU6ICh1cmwsIG5vZGUpID0+IGlwY1JlbmRlcmVyLmludm9rZShcInJlcG8uY2xvbmVcIiwgdXJsLCBub2RlKVxufSk7XG4vKlxubm9kZTogIFxuKi8iXSwibmFtZXMiOlsiY29udGV4dEJyaWRnZSIsImlwY1JlbmRlcmVyIiwicmVxdWlyZSIsImV4cG9zZUluTWFpbldvcmxkIiwibGlzdCIsImludm9rZSIsImNsb25lIiwidXJsIiwibm9kZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/renderer/preload.js\n");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/renderer/preload.js");
/******/ 	
/******/ })()
;