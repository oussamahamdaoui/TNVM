// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this,
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function() {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"iyk8B":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "c22175d22bace513";
module.bundle.HMR_BUNDLE_ID = "504ccad16ed8a0c2"; // @flow
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {
            });
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets /*: {|[string]: boolean|} */ , acceptedAssets /*: {|[string]: boolean|} */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == 'https:' && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? 'wss' : 'ws';
    var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
    // $FlowFixMe
    ws.onmessage = function(event /*: {data: string, ...} */ ) {
        checkedAssets = {
        } /*: {|[string]: boolean|} */ ;
        acceptedAssets = {
        } /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        var data /*: HMRMessage */  = JSON.parse(event.data);
        if (data.type === 'update') {
            // Remove error overlay if there is one
            removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH
            );
            // Handle HMR Update
            var handled = false;
            assets.forEach((asset)=>{
                var didAccept = asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
                if (didAccept) handled = true;
            });
            if (handled) {
                console.clear();
                assets.forEach(function(asset) {
                    hmrApply(module.bundle.root, asset);
                });
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else window.location.reload();
        }
        if (data.type === 'error') {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
            }
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function(e) {
        console.warn('[parcel] 🚨 Connection to the HMR server was lost');
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log('[parcel] ✨ Error resolved');
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
        errorHTML += `\n      <div>\n        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">\n          🚨 ${diagnostic.message}\n        </div>\n        <pre>\n          ${stack}\n        </pre>\n        <div>\n          ${diagnostic.hints.map((hint)=>'<div>' + hint + '</div>'
        ).join('')}\n        </div>\n      </div>\n    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    link.getAttribute('href').split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') {
        reloadCSS();
        return;
    }
    let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
    if (deps) {
        var fn = new Function('require', 'module', 'exports', asset.output);
        modules[asset.id] = [
            fn,
            deps
        ];
    } else if (bundle.parent) hmrApply(bundle.parent, asset);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) return true;
    return getParents(module.bundle.root, id).some(function(v) {
        return hmrAcceptCheck(v[0], v[1], null);
    });
}
function hmrAcceptRun(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData = {
    };
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) // $FlowFixMe[method-unbinding]
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"8dZPq":[function(require,module,exports) {
const { html , $  } = require('@forgjs/noframework');
const VM = require('./VM');
const App = ()=>{
    const DomElement = html`\n    <div class="app">\n        ${VM()}\n        <div class="floor"></div>\n        <div class="light"></div>\n    </div>\n    `;
    return DomElement;
};
document.body.append(App());

},{"./VM":"4l0QT","@forgjs/noframework":"ahxX2"}],"4l0QT":[function(require,module,exports) {
const { html , $  } = require('@forgjs/noframework');
const VM = ()=>{
    const DomElement = html`<div class="vending-machine">\n        <div class="door">\n            <div class="nail"></div>\n            <div class="nail"></div>\n            <div class="nail"></div>\n            <div class="nail"></div>\n            <div class="glass-shadow"></div>\n            <div class="glass">\n                <div class="cube top"></div>\n                <div class="cube left"></div>\n                <div class="cube bot"></div>\n                <div class="cube right"></div>\n                <div class="glaire"></div>\n                <div class="shelves">\n                    <div class="shelve">\n                        <div class="product" position="11" style="--drop:400%;">\n                            <img src="one.png">\n                            <img src="one.png">\n                            <div class="position">11</div>\n                        </div>\n                        <div class="product" position="12" style="--drop:400%;">\n                            <img src="two.png">\n                            <div class="position">12</div>\n                        </div>\n                        <div class="product" position="13" style="--drop:400%;">\n                            <img src="two.png">\n                            <div class="position">13</div>\n                        </div>\n                    </div>\n                    <div class="shelve">\n                        <div class="product" position="21" style="--drop:300%;">\n                            <img src="one.png">\n                            <div class="position">21</div>\n                        </div>\n                        <div class="product" position="22" style="--drop:300%;">\n                            <div class="position">22</div>\n                        </div>\n                        <div class="product" position="23" style="--drop:300%;">\n                            <div class="position">23</div>\n                        </div>\n                    </div>\n                    <div class="shelve">\n                        <div class="product" position="31" style="--drop:200%;">\n                            <div class="position">31</div>\n                        </div>\n                        <div class="product" position="32" style="--drop:200%;">\n                            <img src="one.png">\n                            <div class="position" >32</div>\n                        </div>\n                        <div class="product" position="33" style="--drop:200%;">\n                            <div class="position">33</div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            \n            <div class="trap">\n                <div class="cube-wrapper">\n                    <div class="cube top"></div>\n                    <div class="cube left"></div>\n                    <div class="cube bot"></div>\n                    <div class="cube right"></div>\n                    <div class="cube back"></div>\n                    <img src="one.png">\n                </div>\n                <div class="trap-door-wrapper">\n                    <div class="trap-door">\n                        <div class="glaire"></div>\n                        <div class="lid">PULL</div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="buttons">\n            <div class="nail"></div>\n            <div class="nail"></div>\n            <div class="nail"></div>\n            <div class="nail"></div>\n            <div class="pad">\n                <div class="screen">\n                   <span class="selected-item"></span>\n                </div>\n                <div class="keyboard">\n                    <button type="button" class="button">1</button>\n                    <button type="button" class="button">2</button>\n                    <button type="button" class="button">3</button>\n                    <button type="button" class="button">4</button>\n                    <button type="button" class="button">5</button>\n                    <button type="button" class="button">6</button>\n                    <button type="button" class="button green">OK</button>\n                </div>\n                <div class="card">\n                    <div class="top">PAYE</div>\n                    <div class="circle"></div>\n                    <div class="cb"></div>\n                </div>\n            </div>\n        </div>\n        <div class="foot left"></div>\n        <div class="foot right"></div>\n        <div class="bottom"></div>\n    </div>`;
    const keyboard = $('.keyboard', DomElement);
    const selectedItem = $('.selected-item', DomElement);
    const trap = $('.trap', DomElement);
    const drop = (elem)=>{
        if (!elem || !$('img', elem)) return;
        $('img', elem).classList.add('drop');
        if ($('img', trap).classList.contains('drop')) $('img', trap).className = '';
        $('img', trap).src = $('img', elem).src;
        elem.parentNode.classList.add('drop');
        const css = window.getComputedStyle($('img', elem));
        const timeout = parseInt(css.animationDuration) * 620;
        const pos = Array.from($('img', elem).parentNode.parentNode.children).indexOf($('img', elem).parentNode);
        setTimeout(()=>{
            $('img', trap).classList.add(`pos${pos}`);
            $('img', trap).classList.add('drop');
        }, timeout);
        $('img', elem).addEventListener('animationend', ()=>{
            $('img', elem).remove();
        });
    };
    keyboard.addEventListener('click', (e)=>{
        if (!e.target.classList.contains('button')) return;
        if (e.target.classList.contains('green')) {
            if (selectedItem.innerHTML.length < 2) return;
            const id = selectedItem.innerHTML;
            drop($(`[position="${id}"]`, DomElement));
            selectedItem.innerHTML = "";
        } else selectedItem.innerHTML = (selectedItem.innerHTML + e.target.innerHTML).slice(-2);
    });
    return DomElement;
};
module.exports = VM;

},{"@forgjs/noframework":"ahxX2"}],"ahxX2":[function(require,module,exports) {
/* eslint-disable no-underscore-dangle */ // Selectors
/**
 *
 * @param {String} selector
 * @param {Node} element
 *
 * @return {Node}
 */ const $ = (selector, element = document)=>element.querySelector(selector)
;
/**
 *
 * @param {String} selector
 * @param {Node} element
 *
 * @return {[Node]}
 */ const $$ = (selector, element = document)=>{
    const ret = Array.from(element.querySelectorAll(selector));
    ret.addEventListener = (...params)=>{
        ret.forEach((e)=>e.addEventListener(...params)
        );
    };
    return ret;
};
// templating
const allNodes = (arr)=>Array.isArray(arr) && arr.reduce((acc, current)=>acc && current instanceof Node
    , true)
;
/**
 * Creates an Node element from string
 * Warning: you should escape any untreated string
 * @param {[String]} stringParts
 * @param {[Promise|Node|[Node]]} inBetweens
 *
 * @return {Node}
 */ const html = (stringParts, ...inBetweens)=>{
    let ht = '';
    stringParts.forEach((part, index)=>{
        if (allNodes(inBetweens[index])) ht += part + inBetweens[index].map((e, i)=>`<template style="display:none" temp-id='${index}' arr-id="${i}"></template>`
        ).join('');
        else if (!(inBetweens[index] instanceof Node) && !(inBetweens[index] instanceof Promise)) ht += inBetweens[index] ? part + inBetweens[index] : part;
        else ht += inBetweens[index] ? `${part}<template style="display:none" temp-id='${index}'></template>` : part;
    });
    const template = document.createElement('template');
    template.innerHTML = ht.trim();
    const ret = template.content.firstChild;
    $$('[temp-id]', ret).forEach((e)=>{
        const id = parseInt(e.getAttribute('temp-id'), 10);
        const arrId = parseInt(e.getAttribute('arr-id'), 10);
        const target = inBetweens[id][arrId] ? inBetweens[id][arrId] : inBetweens[id];
        if (target instanceof Promise) target.then((resp)=>{
            if (resp instanceof Node) e.parentElement.replaceChild(resp, e);
            else e.parentElement.replaceChild(document.createTextNode(resp), e);
        });
        else e.parentElement.replaceChild(target, e);
    });
    return ret;
};
/**
 * empties a node
 * @param {Node} element
 *
 */ const emptyElement = (element)=>{
    while(element.firstChild)element.removeChild(element.firstChild);
};
/**
 * A simple EventManager class that allows you to dispatch events and subscribe to them
 */ class EventManager {
    constructor(){
        this.events = {
            '*': []
        };
    }
    /**
   *
   * @param {String} eventName
   * @param {Function} callback
   */ unsubscribe(eventName, callback) {
        this.events[eventName] = this.events[eventName].filter((e)=>e !== callback
        );
    }
    /**
   *
   * @param {String} eventName
   * @param {Function} callback
   */ subscribe(eventName, callback) {
        this.events[eventName] = this.events[eventName] ? this.events[eventName] : [];
        this.events[`before-${eventName}`] = this.events[`before-${eventName}`] ? this.events[`before-${eventName}`] : [];
        this.events[`after-${eventName}`] = this.events[`after-${eventName}`] ? this.events[`after-${eventName}`] : [];
        this.events[eventName].push(callback);
    }
    /**
   *
   * @param {String} eventName
   */ clearEvent(eventName) {
        delete this.events[`before-${eventName}`];
        delete this.events[`after-${eventName}`];
        delete this.events[eventName];
    }
    /**
   *
   * @param {String} eventName
   * @param {any} params
   */ emit(eventName, ...params) {
        this.events[eventName] = this.events[eventName] ? this.events[eventName] : [];
        this.events[`before-${eventName}`] = this.events[`before-${eventName}`] ? this.events[`before-${eventName}`] : [];
        this.events[`after-${eventName}`] = this.events[`after-${eventName}`] ? this.events[`after-${eventName}`] : [];
        this.events[`before-${eventName}`].forEach((callback)=>{
            callback(...params);
        });
        this.events[eventName].forEach((callback)=>{
            callback(...params);
        });
        this.events[`after-${eventName}`].forEach((callback)=>{
            callback(...params);
        });
        this.events['*'].forEach((callback)=>{
            callback(eventName, ...params);
        });
    }
}
const fHash = (str)=>{
    let hash = 0;
    for(let i = 0; i < str.length; i += 1){
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char; // eslint-disable-line
        hash &= hash; // eslint-disable-line
    }
    return hash;
};
/**
 *
 * @param {Function} fn The function to be cached
 * @param {Number} storageTime cache time in ms
 * @return {Function}
 */ const cache = (fn, storageTime)=>{
    const CALLS = {
    };
    const isOutOfTime = (ms)=>storageTime ? +Date.now() - ms > storageTime : false
    ;
    return (...args)=>{
        const key = fHash(JSON.stringify(args));
        if (!CALLS[key] || isOutOfTime(CALLS[key].lastCall)) {
            CALLS[key] = {
            };
            CALLS[key].resp = fn(...args);
            CALLS[key].lastCall = Date.now();
        }
        return CALLS[key].resp;
    };
};
/**
 *
 * @param {String} string
 * @return {String}
 */ const escape = (string)=>{
    const htmlReg = /["'&<>]/;
    const str = `${string}`;
    const match = htmlReg.exec(str);
    if (!match) return str;
    let escaped = '';
    let ret = '';
    let index = 0;
    let lastIndex = 0;
    for(index = match.index; index < str.length; index += 1){
        switch(str.charCodeAt(index)){
            case 34:
                escaped = '&quot;';
                break;
            case 38:
                escaped = '&amp;';
                break;
            case 39:
                escaped = '&#39;';
                break;
            case 60:
                escaped = '&lt;';
                break;
            case 62:
                escaped = '&gt;';
                break;
            default:
                continue;
        }
        if (lastIndex !== index) ret += str.substring(lastIndex, index);
        lastIndex = index + 1;
        ret += escaped;
    }
    return lastIndex !== index ? ret + str.substring(lastIndex, index) : ret;
};
class Router {
    /**
   * @callback routingFunction Specifies if routing should happen to this pageName
   * @param {Location} url the value of document.location
   * @param {String} pageName the name of the page
   * @returns {Boolean} if true routes to pageName
   * */ /**
   * @callback animationFunction Specifies the transition on routing
   * @param {Node} currentPage the current page element
   * @param {Node} destinationPage the destinationPage element
   * (this element is not in the dom if you want to animate you should first add it to the dom)
   * */ /**
   * Creates a router element
   * @param {EventManager} eventManager an event manager object
   * @param {String} pageNotFound the name of the 404 page
   */ constructor(eventManager, pageNotFound){
        this.eventManager = eventManager;
        this.ROUTES = {
        };
        this.currentPage = html`<div></div>`;
        this.pageNotFound = pageNotFound;
        this.eventManager.subscribe('reroute', (url, title, data)=>{
            window.history.pushState(data, title, url);
            this.onReroute(document.location);
        });
        window.addEventListener('popstate', (...params)=>{
            this.onReroute(document.location, ...params);
        });
    }
    /**
 *
 * @param {String} pageName the name of the page
 * @param {Node} component the page Node element
 * @param {routingFunction} routingFunction Specifies if routing should happen to this pageName
 * @param {animationFunction} animationFunction Specifies the transition on routing
 */ set(pageName, component, routingFunction, animationFunction) {
        this.ROUTES[pageName] = {
            component,
            pageName,
            routingFunction: routingFunction || Router.defaultRoutingFunction,
            animationFunction: animationFunction || Router.defaultAnimationFunction
        };
    }
    static defaultRoutingFunction(url, pageName) {
        return pageName === url.pathname;
    }
    static defaultAnimationFunction(from, to) {
        from.replaceWith(to);
    }
    onReroute(url) {
        let rerouted = false;
        Object.values(this.ROUTES).forEach((route)=>{
            if (route.routingFunction(url, route.pageName)) {
                route.animationFunction(this.currentPage, route.component);
                this.currentPage = route.component;
                this.eventManager.emit('rerouted', url, route.component, route.pageName);
                rerouted = true;
            }
        });
        if (rerouted === false) {
            const route = this.ROUTES[this.pageNotFound];
            route.animationFunction(this.currentPage, route.component);
            this.currentPage = route.component;
            this.eventManager.emit('rerouted', url, route.component, route.pageName);
            rerouted = true;
        }
    }
    /**
   * reroutes to the document.location and returns the router element
   */ init() {
        this.eventManager.emit('reroute', document.location);
        return this.currentPage;
    }
}
module.exports = {
    $,
    $$,
    html,
    escape,
    EventManager,
    emptyElement,
    cache,
    Router
};

},{}]},["iyk8B","8dZPq"], "8dZPq", "parcelRequirec30e")

//# sourceMappingURL=index.6ed8a0c2.js.map
