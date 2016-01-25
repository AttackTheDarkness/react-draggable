import {default as React, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import assign from 'object-assign';
import {createTransform} from './utils/domFns';
import {canDragX, canDragY, getBoundPosition, snapToGrid} from './utils/positionFns';
import {dontSetMe} from './utils/shims';
import DraggableCore from './DraggableCore';
import log from './utils/log';
import {default as ScrollManager} from './utils/ScrollManager';

function createUIEvent(node, position, state) {
  let {pageX, pageY} = position;
  let offsetX = pageX - state.startPageX + state.scrollOffsetX;
  let offsetY = pageY - state.startPageY + state.scrollOffsetY;

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

export default class Draggable extends React.Component {

  static displayName = 'Draggable';

  static propTypes = assign({}, DraggableCore.propTypes, {
    /**
     * `axis` determines which axis the draggable can move.
     *
     * 'both' allows movement horizontally and vertically.
     * 'x' limits movement to horizontal axis.
     * 'y' limits movement to vertical axis.
     *
     * Defaults to 'both'.
     */
    axis: PropTypes.oneOf(['both', 'x', 'y']),

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
    bounds: PropTypes.oneOfType([
      PropTypes.shape({
        left: PropTypes.Number,
        right: PropTypes.Number,
        top: PropTypes.Number,
        bottom: PropTypes.Number
      }),
      PropTypes.oneOf(['parent', false])
    ]),

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
    grid: PropTypes.arrayOf(PropTypes.number),

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
    start: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
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
    zIndex: PropTypes.number,

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
    scrollThreshold: PropTypes.number,

    /**
     * These properties should be defined on the child, not here.
     */
    className: dontSetMe,
    style: dontSetMe,
    transform: dontSetMe
  });

  static defaultProps = assign({}, DraggableCore.defaultProps, {
    axis: 'both',
    bounds: false,
    start: {x: 0, y: 0},
    zIndex: NaN,
    scrollThreshold: 40
  });

  state = {
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

  componentDidMount() {
    // Check to see if the element passed is an instanceof SVGElement
    if(ReactDOM.findDOMNode(this) instanceof SVGElement) {
      this.setState({ isElementSVG: true });
    }
  }

  cleanupScrollManager = () => {
    if (this.state.scrollManager) {
      this.state.scrollManager.destroy();
    }
  }

  componentWillUnmount() {
    // Clean up the scroll manager if we're destroyed mid-drag.
    this.cleanupScrollManager();
  }

  onDragStart = (e, coreEvent) => {
    log('Draggable: onDragStart: ', coreEvent.position);

    let {pageX, pageY} = coreEvent.position;
    let state = {dragging: true, startPageX: pageX, startPageY: pageY, lastPageX: pageX, lastPageY: pageY, lastOffsetX: 0, lastOffsetY: 0, scrollOffsetX: 0, scrollOffsetY: 0};

    // Short-circuit if user's callback killed it.
    let shouldStart = this.props.onStart(e, createUIEvent(ReactDOM.findDOMNode(this), coreEvent.position, state));
    // Kills start event on core as well, so move handlers are never bound.
    if (shouldStart === false) return false;

    this.cleanupScrollManager(); // better safe than sorry
    state.scrollManager = new ScrollManager({draggable: this, onScroll: this.handleScroll, scrollThreshold: this.props.scrollThreshold});

    this.setState(state);
  };

  onMove = (e, position, state) => {
    state = state || this.state;
    let uiEvent = createUIEvent(ReactDOM.findDOMNode(this), position, state);

    let dragX = uiEvent.position.left, dragY = uiEvent.position.top;

    let offsetX = state.offsetX + dragX, offsetY = state.offsetY + dragY;

    // Snap to grid if prop has been provided
    if (Array.isArray(this.props.grid)) {
      [offsetX, offsetY] = snapToGrid(this.props.grid, offsetX, offsetY);
    }

    // Keep within bounds.
    if (this.props.bounds) {
      [offsetX, offsetY] = getBoundPosition(this, offsetX, offsetY);
    }

    dragX = offsetX - state.offsetX;
    dragY = offsetY - state.offsetY;

    let newState = {
      lastOffsetX: uiEvent.position.left,
      lastOffsetY: uiEvent.position.top,
      dragX: dragX,
      dragY: dragY,
      lastPageX: position.pageX,
      lastPageY: position.pageY
    };

    // Short-circuit if user's callback killed it.
    let shouldUpdate = this.props.onDrag(e, uiEvent);
    if (shouldUpdate === false) return false;

    this.setState(newState);
  };

  handleScroll = (scrollInfo) => {
    let state = this.state;

    let position = {pageX: this.state.lastPageX, pageY: this.state.lastPageY};

    if (scrollInfo.isPage) {
      // If the scrolling element is the page, the pointer has "moved" in relation
      // to the page.
      position.pageX = this.state.lastPageX + scrollInfo.delta.x;
      position.pageY = this.state.lastPageY + scrollInfo.delta.y;
    } else {
      // If the scrolling element is a child of the page, update the scrollOffset.
      let newState = {
        scrollOffsetX: this.state.scrollOffsetX + scrollInfo.delta.x,
        scrollOffsetY: this.state.scrollOffsetY + scrollInfo.delta.y
      };

      this.setState(newState);
      // setState is async, so let's create an updated state that we can pass through
      state = assign({}, this.state, newState);
    }

    this.onMove(scrollInfo.event, position, state);
  };

  onDrag = (e, coreEvent) => {
    log('Draggable: onDrag: ', JSON.stringify(coreEvent.position));

    this.state.scrollManager.checkScroll(coreEvent.position);
    this.onMove(e, coreEvent.position);
  };

  onDragStop = (e, coreEvent) => {
    // Short-circuit if user's callback killed it.
    let shouldStop = this.props.onStop(e, createUIEvent(ReactDOM.findDOMNode(this), coreEvent.position, this.state));
    if (shouldStop === false) return false;

    log('Draggable: onDragStop: ', coreEvent.position);

    this.state.scrollManager.destroy();

    this.setState({
      scrollManager: null,
      dragging: false,
      offsetX: this.state.offsetX + this.state.dragX,
      offsetY: this.state.offsetY + this.state.dragY,
      dragX: 0,
      dragY: 0
    });
  };
  
  componentWillReceiveProps(nextProps) {
    // If we're modifying the start location, offset our state by the difference.
    if (nextProps.start.x !== this.props.start.x || nextProps.start.y !== this.props.start.y) {
      this.setState({
        offsetX: this.state.offsetX + nextProps.start.x - this.props.start.x,
        offsetY: this.state.offsetY + nextProps.start.y - this.props.start.y
      });
    }
  }

  render() {
    let style, svgTransform = null;
    // Add a CSS transform to move the element around. This allows us to move the element around
    // without worrying about whether or not it is relatively or absolutely positioned.
    // If the item you are dragging already has a transform set, wrap it in a <span> so <Draggable>
    // has a clean slate.
    style = createTransform({
      // Set left if horizontal drag is enabled
      x: canDragX(this) ?
        this.state.offsetX + this.state.dragX :
        this.props.start.x,

      // Set top if vertical drag is enabled
      y: canDragY(this) ?
        this.state.offsetY + this.state.dragY :
        this.props.start.y
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
    let className = classNames((this.props.children.props.className || ''), 'react-draggable', {
      'react-draggable-dragging': this.state.dragging,
      'react-draggable-dragged': this.state.dragged
    });

    // Reuse the child provided
    // This makes it flexible to use whatever element is wanted (div, ul, etc)
    return (
      <DraggableCore {...this.props} onStart={this.onDragStart} onDrag={this.onDrag} onStop={this.onDragStop}>
        {React.cloneElement(React.Children.only(this.props.children), {
          className: className,
          style: assign({}, this.props.children.props.style, style),
          transform: svgTransform
        })}
      </DraggableCore>
    );
  }
}
