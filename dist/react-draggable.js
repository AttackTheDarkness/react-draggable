(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom"], factory);
	else if(typeof exports === 'object')
		exports["ReactDraggable"] = factory(require("react"), require("react-dom"));
	else
		root["ReactDraggable"] = factory(root["React"], root["ReactDOM"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(1);
	module.exports.DraggableCore = __webpack_require__(10);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(3);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _classnames = __webpack_require__(4);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	var _objectAssign = __webpack_require__(5);
	
	var _objectAssign2 = _interopRequireDefault(_objectAssign);
	
	var _utilsDomFns = __webpack_require__(6);
	
	var _utilsPositionFns = __webpack_require__(9);
	
	var _utilsShims = __webpack_require__(7);
	
	var _DraggableCore = __webpack_require__(10);
	
	var _DraggableCore2 = _interopRequireDefault(_DraggableCore);
	
	var _utilsLog = __webpack_require__(11);
	
	var _utilsLog2 = _interopRequireDefault(_utilsLog);
	
	var _utilsScrollManager = __webpack_require__(12);
	
	var _utilsScrollManager2 = _interopRequireDefault(_utilsScrollManager);
	
	function createUIEvent(node, position, state) {
	  var pageX = position.pageX;
	  var pageY = position.pageY;
	
	  var offsetX = pageX - state.startPageX + state.scrollOffsetX;
	  var offsetY = pageY - state.startPageY + state.scrollOffsetY;
	
	  return {
	    node: node,
	    position: {
	      left: offsetX,
	      top: offsetY
	    },
	    deltaX: offsetX - state.lastOffsetX,
	    deltaY: offsetY - state.lastOffsetY
	  };
	}
	
	//
	// Define <Draggable>
	//
	
	var Draggable = (function (_React$Component) {
	  _inherits(Draggable, _React$Component);
	
	  function Draggable() {
	    var _this = this;
	
	    _classCallCheck(this, Draggable);
	
	    _get(Object.getPrototypeOf(Draggable.prototype), 'constructor', this).apply(this, arguments);
	
	    this.state = {
	      dragging: false,
	
	      // Current transform x and y.
	      offsetX: this.props.start.x,
	      offsetY: this.props.start.y,
	
	      // Offset due to the current drag.
	      dragX: 0,
	      dragY: 0,
	
	      // Can only determine if SVG after mounting
	      isElementSVG: false
	    };
	
	    this.cleanupScrollManager = function () {
	      if (_this.state.scrollManager) {
	        _this.state.scrollManager.destroy();
	      }
	    };
	
	    this.onDragStart = function (e, coreEvent) {
	      (0, _utilsLog2['default'])('Draggable: onDragStart: ', coreEvent.position);
	
	      var _coreEvent$position = coreEvent.position;
	      var pageX = _coreEvent$position.pageX;
	      var pageY = _coreEvent$position.pageY;
	
	      var state = { dragging: true, startPageX: pageX, startPageY: pageY, lastPageX: pageX, lastPageY: pageY, lastOffsetX: 0, lastOffsetY: 0, scrollOffsetX: 0, scrollOffsetY: 0 };
	
	      // Short-circuit if user's callback killed it.
	      var shouldStart = _this.props.onStart(e, createUIEvent(_reactDom2['default'].findDOMNode(_this), coreEvent.position, state));
	      // Kills start event on core as well, so move handlers are never bound.
	      if (shouldStart === false) return false;
	
	      _this.cleanupScrollManager(); // better safe than sorry
	      state.scrollManager = new _utilsScrollManager2['default']({ draggable: _this, onScroll: _this.handleScroll, scrollThreshold: _this.props.scrollThreshold });
	
	      _this.setState(state);
	    };
	
	    this.onMove = function (e, position, state) {
	      state = state || _this.state;
	      var uiEvent = createUIEvent(_reactDom2['default'].findDOMNode(_this), position, state);
	
	      var dragX = uiEvent.position.left,
	          dragY = uiEvent.position.top;
	
	      var offsetX = state.offsetX + dragX,
	          offsetY = state.offsetY + dragY;
	
	      // Snap to grid if prop has been provided
	      if (Array.isArray(_this.props.grid)) {
	        var _snapToGrid = (0, _utilsPositionFns.snapToGrid)(_this.props.grid, offsetX, offsetY);
	
	        var _snapToGrid2 = _slicedToArray(_snapToGrid, 2);
	
	        offsetX = _snapToGrid2[0];
	        offsetY = _snapToGrid2[1];
	      }
	
	      // Keep within bounds.
	      if (_this.props.bounds) {
	        var _getBoundPosition = (0, _utilsPositionFns.getBoundPosition)(_this, offsetX, offsetY);
	
	        var _getBoundPosition2 = _slicedToArray(_getBoundPosition, 2);
	
	        offsetX = _getBoundPosition2[0];
	        offsetY = _getBoundPosition2[1];
	      }
	
	      dragX = offsetX - state.offsetX;
	      dragY = offsetY - state.offsetY;
	
	      var newState = {
	        lastOffsetX: uiEvent.position.left,
	        lastOffsetY: uiEvent.position.top,
	        dragX: dragX,
	        dragY: dragY,
	        lastPageX: position.pageX,
	        lastPageY: position.pageY
	      };
	
	      // Short-circuit if user's callback killed it.
	      var shouldUpdate = _this.props.onDrag(e, uiEvent);
	      if (shouldUpdate === false) return false;
	
	      _this.setState(newState);
	    };
	
	    this.handleScroll = function (scrollInfo) {
	      var state = _this.state;
	
	      var position = { pageX: _this.state.lastPageX, pageY: _this.state.lastPageY };
	
	      if (scrollInfo.isPage) {
	        // If the scrolling element is the page, the pointer has "moved" in relation
	        // to the page.
	        position.pageX = _this.state.lastPageX + scrollInfo.delta.x;
	        position.pageY = _this.state.lastPageY + scrollInfo.delta.y;
	      } else {
	        // If the scrolling element is a child of the page, update the scrollOffset.
	        var newState = {
	          scrollOffsetX: _this.state.scrollOffsetX + scrollInfo.delta.x,
	          scrollOffsetY: _this.state.scrollOffsetY + scrollInfo.delta.y
	        };
	
	        _this.setState(newState);
	        // setState is async, so let's create an updated state that we can pass through
	        state = (0, _objectAssign2['default'])({}, _this.state, newState);
	      }
	
	      _this.onMove(scrollInfo.event, position, state);
	    };
	
	    this.onDrag = function (e, coreEvent) {
	      (0, _utilsLog2['default'])('Draggable: onDrag: ', JSON.stringify(coreEvent.position));
	
	      _this.state.scrollManager.checkScroll(coreEvent.position);
	      _this.onMove(e, coreEvent.position);
	    };
	
	    this.onDragStop = function (e, coreEvent) {
	      // Short-circuit if user's callback killed it.
	      var shouldStop = _this.props.onStop(e, createUIEvent(_reactDom2['default'].findDOMNode(_this), coreEvent.position, _this.state));
	      if (shouldStop === false) return false;
	
	      (0, _utilsLog2['default'])('Draggable: onDragStop: ', coreEvent.position);
	
	      _this.state.scrollManager.destroy();
	
	      _this.setState({
	        scrollManager: null,
	        dragging: false,
	        offsetX: _this.state.offsetX + _this.state.dragX,
	        offsetY: _this.state.offsetY + _this.state.dragY,
	        dragX: 0,
	        dragY: 0
	      });
	    };
	  }
	
	  _createClass(Draggable, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      // Check to see if the element passed is an instanceof SVGElement
	      if (_reactDom2['default'].findDOMNode(this) instanceof SVGElement) {
	        this.setState({ isElementSVG: true });
	      }
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      // Clean up the scroll manager if we're destroyed mid-drag.
	      this.cleanupScrollManager();
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      // If we're modifying the start location, offset our state by the difference.
	      if (nextProps.start.x !== this.props.start.x || nextProps.start.y !== this.props.start.y) {
	        this.setState({
	          offsetX: this.state.offsetX + nextProps.start.x - this.props.start.x,
	          offsetY: this.state.offsetY + nextProps.start.y - this.props.start.y
	        });
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var style = undefined,
	          svgTransform = null;
	      // Add a CSS transform to move the element around. This allows us to move the element around
	      // without worrying about whether or not it is relatively or absolutely positioned.
	      // If the item you are dragging already has a transform set, wrap it in a <span> so <Draggable>
	      // has a clean slate.
	      style = (0, _utilsDomFns.createTransform)({
	        // Set left if horizontal drag is enabled
	        x: (0, _utilsPositionFns.canDragX)(this) ? this.state.offsetX + this.state.dragX : this.props.start.x,
	
	        // Set top if vertical drag is enabled
	        y: (0, _utilsPositionFns.canDragY)(this) ? this.state.offsetY + this.state.dragY : this.props.start.y
	      }, this.state.isElementSVG);
	
	      // If this element was SVG, we use the `transform` attribute.
	      if (this.state.isElementSVG) {
	        svgTransform = style;
	        style = {};
	      }
	
	      // zIndex option
	      if (this.state.dragging && !isNaN(this.props.zIndex)) {
	        style.zIndex = this.props.zIndex;
	      }
	
	      // Mark with class while dragging
	      var className = (0, _classnames2['default'])(this.props.children.props.className || '', 'react-draggable', {
	        'react-draggable-dragging': this.state.dragging,
	        'react-draggable-dragged': this.state.dragged
	      });
	
	      // Reuse the child provided
	      // This makes it flexible to use whatever element is wanted (div, ul, etc)
	      return _react2['default'].createElement(
	        _DraggableCore2['default'],
	        _extends({}, this.props, { onStart: this.onDragStart, onDrag: this.onDrag, onStop: this.onDragStop }),
	        _react2['default'].cloneElement(_react2['default'].Children.only(this.props.children), {
	          className: className,
	          style: (0, _objectAssign2['default'])({}, this.props.children.props.style, style),
	          transform: svgTransform
	        })
	      );
	    }
	  }], [{
	    key: 'displayName',
	    value: 'Draggable',
	    enumerable: true
	  }, {
	    key: 'propTypes',
	    value: (0, _objectAssign2['default'])({}, _DraggableCore2['default'].propTypes, {
	      /**
	       * `axis` determines which axis the draggable can move.
	       *
	       * 'both' allows movement horizontally and vertically.
	       * 'x' limits movement to horizontal axis.
	       * 'y' limits movement to vertical axis.
	       *
	       * Defaults to 'both'.
	       */
	      axis: _react.PropTypes.oneOf(['both', 'x', 'y']),
	
	      /**
	       * `bounds` determines the range of movement available to the element.
	       * Available values are:
	       *
	       * 'parent' restricts movement within the Draggable's parent node.
	       *
	       * Alternatively, pass an object with the following properties, all of which are optional:
	       *
	       * {left: LEFT_BOUND, right: RIGHT_BOUND, bottom: BOTTOM_BOUND, top: TOP_BOUND}
	       *
	       * All values are in px.
	       *
	       * Example:
	       *
	       * ```jsx
	       *   let App = React.createClass({
	       *       render: function () {
	       *         return (
	       *            <Draggable bounds={{right: 300, bottom: 300}}>
	       *              <div>Content</div>
	       *           </Draggable>
	       *         );
	       *       }
	       *   });
	       * ```
	       */
	      bounds: _react.PropTypes.oneOfType([_react.PropTypes.shape({
	        left: _react.PropTypes.Number,
	        right: _react.PropTypes.Number,
	        top: _react.PropTypes.Number,
	        bottom: _react.PropTypes.Number
	      }), _react.PropTypes.oneOf(['parent', false])]),
	
	      /**
	       * `grid` specifies the x and y that dragging should snap to.
	       *
	       * Example:
	       *
	       * ```jsx
	       *   let App = React.createClass({
	       *       render: function () {
	       *           return (
	       *               <Draggable grid={[25, 25]}>
	       *                   <div>I snap to a 25 x 25 grid</div>
	       *               </Draggable>
	       *           );
	       *       }
	       *   });
	       * ```
	       */
	      grid: _react.PropTypes.arrayOf(_react.PropTypes.number),
	
	      /**
	       * `start` specifies the x and y that the dragged item should start at
	       *
	       * Example:
	       *
	       * ```jsx
	       *      let App = React.createClass({
	       *          render: function () {
	       *              return (
	       *                  <Draggable start={{x: 25, y: 25}}>
	       *                      <div>I start with transformX: 25px and transformY: 25px;</div>
	       *                  </Draggable>
	       *              );
	       *          }
	       *      });
	       * ```
	       */
	      start: _react.PropTypes.shape({
	        x: _react.PropTypes.number,
	        y: _react.PropTypes.number
	      }),
	
	      /**
	       * `zIndex` specifies the zIndex to use while dragging.
	       *
	       * Example:
	       *
	       * ```jsx
	       *   let App = React.createClass({
	       *       render: function () {
	       *           return (
	       *               <Draggable zIndex={100}>
	       *                   <div>I have a zIndex</div>
	       *               </Draggable>
	       *           );
	       *       }
	       *   });
	       * ```
	       */
	      zIndex: _react.PropTypes.number,
	
	      /**
	       * `scrollThreshold` specifies how close the user needs to drag from the edge of
	       * the body / scrollParent before scrolling starts. Value is in px.
	       * 0 or negative values will disable the autoscrolling.
	       * Default is 40.
	       *
	       * Example:
	       *
	       * ```jsx
	       *   let App = React.createClass({
	       *       render: function () {
	       *           return (
	       *               <Draggable scrollThreshold={100}>
	       *                   <div>Drag me close to an edge</div>
	       *               </Draggable>
	       *           );
	       *       }
	       *   });
	       * ```
	       */
	      scrollThreshold: _react.PropTypes.number,
	
	      /**
	       * These properties should be defined on the child, not here.
	       */
	      className: _utilsShims.dontSetMe,
	      style: _utilsShims.dontSetMe,
	      transform: _utilsShims.dontSetMe
	    }),
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: (0, _objectAssign2['default'])({}, _DraggableCore2['default'].defaultProps, {
	      axis: 'both',
	      bounds: false,
	      start: { x: 0, y: 0 },
	      zIndex: NaN,
	      scrollThreshold: 40
	    }),
	    enumerable: true
	  }]);
	
	  return Draggable;
	})(_react2['default'].Component);
	
	exports['default'] = Draggable;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2016 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	/* global define */
	
	(function () {
		'use strict';
	
		var hasOwn = {}.hasOwnProperty;
	
		function classNames () {
			var classes = [];
	
			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;
	
				var argType = typeof arg;
	
				if (argType === 'string' || argType === 'number') {
					classes.push(arg);
				} else if (Array.isArray(arg)) {
					classes.push(classNames.apply(null, arg));
				} else if (argType === 'object') {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				}
			}
	
			return classes.join(' ');
		}
	
		if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		} else if (true) {
			// register as 'classnames', consistent with npm package name
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.classNames = classNames;
		}
	}());


