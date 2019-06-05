/**
 * Add props to an element
 *
 * The first agument is an object with props. Most props are DOM node
 * properties, and correspoding values are used the same way. Some props are
 * treated specially.
 *
 * - `class` prop follows the following rules:
 *   + If the value is an array, each member is added to the `classList`.
 *   + If the value is `undefined` or `null`, it is ignored.
 *   + All other values are coerced into string and used as `className`.
 * - `style` prop value should be an object and each key of the object
 *   containing style rules.
 * - `for` is an alias for `htmlFor`
 * - `tabindex` is an alias for `tabIndex`.
 * - `dataset` is an object that will be merged into the `dataset` property.
 * - `role` (ARIA) is used as an attribute, not property.
 * - `aria` is an object whose properties will be prefixed with `aria-` and
 *   used as attributes rather than properties.
 *
 * Examples:
 *
 *    const el = document.createElement('div');
 *
 *    addProps({id: 'test'}, el);
 *    addProps({class: 'test'});
 *    addProps({class: ['left', 'top']);
 *    addProps({style: {width: '200px', height: '40px'}})
 *
 */
export function addProps(props, el) {
  for (const key in props) {
    if (key === 'class') {
      const classNames = props.class;

      if (Array.isArray(classNames)) {
        el.classList.add(...classNames);
      }
      else if (classNames != null) {
        el.className = classNames;
      }
    }

    else if (key === 'for') {
      el.htmlFor = props.for;
    }

    else if (key === 'tabindex') {
      el.tabIndex = props.tabindex;
    }

    else if (key === 'style') {
      const styles = props.style;
      for (let rule in styles) {
        el.style[rule] = styles[rule];
      }
    }

    else if (key === 'dataset') {
      const dataset = props.dataset;
      for (const dataKey in dataset) {
        el.dataset[dataKey] = dataset[dataKey];
      }
    }

    else if (key === 'role') {
      // ARIA role is not a property
      el.setAttribute('role', props.role);
    }

    else if (key === 'aria') {
      const aria = props.aria;
      for (const attr in aria) {
        el.setAttribute(`aria-${attr}`, aria[attr]);
      }
    }

    else {
      el[key] = props[key];
    }
  }
}

/**
 * Append specified children to an element.
 *
 * The children can be one of:
 *
 * - `Element` object.
 * - `Comment` object.
 * - `Text` object.
 * - An array of children (recursive)
 * - `undefined` and `null` are rendered as HTML comments
 * - Any other JavaScript value (all coerced into string and added as text
 *   nodes)
 *
 * Examples:
 *
 *     const $ = createElement;
 *     const el = $('div');
 *     addChildren($('span'), el);
 *     addChildren('Hello', el);
 *     addChildren([$('span'), $('span'), 'word'], el);
 *
 */
export function addChildren(children, el) {
  if (children && typeof children.onbeforeappend === 'function') {
    children.onbeforeappend(el);
  }

  if (Array.isArray(children)) {
    children.forEach(function (child) {
      addChildren(child, el);
    });
  }
  else if (
    children instanceof Element ||
    children instanceof Comment ||
    children instanceof Text
  ) {
    el.appendChild(children);
  }
  else if (children == null) {
    el.appendChild(document.createComment('' + children));
  }
  else if (typeof children.toElement === 'function') {
    el.appendChild(children.toElement());
  }
  else if (typeof children.toString === 'function') {
    el.appendChild(document.createTextNode(children.toString()));
  }
  else {
    el.appendChild(document.createTextNode('' + children));
  }

  if (children && typeof children.onappend === 'function') {
    children.onappend(el);
  }
}

/**
 * Create a DOM element add invoke create hooks
 *
 * The first argument is the lower-case tag name.
 *
 * Optionally, a number of additional arguments can be specified with the
 * following semantics:
 *
 * - Any object will be treated as props (see `addProps`). This includes
 *   only plain objects.
 * - Any function will be treated as a hook and called with the created DOM
 *   element.
 * - Everything else will be treated as a child node (see `addChildren`).
 *
 * Returns the created DOM element.
 *
 * Example:
 *
 *     createElement('div');
 *     createElement('span', console.log);
 *     createElement('div', {id: 'test'});
 *     createElement('a', {href: '#main'}, 'Jump to content');
 *
 */
export function createElement(tag, ...args) {
  const el = document.createElement(tag);

  for (let i = 0, l = args.length; i < l; i++) {
    const arg = args[i];

    if ({}.toString.call(arg) === '[object Object]') {
      addProps(arg, el);
    }
    else if (typeof arg === 'function') {
      arg(el);
    }
    else {
      addChildren(arg, el);
    }
  }

  return el;
};

