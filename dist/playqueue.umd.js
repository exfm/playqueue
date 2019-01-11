(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global['audio-controls'] = {})));
}(this, (function (exports) { 'use strict';

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var classCallCheck = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck = unwrapExports(classCallCheck);

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.6.2' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$1 = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function (it) {
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var hasOwnProperty = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && _has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx(out, _global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
_export(_export.S + _export.F * !_descriptors, 'Object', { defineProperty: _objectDp.f });

var $Object = _core.Object;
var defineProperty$2 = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

var defineProperty = createCommonjsModule(function (module) {
module.exports = { "default": defineProperty$2, __esModule: true };
});

unwrapExports(defineProperty);

var createClass = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _defineProperty2 = _interopRequireDefault(defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
});

var _createClass = unwrapExports(createClass);

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// true  -> String#at
// false -> String#codePointAt
var _stringAt = function (TO_STRING) {
  return function (that, pos) {
    var s = String(_defined(that));
    var i = _toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var _library = true;

var _redefine = _hide;

var _iterators = {};

var toString = {}.toString;

var _cof = function (it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject = function (it) {
  return _iobject(_defined(it));
};

// 7.1.15 ToLength

var min = Math.min;
var _toLength = function (it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes



var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var _shared = createCommonjsModule(function (module) {
var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: _core.version,
  mode: _library ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});
});

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO$1 = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO$1) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)



var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  _anObject(O);
  var keys = _objectKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
  return O;
};

var document$2 = _global.document;
var _html = document$2 && document$2.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



var IE_PROTO = _sharedKey('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE$1 = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe');
  var i = _enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE$1] = _anObject(O);
    result = new Empty();
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : _objectDps(result, Properties);
};

var _wks = createCommonjsModule(function (module) {
var store = _shared('wks');

var Symbol = _global.Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
};

$exports.store = store;
});

var def = _objectDp.f;

var TAG = _wks('toStringTag');

var _setToStringTag = function (it, tag, stat) {
  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function () { return this; });

var _iterCreate = function (Constructor, NAME, next) {
  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
  _setToStringTag(Constructor, NAME + ' Iterator');
};

// 7.1.13 ToObject(argument)

var _toObject = function (it) {
  return Object(_defined(it));
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


var IE_PROTO$2 = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function (O) {
  O = _toObject(O);
  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

var ITERATOR = _wks('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  _iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!_library && typeof IteratorPrototype[ITERATOR] != 'function') _hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    _hide(proto, ITERATOR, $default);
  }
  // Plug for library
  _iterators[NAME] = $default;
  _iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) _redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

var $at = _stringAt(true);

// 21.1.3.27 String.prototype[@@iterator]()
_iterDefine(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

var _addToUnscopables = function () { /* empty */ };

var _iterStep = function (done, value) {
  return { value: value, done: !!done };
};

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
  this._t = _toIobject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return _iterStep(1);
  }
  if (kind == 'keys') return _iterStep(0, index);
  if (kind == 'values') return _iterStep(0, O[index]);
  return _iterStep(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
_iterators.Arguments = _iterators.Array;

_addToUnscopables('keys');
_addToUnscopables('values');
_addToUnscopables('entries');

var TO_STRING_TAG = _wks('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = _global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
  _iterators[NAME] = _iterators.Array;
}

var f$1 = _wks;

var _wksExt = {
	f: f$1
};

var iterator$2 = _wksExt.f('iterator');

var iterator = createCommonjsModule(function (module) {
module.exports = { "default": iterator$2, __esModule: true };
});

unwrapExports(iterator);

var _meta = createCommonjsModule(function (module) {
var META = _uid('meta');


var setDesc = _objectDp.f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !_fails(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!_has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!_has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};
});

var defineProperty$4 = _objectDp.f;
var _wksDefine = function (name) {
  var $Symbol = _core.Symbol || (_core.Symbol = _library ? {} : _global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty$4($Symbol, name, { value: _wksExt.f(name) });
};

var f$2 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$2
};

var f$3 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$3
};

// all enumerable object keys, includes symbols



var _enumKeys = function (it) {
  var result = _objectKeys(it);
  var getSymbols = _objectGops.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = _objectPie.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

// 7.2.2 IsArray(argument)

var _isArray = Array.isArray || function isArray(arg) {
  return _cof(arg) == 'Array';
};

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

var f$5 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return _objectKeysInternal(O, hiddenKeys);
};

var _objectGopn = {
	f: f$5
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

var gOPN$1 = _objectGopn.f;
var toString$1 = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN$1(it);
  } catch (e) {
    return windowNames.slice();
  }
};

var f$4 = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN$1(_toIobject(it));
};

var _objectGopnExt = {
	f: f$4
};

var gOPD$1 = Object.getOwnPropertyDescriptor;

var f$6 = _descriptors ? gOPD$1 : function getOwnPropertyDescriptor(O, P) {
  O = _toIobject(O);
  P = _toPrimitive(P, true);
  if (_ie8DomDefine) try {
    return gOPD$1(O, P);
  } catch (e) { /* empty */ }
  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
};

var _objectGopd = {
	f: f$6
};

// ECMAScript 6 symbols shim





var META = _meta.KEY;



