/***/ },
/* 5 */
/***/ function(module, exports) {

	/* eslint-disable no-unused-vars */
	'use strict';
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;
	
	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}
	
		return Object(val);
	}
	
	module.exports = Object.assign || function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;
	
		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);
	
			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}
	
			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}
	
		return to;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.matchesSelector = matchesSelector;
	exports.addEvent = addEvent;
	exports.removeEvent = removeEvent;
	exports.outerHeight = outerHeight;
	exports.outerWidth = outerWidth;
	exports.innerHeight = innerHeight;
	exports.innerWidth = innerWidth;
	exports.createTransform = createTransform;
	exports.createCSSTransform = createCSSTransform;
	exports.createSVGTransform = createSVGTransform;
	exports.styleHacks = styleHacks;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _shims = __webpack_require__(7);
	
	var _getPrefix = __webpack_require__(8);
	
	var _getPrefix2 = _interopRequireDefault(_getPrefix);
	
	var _objectAssign = __webpack_require__(5);
	
	var _objectAssign2 = _interopRequireDefault(_objectAssign);
	
	var matchesSelectorFunc = '';
	
	function matchesSelector(el, selector) {
	  if (!(el instanceof Node)) throw new TypeError('Value of argument \'el\' violates contract, expected Node got ' + (el === null ? 'null' : el instanceof Object && el.constructor ? el.constructor.name : typeof el));
	  if (typeof selector !== 'string') throw new TypeError('Value of argument \'selector\' violates contract, expected string got ' + (selector === null ? 'null' : selector instanceof Object && selector.constructor ? selector.constructor.name : typeof selector));
	
	  if (!matchesSelectorFunc) {
	    matchesSelectorFunc = (0, _shims.findInArray)(['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'], function (method) {
	      return (0, _shims.isFunction)(el[method]);
	    });
	  }
	
	  return el[matchesSelectorFunc].call(el, selector);
	}
	
	function addEvent(el, event, handler) {
	  if (typeof event !== 'string') throw new TypeError('Value of argument \'event\' violates contract, expected string got ' + (event === null ? 'null' : event instanceof Object && event.constructor ? event.constructor.name : typeof event));
	  if (typeof handler !== 'function') throw new TypeError('Value of argument \'handler\' violates contract, expected function got ' + (handler === null ? 'null' : handler instanceof Object && handler.constructor ? handler.constructor.name : typeof handler));
	
	  if (!el) {
	    return;
	  }
	  if (el.attachEvent) {
	    el.attachEvent('on' + event, handler);
	  } else if (el.addEventListener) {
	    el.addEventListener(event, handler, true);
	  } else {
	    el['on' + event] = handler;
	  }
	}
	
	function removeEvent(el, event, handler) {
	  if (typeof event !== 'string') throw new TypeError('Value of argument \'event\' violates contract, expected string got ' + (event === null ? 'null' : event instanceof Object && event.constructor ? event.constructor.name : typeof event));
	  if (typeof handler !== 'function') throw new TypeError('Value of argument \'handler\' violates contract, expected function got ' + (handler === null ? 'null' : handler instanceof Object && handler.constructor ? handler.constructor.name : typeof handler));
	
	  if (!el) {
	    return;
	  }
	  if (el.detachEvent) {
	    el.detachEvent('on' + event, handler);
	  } else if (el.removeEventListener) {
	    el.removeEventListener(event, handler, true);
	  } else {
	    el['on' + event] = null;
	  }
	}
	
	function outerHeight(node) {
	  if (!(node instanceof Node)) throw new TypeError('Value of argument \'node\' violates contract, expected Node got ' + (node === null ? 'null' : node instanceof Object && node.constructor ? node.constructor.name : typeof node));
	
	  // This is deliberately excluding margin for our calculations, since we are using
	  // offsetTop which is including margin. See getBoundPosition
	  var height = node.clientHeight;
	  var computedStyle = window.getComputedStyle(node);
	  height += (0, _shims.int)(computedStyle.borderTopWidth);
	  height += (0, _shims.int)(computedStyle.borderBottomWidth);
	  return height;
	}
	
	function outerWidth(node) {
	  if (!(node instanceof Node)) throw new TypeError('Value of argument \'node\' violates contract, expected Node got ' + (node === null ? 'null' : node instanceof Object && node.constructor ? node.constructor.name : typeof node));
	
	  // This is deliberately excluding margin for our calculations, since we are using
	  // offsetLeft which is including margin. See getBoundPosition
	  var width = node.clientWidth;
	  var computedStyle = window.getComputedStyle(node);
	  width += (0, _shims.int)(computedStyle.borderLeftWidth);
	  width += (0, _shims.int)(computedStyle.borderRightWidth);
	  return width;
	}
	
	function innerHeight(node) {
	  if (!(node instanceof Node)) throw new TypeError('Value of argument \'node\' violates contract, expected Node got ' + (node === null ? 'null' : node instanceof Object && node.constructor ? node.constructor.name : typeof node));
	
	  var height = node.clientHeight;
	  var computedStyle = window.getComputedStyle(node);
	  height -= (0, _shims.int)(computedStyle.paddingTop);
	  height -= (0, _shims.int)(computedStyle.paddingBottom);
	  return height;
	}
	
	function innerWidth(node) {
	  if (!(node instanceof Node)) throw new TypeError('Value of argument \'node\' violates contract, expected Node got ' + (node === null ? 'null' : node instanceof Object && node.constructor ? node.constructor.name : typeof node));
	
	  var width = node.clientWidth;
	  var computedStyle = window.getComputedStyle(node);
	  width -= (0, _shims.int)(computedStyle.paddingLeft);
	  width -= (0, _shims.int)(computedStyle.paddingRight);
	  return width;
	}
	
	function createTransform(position, isSVG) {
	  if (typeof position !== 'object') throw new TypeError('Value of argument \'position\' violates contract, expected object got ' + (position === null ? 'null' : position instanceof Object && position.constructor ? position.constructor.name : typeof position));
	  if (isSVG != null && typeof isSVG !== 'boolean') throw new TypeError('Value of argument \'isSVG\' violates contract, expected null or boolean got ' + (isSVG === null ? 'null' : isSVG instanceof Object && isSVG.constructor ? isSVG.constructor.name : typeof isSVG));
	
	  if (isSVG) return createSVGTransform(position);
	  return createCSSTransform(position);
	}
	
	function createCSSTransform(_ref) {
	  var x = _ref.x;
	  var y = _ref.y;
	  return (function () {
	    if ({ x: x, y: y } === null || typeof { x: x, y: y } !== 'object' || typeof { x: x, y: y }.x !== 'number' || typeof { x: x, y: y }.y !== 'number') throw new TypeError('Value of argument \'undefined\' violates contract, expected Object with properties x and y got ' + ({ x: x, y: y } === null ? 'null' : { x: x, y: y } instanceof Object && { x: x, y: y }.constructor ? { x: x, y: y }.constructor.name : typeof { x: x, y: y }));
	
	    // Replace unitless items with px
	    var out = { transform: 'translate(' + x + 'px,' + y + 'px)' };
	    // Add single prefixed property as well
	    if (_getPrefix2['default']) {
	      out[_getPrefix2['default'] + 'Transform'] = out.transform;
	    }
	    return out;
	  })();
	}
	
	function createSVGTransform(_ref2) {
	  var x = _ref2.x;
	  var y = _ref2.y;
	  return (function () {
	    if ({ x: x, y: y } === null || typeof { x: x, y: y } !== 'object' || typeof { x: x, y: y }.x !== 'number' || typeof { x: x, y: y }.y !== 'number') throw new TypeError('Value of argument \'undefined\' violates contract, expected Object with properties x and y got ' + ({ x: x, y: y } === null ? 'null' : { x: x, y: y } instanceof Object && { x: x, y: y }.constructor ? { x: x, y: y }.constructor.name : typeof { x: x, y: y }));
	
	    return 'translate(' + x + ',' + y + ')';
	  })();
	}
	
	function styleHacks() {
	  var childStyle = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  // Workaround IE pointer events; see #51
	  // https://github.com/mzabriskie/react-draggable/issues/51#issuecomment-103488278
	  var touchHacks = {
	    touchAction: 'none'
	  };
	
	  return (0, _objectAssign2['default'])(touchHacks, childStyle);
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	// @credits https://gist.github.com/rogozhnikoff/a43cfed27c41e4e68cdc
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.findInArray = findInArray;
	exports.isFunction = isFunction;
	exports.isNum = isNum;
	exports.int = int;
	exports.dontSetMe = dontSetMe;
	
	function findInArray(array, callback) {
	  for (var i = 0, _length = array.length; i < _length; i++) {
	    if (callback.apply(callback, [array[i], i, array])) return array[i];
	  }
	}
	
	function isFunction(func) {
	  return typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]';
	}
	
	function isNum(num) {
	  return typeof num === 'number' && !isNaN(num);
	}
	
	function int(a) {
	  return parseInt(a, 10);
	}
	
	function dontSetMe(props, propName, componentName) {
	  if (props[propName]) {
	    throw new Error('Invalid prop ' + propName + ' passed to ' + componentName + ' - do not set this, set it on the child.');
	  }
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	exports['default'] = (function () {
	  // Checking specifically for 'window.document' is for pseudo-browser server-side
	  // environments that define 'window' as the global context.
	  // E.g. React-rails (see https://github.com/reactjs/react-rails/pull/84)
	  if (typeof window === 'undefined' || typeof window.document === 'undefined') return '';
	
	  // Thanks David Walsh
	  var styles = window.getComputedStyle(document.documentElement, ''),
	      pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || styles.OLink === '' && ['', 'o'])[1];
	  // 'ms' is not titlecased
	  if (pre === undefined || pre === null) return '';
	  if (pre === 'ms') return pre;
	  if (pre === undefined || pre === null) return '';
	  return pre.slice(0, 1).toUpperCase() + pre.slice(1);
	})();
	
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.getBoundPosition = getBoundPosition;
	exports.snapToGrid = snapToGrid;
	exports.canDragX = canDragX;
	exports.canDragY = canDragY;
	exports.getControlPosition = getControlPosition;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _shims = __webpack_require__(7);
	
	var _reactDom = __webpack_require__(3);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _domFns = __webpack_require__(6);
	
	function getBoundPosition(draggable, offsetX, offsetY) {
	  // If no bounds, short-circuit and move on
	  if (!draggable.props.bounds) return [offsetX, offsetY];
	
	  var bounds = JSON.parse(JSON.stringify(draggable.props.bounds));
	  var node = _reactDom2['default'].findDOMNode(draggable);
	  var parent = node.parentNode;
	
	  if (bounds === 'parent') {
	    var nodeStyle = window.getComputedStyle(node);
	    var parentStyle = window.getComputedStyle(parent);
	    // Compute bounds. This is a pain with padding and offsets but this gets it exactly right.
	    bounds = {
	      left: -node.offsetLeft + (0, _shims.int)(parentStyle.paddingLeft) + (0, _shims.int)(nodeStyle.borderLeftWidth) + (0, _shims.int)(nodeStyle.marginLeft),
	      top: -node.offsetTop + (0, _shims.int)(parentStyle.paddingTop) + (0, _shims.int)(nodeStyle.borderTopWidth) + (0, _shims.int)(nodeStyle.marginTop),
	      right: (0, _domFns.innerWidth)(parent) - (0, _domFns.outerWidth)(node) - node.offsetLeft,
	      bottom: (0, _domFns.innerHeight)(parent) - (0, _domFns.outerHeight)(node) - node.offsetTop
	    };
	  }
	
	  // Keep x and y below right and bottom limits...
	  if ((0, _shims.isNum)(bounds.right)) offsetX = Math.min(offsetX, bounds.right);
	  if ((0, _shims.isNum)(bounds.bottom)) offsetY = Math.min(offsetY, bounds.bottom);
	
	  // But above left and top limits.
	  if ((0, _shims.isNum)(bounds.left)) offsetX = Math.max(offsetX, bounds.left);
	  if ((0, _shims.isNum)(bounds.top)) offsetY = Math.max(offsetY, bounds.top);
	
	  return [offsetX, offsetY];
	}
	
	function snapToGrid(grid, pendingX, pendingY) {
	  var x = Math.round(pendingX / grid[0]) * grid[0];
	  var y = Math.round(pendingY / grid[1]) * grid[1];
	  return [x, y];
	}
	
	function canDragX(draggable) {
	  return draggable.props.axis === 'both' || draggable.props.axis === 'x';
	}
	
	function canDragY(draggable) {
	  return draggable.props.axis === 'both' || draggable.props.axis === 'y';
	}
	
	// Get {clientX/Y, pageX/Y} positions from event.
	
	function getControlPosition(e) {
	  // Android Chrome (as of v. 47, anyway) gives bogus values for clientX/Y when the
	  // viewport is zoomed. So, instead, we use the pageX/Y coordinates and adjust for
	  // scrolling, which seems reliable cross-platform.
	  // Of course, because nothing can ever be easy, old versions of IE don't have *any*
	  // values for pageX/Y... so we calculate those in the opposite direction.
	  var position = e.targetTouches && e.targetTouches[0] || e;
	  var pageX = position.pageX;
	  var pageY = position.pageY;
	  var pageXOffset = window.pageXOffset;
	  var pageYOffset = window.pageYOffset;
	
	  if (pageX === undefined) {
	    pageX = position.clientX + pageXOffset;
	    pageY = position.clientY + pageYOffset;
	  }
	
	  return {
	    pageX: pageX,
	    pageY: pageY,
	    clientX: pageX - pageXOffset,
	    clientY: pageY - pageYOffset
	  };
	}
	
	;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(3);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _utilsDomFns = __webpack_require__(6);
	
	var _utilsPositionFns = __webpack_require__(9);
	
	var _utilsShims = __webpack_require__(7);
	
	var _utilsLog = __webpack_require__(11);
	
	var _utilsLog2 = _interopRequireDefault(_utilsLog);
	
	// Simple abstraction for dragging events names.
	var eventsFor = {
	  touch: {
	    start: 'touchstart',
	    move: 'touchmove',
	    stop: 'touchend'
	  },
	  mouse: {
	    start: 'mousedown',
	    move: 'mousemove',
	    stop: 'mouseup'
	  }
	};
	
	//
	// Define <DraggableCore>.
	//
	// <DraggableCore> listens to mouse/touch events and calls out into props.onStart,
	// props.onDrag and props.onStop whenever a drag starts, moves, or stops, respectively.
	// <DraggableCore> deals in position values relative to the viewport (clientX/Y) and
	// document (pageX/Y); consume whichever you prefer, but using pageX/Y makes dealing
	// with document scrolling much easier.
	//
	
	var DraggableCore = (function (_React$Component) {
	  _inherits(DraggableCore, _React$Component);
	
	  _createClass(DraggableCore, null, [{
	    key: 'displayName',
	    value: 'DraggableCore',
	    enumerable: true
	  }, {
	    key: 'propTypes',
	    value: {
	      /**
	       * `allowAnyClick` allows dragging using any mouse button.
	       * By default, we only accept the left button.
	       *
	       * Defaults to `false`.
	       */
	      allowAnyClick: _react.PropTypes.bool,
	
	      /**
	       * `disabled`, if true, stops the <Draggable> from dragging. All handlers,
	       * with the exception of `onMouseDown`, will not fire.
	       *
	       * Example:
	       *
	       * ```jsx
	       *   let App = React.createClass({
	       *       render: function () {
	       *           return (
	       *               <Draggable disabled={true}>
	       *                   <div>I can't be dragged</div>
	       *               </Draggable>
	       *           );
	       *       }
	       *   });
	       * ```
	       */
	      disabled: _react.PropTypes.bool,
	
	      /**
	       * `handle` specifies a selector to be used as the handle that initiates drag.
	       *
	       * Example:
	       *
	       * ```jsx
	       *   let App = React.createClass({
	       *       render: function () {
	       *         return (
	       *            <Draggable handle=".handle">
	       *              <div>
	       *                  <div className="handle">Click me to drag</div>
	       *                  <div>This is some other content</div>
	       *              </div>
	       *           </Draggable>
	       *         );
	       *       }
	       *   });
	       * ```
	       */
	      handle: _react.PropTypes.string,
	
	      /**
	       * `cancel` specifies a selector to be used to prevent drag initialization.
	       *
	       * Example:
	       *
	       * ```jsx
	       *   let App = React.createClass({
	       *       render: function () {
	       *           return(
	       *               <Draggable cancel=".cancel">
	       *                   <div>
	       *                     <div className="cancel">You can't drag from here</div>
	       *            <div>Dragging here works fine</div>
	       *                   </div>
	       *               </Draggable>
	       *           );
	       *       }
	       *   });
	       * ```
	       */
	      cancel: _react.PropTypes.string,
	
	      /**
	       * Called when dragging starts.
	       * If this function returns the boolean false, dragging will be canceled.
	       *
	       * Example:
	       *
	       * ```js
	       *  function (event, ui) {}
	       * ```
	       *
	       * `event` is the Event that was triggered.
	       * `ui` is an object:
	       *
	       * ```js
	       *  {
	       *    position: {top: 0, left: 0}
	       *  }
	       * ```
	       */
	      onStart: _react.PropTypes.func,
	
	      /**
	       * Called while dragging.
	       * If this function returns the boolean false, dragging will be canceled.
	       *
	       * Example:
	       *
	       * ```js
	       *  function (event, ui) {}
	       * ```
	       *
	       * `event` is the Event that was triggered.
	       * `ui` is an object:
	       *
	       * ```js
	       *  {
	       *    position: {top: 0, left: 0}
	       *  }
	       * ```
	       */
	      onDrag: _react.PropTypes.func,
	
	      /**
	       * Called when dragging stops.
	       *
	       * Example:
	       *
	       * ```js
	       *  function (event, ui) {}
	       * ```
	       *
	       * `event` is the Event that was triggered.
	       * `ui` is an object:
	       *
	       * ```js
	       *  {
	       *    position: {top: 0, left: 0}
	       *  }
	       * ```
	       */
	      onStop: _react.PropTypes.func,
	
	      /**
	       * A workaround option which can be passed if onMouseDown needs to be accessed,
	       * since it'll always be blocked (due to that there's internal use of onMouseDown)
	       */
	      onMouseDown: _react.PropTypes.func,
	
	      /**
	       * These properties should be defined on the child, not here.
	       */
	      className: _utilsShims.dontSetMe,
	      style: _utilsShims.dontSetMe,
	      transform: _utilsShims.dontSetMe
	    },
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      allowAnyClick: false, // by default only accept left click
	      cancel: null,
	      disabled: false,
	      handle: null,
	      transform: null,
	      eatDragEvents: true,
	      onStart: function onStart() {},
	      onDrag: function onDrag() {},
	      onStop: function onStop() {},
	      onMouseDown: function onMouseDown() {}
	    },
	    enumerable: true
	  }]);
	
	  function DraggableCore(props) {
	    var _this = this;
	
	    _classCallCheck(this, DraggableCore);
	
	    _get(Object.getPrototypeOf(DraggableCore.prototype), 'constructor', this).call(this, props);
	    this.state = {
	      dragging: false
	    };
	
	    this.createCoreEvent = function (position) {
	      var clientX = position.clientX;
	      var clientY = position.clientY;
	      var pageX = position.pageX;
	      var pageY = position.pageY;
	
	      return {
	        node: _reactDom2['default'].findDOMNode(_this),
	        position: {
	          clientX: clientX, clientY: clientY,
	          pageX: pageX, pageY: pageY
	        }
	      };
	    };
	
	    this.eatDragEvent = function (e) {
	      // Prevent the default behavior, unless the consumer's told us explicitly not to.
	      // This prevents undesirable behavior like selecting text (whilst using the mouse) or
	      // spurious scrolling (on a touch device).
	      _this.props.eatDragEvents && e && e.preventDefault && e.preventDefault();
	    };
	
	    this.handleDragStart = function (e, dragType) {
	      if (_this.state.dragging) return;
	
	      var dragEventFor = eventsFor[dragType];
	
	      // Make it possible to attach event handlers on top of this one.
	      _this.props.onMouseDown(e);
	
	      // Only accept left-clicks.
	      if (!_this.props.allowAnyClick && typeof e.button === 'number' && e.button !== 0) return false;
	
	      // Short circuit if handle or cancel prop was provided and selector doesn't match.
	      if (_this.props.disabled || _this.props.handle && !(0, _utilsDomFns.matchesSelector)(e.target, _this.props.handle) || _this.props.cancel && (0, _utilsDomFns.matchesSelector)(e.target, _this.props.cancel)) {
	        return;
	      }
	
	      // Create an event object with all the data parents need to make a decision here.
	      var coreEvent = _this.createCoreEvent((0, _utilsPositionFns.getControlPosition)(e));
	
	      (0, _utilsLog2['default'])('DraggableCore: handleDragStart: ', coreEvent.position);
	
	      // Call event handler. If it returns explicit false, cancel.
	      var shouldUpdate = _this.props.onStart(e, coreEvent);
	      if (shouldUpdate === false) return;
	
	      // Set touch identifier in component state if this is a touch event. This allows us to
	      // distinguish between individual touches on multitouch screens by identifying which
	      // touchpoint was set to this element.
	      if (e.targetTouches) {
	        _this.setState({ touchIdentifier: e.targetTouches[0].identifier });
	      }
	
	      _this.eatDragEvent(e);
	
	      // Initiate dragging. Set the current x and y as offsets
	      // so we know how much we've moved during the drag. This allows us
	      // to drag elements around even if they have been moved, without issue.
	      _this.setState({
	        dragging: dragType
	      });
	
	      // Add events to the document directly so we catch when the user's mouse/touch moves outside of
	      // this element. We use different events depending on whether or not we have detected that this
	      // is a touch-capable device.
	      (0, _utilsDomFns.addEvent)(document, dragEventFor.move, _this.handleDrag);
	      (0, _utilsDomFns.addEvent)(document, dragEventFor.stop, _this.handleDragStop);
	    };
	
	    this.handleDrag = function (e) {
	      if (!_this.state.dragging) return;
	
	      // Return if this is a touch event, but not the correct one for this element
	      if (e.targetTouches && e.targetTouches[0].identifier !== _this.state.touchIdentifier) return;
	
	      _this.eatDragEvent(e);
	
	      var coreEvent = _this.createCoreEvent((0, _utilsPositionFns.getControlPosition)(e));
	
	      (0, _utilsLog2['default'])('DraggableCore: handleDrag: ', coreEvent.position);
	
	      // Call event handler. If it returns explicit false, trigger end.
	      var shouldUpdate = _this.props.onDrag(e, coreEvent);
	      if (shouldUpdate === false) {
	        _this.handleDragStop(e);
	        return;
	      }
	    };
	
	    this.handleDragStop = function (e) {
	      if (!_this.state.dragging) return;
	
	      // Short circuit if this is not the correct touch event. `changedTouches` contains all
	      // touch points that have been removed from the surface.
	      if (e.changedTouches && e.changedTouches[0].identifier !== _this.state.touchIdentifier) return;
	
	      var dragEventFor = eventsFor[_this.state.dragging];
	
	      _this.eatDragEvent(e);
	
	      var coreEvent = _this.createCoreEvent((0, _utilsPositionFns.getControlPosition)(e));
	
	      (0, _utilsLog2['default'])('DraggableCore: handleDragStop: ', coreEvent.position);
	
	      // Reset the el.
	      _this.setState({
	        dragging: null
	      });
	
	      // Call event handler
	      _this.props.onStop(e, coreEvent);
	
	      // Remove event handlers
	      (0, _utilsLog2['default'])('DraggableCore: Removing handlers');
	      (0, _utilsDomFns.removeEvent)(document, dragEventFor.move, _this.handleDrag);
	      (0, _utilsDomFns.removeEvent)(document, dragEventFor.stop, _this.handleDragStop);
	    };
	
	    this.onMouseDown = function (e) {
	      return _this.handleDragStart(e, 'mouse');
	    };
	
	    this.onTouchStart = function (e) {
	      return _this.handleDragStart(e, 'touch');
	    };
	  }
	
	  _createClass(DraggableCore, [{
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      // Remove any leftover event handlers. Remove both touch and mouse handlers in case
	      // some browser quirk caused a touch event to fire during a mouse move, or vice versa.
	      (0, _utilsDomFns.removeEvent)(document, eventsFor.mouse.move, this.handleDrag);
	      (0, _utilsDomFns.removeEvent)(document, eventsFor.touch.move, this.handleDrag);
	      (0, _utilsDomFns.removeEvent)(document, eventsFor.mouse.stop, this.handleDragStop);
	      (0, _utilsDomFns.removeEvent)(document, eventsFor.touch.stop, this.handleDragStop);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      // Reuse the child provided
	      // This makes it flexible to use whatever element is wanted (div, ul, etc)
	      return _react2['default'].cloneElement(_react2['default'].Children.only(this.props.children), {
	        style: (0, _utilsDomFns.styleHacks)(this.props.children.props.style),
	
	        // Note: mouseMove handler is attached to document so it will still function
	        // when the user drags quickly and leaves the bounds of the element.
	        onMouseDown: this.onMouseDown,
	        onTouchStart: this.onTouchStart,
	        onMouseUp: this.handleDragStop,
	        onTouchEnd: this.handleDragStop
	      });
	    }
	  }]);
	
	  return DraggableCore;
	})(_react2['default'].Component);
	
	exports['default'] = DraggableCore;
	module.exports = exports['default'];

	// Start drag, listen for further mouse events

	// Start drag, listen for further touch events

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = log;
	
	function log(str, data) {
	  if ((undefined)) arguments.length > 1 ? console.log(str, data) : console.log(str);
	}
	
	module.exports = exports["default"];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _domFns = __webpack_require__(6);
	
	var _reactDom = __webpack_require__(3);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	//
	// Define ScrollManager.
	//
	// ScrollManager hooks into <Draggable>'s event handling and manages scrolling behavior.
	// It has 2 jobs to do:
	//	 1. adjust offsets if the parent DOM element scrolls.
	//	 2. scroll the parent DOM element if the drag gets close to the edge.
	//
	// ScrollManagers are meant to be transient; create one when a drag starts, call `destroy`
	// when the drag ends.
	
	var defaultOptions = {
		// How close you need to get to the edge before we start scrolling (in px).
		// Setting to 40 makes it easier to initiate scrolling on mobile devices, but it's not so large as
		// to cause lots of unwanted scrolls.
		// Set to <= 0 to disable scrolling.
		scrollThreshold: 40,
		// Callback for scroll events
		onScroll: function onScroll() {}
	};
	
	var overflowRegex = /(auto|scroll)/;
	
	var topElement = window;
	
	// Get the current x/y scroll for the given element.
	function getScrollAmount(element) {
		if (element === topElement) {
			return {
				x: window.pageXOffset,
				y: window.pageYOffset
			};
		}
		return {
			x: element.scrollLeft,
			y: element.scrollTop
		};
	}
	
	// Simple fallback for browsers that aren't down with requestAnimationFrame (e.g., IE9)
	var raf = window.requestAnimationFrame || function (fn) {
		return setTimeout(fn, 16 /* 60fps -> 16ms */);
	};
	var caf = window.cancelAnimationFrame || function (i) {
		return clearTimeout(i);
	};
	
	var ScrollManager = function ScrollManager(inOptions) {
		var _this = this;
	
		_classCallCheck(this, ScrollManager);
	
		this.isScrollOnDrag = function () {
			return _this.options.scrollThreshold > 0;
		};
	
		this.getScrollBounds = function () {
			if (!_this.isScrollOnDrag()) {
				return null;
			}
	
			if (_this.options.element === topElement) {
				// when scrolling the body, it's easiest to use client coordinates
				return { top: 0, bottom: window.innerHeight, left: 0, right: window.innerWidth };
			}
	
			var bcr = _this.options.element.getBoundingClientRect();
			// Offset the boundingCLientRect to get page coordinates; this lets us do fewer
			// scroll offset calculations.
			return {
				top: bcr.top + window.pageYOffset,
				bottom: bcr.bottom + window.pageYOffset,
				left: bcr.left + window.pageXOffset,
				right: bcr.right + window.pageXOffset
			};
		};
	
		this.destroy = function () {
			if (_this.noop) {
				return;
			}
	
			if (_this.state.raf) {
				caf(_this.state.raf);
				_this.state.raf = null;
			}
			_this.detachEvents();
		};
	
		this.attachEvents = function () {
			(0, _domFns.addEvent)(_this.options.element, 'scroll', _this.handleScroll);
		};
	
		this.detachEvents = function () {
			(0, _domFns.removeEvent)(_this.options.element, 'scroll', _this.handleScroll);
		};
	
		this.checkScroll = function (position) {
			if (!_this.isScrollOnDrag()) {
				return;
			}
	
			// Scroll if appropriate.
			var scrollingX = 0,
			    scrollingY = 0,
			    scrollThreshold = _this.options.scrollThreshold;
			var x = undefined,
			    y = undefined;
			if (_this.options.element === topElement) {
				x = position.clientX;y = position.clientY;
			} else {
				x = position.pageX;y = position.pageY;
			}
	
			if (x < _this.state.scrollBounds.left + scrollThreshold) {
				// scroll left
				scrollingX = -_this.state.scrollBounds.left - scrollThreshold + x;
			} else if (x > _this.state.scrollBounds.right - scrollThreshold) {
				// scroll right
				scrollingX = x - _this.state.scrollBounds.right + scrollThreshold;
			}
	
			if (y < _this.state.scrollBounds.top + scrollThreshold) {
				// scroll up
				scrollingY = -_this.state.scrollBounds.top - scrollThreshold + y;
			} else if (y > _this.state.scrollBounds.bottom - scrollThreshold) {
				// scroll down
				scrollingY = y - _this.state.scrollBounds.bottom + scrollThreshold;
			}
	
			_this.state.scrollingX = scrollingX;
			_this.state.scrollingY = scrollingY;
	
			// Initiate scrolling if appropriate
			var self = _this;
			if (scrollingX || scrollingY) {
				if (!_this.state.raf) {
					_this.state.raf = raf(function () {
						return self.doScroll();
					});
				}
			} else {
				// Cancel any outstanding scrolls.
				if (_this.state.raf) {
					caf(_this.state.raf);
					_this.state.raf = null;
				}
			}
		};
	
		this.doScroll = function () {
			var maxScrollSpeed = 100;
	
			// Use a square relationship to make scrolling accelerate as you approach the limit.
			function getScrollDelta(val, threshold) {
				// Squares are always positive, so make sure we remember if this is a negative.
				var neg = 1;
				if (val < 0) {
					neg = -1;
					val = -val;
				}
				val = Math.min(val / threshold, 1);
				return Math.ceil(val * val * maxScrollSpeed * neg);
			}
	
			var element = _this.options.element,
			    self = _this;
			var deltaX = getScrollDelta(self.state.scrollingX, self.options.scrollThreshold),
			    deltaY = getScrollDelta(self.state.scrollingY, self.options.scrollThreshold);
	
			if (_this.state.scrollingX || _this.state.scrollingY) {
				// Do the scroll
				if (element === topElement) {
					window.scrollBy(deltaX, deltaY);
				} else {
					element.scrollLeft += deltaX;
					element.scrollTop += deltaY;
				}
	
				// Keep scrolling
				_this.state.raf = raf(function () {
					return self.doScroll();
				});
	
				// There's usually no need to call handleScroll explicitly here, since updating
				// the scrollTop will trigger the "scroll" event.
				// IE9, however, will not trigger the event for
			} else {
					// Done scrolling
					_this.state.raf = null;
				}
		};
	
		this.handleScroll = function (e) {
			// Determine deltas
	
			var _getScrollAmount = getScrollAmount(_this.options.element);
	
			var x = _getScrollAmount.x;
			var y = _getScrollAmount.y;
	
			var deltaX = x - _this.state.scrollX;
			var deltaY = y - _this.state.scrollY;
	
			if (deltaX || deltaY) {
				// update state to reflect current values
				_this.state.scrollX = x;
				_this.state.scrollY = y;
	
				// notify listener
				_this.options.onScroll({
					event: e,
					isPage: _this.options.element === topElement,
					scroll: { x: x, y: y },
					delta: { x: deltaX, y: deltaY }
				});
			}
		};
	
		if (!inOptions || !inOptions.draggable) {
			throw 'ScrollManager needs a draggable to work with.';
		}
		this.options = {};
		for (var opt in defaultOptions) {
			this.options[opt] = inOptions[opt] === undefined ? defaultOptions[opt] : inOptions[opt];
		}
	
		if (!this.options.element) {
			// Find the first scrollable parent.
			// If none, then use the topElement.
			// Adapted from jQuery's $.fn.scrollParent
	
			var draggableNode = _reactDom2['default'].findDOMNode(inOptions.draggable),
			    parentNode = draggableNode.parentElement,
			    elementStyle = window.getComputedStyle(draggableNode),
			    position = elementStyle.position,
			    excludeStaticParent = position === 'absolute',
			    parentStyle = undefined,
			    scrollParent = undefined;
	
			if (position === 'fixed') {
				// fixed elements shouldn't take scrolling into account, so we have nothing to do here.
				this.noop = true;
				return;
			}
	
			while (parentNode && !scrollParent) {
				parentStyle = window.getComputedStyle(parentNode);
				if (!excludeStaticParent || parentStyle.position !== 'static') {
					if (overflowRegex.test(parentStyle.overflow + parentStyle.overflowY + parentStyle.overflowX)) {
						scrollParent = parentNode;
					}
				}
				parentNode = parentNode.parentElement;
			}
	
			this.options.element = scrollParent || topElement;
		}
	
		// Snapshot the original scroll location
		var scrollAmount = getScrollAmount(this.options.element);
		this.state = {
			scrollX: scrollAmount.x,
			scrollY: scrollAmount.y,
			scrollingX: 0,
			scrollingY: 0,
			scrollBounds: this.getScrollBounds(),
			raf: null
		};
	
		this.attachEvents();
	};
	
	exports['default'] = ScrollManager;
	module.exports = exports['default'];

	// Calculate the boundaries of the scroll parent

	// Check to see if we should be scrolling.

/***/ }
/******/ ])
});
;
//# sourceMappingURL=react-draggable.js.map