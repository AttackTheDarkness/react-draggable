import {isNum, int} from './shims';
import ReactDOM from 'react-dom';
import {innerWidth, innerHeight, outerWidth, outerHeight} from './domFns';

export function getBoundPosition(draggable, offsetX, offsetY) {
  // If no bounds, short-circuit and move on
  if (!draggable.props.bounds) return [offsetX, offsetY];

  let bounds = JSON.parse(JSON.stringify(draggable.props.bounds));
  let node = ReactDOM.findDOMNode(draggable);
  let parent = node.parentNode;

  if (bounds === 'parent') {
    let nodeStyle = window.getComputedStyle(node);
    let parentStyle = window.getComputedStyle(parent);
    // Compute bounds. This is a pain with padding and offsets but this gets it exactly right.
    bounds = {
      left: -node.offsetLeft + int(parentStyle.paddingLeft) +
            int(nodeStyle.borderLeftWidth) + int(nodeStyle.marginLeft),
      top: -node.offsetTop + int(parentStyle.paddingTop) +
            int(nodeStyle.borderTopWidth) + int(nodeStyle.marginTop),
      right: innerWidth(parent) - outerWidth(node) - node.offsetLeft,
      bottom: innerHeight(parent) - outerHeight(node) - node.offsetTop
    };
  }

  // Keep x and y below right and bottom limits...
  if (isNum(bounds.right)) offsetX = Math.min(offsetX, bounds.right);
  if (isNum(bounds.bottom)) offsetY = Math.min(offsetY, bounds.bottom);

  // But above left and top limits.
  if (isNum(bounds.left)) offsetX = Math.max(offsetX, bounds.left);
  if (isNum(bounds.top)) offsetY = Math.max(offsetY, bounds.top);

  return [offsetX, offsetY];
}

export function snapToGrid(grid, pendingX, pendingY) {
  let x = Math.round(pendingX / grid[0]) * grid[0];
  let y = Math.round(pendingY / grid[1]) * grid[1];
  return [x, y];
}

export function canDragX(draggable) {
  return draggable.props.axis === 'both' || draggable.props.axis === 'x';
}

export function canDragY(draggable) {
  return draggable.props.axis === 'both' || draggable.props.axis === 'y';
}

// Get {clientX/Y, pageX/Y} positions from event.
export function getControlPosition(e) {
  // Android Chrome (as of v. 47, anyway) gives bogus values for clientX/Y when the
  // viewport is zoomed. So, instead, we use the pageX/Y coordinates and adjust for
  // scrolling, which seems reliable cross-platform.
  // Of course, because nothing can ever be easy, old versions of IE don't have *any*
  // values for pageX/Y... so we calculate those in the opposite direction.
  let position = (e.targetTouches && e.targetTouches[0]) || e;
  let {pageX, pageY} = position;
  let {pageXOffset, pageYOffset} = window;

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
};