var gOPD = _objectGopd.f;
var dP$2 = _objectDp.f;
var gOPN = _objectGopnExt.f;
var $Symbol = _global.Symbol;
var $JSON = _global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE$2 = 'prototype';
var HIDDEN = _wks('_hidden');
var TO_PRIMITIVE = _wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = _shared('symbol-registry');
var AllSymbols = _shared('symbols');
var OPSymbols = _shared('op-symbols');
var ObjectProto$1 = Object[PROTOTYPE$2];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = _global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = _descriptors && _fails(function () {
  return _objectCreate(dP$2({}, 'a', {
    get: function () { return dP$2(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto$1, key);
  if (protoDesc) delete ObjectProto$1[key];
  dP$2(it, key, D);
  if (protoDesc && it !== ObjectProto$1) dP$2(ObjectProto$1, key, protoDesc);
} : dP$2;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto$1) $defineProperty(OPSymbols, key, D);
  _anObject(it);
  key = _toPrimitive(key, true);
  _anObject(D);
  if (_has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!_has(it, HIDDEN)) dP$2(it, HIDDEN, _propertyDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP$2(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  _anObject(it);
  var keys = _enumKeys(P = _toIobject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = _toPrimitive(key, true));
  if (this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;
  return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = _toIobject(it);
  key = _toPrimitive(key, true);
  if (it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(_toIobject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto$1;
  var names = gOPN(IS_OP ? OPSymbols : _toIobject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto$1) $set.call(OPSymbols, value);
      if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, _propertyDesc(1, value));
    };
    if (_descriptors && setter) setSymbolDesc(ObjectProto$1, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  _redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
    return this._k;
  });

  _objectGopd.f = $getOwnPropertyDescriptor;
  _objectDp.f = $defineProperty;
  _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
  _objectPie.f = $propertyIsEnumerable;
  _objectGops.f = $getOwnPropertySymbols;

  if (_descriptors && !_library) {
    _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  _wksExt.f = function (name) {
    return wrap(_wks(name));
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)_wks(es6Symbols[j++]);

for (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);

_export(_export.S + _export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return _has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

_export(_export.S + _export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && _export(_export.S + _export.F * (!USE_NATIVE || _fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!_isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!_isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
_setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
_setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
_setToStringTag(_global.JSON, 'JSON', true);

_wksDefine('asyncIterator');

_wksDefine('observable');

var symbol$2 = _core.Symbol;

var symbol = createCommonjsModule(function (module) {
module.exports = { "default": symbol$2, __esModule: true };
});

unwrapExports(symbol);

var _typeof_1 = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _iterator2 = _interopRequireDefault(iterator);



var _symbol2 = _interopRequireDefault(symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
});

var _typeof = unwrapExports(_typeof_1);

var EventBus = function () {
  function EventBus() {
    _classCallCheck(this, EventBus);

    if (!EventBus.instance) {
      EventBus.instance = this;
      this.listeners = {};
    }
    return EventBus.instance;
  }

  _createClass(EventBus, [{
    key: 'on',
    value: function on(type, listener) {
      var checkAllowed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (checkAllowed === true) {
        if (this.allowedTypes[type] === true) {
          if (!this.listeners[type]) {
            this.listeners[type] = [];
          }
          this.listeners[type].push(listener);
        }
      } else {
        if (!this.listeners[type]) {
          this.listeners[type] = [];
        }
        this.listeners[type].push(listener);
      }
    }
  }, {
    key: 'off',
    value: function off(type, listener) {
      var _this = this;

      if (typeof this.listeners[type] !== 'undefined') {
        this.listeners[type].forEach(function (l, i) {
          if (listener) {
            if (l === listener) {
              _this.listeners[type].splice(i, 1);
            }
          } else {
            _this.listeners[type] = [];
          }
        });
      }
    }
  }, {
    key: 'trigger',
    value: function trigger(type, data) {
      var _this2 = this;

      if (this.listeners && typeof this.listeners[type] !== 'undefined' && this.listeners[type].length) {
        var array = this.listeners[type].slice();
        array.forEach(function (listener) {
          Object.assign(data, _this2.eventExtras(type));
          listener.apply(null, [data]);
        });
      }
    }

    //todo add in extra props (song, etc)

  }, {
    key: 'eventExtras',
    value: function eventExtras(type) {
      return {
        'type': type,
        'timestamp': new Date().getTime()
      };
    }
  }, {
    key: 'allowedTypes',
    get: function get() {
      return {
        'nextTrack': true,
        'previousTrack': true,
        'added': true,
        'playing': true,
        'songHalf': true,
        'loading': true,
        'stop': true,
        'shuffleToggle': true,
        'listChange': true,
        'play': true,
        'pause': true,
        'error': true,
        'preloading': true
      };
    }
  }]);

  return EventBus;
}();

var runtime = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = 'object' === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);
});

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

var runtimeModule = runtime;

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

var regenerator = runtimeModule;

// getting tag from 19.1.3.6 Object.prototype.toString()

var TAG$1 = _wks('toStringTag');
// ES3 wrong here
var ARG = _cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

var _classof = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
    // builtinTag case
    : ARG ? _cof(O)
    // ES3 arguments fallback
    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var _anInstance = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

// call something on iterator step with safe closing on error

var _iterCall = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) _anObject(ret.call(iterator));
    throw e;
  }
};

// check on default Array iterator

var ITERATOR$1 = _wks('iterator');
var ArrayProto = Array.prototype;

var _isArrayIter = function (it) {
  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR$1] === it);
};

var ITERATOR$2 = _wks('iterator');

var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$2]
    || it['@@iterator']
    || _iterators[_classof(it)];
};

var _forOf = createCommonjsModule(function (module) {
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);
  var f = _ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
    result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = _iterCall(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;
});

// 7.3.20 SpeciesConstructor(O, defaultConstructor)


var SPECIES = _wks('species');
var _speciesConstructor = function (O, D) {
  var C = _anObject(O).constructor;
  var S;
  return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
};

// fast apply, http://jsperf.lnkit.com/fast-apply/5
var _invoke = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