export const a = createElement.bind(null, 'a');
export const abbr = createElement.bind(null, 'abbr');
export const acronym = createElement.bind(null, 'acronym');
export const address = createElement.bind(null, 'address');
export const applet = createElement.bind(null, 'applet');
export const area = createElement.bind(null, 'area');
export const article = createElement.bind(null, 'article');
export const aside = createElement.bind(null, 'aside');
export const audio = createElement.bind(null, 'audio');
export const b = createElement.bind(null, 'b');
export const base = createElement.bind(null, 'base');
export const basefont = createElement.bind(null, 'basefont');
export const bdi = createElement.bind(null, 'bdi');
export const bdo = createElement.bind(null, 'bdo');
export const big = createElement.bind(null, 'big');
export const blockquote = createElement.bind(null, 'blockquote');
export const body = createElement.bind(null, 'body');
export const br = createElement.bind(null, 'br');
export const button = createElement.bind(null, 'button');
export const canvas = createElement.bind(null, 'canvas');
export const caption = createElement.bind(null, 'caption');
export const center = createElement.bind(null, 'center');
export const cite = createElement.bind(null, 'cite');
export const code = createElement.bind(null, 'code');
export const col = createElement.bind(null, 'col');
export const colgroup = createElement.bind(null, 'colgroup');
export const datalist = createElement.bind(null, 'datalist');
export const dd = createElement.bind(null, 'dd');
export const del = createElement.bind(null, 'del');
export const details = createElement.bind(null, 'details');
export const dfn = createElement.bind(null, 'dfn');
export const dir = createElement.bind(null, 'dir');
export const div = createElement.bind(null, 'div');
export const dl = createElement.bind(null, 'dl');
export const dt = createElement.bind(null, 'dt');
export const em = createElement.bind(null, 'em');
export const embed = createElement.bind(null, 'embed');
export const fieldset = createElement.bind(null, 'fieldset');
export const figcaption = createElement.bind(null, 'figcaption');
export const figure = createElement.bind(null, 'figure');
export const font = createElement.bind(null, 'font');
export const footer = createElement.bind(null, 'footer');
export const form = createElement.bind(null, 'form');
export const frame = createElement.bind(null, 'frame');
export const frameset = createElement.bind(null, 'frameset');
export const h1 = createElement.bind(null, 'h1');
export const h2 = createElement.bind(null, 'h2');
export const h3 = createElement.bind(null, 'h3');
export const h4 = createElement.bind(null, 'h4');
export const h5 = createElement.bind(null, 'h5');
export const h6 = createElement.bind(null, 'h6');
export const head = createElement.bind(null, 'head');
export const header = createElement.bind(null, 'header');
export const hgroup = createElement.bind(null, 'hgroup');
export const hr = createElement.bind(null, 'hr');
export const html = createElement.bind(null, 'html');
export const i = createElement.bind(null, 'i');
export const iframe = createElement.bind(null, 'iframe');
export const img = createElement.bind(null, 'img');
export const input = createElement.bind(null, 'input');
export const ins = createElement.bind(null, 'ins');
export const kbd = createElement.bind(null, 'kbd');
export const keygen = createElement.bind(null, 'keygen');
export const label = createElement.bind(null, 'label');
export const legend = createElement.bind(null, 'legend');
export const li = createElement.bind(null, 'li');
export const link = createElement.bind(null, 'link');
export const map = createElement.bind(null, 'map');
export const mark = createElement.bind(null, 'mark');
export const menu = createElement.bind(null, 'menu');
export const meta = createElement.bind(null, 'meta');
export const meter = createElement.bind(null, 'meter');
export const nav = createElement.bind(null, 'nav');
export const noframes = createElement.bind(null, 'noframes');
export const noscript = createElement.bind(null, 'noscript');
export const object = createElement.bind(null, 'object');
export const ol = createElement.bind(null, 'ol');
export const optgroup = createElement.bind(null, 'optgroup');
export const output = createElement.bind(null, 'output');
export const p = createElement.bind(null, 'p');
export const param = createElement.bind(null, 'param');
export const pre = createElement.bind(null, 'pre');
export const progress = createElement.bind(null, 'progress');
export const q = createElement.bind(null, 'q');
export const rp = createElement.bind(null, 'rp');
export const rt = createElement.bind(null, 'rt');
export const ruby = createElement.bind(null, 'ruby');
export const s = createElement.bind(null, 's');
export const samp = createElement.bind(null, 'samp');
export const script = createElement.bind(null, 'script');
export const section = createElement.bind(null, 'section');
export const select = createElement.bind(null, 'select');
export const small = createElement.bind(null, 'small');
export const source = createElement.bind(null, 'source');
export const span = createElement.bind(null, 'span');
export const strike = createElement.bind(null, 'strike');
export const strong = createElement.bind(null, 'strong');
export const style = createElement.bind(null, 'style');
export const sub = createElement.bind(null, 'sub');
export const summary = createElement.bind(null, 'summary');
export const sup = createElement.bind(null, 'sup');
export const table = createElement.bind(null, 'table');
export const tbody = createElement.bind(null, 'tbody');
export const td = createElement.bind(null, 'td');
export const textarea = createElement.bind(null, 'textarea');
export const tfoot = createElement.bind(null, 'tfoot');
export const th = createElement.bind(null, 'th');
export const thead = createElement.bind(null, 'thead');
export const time = createElement.bind(null, 'time');
export const title = createElement.bind(null, 'title');
export const tr = createElement.bind(null, 'tr');
export const track = createElement.bind(null, 'track');
export const tt = createElement.bind(null, 'tt');
export const u = createElement.bind(null, 'u');
export const ul = createElement.bind(null, 'ul');
export const v = createElement.bind(null, 'var');
export const video = createElement.bind(null, 'video');
export const wbr = createElement.bind(null, 'wbr');
