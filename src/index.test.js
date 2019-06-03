import {createElement as $, addProps, addChildren} from './index';

describe('addProps', function () {

  test('add a property', function () {
    const n = $('main');
    addProps({id: 'main'}, n);
    expect(n.id).toBe('main');
  });

  test('add multiple properties', function () {
    const n = $('a');
    addProps({href: 'http://www.example.com/', target: '_blank'}, n);
    expect(n.href).toBe('http://www.example.com/');
    expect(n.target).toBe('_blank');
  });

  test('class property special case', function () {
    const n = $('div');
    addProps({class: 'middle'}, n);
    expect(n.className).toBe('middle');
  });

  test('class property accepts arrays', function () {
    const n  = $('div');
    addProps({class: ['middle', 'left']}, n);
    expect(n.className).toBe('middle left');
  });

  test('class property is coerced into string', function () {
    const n = $('span');
    addProps({class: false}, n);
    expect(n.className).toBe('false');
  });

  test.each([undefined, null])(
    'class property is ignored if %s',
    function (className) {
      const n = $('span');
      addProps({class: className}, n);
      expect(n.className).toBe('');
    }
  );

  test('for property is an alias for htmlFor', function () {
    const n = $('span');
    addProps({for: 'me'}, n);
    expect(n.htmlFor).toBe('me');
  });

  test('tabindex is an alias for tabIndex', function () {
    const n = $('span');
    addProps({tabindex: 2}, n);
    expect(n.tabIndex).toBe(2);
  });

  test('create with style property', function () {
    const n = $('span');
    addProps({style: {width: '200px'}}, n);
    expect(n.style.width).toBe('200px');
  });

  test('create with multiple style rules', function () {
    const n = $('span');
    addProps({style: {width: '200px', height: '40px'}}, n);
    expect(n.style.width).toBe('200px');
    expect(n.style.height).toBe('40px');
  });

  test('data property', function () {
    const n = $('span');
    addProps({dataset: {foo: 'bar'}}, n);
    expect(n.dataset.foo).toBe('bar');
  });

  test('multiple data properties', function () {
    const n = $('span');
    addProps({dataset: {foo: 'bar', bar: 'baz'}}, n);
    expect(n.dataset.foo).toBe('bar');
    expect(n.dataset.bar).toBe('baz');
  });

  test('add ARIA role', function () {
    const n = $('span');
    addProps({role: 'button'}, n);
    expect(n.role).toBeUndefined();
    expect(n.getAttribute('role')).toBe('button');
  });

  test('add ARIA attribute', function () {
    const n = $('span');
    addProps({aria: {valuenow: 12}}, n);
    expect(n.aria).toBeUndefined();
    expect(n.getAttribute('aria-valuenow')).toBe('12');
  });

});

describe('addChildren', function () {

  test('add DOM node', function () {
    const n = $('div');
    const c = $('span');
    addChildren(c, n);
    expect(c.parentNode).toBe(n);
  });

  test('add Comment node', function () {
    const n = $('div');
    const c = document.createComment('test me');
    addChildren(c, n);
    expect(c.parentNode).toBe(n);
    expect(n.innerHTML).toBe('<!--test me-->');
  });

  test('add elementable object', function () {
    const n = $('div');
    const o = {
      toElement: function () {
        return $('span');
      },
    };
    addChildren(o, n);
    expect(n.firstChild).toBeInstanceOf(HTMLSpanElement);
  });

  test('add stringable element', function () {
    const n = $('div');
    const o = {
      toString: function () {
        return 'Hello, test!';
      },
    };
    addChildren(o, n);
    expect(n.firstChild).toEqual(document.createTextNode('Hello, test!'));
  });

  test('add text', function () {
    const n = $('div');
    addChildren('Hello, test!', n);
    expect(n.firstChild).toEqual(document.createTextNode('Hello, test!'));
  });

  test('add multiple DOM nodes', function () {
    const n = $('div');
    const c = [$('span'), $('span')];
    addChildren(c, n);
    c.forEach(function (child) {
      expect(child.parentNode).toBe(n);
    });
  });

  test('add mixed DOM nodes and text', function () {
    const n = $('div');
    const c = [$('span'), 'span'];
    addChildren(c, n);
    expect(n.lastChild).toEqual(document.createTextNode('span'));
  });

  test.each([
    [undefined, 'undefined'],
    [null, 'null'],
  ])(
    'add %s as child',
    function (val, commentText) {
      const n = $('div');
      addChildren(val, n);
      expect(n.firstChild).toEqual(document.createComment(commentText));
    }
  )

  test('add mixed DOM ndodes and undefined', function () {
    const n = $('div');
    const c = [$('span'), undefined];
    addChildren(c, n);
    expect(n.lastChild).toEqual(document.createComment('undefined'));
  });

  test('beforeappend hook', function () {
    const n = $('div');
    const c = $('span');
    c.onbeforeappend = jest.fn(function (el) {
      expect(el.childNodes.length).toBe(0);
    });
    addChildren(c, n);
    expect(c.onbeforeappend).toHaveBeenCalledWith(n);
  });

  test('onappend hook', function () {
    const n = $('div');
    const c = $('span');
    c.onappend = jest.fn(function (el) {
      expect(el.firstChild).toBe(c);
    });
    addChildren(c, n);
    expect(c.onappend).toHaveBeenCalledWith(n);
  });

});

describe('createElement', function () {

  test.each([
    ['div', HTMLDivElement],
    ['span', HTMLSpanElement],
  ])(
    'create a %s element',
    function (tag, ctor) {
      const n = $(tag);
      expect(n).toBeInstanceOf(ctor);
    }
  );

  test('create hook', () => {
    const hook = jest.fn();
    const n = $('div', hook);
    expect(hook).toHaveBeenCalledWith(document.createElement('div'));
  });

  test('multiple hooks', () => {
    const hook1 = jest.fn();
    const hook2 = jest.fn();
    const n = $('div', hook1, hook2);
    expect(hook1).toHaveBeenCalledWith(document.createElement('div'));
    expect(hook2).toHaveBeenCalledWith(document.createElement('div'));
  });

  test('add props using an object', function () {
    const n = $('div', {id: 'main'});
    expect(n.id).toEqual('main');
  });

  test('add child node', function () {
    const n = $('div', $('span'));
    expect(n.childNodes.length).toBe(1);
  });

  test('add mixed', function () {
    const hook = jest.fn();
    const n = $('div', hook, 'Hello, world!', {id: 'side'}, $('span'));
    expect(n.id).toBe('side');
    expect(n.firstChild).toEqual(document.createTextNode('Hello, world!'));
    expect(n.lastChild).toBeInstanceOf(HTMLSpanElement);
    expect(hook).toHaveBeenCalledWith(n);
  });

});