var process$1 = _global.process;
var setTask = _global.setImmediate;
var clearTask = _global.clearImmediate;
var MessageChannel = _global.MessageChannel;
var Dispatch = _global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer;
var channel;
var port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      _invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (_cof(process$1) == 'process') {
    defer = function (id) {
      process$1.nextTick(_ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(_ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = _ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {
    defer = function (id) {
      _global.postMessage(id + '', '*');
    };
    _global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in _domCreate('script')) {
    defer = function (id) {
      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {
        _html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(_ctx(run, id, 1), 0);
    };
  }
}
var _task = {
  set: setTask,
  clear: clearTask
};

var macrotask = _task.set;
var Observer = _global.MutationObserver || _global.WebKitMutationObserver;
var process$2 = _global.process;
var Promise$1 = _global.Promise;
var isNode$1 = _cof(process$2) == 'process';

var _microtask = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode$1 && (parent = process$2.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode$1) {
    notify = function () {
      process$2.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(_global.navigator && _global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise$1 && Promise$1.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise$1.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(_global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

// 25.4.1.5 NewPromiseCapability(C)


function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = _aFunction(resolve);
  this.reject = _aFunction(reject);
}

var f$7 = function (C) {
  return new PromiseCapability(C);
};

var _newPromiseCapability = {
	f: f$7
};

var _perform = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

var navigator = _global.navigator;

var _userAgent = navigator && navigator.userAgent || '';

var _promiseResolve = function (C, x) {
  _anObject(C);
  if (_isObject(x) && x.constructor === C) return x;
  var promiseCapability = _newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var _redefineAll = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else _hide(target, key, src[key]);
  } return target;
};

var SPECIES$1 = _wks('species');

var _setSpecies = function (KEY) {
  var C = typeof _core[KEY] == 'function' ? _core[KEY] : _global[KEY];
  if (_descriptors && C && !C[SPECIES$1]) _objectDp.f(C, SPECIES$1, {
    configurable: true,
    get: function () { return this; }
  });
};

var ITERATOR$3 = _wks('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR$3]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

var _iterDetect = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR$3]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR$3] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

var task = _task.set;
var microtask = _microtask();




var PROMISE = 'Promise';
var TypeError$1 = _global.TypeError;
var process = _global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = _global[PROMISE];
var isNode = _classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal;
var newGenericPromiseCapability;
var OwnPromiseCapability;
var Wrapper;
var newPromiseCapability = newGenericPromiseCapability = _newPromiseCapability.f;

var USE_NATIVE$1 = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[_wks('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && _userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError$1('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(_global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = _perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = _global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = _global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(_global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = _global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE$1) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    _anInstance(this, $Promise, PROMISE, '_h');
    _aFunction(executor);
    Internal.call(this);
    try {
      executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = _redefineAll($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(_speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = _ctx($resolve, promise, 1);
    this.reject = _ctx($reject, promise, 1);
  };
  _newPromiseCapability.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE$1, { Promise: $Promise });
_setToStringTag($Promise, PROMISE);
_setSpecies(PROMISE);
Wrapper = _core[PROMISE];

// statics
_export(_export.S + _export.F * !USE_NATIVE$1, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
_export(_export.S + _export.F * (_library || !USE_NATIVE$1), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return _promiseResolve(_library && this === Wrapper ? $Promise : this, x);
  }
});
_export(_export.S + _export.F * !(USE_NATIVE$1 && _iterDetect(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = _perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      _forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = _perform(function () {
      _forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

_export(_export.P + _export.R, 'Promise', { 'finally': function (onFinally) {
  var C = _speciesConstructor(this, _core.Promise || _global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return _promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return _promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

// https://github.com/tc39/proposal-promise-try




_export(_export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = _newPromiseCapability.f(this);
  var result = _perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

var promise$2 = _core.Promise;

var promise = createCommonjsModule(function (module) {
module.exports = { "default": promise$2, __esModule: true };
});

unwrapExports(promise);

var asyncToGenerator = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _promise2 = _interopRequireDefault(promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return _promise2.default.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};
});

var _asyncToGenerator = unwrapExports(asyncToGenerator);

var AudioManager = function () {
  function AudioManager() {
    _classCallCheck(this, AudioManager);

    if (!AudioManager.instance) {
      AudioManager.instance = this;
    }
    return AudioManager.instance;
  }

  _createClass(AudioManager, [{
    key: 'addAudioListeners',


    // todo do we need removeEventListeners?
    value: function addAudioListeners() {
      if (this.audio && this.listenersAdded === false) {
        this.audio.addEventListener('canplay', this.audioOnCanPlay.bind(this));
        this.audio.addEventListener('error', this.audioOnError.bind(this));
        this.audio.addEventListener('play', this.audioOnPlay.bind(this));
        this.audio.addEventListener('pause', this.audioOnPause.bind(this));
        if (this.shouldNotifyBeforeEnd === true || this.shouldNotifySongHalf === true) {
          this.audio.addEventListener('timeupdate', this.timeUpdate.bind(this));
        }
        if (this.shouldNotifyBeforeEnd === false) {
          this.audio.addEventListener('ended', this.next.bind(this));
        }
        this.audio.addEventListener('remoteprevious', this.previous.bind(this));
        this.audio.addEventListener('remotenext', this.next.bind(this));
      }
    }

    //todo why do "playing" here vs. "canplay"?

  }, {
    key: 'audioOnCanPlay',
    value: function audioOnCanPlay() {
      this.canPlayCalled = true;
      this.audio.play();
      this.triggerEvent('playing');
    }

    // Listener on audio timeupdate
    // Handles shouldNotifyBeforeEnd and shouldNotifySongHalf

  }, {
    key: 'timeUpdate',
    value: function timeUpdate() {
      if (this.shouldNotifyBeforeEnd === true && this.audio.duration > 0 && this.audio.duration - this.audio.currentTime < .5 && this.beforeEndNotified === false) {
        this.beforeEndNotified = true;
        this.next({ 'type': 'ended' });
      }
      if (this.shouldNotifySongHalf === true && this.songHalfNotified === false && this.audio.currentTime / this.audio.duration > .5) {
        this.songHalfNotified = true;
        this.triggerEvent('songHalf');
      }
    }

    // Trigger play event when audio play is triggered adding some useful data

  }, {
    key: 'audioOnPlay',
    value: function audioOnPlay(e) {
      this.triggerEvent('play');
    }

    // Trigger pause event when audio pause is triggered adding some useful data

  }, {
    key: 'audioOnPause',
    value: function audioOnPause(e) {
      this.triggerEvent('pause');
    }

    // Fires 'error' event song cannot load or has timed out 
    // Then calls next

  }, {
    key: 'audioOnError',
    value: function audioOnError() {
      clearTimeout(this.loadTimeoutFn);
      this.triggerEvent('error');
      this.next({ 'type': 'ended' });
    }

    // play a song at a given index

  }, {
    key: 'play',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(n) {
        var proposedSong, song;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.canPlayCalled = false;
                proposedSong = this.listManager.list[n];

                if (!proposedSong) {
                  _context.next = 20;
                  break;
                }

                this.eventBus.trigger('preloading', { 'song': proposedSong });

                if (!this.validatePlayFunction) {
                  _context.next = 17;
                  break;
                }

                _context.prev = 5;
                _context.next = 8;
                return this.validatePlayFunction(proposedSong);

              case 8:
                song = _context.sent;

                this._play(song, n);
                _context.next = 15;
                break;

              case 12:
                _context.prev = 12;
                _context.t0 = _context['catch'](5);

                console.error(_context.t0);

              case 15:
                _context.next = 18;
                break;

              case 17:
                this._play(proposedSong, n);

              case 18:
                _context.next = 21;
                break;

              case 20:
                throw new RangeError('Index out of bounds. \n        Got: ' + n + '. List length: ' + this.listManager.length + '\n      ');

              case 21:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[5, 12]]);
      }));

      function play(_x) {
        return _ref.apply(this, arguments);
      }

      return play;
    }()

    // play the song

  }, {
    key: '_play',
    value: function _play(song, n) {
      clearTimeout(this.loadTimeoutFn);
      this.isStopped = false;
      this.songHalfNotified = false;
      this.beforeEndNotified = false;
      this.listManager.position = n;
      this.audio.src = song.url;
      this.audio.load();
      this.triggerEvent('loading');
      if (this.loadTimeout !== -1) {
        this.loadTimeoutFn = setTimeout(this.timeoutLoading.bind(this), this.loadTimeout);
      }
    }

    // This is called when loadTimeout is reached
    // If song has not started, next is called

  }, {
    key: 'timeoutLoading',
    value: function timeoutLoading() {
      if (this.canPlayCalled === false) {
        this.audioOnError();
      }
    }

    // This will toggle paused state of audio. 
    // If stopped, will start playing first song

  }, {
    key: 'togglePlay',
    value: function togglePlay() {
      if (this.isStopped === true) {
        this.play(this.listMananager.position);
      } else {
        if (this.audio.paused) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }
      return this.audio.paused;
    }

    // This will pause the current audio

  }, {
    key: 'pause',
    value: function pause() {
      this.audio.pause();
    }

    // This will resume the current audio

  }, {
    key: 'resume',
    value: function resume() {
      this.audio.play();
    }

    // Return current audio properties plus some useful data

  }, {
    key: 'seek',


    // Seek audio by percentage of song
    // Percentage range = 0-1
    value: function seek(percentage) {
      if (!isNaN(this.audio.duration)) {
        this.audio.currentTime = Math.floor(percentage * this.audio.duration);
      }
    }

    // This is called to skip to the next song in the list
    // Called automatically when a song ends
    // If there are no more songs in the list, calles stop
    //todo - pass in forceStop to override userCanStop

  }, {
    key: 'next',
    value: function next(e) {
      // not user initiated
      if (e && e.type === 'ended') {
        if (this.listManager.position < this.listManager.length - 1 && this.listManager.autoNext === true) {
          this._next();
        } else {
          this.stop();
        }
      } else {
        // user initiated
        if (this.listManager.position < this.listManager.length - 1) {
          this._next();
        } else {
          if (this.userCanStop === true) {
            this.stop();
          }
        }
      }
    }

    // actually skip to the next song

  }, {
    key: '_next',
    value: function _next(e) {
      this.listManager.position = this.listManager.position + 1;
      this.play(this.listManager.position);
      this.triggerEvent('nextTrack');
    }

    // This is called to go to the previous song in the list
    // If smart_previous is true, it will go back to current song
    // when it is over 10 seconds in. Or else it will go to previous song

  }, {
    key: 'previous',
    value: function previous() {
      if (this.listManager.smartPrevious === true) {
        if (this.audio.currentTime > 10) {
          this.audio.currentTime = 0;
        } else if (this.listManager.position > 0) {
          this._previous();
        }
      } else if (this.listManager.position > 0) {
        this._previous();
      }
    }

    // actually go to the previous song

  }, {
    key: '_previous',
    value: function _previous() {
      this.listManager.position = this.listManager.position - 1;
      this.play(this.listManager.position);
      this.triggerEvent('previousTrack');
    }

    // This is called when we reach the end of the list
    // Reset position

  }, {
    key: 'stop',
    value: function stop() {
      this.isStopped = true;
      this.listManager.position = 0;
      this.eventBus.trigger('stop', {
        'audio': this.audioProperties
      });
    }
  }, {
    key: 'triggerEvent',
    value: function triggerEvent(type) {
      this.eventBus.trigger(type, {
        'song': this.listManager.song,
        'position': this.listManager.position,
        'audio': this.audioProperties
      });
    }
  }, {
    key: 'eventBus',
    get: function get() {
      if (!this._eventBus) {
        this._eventBus = new EventBus();
      }
      return this._eventBus;
    }
  }, {
    key: 'listManager',
    get: function get() {
      if (!this._listManager) {
        this._listManager = new ListManager();
      }
      return this._listManager;
    }
  }, {
    key: 'audio',
    get: function get() {
      return this._audio;
    },
    set: function set(_audio) {
      this._audio = _audio;
      this.addAudioListeners();
    }
  }, {
    key: 'listenersAdded',
    get: function get() {
      return this._listenersAdded || false;
    },
    set: function set(bool) {
      this._listenersAdded = bool;
    }
  }, {
    key: 'paused',
    get: function get() {
      if (this.audio !== undefined) {
        return this.audio.paused;
      }
      return false;
    }
  }, {
    key: 'shouldNotifyBeforeEnd',
    get: function get() {
      return this._shouldNotifyBeforeEnd || false;
    },
    set: function set(bool) {
      this._shouldNotifyBeforeEnd = bool;
    }

    // Boolean if we already fired the fake 'ended' event

  }, {
    key: 'beforeEndNotified',
    get: function get() {
      return this._beforeEndNotified || false;
    },
    set: function set(bool) {
      this._beforeEndNotified = bool;
    }
  }, {
    key: 'loadTimeout',
    get: function get() {
      return this._loadTimeout || 15000;
    },
    set: function set(num) {
      this._loadTimeout = num;
    }
  }, {
    key: 'shouldNotifySongHalf',
    get: function get() {
      return this._shouldNotifySongHalf || false;
    },
    set: function set(bool) {
      this._shouldNotifySongHalf = bool;
    }

    // Boolean if we already fired the song half event

  }, {
    key: 'songHalfNotified',
    get: function get() {
      return this._songHalfNotified || false;
    },
    set: function set(bool) {
      this._songHalfNotified = bool;
    }
  }, {
    key: 'isStopped',
    get: function get() {
      if (this._isStopped !== undefined) {
        return this._isStopped;
      }
      return true;
    },
    set: function set(bool) {
      this._isStopped = bool;
    }
  }, {
    key: 'validatePlayFunction',
    get: function get() {
      return this._validatePlayFunction;
    },
    set: function set(fn) {
      this._validatePlayFunction = fn;
    }
  }, {
    key: 'audioProperties',
    get: function get() {
      return {
        'paused': this.audio.paused,
        'isStopped': this.isStopped,
        'currentTime': this.audio.currentTime,
        'duration': this.audio.duration,
        'src': this.audio.src,
        'volume': this.audio.volume
      };
    }
  }]);

  return AudioManager;
}();



/**
 * @event PlayQueue~preloading
 * @description Fires when there an attempt to play a new song.
 * @type {object}
 * @property {PlayQueue~Song} song - The attempted song.
 */

/**
* @event PlayQueue~loading
* @description Fires when a new song is loading.
* @type {object}
* @property {PlayQueue~Song} song - The loading song.
*/

/**
 * @event PlayQueue~play
 * @description Fires when a song resumes.
 * @type {object}
 * @property {PlayQueue~Song} song - The playing song.
 * @property {number} position - Current position.
 * @property {PlayQueue~audioProperties} audio - various audio properties.
 */

/**
 * @event PlayQueue~playing
 * @description Fires when a new song starts playing.
 * @type {object}
 * @property {PlayQueue~Song} song - The playing song.
 * @property {number} position - Current position.
 * @property {PlayQueue~audioProperties} audio - various audio properties.
 */

/**
 * @event PlayQueue~pause
 * @description Fires when a song pauses.
 * @type {object}
 * @property {PlayQueue~Song} song - The playing song.
 * @property {number} position - Current position.
 * @property {PlayQueue~audioProperties} audio - various audio properties.
 */

/**
 * @event PlayQueue~error
 * @description Fires when a song fails to load.
 * @type {object}
 * @property {PlayQueue~Song} song - The playing song.
 * @property {number} position - Current position.
 * @property {PlayQueue~audioProperties} audio - various audio properties.
 */

/**
 * @event PlayQueue~songHalf
 * @description Fires when a song is played halfway through.
 * @type {object}
 * @property {PlayQueue~Song} song - The playing song.
 * @property {number} position - Current position.
 * @property {PlayQueue~audioProperties} audio - various audio properties.
 */

/**
 * @event PlayQueue~nextTrack
 * @description Fires when the next method is called. 
 * @type {object}
 * @property {PlayQueue~Song} song - The playing song.
 * @property {number} position - Current position.
 * @property {PlayQueue~audioProperties} audio - various audio properties.
 */

/**
 * @event PlayQueue~previousTrack
 * @description Fires when the previous method is called. 
 * @type {object}
 * @property {PlayQueue~Song} song - The playing song.
 * @property {number} position - Current position.
 * @property {PlayQueue~audioProperties} audio - various audio properties.
 */

/**
* @event PlayQueue~stop
* @description Fires when the last song in the list ends. 
* @type {object}
* @property {PlayQueue~Song} song - The playing song.
* @property {number} position - Current position.
* @property {PlayQueue~audioProperties} audio - various audio properties.
*/

// todo - create a state object with song, audio, isStopped, position, shuffle, etc

var ListManager = function () {
  function ListManager() {
    _classCallCheck(this, ListManager);

    if (!ListManager.instance) {
      ListManager.instance = this;
    }
    return ListManager.instance;
  }

  _createClass(ListManager, [{
    key: 'initFromLocalStorage',
    value: function initFromLocalStorage() {
      var lsList = localStorage.getItem(this.localStorageNS + ':list');
      if (lsList !== null) {
        this._list = JSON.parse(lsList);
      }
      var lsPosition = localStorage.getItem(this.localStorageNS + ':position');
      if (lsPosition !== null) {
        this._position = JSON.parse(lsPosition);
      }
      var lsShuffle = localStorage.getItem(this.localStorageNS + ':shuffle');
      if (lsShuffle !== null) {
        this._shuffle = JSON.parse(lsShuffle);
      }
      this._useLocalStorage = true;
    }
  }, {
    key: '_setPosition',
    value: function _setPosition(num) {
      this._position = num;
      if (this.useLocalStorage === true) {
        localStorage.setItem(this.localStorageNS + ':position', num);
      }
    }
  }, {
    key: 'addOriginalIndexToSong',
    value: function addOriginalIndexToSong(songs) {
      var _this = this;

      songs.forEach(function (item) {
        item._originalIndex = _this.originalIndex;
      });
    }

    // add songs to the list. Takes an array of objects,
    // a single object or a single url string

  }, {
    key: 'add',
    value: function add(songs) {
      var _this2 = this;

      var currentListLen = this.length;
      var added = [];
      if ((typeof songs === 'undefined' ? 'undefined' : _typeof(songs)) === 'object') {
        if (songs.length) {
          songs.forEach(function (song) {
            if (song.url) {
              added.push(song);
            }
          });
        } else {
          if (songs.url) {
            added.push(songs);
          }
        }
      } else if (typeof songs === 'string') {
        added.push({ 'url': songs });
      }
      if (this.limit > -1 && currentListLen + added.length > this.limit) {
        throw new RangeError('\n        List has ' + this.length + ' songs. \n        Adding ' + added.length + ' songs will go over limit (' + this.limit + ')\n      ');
      } else {
        this.addOriginalIndexToSong(added);
        if (this.shuffle === true) {
          var remainingPart = this.list.splice(this.position + 1);
          var shuffledPart = this.shuffleArray(remainingPart.concat(added));
          shuffledPart.forEach(function (item) {
            _this2.list.push(item);
          });
        } else {
          added.forEach(function (item) {
            _this2.list.push(item);
          });
        }
        this.listHasChanged(added, [], currentListLen, currentListLen);
      }
    }

    // remove a song from the list by index

  }, {
    key: 'remove',
    value: function remove(n) {
      var currentListLen = this.length;
      var returnValue = -1;
      if (this.list[n]) {
        if (this.position === n) {
          if (this.audioManager.isStopped === false) {
            this.next(true);
          }
        }
        if (this.position >= n && n !== 0) {
          this.position = this.position - 1;
        }
        var removed = this.list.splice(n, 1);
        this.listHasChanged([], removed, null, currentListLen);
        returnValue = n;
      }
      return returnValue;
    }

    // clear the list, reset position

  }, {
    key: 'clear',
    value: function clear() {
      if (this.length > 0) {
        this.list = [];
      }
      this.position = 0;
    }

    // move a song from one position in the list to another

  }, {
    key: 'move',
    value: function move(itemIndex, moveToIndex) {
      if (itemIndex === moveToIndex) {
        throw new RangeError('itemIndex cannot be equal to moveIndex');
      }
      if (itemIndex < 0) {
        throw new RangeError('itemIndex out of bounds');
      }
      if (moveToIndex < 0) {
        throw new RangeError('moveToIndex out of bounds');
      }
      if (this.length - 1 < itemIndex) {
        throw new RangeError('itemIndex out of bounds');
      }
      if (this.length - 1 < moveToIndex) {
        throw new TypeError('moveToIndex out of bounds');
      }
      var song = this.list.splice(itemIndex, 1);
      this.list.splice(moveToIndex, 0, song[0]);
      if (this.position === itemIndex) {
        this.position = moveToIndex;
      } else if (itemIndex < this.position && moveToIndex >= this.position) {
        this.position = this.position - 1;
      } else if (itemIndex > this.position && moveToIndex <= this.position) {
        this.position = this.position + 1;
      }
      listHasChanged([], [], null, this.length);
    }
  }, {
    key: 'shuffleArray',
    value: function shuffleArray(array) {
      var currentIndex = array.length,
          temporaryValue = void 0,
          randomIndex = void 0;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }
  }, {
    key: 'shuffleList',
    value: function shuffleList() {
      var _this3 = this;

      var before = this.list.splice(0, this.position);
      var currentSong = this.list.splice(0, 1);
      var after = this.list.splice(0);
      this.shuffleArray(before);
      this.shuffleArray(after);
      before.forEach(function (item) {
        _this3.list.push(item);
      });
      currentSong.forEach(function (item) {
        _this3.list.push(item);
      });
      after.forEach(function (item) {
        _this3.list.push(item);
      });
    }
  }, {
    key: 'unShuffleList',
    value: function unShuffleList() {
      this.list.sort(function (a, b) {
        return a._originalIndex - b._originalIndex;
      });
    }

    // Toggled shuffle state

  }, {
    key: 'toggleShuffle',
    value: function toggleShuffle(start) {
      if (this.shuffle === true) {
        this.shuffle = false;
      } else {
        this.shuffle = true;
      }
      return this.shuffle;
    }
  }, {
    key: 'listHasChanged',
    value: function listHasChanged(added, removed, positionAddedAt, oldListLength) {
      var frozenList = JSON.parse(JSON.stringify(this.list));
      this.eventBus.trigger('listChange', {
        'list': frozenList,
        'length': frozenList.length,
        'position': this.position,
        'added': added,
        'removed': removed,
        'positionAddedAt': positionAddedAt,
        'oldListLength': oldListLength,
        'shuffle': this.shuffle
      });
      if (this.useLocalStorage === true) {
        localStorage.setItem(this.localStorageNS + ':list', JSON.stringify(this.list));
      }
    }
  }, {
    key: 'eventBus',
    get: function get() {
      if (!this._eventBus) {
        this._eventBus = new EventBus();
      }
      return this._eventBus;
    }
  }, {
    key: 'audioManager',
    get: function get() {
      if (!this._audioManager) {
        this._audioManager = new AudioManager();
      }
      return this._audioManager;
    }
  }, {
    key: 'list',
    get: function get() {
      if (this._list === undefined) {
        this._list = [];
      }
      return this._list;
    },
    set: function set(array) {
      var currentList = [].concat(this.list);
      var removed = [];
      var added = [];
      var positionAddedAt = null;
      if (array.length > 0) {
        if (this.limit > -1 && array.length > this.limit) {
          throw new RangeError('\n          List has ' + this.length + ' songs. \n          Adding ' + array.length + ' songs will go over limit (' + this.limit + ')\n        ');
        } else {
          positionAddedAt = currentList.length;
          added = [].concat(array);
          this.addOriginalIndexToSong(added);
          if (this.shuffle === true) {
            this._list = this.shuffleArray(array);
          } else {
            this._list = array;
          }
        }
      } else {
        this._list = array;
        removed = currentList;
        this.position = 0;
        this.audioManager.stop();
      }
      this.listHasChanged(added, removed, positionAddedAt, currentList.length);
    }
  }, {
    key: 'length',
    get: function get() {
      return this.list.length;
    }
  }, {
    key: 'position',
    get: function get() {
      return this._position || 0;
    },
    set: function set(num) {
      if (num >= 0) {
        if (this.length > 0) {
          if (num <= this.length - 1) {
            this._setPosition(num);
          } else {
            throw new RangeError('Index out of bounds');
          }
        } else {
          if (num === 0) {
            this._setPosition(num);
          } else {
            throw new RangeError('Index out of bounds');
          }
        }
      } else {
        throw new RangeError('Index out of bounds');
      }
    }
  }, {
    key: 'limit',
    get: function get() {
      if (this._limit === undefined) {
        return -1;
      }
      return this._limit;
    },
    set: function set(num) {
      this._limit = num;
    }
  }, {
    key: 'song',
    get: function get() {
      if (this.list[this.position]) {
        return this.list[this.position];
      }
      return null;
    }
  }, {
    key: 'smartPrevious',
    get: function get() {
      if (this._smartPrevious !== undefined) {
        return this._smartPrevious;
      }
      return true;
    },
    set: function set(bool) {
      this._smartPrevious = bool;
    }
  }, {
    key: 'autoNext',
    get: function get() {
      if (this._autoNext !== undefined) {
        return this._autoNext;
      }
      return true;
    },
    set: function set(bool) {
      this._autoNext = bool;
    }
  }, {
    key: 'userCanStop',
    get: function get() {
      return this._userCanStop || false;
    },
    set: function set(bool) {
      this._userCanStop = bool;
    }
  }, {
    key: 'useLocalStorage',
    get: function get() {
      return this._useLocalStorage || false;
    },
    set: function set(bool) {
      var currentState = this.useLocalStorage;
      this._useLocalStorage = bool;
      if (currentState === false && bool === true) {
        //todo dont need to save after initital load
        localStorage.setItem(this.localStorageNS + ':list', JSON.stringify(this.list));
        localStorage.setItem(this.localStorageNS + ':position', JSON.stringify(this.position));
        localStorage.setItem(this.localStorageNS + ':shuffle', JSON.stringify(this.shuffle));
      }
      if (bool === false) {
        localStorage.removeItem(this.localStorageNS + ':list');
        localStorage.removeItem(this.localStorageNS + ':position');
        localStorage.removeItem(this.localStorageNS + ':shuffle');
      }
    }
  }, {
    key: 'shuffle',
    get: function get() {
      return this._shuffle || false;
    },
    set: function set(bool) {
      var currentState = this.shuffle;
      this._shuffle = bool;
      if (bool === true) {
        this.shuffleList();
      } else {
        this.unShuffleList();
      }
      if (bool !== currentState) {
        this.eventBus.trigger('shuffleToggled', { 'shuffle': bool });
      }
      if (this.useLocalStorage === true) {
        localStorage.setItem(this.localStorageNS + ':shuffle', JSON.stringify(bool));
      }
      if (this.length > 0) {
        this.listHasChanged([], [], null, this.length);
      }
    }
  }, {
    key: 'localStorageNS',
    get: function get() {
      if (this._localStorageNS !== undefined) {
        return this._localStorageNS;
      }
      return 'playqueue';
    },
    set: function set(str) {
      if (str !== this.localStorageNS) {
        var lsList = localStorage.getItem(this.localStorageNS + ':list');
        var lsPosition = localStorage.getItem(this.localStorageNS + ':position');
        var lsShuffle = localStorage.getItem(this.localStorageNS + ':shuffle');
        if (lsList !== null) {
          localStorage.removeItem(this.localStorageNS + ':list');
          localStorage.setItem(str + ':list', lsList);
        }
        if (lsPosition !== null) {
          localStorage.removeItem(this.localStorageNS + ':position');
          localStorage.setItem(str + ':position', lsPosition);
        }
        if (lsShuffle !== null) {
          localStorage.removeItem(this.localStorageNS + ':shuffle');
          localStorage.setItem(str + ':shuffle', lsShuffle);
        }
        this._localStorageNS = str;
      }
    }
  }, {
    key: 'originalIndex',
    get: function get() {
      if (this._originalIndex === undefined) {
        this._originalIndex = 0;
      } else {
        this._originalIndex = this._originalIndex + 1;
      }
      return this._originalIndex;
    }
  }]);

  return ListManager;
}();



/**
* @event PlayQueue~listChange
* @description Fires when any change to the list is made.
* @type {object}
* @property {array} list - The full list.
* @property {number} length - Current length of the list.
* @property {number} position - The current position.
* @property {array} added - Any new songs added to the list.
* @property {array} removed - Any new songs removed from the list.
* @property {number} positionAddedAt - If new songs where added, the position they were added at.
* @property {number} oldListLength - The list length before any changes were made.
* @property {boolean} shuffle - Current shuffle state.
*/

/**
* @event PlayQueue~shuffleToggled
* @description Fires when the shuffle state changes.
* @property {boolean} shuffle - Current shuffle state.
*/

var PlayQueue = function () {

  /**
   * Create a PlayQueue
   * @class PlayQueue
   * @param {Object} opts
   * @param {Audio} opts.audio - The underlying audio object.
   * @param {number} [opts.limit=-1] - If set will limit the max length of the [list]{@link PlayQueue#list}
   * @param {number} [opts.loadTimeout=15000] - Number of milliseconds to wait for a song to load before 
   * moving on to next song
   * @param {boolean} [opts.useLocalStorage=false] - If true will save [list]{@link PlayQueue#list}, 
   * [position]{@link PlayQueue#position}, and [shuffle]{@link PlayQueue#shuffle} state 
   * in localStorage. Subsequent page loads will initialize with these saved values.
   * @param {string} [opts.localStorageNS='playqueue'] - If useLocalStorage is true, items will be saved
   * with the default namespace 'playqueue'. You can change the namespace to a different value.
   * @param {boolean} [opts.shouldNotifySongHalf=false] - If true, will trigger 'songHalf' event 
   *  at half point of playing song.
   * @param {boolean} [opts.shouldNotifyBeforeEnd=false] - If true, will trigger 'ended' event manually
   *  when there is .5s remaining in song. Fix for mobile Safari which doesn't always fire 'ended' 
   *  event when song ends.
   * 
   * @example 
   * import {PlayQueue} from 'playqueue'; 
   *
   * const audio = new Audio();
   *
   * const playQueue = new PlayQueue({
   *   'audio': audio,
   *   'limit': 200,
   *   'useLocalStorage': true,
   *   'shouldNotifySongHalf': true,
   * });
   */
  function PlayQueue(opts) {
    _classCallCheck(this, PlayQueue);

    if (opts) {
      if (opts.audio) {
        this.audio = opts.audio;
        this.setOpts(opts);
      } else {
        throw new Error("PlayQueue constructor requires an Audio object");
      }
    } else {
      throw new Error("PlayQueue constructor requires an Audio object");
    }

    //todo - enforce types when using setters. Throw TypeError

    //todo - what is this?
    /*
    // should we first check the connection type
    // before setting the timeout time?
    // for Cordova only
    this.checkConnection = false;*/

    // todo - where does this go?
    /* 
    // Which song properties do we need?
    var savedSongProperties = ['url', '_listPosition'];
    this.savedSongProperties = opts.savedSongProperties || savedSongProperties;
    if(_.indexOf(this.savedSongProperties, '_listPosition') === -1){
        this.savedSongProperties.push('_listPosition');
    }*/
  }

  _createClass(PlayQueue, [{
    key: 'setOpts',
    value: function setOpts(opts) {
      var _this = this;

      var settableOpts = ['shouldNotifyBeforeEnd', 'shouldNotifySongHalf', 'loadTimeout', 'limit', 'localStorageNS'];
      settableOpts.forEach(function (settableOpt) {
        if (opts[settableOpt] !== undefined) {
          _this[settableOpt] = opts[settableOpt];
        }
      });
      if (opts.useLocalStorage === true) {
        this.listManager.initFromLocalStorage();
      }
    }
  }, {
    key: 'add',


    /**
     * Add one or more Songs to the list.
     * @method
     * @param {(PlayQueue~Song|PlayQueue~Song[]|string)} params - Song object or array. If string, pass in url of the song.
     * @throws {RangeError} Added songs cannot exceed limit if set.
     * @example // add multiple songs
     * playQueue.add([
     *   {'url': '1.mp3', 'title': 'One', 'artist': 'Cool Band', 'album': 'The Hits'},
     *   {'url': '2.mp3', 'title': 'Two', 'artist': 'Cool Band', 'album': 'The Hits'}
     * ]);
     * @example // add a single song
     * playQueue.add({'url': '1.mp3', 'title': 'One', 'artist': 'Cool Band', 'album': 'The Hits'});
     * @example // add a single song with just a url
     * playQueue.add('1.mp3');
     */
    value: function add(songs) {
      this.listManager.add(songs);
    }

    /**
     * Remove a Song from the list by index number.
     * @method
     * @param {number} index - The index number
     * @returns {number} The index removed or -1 if no song was found at that index.
     */

  }, {
    key: 'remove',
    value: function remove(index) {
      return this.listManager.remove(index);
    }

    /**
     * Clear the list and resets position to 0.
     * @method
     * @param {number} index - The index number
     */

  }, {
    key: 'clear',
    value: function clear() {
      this.listManager.clear();
    }

    /**
     * Move a Song from one position in the list to another.
     * @method
     * @param {number} songIndex - The index number of the song to move
     * @param {number} moveIndex - The index number to move the song to. Must be greater than 0 and less than
     * the list length.
     * @throws {RangeError} itemIndex cannot be equal to moveIndex
     * @throws {RangeError} itemIndex out of bounds
     * @throws {RangeError} moveToIndex out of bounds
     */

  }, {
    key: 'move',
    value: function move(songIndex, moveIndex) {
      return this.listManager.remove(index);
    }

    /**
     * Toggle the shuffle state.
     * @method
     * @returns {boolean} The new shuffle state.
     */

  }, {
    key: 'toggleShuffle',
    value: function toggleShuffle() {
      return this.listManager.toggleShuffle();
    }

    // Audio Manager

    //todo can make this an object or selector
    /**
     * The underlying audio object.  
     * @member
     * @type {Audio}
     */

  }, {
    key: 'play',


    /**
     * Play a song at a specific index.   
     * @method
     * @param {number} [index=0] - The index to play.
     * @throws {RangeError} Index must be less than list length.
     */
    value: function play() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      this.audioManager.play(index);
    }

    /**
     * Resume/pause the current song.  
     * @method
     * @returns {boolean} The new paused state.
     */

  }, {
    key: 'togglePlay',
    value: function togglePlay() {
      return this.audioManager.togglePlay();
    }

    /**
     * Pause the current song.  
     * @method
     */

  }, {
    key: 'pause',
    value: function pause() {
      this.audio.pause();
    }

    /**
     * Resume the current song.  
     * @method
     */

  }, {
    key: 'resume',
    value: function resume() {
      this.audio.resume();
    }

    /**
     * Seek to a position in the current song.   
     * @method
     * @param {number} percentage - 0-1
     */

  }, {
    key: 'seek',
    value: function seek(percentage) {
      this.audioManager.seek(percentage);
    }

    /**
     * Skip to the next song in the list.   
     * @method
     */

  }, {
    key: 'next',
    value: function next() {
      this.audioManager.next();
    }

    /**
     * Go to the previous song in the list.  
     * @method
     */

  }, {
    key: 'previous',
    value: function previous() {
      this.audioManager.previous();
    }

    /**
     * Stop playback. Resets position to 0.  
     * @method
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.audioManager.stop();
    }

    /**
     * Various audio properties.
     * @member
     * @type {object}
     * @property {PlayQueue~audioProperties} audio
     * @readonly
     */

  }, {
    key: 'on',


    // Event Bus

    /**
     * @method
     * @description Add an event listener. [View all events]{@link PlayQueue~event:error}.
     * @param {string} type - The name of the event to listen on.
     * @param {function} listener - The callback function for when this event is triggered.
     */
    value: function on(type, listener) {
      this.eventBus.on(type, listener, true);
    }

    /**
     * @method
     * @description Remove an event listener. 
     * @param {string} type - The name of the event to remove.
     * @param {function} [listener] - The callback function for when this event is triggered. If no listener
     * is provided, all listeners of the type will be removed.
     */

  }, {
    key: 'off',
    value: function off(type, listener) {
      this.eventBus.off(type, listener);
    }
  }, {
    key: 'listManager',
    get: function get() {
      if (!this._listManager) {
        this._listManager = new ListManager();
      }
      return this._listManager;
    }
  }, {
    key: 'audioManager',
    get: function get() {
      if (!this._audioManager) {
        this._audioManager = new AudioManager();
      }
      return this._audioManager;
    }
  }, {
    key: 'eventBus',
    get: function get() {
      if (!this._eventBus) {
        this._eventBus = new EventBus();
      }
      return this._eventBus;
    }

    // List Manager


    /**
     * Get or set the list of songs. If set, the entire list will be replaced. Use add or remove to manipulate
     * the list without replacing the whole list.
     * @member
     * @type {PlayQueue~Song[]}
     */

  }, {
    key: 'list',
    get: function get() {
      return this.listManager.list;
    },
    set: function set(array) {
      this.listManager.list = array;
    }

    /**
     * Length of list.
     * @member
     * @type {number}
     * @readonly
     */

  }, {
    key: 'length',
    get: function get() {
      return this.list.length;
    }

    /**
     * Current playing song.
     * @member
     * @type {(PlayQueue~Song|null)}
     * @readonly
     */

  }, {
    key: 'song',
    get: function get() {
      return this.listManager.song;
    }

    /**
     * Get or set the position of the current playing song in list.
     * @member
     * @type {number}
     * @readonly
     * @throws {RangeError} Index must be less than list length.
     */

  }, {
    key: 'position',
    get: function get() {
      return this.listManager.position;
    }

    /**
     * If true, calling 'previous' method will start current song playing again if it is more than 10 seconds
     * in. If false, will go back to previous song in list.
     * @member
     * @type {boolean} 
     * @default true
     */

  }, {
    key: 'smartPrevious',
    get: function get() {
      return this.listManager.smartPrevious;
    },
    set: function set(bool) {
      this.listManager.smartPrevious = bool;
    }
  }, {
    key: 'userCanStop',


    /**
     * If true, on last song in list, user can click next and it will immediatelly end song and trigger 
     * 'stop' event.
     * @member
     * @type {boolean} 
     * @default false
     */
    get: function get() {
      return this.listManager.userCanStop;
    },
    set: function set(bool) {
      this.listManager.userCanStop = bool;
    }
  }, {
    key: 'autoNext',


    /**
     * If true, we should automatically go to next song when current song ends. Good to set to false if  
     * client goes offline so it doesn't skip through all songs.
     * @member
     * @type {boolean} 
     * @default true
     */
    get: function get() {
      return this.listManager.autoNext;
    },
    set: function set(bool) {
      this.listManager.autoNext = bool;
    }

    /**
     * If true, list, position, and shuffled state will be stored in localStorage and set on page load.
     * @member
     * @type {boolean} 
     * @default false
     */

  }, {
    key: 'useLocalStorage',
    get: function get() {
      return this.listManager.useLocalStorage;
    },
    set: function set(bool) {
      this.listManager.useLocalStorage = bool;
    }

    /**
     * If set will limit the max length of the list. -1 means no limit.
     * @member
     * @type {number} 
     * @default -1
     */

  }, {
    key: 'limit',
    get: function get() {
      return this.listManager.limit;
    },
    set: function set(num) {
      this.listManager.limit = num;
    }

    /**
     * If set to true, will shuffle the current list. Setting back to false will revert to original list order.
     * @member
     * @type {boolean} 
     * @default false
     */

  }, {
    key: 'shuffle',
    get: function get() {
      return this.listManager.shuffle;
    },
    set: function set(bool) {
      this.listManager.shuffle = bool;
    }

    /**
     * Namespace for localStorage items. Items will be saved like 'namespace:itemName'
     * @member
     * @type {string} 
     * @default 'playqueue'
     */

  }, {
    key: 'localStorageNS',
    get: function get() {
      return this.listManager.localStorageNS;
    },
    set: function set(str) {
      this.listManager.localStorageNS = str;
    }
  }, {
    key: 'audio',
    get: function get() {
      return this.audioManager.audio;
    },
    set: function set(_audio) {
      this.audioManager.audio = _audio;
    }

    /**
     * If true, will trigger 'ended' event manually when there is .5s remaining in song. 
     * Fix for mobile Safari which doesn't always fire 'ended' event when song ends. 
     * @member
     * @type {boolean}
     * @default false
     * @readonly
     */

  }, {
    key: 'shouldNotifyBeforeEnd',
    get: function get() {
      return this.audioManager.shouldNotifyBeforeEnd;
    }

    /**
     * Number of milliseconds waited before deciding the current song loading is not going to load 
     * and will skip to next song
     * @member
     * @type {number}
     * @default 15000
     */

  }, {
    key: 'loadTimeout',
    get: function get() {
      return this.audioManager.loadTimeout;
    },
    set: function set(num) {
      this.audioManager.loadTimeout = num;
    }

    /**
     * If true, will trigger 'songHalf' event at half point of playing song. 
     * @member
     * @type {boolean}
     * @default false
     * @readonly
     */

  }, {
    key: 'shouldNotifySongHalf',
    get: function get() {
      return this.audioManager.shouldNotifySongHalf;
    }

    /**
     * If a song is playing or paused will return false.
     * @member
     * @type {boolean}
     * @default true
     * @readonly
     */

  }, {
    key: 'isStopped',
    get: function get() {
      return this.audioManager.isStopped;
    }

    /**
     * If set, before loading a song, this function will be called. It must return a promise. Promise must
     * resolve with a [Song]{@link PlayQueue~Song} object (or reject).  
     * @member
     * @type {function}
     */

  }, {
    key: 'validatePlayFunction',
    get: function get() {
      return this.audioManager.validatePlayFunction;
    },
    set: function set(fn) {
      this.audioManager.validatePlayFunction = fn;
    }
  }, {
    key: 'audioProperties',
    get: function get() {
      return this.audioManager.audioProperties;
    }
  }]);

  return PlayQueue;
}();



/**
 * @typedef PlayQueue~audioProperties
 * @description - various audio properties.
 * @type {object}
 * @property {boolean} paused - Paused state of audio.
 * @property {boolean} isStopped - Stopped state of playQueue.
 * @property {number} currentTime - Current time of audio.
 * @property {number} duration - Duration time of audio.
 * @property {string} src - Src time of audio.
 * @property {string} volume - Volume time of audio.
 */

/**
* @typedef PlayQueue~Song
* @description - Expected object for list.
* @type {object}
* @property {string} url - The local or remote url to play.
* @property {string} [title] - The name of the song.
* @property {string} [artist] - The song's artist.
* @property {string} [album] - Album the song appears on.
* @property {string} [coverart] - Image url for album art.
*/

exports.PlayQueue = PlayQueue;

Object.defineProperty(exports, '__esModule', { value: true });

})));
