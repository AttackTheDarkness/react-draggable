import {addEvent, removeEvent} from './domFns';
import ReactDOM from 'react-dom';

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


const defaultOptions = {
	// How close you need to get to the edge before we start scrolling (in px).
	// Setting to 40 makes it easier to initiate scrolling on mobile devices, but it's not so large as
	// to cause lots of unwanted scrolls.
	// Set to <= 0 to disable scrolling.
	scrollThreshold: 40,
	// Callback for scroll events
	onScroll: function() {}
};

const overflowRegex = /(auto|scroll)/;

const topElement = window;

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
const raf = window.requestAnimationFrame || function(fn) { return setTimeout(fn, 16 /* 60fps -> 16ms */); };
const caf = window.cancelAnimationFrame || function(i) { return clearTimeout(i); };


export default class ScrollManager {
	constructor(inOptions) {
		if (!inOptions || !inOptions.draggable) {
			throw 'ScrollManager needs a draggable to work with.';
		}
		this.options = {};
		for (var opt in defaultOptions) {
			this.options[opt] = (inOptions[opt] === undefined) ? defaultOptions[opt] : inOptions[opt];
		}

		if (!this.options.element) {
			// Find the first scrollable parent.
			// If none, then use the topElement.
			// Adapted from jQuery's $.fn.scrollParent

			let draggableNode = ReactDOM.findDOMNode(inOptions.draggable),
				parentNode = draggableNode.parentElement,
				elementStyle = window.getComputedStyle(draggableNode),
			position = elementStyle.position,
			excludeStaticParent = position === 'absolute',
			parentStyle, scrollParent;

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
		let scrollAmount = getScrollAmount(this.options.element);
		this.state = {
			scrollX: scrollAmount.x,
			scrollY: scrollAmount.y,
			scrollingX: 0,
			scrollingY: 0,
			scrollBounds: this.getScrollBounds(),
			raf: null
		};
	
		this.attachEvents();
	}

	isScrollOnDrag = () => {
		return this.options.scrollThreshold > 0;
	};

	// Calculate the boundaries of the scroll parent
	getScrollBounds = () => {
		if (!this.isScrollOnDrag()) {
			return null;
		}

		if (this.options.element === topElement) {
			// when scrolling the body, it's easiest to use client coordinates
			return {top: 0, bottom: window.innerHeight, left: 0, right: window.innerWidth};
		}

		let bcr = this.options.element.getBoundingClientRect();
		// Offset the boundingCLientRect to get page coordinates; this lets us do fewer
		// scroll offset calculations.
		return {
			top: bcr.top + window.pageYOffset,
			bottom: bcr.bottom + window.pageYOffset,
			left: bcr.left + window.pageXOffset,
			right: bcr.right + window.pageXOffset
		};
	}

	destroy = () => {
		if (this.noop) {
			return;
		}

		if (this.state.raf) {
			caf(this.state.raf);
			this.state.raf = null;
		}
		this.detachEvents();
	}
	attachEvents = () => {
		addEvent(this.options.element, 'scroll', this.handleScroll);
	}
	detachEvents = () => {
		removeEvent(this.options.element, 'scroll', this.handleScroll);
	}

	// Check to see if we should be scrolling.
	checkScroll = (position) => {
		if (!this.isScrollOnDrag()) {
			return;
		}

		// Scroll if appropriate.
		let scrollingX = 0, scrollingY = 0, scrollThreshold = this.options.scrollThreshold;
		let x, y;
		if (this.options.element === topElement) {
			x = position.clientX; y = position.clientY;
		} else {
			x = position.pageX; y = position.pageY;
		}

		if (x < this.state.scrollBounds.left + scrollThreshold) {
			// scroll left
			scrollingX = - this.state.scrollBounds.left - scrollThreshold + x;
		} else if (x > this.state.scrollBounds.right - scrollThreshold) {
			// scroll right
			scrollingX = x - this.state.scrollBounds.right + scrollThreshold;
		}

		if (y < this.state.scrollBounds.top + scrollThreshold) {
			// scroll up
			scrollingY = - this.state.scrollBounds.top - scrollThreshold + y;
		} else if (y > this.state.scrollBounds.bottom - scrollThreshold) {
			// scroll down
			scrollingY = y - this.state.scrollBounds.bottom + scrollThreshold;
		}

		this.state.scrollingX = scrollingX;
		this.state.scrollingY = scrollingY;

		// Initiate scrolling if appropriate
		let self = this;
		if (scrollingX || scrollingY) {
			if (!this.state.raf) {
				this.state.raf = raf(() => self.doScroll());
			}
		} else {
			// Cancel any outstanding scrolls.
			if (this.state.raf) {
				caf(this.state.raf);
				this.state.raf = null;
			}
		}
	}

	doScroll = () => {
		const maxScrollSpeed = 100;

		// Use a square relationship to make scrolling accelerate as you approach the limit.
		function getScrollDelta(val, threshold) {
			// Squares are always positive, so make sure we remember if this is a negative.
			let neg = 1;
			if (val < 0) {
				neg = -1;
				val = -val;
			}
			val = Math.min(val / threshold, 1);
			return Math.ceil(val * val * maxScrollSpeed * neg);
		}

		let element = this.options.element, self = this;
		let deltaX = getScrollDelta(self.state.scrollingX, self.options.scrollThreshold),
			deltaY = getScrollDelta(self.state.scrollingY, self.options.scrollThreshold);

		if (this.state.scrollingX || this.state.scrollingY) {
			// Do the scroll
			if (element === topElement) {
				window.scrollBy(deltaX, deltaY);
			} else {
				element.scrollLeft += deltaX;
				element.scrollTop += deltaY;
			}

			// Keep scrolling
			this.state.raf = raf(() => self.doScroll());

			// There's usually no need to call handleScroll explicitly here, since updating
			// the scrollTop will trigger the "scroll" event.
			// IE9, however, will not trigger the event for 
		} else {
			// Done scrolling
			this.state.raf = null;
		}
	}

	handleScroll = (e) => {
		// Determine deltas
		let {x, y} = getScrollAmount(this.options.element);
		let deltaX = x - this.state.scrollX;
		let deltaY = y - this.state.scrollY;

		if (deltaX || deltaY) {
			// update state to reflect current values
			this.state.scrollX = x;
			this.state.scrollY = y;

			// notify listener
			this.options.onScroll({
				event: e,
				isPage: this.options.element === topElement,
				scroll: {x: x, y: y},
				delta: {x: deltaX, y: deltaY}
			});
		}
	};

}