import {findInArray, isFunction, int} from './shims';
import browserPrefix from './getPrefix';
import assign from 'object-assign';

let matchesSelectorFunc = '';
export function matchesSelector(el: Node, selector: string) {
  if (!matchesSelectorFunc) {
    matchesSelectorFunc = findInArray([
      'matches',
      'webkitMatchesSelector',
      'mozMatchesSelector',
      'msMatchesSelector',
      'oMatchesSelector'
    ], function(method){
      return isFunction(el[method]);
    });
  }

  return el[matchesSelectorFunc].call(el, selector);
}

export function addEvent(el: any, event: string, handler: Function) {
  if (!el) { return; }
  if (el.attachEvent) {
    el.attachEvent('on' + event, handler);
  } else if (el.addEventListener) {
    el.addEventListener(event, handler, true);
  } else {
    el['on' + event] = handler;
  }
}

export function removeEvent(el: any, event: string, handler: Function) {
  if (!el) { return; }
  if (el.detachEvent) {
    el.detachEvent('on' + event, handler);
  } else if (el.removeEventListener) {
    el.removeEventListener(event, handler, true);
  } else {
    el['on' + event] = null;
  }
}

export function outerHeight(node: Node) {
  // This is deliberately excluding margin for our calculations, since we are using
  // offsetTop which is including margin. See getBoundPosition
  let height = node.clientHeight;
  let computedStyle = window.getComputedStyle(node);
  height += int(computedStyle.borderTopWidth);
  height += int(computedStyle.borderBottomWidth);
  return height;
}

export function outerWidth(node: Node) {
  // This is deliberately excluding margin for our calculations, since we are using
  // offsetLeft which is including margin. See getBoundPosition
  let width = node.clientWidth;
  let computedStyle = window.getComputedStyle(node);
  width += int(computedStyle.borderLeftWidth);
  width += int(computedStyle.borderRightWidth);
  return width;
}
export function innerHeight(node: Node) {
  let height = node.clientHeight;
  let computedStyle = window.getComputedStyle(node);
  height -= int(computedStyle.paddingTop);
  height -= int(computedStyle.paddingBottom);
  return height;
}

export function innerWidth(node: Node) {
  let width = node.clientWidth;
  let computedStyle = window.getComputedStyle(node);
  width -= int(computedStyle.paddingLeft);
  width -= int(computedStyle.paddingRight);
  return width;
}

export function createTransform(position: Object, isSVG: ?boolean) {
  if (isSVG) return createSVGTransform(position);
  return createCSSTransform(position);
}

export function createCSSTransform({x, y}: {x: number, y: number}) {
  // Replace unitless items with px
  let out = {transform: 'translate(' + x + 'px,' + y + 'px)'};
  // Add single prefixed property as well
  if (browserPrefix) {
    out[browserPrefix + 'Transform'] = out.transform;
  }
  return out;
}

export function createSVGTransform({x, y}: {x: number, y: number}) {
  return 'translate(' + x + ',' + y + ')';
}

export function styleHacks(childStyle = {}) {
  // Workaround IE pointer events; see #51
  // https://github.com/mzabriskie/react-draggable/issues/51#issuecomment-103488278
  let touchHacks = {
    touchAction: 'none'
  };

  return assign(touchHacks, childStyle);
}
