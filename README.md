[![Build Status](https://travis-ci.org/foxbunny/hyperscribe.svg?branch=master)](https://travis-ci.org/foxbunny/hyperscribe)

# Hyperscribe

Extensible DOM node creation library for JavaScript programmers

## Overview

Hyperscribe is a library of functions that can be used to construct plain
vanilla DOM nodes. It works in any browser as well as on NodeJS with JSDOM.
It's simple JavaScript, not JSX, so it compiles without any additional tooling.

The main motivation for Hyperscribe was to serve as a library that would be
write-once-extend-forever. Extensibility of the library was prioritized over
anything else, and new features can be added trivally thanks to its hooks
system.

## Installation

Install from the NPM repository with NPM:

```bash
npm install hyperscribe
```

or with Yarn:

```bash
yarn add hyperscribe
```

## Quick tour

The library contains a generic function `createElement`, which can be imported
and used for creating elements (surprise!).

```javascript
import {createElement} from 'hyperscribe';

createElement('div', 'Hello, DIV!');
```

The first argument is the tag name, and the second is the child element, a
text node.

If we want to add some properties to the nodes, we can do so using an object:

```javascript
createElement('div', {class: 'test'}, 'Hello, DIV!');
```

The role of the arguments, except for the first one, are determined by their
type, not position. The last example, and the following one produce identical
results:

```javascript
createElement('div', 'Hello, DIV!', {class: 'test'});
```

It is also possible to have multiple objects with properties. Here's an
example:

```javascript
createElement('div', {id: 'myDiv'}, 'Hello, DIV!', {class: 'test'});
```

Both objects are applied as expected. Note though that, if two objects contain
the same properties, the latter one will override the previous one. It's
generally not necessary nor recommeded to do this, though. There is no reason
why you would not keep all properties in a single object, and before any
children.

## Tag shortcuts

It would be pretty horrible if we had to write `createElement` every time. We
can alias it to something like a `$` or `_` to make things a bit better, but
this library provides an even better solution: a version of `createElement` for
each tag.

Here are some examples:

```javascript
import {
  p,
  label,
  input,
  span,
} from 'hyperscribe';

p(
  {clas: 'field'},
  label(
    span(
      {class: ['labelText', 'required']},
      'Email:'
    ),
    input(
      {type: 'email', name: 'email', 'autofocus': true}
    ),
  ),
);
```

If you squint a bit, it even looks a bit like like HTML!

The only exception to the tag names is the `<var>` tag, which clashes with the
JavaScript's `var` keyword and has therefore been renamed to just `v`.

## Argument types

Regarless of how many there are and in what order they appear, all arguments
(except for the very first one which is the tag name) are basically one of
three types:

- A plain object.
- A function.
- Everything else.

Plain objects are used as element properties. Functions are so-called hooks
that are called with the newly created element. We will talk more about hooks
later. All other types of objects, including non-plain objects, arrays,
strings, boolean, and so on, are treated as children. We will discuss the
semantics of each of the child types later.

## Properties

The main difference between the properties we pass to the elements in
Hyperscribe and the HTML attributes we commonly used in the HTML files is that
these are all DOM node properties rather than attributes. 

Some attributes have a dash in the name. For example, `accept-charset` on
`form` elements. These must all be specified in camelCase, so `acceptCharset`
is the correct property.

Another thing to keep in mind with properties is that it's possible to specify
arbitrary non-standard properties and they all get assigned! For example:

```javascript
import {span} from 'hyperscribe';

const s = span({foo: 'bar'});
console.log(s.foo); // logs 'bar'
```

The `for` attribtue can be used as expected despite it being `htmlFor` when
used as a DOM property. You can also use `htmlFor` and it has the same meaning
(don't use both, though). Similarly, `tabindex` can be used as an alias for
`tabIndex`.

### Classes

The classes are specified using the `class` property. The usual approach is to
use strings, but if we want to specify multiple classes, it may sometimes be
more convenient to use arrays instead. For example:

```javascript
import {div} from 'hyperscribe';
import css from './my.module.css';

div({class: [css.top, css.content]});
```

### Style property

Unlike the `style` attribute, the `style` property does not support strings.
Instead, we pass CSS rules as an object:

```javascript
import {div} from 'hyperscribe';

const myWidth = 200;

div({style: {
  borderRadius: '5px',
  width: `${myWidth}px`,
}})
```

As with properties, any rules that have a dash in it must be camelCased (e.g.,
`backgroundImage` instead of `background-image`).

### Event handlers

Event handlers are simply added using `on*` properties. For example, a click
event handler is added using the `onclick` property. There is absolutely no
magic behind this: the event listeners are literally assigned to those
properties on the DOM element.

```javascript
import {button} from 'hyperscribe';

button(
  {
    onclick: function () { 
      alert('clicked!'); 
    },
  }, 
  'Click me',
);
```

If you are used to `addEventListeners()` or even swear by it, this may be
confusing or outright wrong. There is nothing inherently wrong about using the
`on*` properties. They work just as well. 

The only real limitation is that you can only have one listener per event type.
This is effectively solved by using a function that will itself dispatch to
several other functions as needed.

If, for any reason you decide that this approach is not good, you can use
hooks:

```javascript
import {button} from 'hyperscribe';

button(
  function (el) {
    el.addEventListener('click', function () {
      alert('clicked!');
    });
  },
  'Click me',
);
```

### Data attribtues

In the past, it was very common to use `data-` attributes to store auxillary
information in elements. To specify them using properties, we use the `dataset`
property which is an object containing all the data properties we want.

```javascript
import {div} from 'hyperscribe';

div({dataset: {
  foo: 'bar',
  bar: 'baz',
}});
```

Using non-string values in the `dataset` property should be avoided, as any and
all values are coerced into strings. If you want to preserve JavaScript values,
it is recommended to either keep them out of the DOM completely, or use a
non-standard custom property.

### ARIA attributes

ARIA attributes are special. They do not have a DOM property counterpart. They
are handled through the `role` and `aria` property in hyperscribe, and are
added via `setAttribute()`. When retrieving them, you will have to use
`getAttribute()`.

```javascript
import {div} from 'hyperscribe';

div({
  role: 'progressbar',
  aria: {
    valuemin: 0,
    valuemax: 100,
    valuenow: 15,
  },
});
```

## Children

Elemnts can have child nodes. Passing one of the following as an argument to
`createElement` or one of the shortcuts will count as a child element:

- `Element` object.
- `Comment` object.
- `Text` object.
- Objects with `toElement()` method.
- Objects with `toString()` method.
- `undefined` and `null`.
- Any types not explictly on this list.
- An array is treated as an array of the above, recursively.

The `Element`, `Comment` and `Text` objects are added to the parent node
directly.

Objects that have an `toElement()` method will be expected to return an
`Element` or a `Comment` object and that will be appended to the parent node.

Objects that have a `toString()` will be added as text nodes where the return
value of the method is used as the content.

`undefined` and `null` are rendered as HTML comments `<!--undefined-->` and
`<!--null-->` respectively. This should make troubleshooting easier.

Any types that are not one of the above or an array will be coerced into a 
string and added as text nodes.

Arrays are flattened and each element of the array is added according to the
above rules. This is done recursively.

When it comes to children, there are two special properties that any non-null
child can have: `onbeforeappend` and `onappend`. If these properties are
present and are functions, they will be called before and after the child is
added to its parent, respectively. This applies not only to `Element` objects
but also other objects, including arrays of children. For example:

```javascript
import {div, span} from 'hyperscribe';

div(
  span({onappend: function (parent) {
    // This is called right after the `span` element is appeneded to `div`. The
    // only argument to this function is the parent element.
    console.log('My parent is', parent);
  }})
)
```

## Hooks

Any argument to `createElement` or its shortcuts that is a function is called a
hook. A hook is a simple and effective way to extend the behavior of
`createElement`: it is just function that gets called with the element that is
being created.

Let's say we want to collect refrences to elements like we can in Vue or React.
This can be accomplished easily with a hook.

```javascript
import {div} from 'hyperscribe';

function ref(refObj, name) {  // <-- this is a hook factory
  return function (el) {  // <-- this is the hook
    refObj[name] = el;
  };
}

const refs = {};

div(
  ref(refs, 'top'),
  div(
    ref(refs, 'inner'),
    'Hello, World!',
  ),
);
```

After the code above is executed, the `refs` object looks like this:

```javascript
{
  top: [object HTMLDivElement],
  inner: [object HTMLDivElement],
}
```

