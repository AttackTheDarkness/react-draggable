import {default as React, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {matchesSelector, addEvent, removeEvent, styleHacks} from './utils/domFns';
import {getControlPosition} from './utils/positionFns';
import {dontSetMe} from './utils/shims';
import log from './utils/log';

// Simple abstraction for dragging events names.
let eventsFor = {
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

export default class DraggableCore extends React.Component {

  static displayName = 'DraggableCore';

  static propTypes = {
    /**
     * `allowAnyClick` allows dragging using any mouse button.
     * By default, we only accept the left button.
     *
     * Defaults to `false`.
     */
    allowAnyClick: PropTypes.bool,

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
    disabled: PropTypes.bool,

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
    handle: PropTypes.string,

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
    cancel: PropTypes.string,

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
    onStart: PropTypes.func,

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
    onDrag: PropTypes.func,

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
    onStop: PropTypes.func,

    /**
     * A workaround option which can be passed if onMouseDown needs to be accessed,
     * since it'll always be blocked (due to that there's internal use of onMouseDown)
     */
    onMouseDown: PropTypes.func,

    /**
     * These properties should be defined on the child, not here.
     */
    className: dontSetMe,
    style: dontSetMe,
    transform: dontSetMe
  };

  static defaultProps = {
    allowAnyClick: false, // by default only accept left click
    cancel: null,
    disabled: false,
    handle: null,
    transform: null,
    eatDragEvents: true,
    onStart: function(){},
    onDrag: function(){},
    onStop: function(){},
    onMouseDown: function(){}
  };

  state = {
    dragging: false
  };

  constructor(props) {
    super(props);
  }

  createCoreEvent = (position) => {
    let {clientX, clientY, pageX, pageY} = position;

    return {
      node: ReactDOM.findDOMNode(this),
      position: {
        clientX: clientX, clientY: clientY,
        pageX: pageX, pageY: pageY
      }
    };
  };

  componentWillUnmount() {
    // Remove any leftover event handlers. Remove both touch and mouse handlers in case
    // some browser quirk caused a touch event to fire during a mouse move, or vice versa.
    removeEvent(document, eventsFor.mouse.move, this.handleDrag);
    removeEvent(document, eventsFor.touch.move, this.handleDrag);
    removeEvent(document, eventsFor.mouse.stop, this.handleDragStop);
    removeEvent(document, eventsFor.touch.stop, this.handleDragStop);
  }

  eatDragEvent = (e) => {
    // Prevent the default behavior, unless the consumer's told us explicitly not to.
    // This prevents undesirable behavior like selecting text (whilst using the mouse) or
    // spurious scrolling (on a touch device).
    this.props.eatDragEvents && e && e.preventDefault && e.preventDefault();
  };

  handleDragStart = (e, dragType) => {
    if (this.state.dragging) return;

    let dragEventFor = eventsFor[dragType];

    // Make it possible to attach event handlers on top of this one.
    this.props.onMouseDown(e);

    // Only accept left-clicks.
    if (!this.props.allowAnyClick && typeof e.button === 'number' && e.button !== 0) return false;

    // Short circuit if handle or cancel prop was provided and selector doesn't match.
    if (this.props.disabled ||
      (this.props.handle && !matchesSelector(e.target, this.props.handle)) ||
      (this.props.cancel && matchesSelector(e.target, this.props.cancel))) {
      return;
    }

    // Create an event object with all the data parents need to make a decision here.
    let coreEvent = this.createCoreEvent(getControlPosition(e));

    log('DraggableCore: handleDragStart: ', coreEvent.position);

    // Call event handler. If it returns explicit false, cancel.
    let shouldUpdate = this.props.onStart(e, coreEvent);
    if (shouldUpdate === false) return;

    // Set touch identifier in component state if this is a touch event. This allows us to
    // distinguish between individual touches on multitouch screens by identifying which
    // touchpoint was set to this element.
    if (e.targetTouches){
      this.setState({touchIdentifier: e.targetTouches[0].identifier});
    }

    this.eatDragEvent(e);

    // Initiate dragging. Set the current x and y as offsets
    // so we know how much we've moved during the drag. This allows us
    // to drag elements around even if they have been moved, without issue.
    this.setState({
      dragging: dragType
    });

    // Add events to the document directly so we catch when the user's mouse/touch moves outside of
    // this element. We use different events depending on whether or not we have detected that this
    // is a touch-capable device.
    addEvent(document, dragEventFor.move, this.handleDrag);
    addEvent(document, dragEventFor.stop, this.handleDragStop);
  };

  handleDrag = (e) => {
    if (!this.state.dragging) return;

    // Return if this is a touch event, but not the correct one for this element
    if (e.targetTouches && (e.targetTouches[0].identifier !== this.state.touchIdentifier)) return;

    this.eatDragEvent(e);

    let coreEvent = this.createCoreEvent(getControlPosition(e));

    log('DraggableCore: handleDrag: ', coreEvent.position);

    // Call event handler. If it returns explicit false, trigger end.
    let shouldUpdate = this.props.onDrag(e, coreEvent);
    if (shouldUpdate === false) {
      this.handleDragStop(e);
      return;
    }
  };

  handleDragStop = (e) => {
    if (!this.state.dragging) return;

    // Short circuit if this is not the correct touch event. `changedTouches` contains all
    // touch points that have been removed from the surface.
    if (e.changedTouches && (e.changedTouches[0].identifier !== this.state.touchIdentifier)) return;

    let dragEventFor = eventsFor[this.state.dragging];

    this.eatDragEvent(e);

    let coreEvent = this.createCoreEvent(getControlPosition(e));

    log('DraggableCore: handleDragStop: ', coreEvent.position);

    // Reset the el.
    this.setState({
      dragging: null
    });

    // Call event handler
    this.props.onStop(e, coreEvent);

    // Remove event handlers
    log('DraggableCore: Removing handlers');
    removeEvent(document, dragEventFor.move, this.handleDrag);
    removeEvent(document, dragEventFor.stop, this.handleDragStop);
  };

  // Start drag, listen for further mouse events
  onMouseDown = (e) => {
    return this.handleDragStart(e, 'mouse');
  };

  // Start drag, listen for further touch events
  onTouchStart = (e) => {
    return this.handleDragStart(e, 'touch');
  };

  render() {
    // Reuse the child provided
    // This makes it flexible to use whatever element is wanted (div, ul, etc)
    return React.cloneElement(React.Children.only(this.props.children), {
      style: styleHacks(this.props.children.props.style),

      // Note: mouseMove handler is attached to document so it will still function
      // when the user drags quickly and leaves the bounds of the element.
      onMouseDown: this.onMouseDown,
      onTouchStart: this.onTouchStart,
      onMouseUp: this.handleDragStop,
      onTouchEnd: this.handleDragStop
    });
  }
}
