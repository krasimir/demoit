!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=5)}([function(t,e,n){t.exports=n(6)},function(t,e){function n(t,e,n,r,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void n(t)}c.done?e(u):Promise.resolve(u).then(r,o)}t.exports=function(t){return function(){var e=this,r=arguments;return new Promise(function(o,i){var a=t.apply(e,r);function c(t){n(a,o,i,c,u,"next",t)}function u(t){n(a,o,i,c,u,"throw",t)}c(void 0)})}}},function(t,e,n){var r=n(8),o=n(9),i=n(10);t.exports=function(t){return r(t)||o(t)||i()}},function(t,e,n){var r=n(11);t.exports=function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},o=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),o.forEach(function(e){r(t,e,n[e])})}return t}},function(t,e,n){var r=n(12),o=n(13),i=n(14);t.exports=function(t,e){return r(t)||o(t,e)||i()}},function(t,e,n){t.exports=n(15)},function(t,e,n){var r=function(){return this||"object"==typeof self&&self}()||Function("return this")(),o=r.regeneratorRuntime&&Object.getOwnPropertyNames(r).indexOf("regeneratorRuntime")>=0,i=o&&r.regeneratorRuntime;if(r.regeneratorRuntime=void 0,t.exports=n(7),o)r.regeneratorRuntime=i;else try{delete r.regeneratorRuntime}catch(t){r.regeneratorRuntime=void 0}},function(t,e){!function(e){"use strict";var n,r=Object.prototype,o=r.hasOwnProperty,i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",u=i.toStringTag||"@@toStringTag",s="object"==typeof t,l=e.regeneratorRuntime;if(l)s&&(t.exports=l);else{(l=e.regeneratorRuntime=s?t.exports:{}).wrap=x;var f="suspendedStart",p="suspendedYield",h="executing",d="completed",v={},m={};m[a]=function(){return this};var g=Object.getPrototypeOf,y=g&&g(g(M([])));y&&y!==r&&o.call(y,a)&&(m=y);var w=k.prototype=j.prototype=Object.create(m);S.prototype=w.constructor=k,k.constructor=S,k[u]=S.displayName="GeneratorFunction",l.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===S||"GeneratorFunction"===(e.displayName||e.name))},l.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,k):(t.__proto__=k,u in t||(t[u]="GeneratorFunction")),t.prototype=Object.create(w),t},l.awrap=function(t){return{__await:t}},q(E.prototype),E.prototype[c]=function(){return this},l.AsyncIterator=E,l.async=function(t,e,n,r){var o=new E(x(t,e,n,r));return l.isGeneratorFunction(e)?o:o.next().then(function(t){return t.done?t.value:o.next()})},q(w),w[u]="Generator",w[a]=function(){return this},w.toString=function(){return"[object Generator]"},l.keys=function(t){var e=[];for(var n in t)e.push(n);return e.reverse(),function n(){for(;e.length;){var r=e.pop();if(r in t)return n.value=r,n.done=!1,n}return n.done=!0,n}},l.values=M,L.prototype={constructor:L,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=n,this.done=!1,this.delegate=null,this.method="next",this.arg=n,this.tryEntries.forEach(F),!t)for(var e in this)"t"===e.charAt(0)&&o.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=n)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(r,o){return c.type="throw",c.arg=t,e.next=r,o&&(e.method="next",e.arg=n),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return r("end");if(a.tryLoc<=this.prev){var u=o.call(a,"catchLoc"),s=o.call(a,"finallyLoc");if(u&&s){if(this.prev<a.catchLoc)return r(a.catchLoc,!0);if(this.prev<a.finallyLoc)return r(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return r(a.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return r(a.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&o.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var i=r;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,v):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),v},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),F(n),v}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;F(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:M(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=n),v}}}function x(t,e,n,r){var o=e&&e.prototype instanceof j?e:j,i=Object.create(o.prototype),a=new L(r||[]);return i._invoke=function(t,e,n){var r=f;return function(o,i){if(r===h)throw new Error("Generator is already running");if(r===d){if("throw"===o)throw i;return I()}for(n.method=o,n.arg=i;;){var a=n.delegate;if(a){var c=O(a,n);if(c){if(c===v)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(r===f)throw r=d,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r=h;var u=b(t,e,n);if("normal"===u.type){if(r=n.done?d:p,u.arg===v)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(r=d,n.method="throw",n.arg=u.arg)}}}(t,n,a),i}function b(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}function j(){}function S(){}function k(){}function q(t){["next","throw","return"].forEach(function(e){t[e]=function(t){return this._invoke(e,t)}})}function E(t){var e;this._invoke=function(n,r){function i(){return new Promise(function(e,i){!function e(n,r,i,a){var c=b(t[n],t,r);if("throw"!==c.type){var u=c.arg,s=u.value;return s&&"object"==typeof s&&o.call(s,"__await")?Promise.resolve(s.__await).then(function(t){e("next",t,i,a)},function(t){e("throw",t,i,a)}):Promise.resolve(s).then(function(t){u.value=t,i(u)},function(t){return e("throw",t,i,a)})}a(c.arg)}(n,r,e,i)})}return e=e?e.then(i,i):i()}}function O(t,e){var r=t.iterator[e.method];if(r===n){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=n,O(t,e),"throw"===e.method))return v;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return v}var o=b(r,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,v;var i=o.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=n),e.delegate=null,v):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,v)}function C(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function F(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function L(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(C,this),this.reset(!0)}function M(t){if(t){var e=t[a];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,i=function e(){for(;++r<t.length;)if(o.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=n,e.done=!0,e};return i.next=i}}return{next:I}}function I(){return{value:n,done:!0}}}(function(){return this||"object"==typeof self&&self}()||Function("return this")())},function(t,e){t.exports=function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}},function(t,e){t.exports=function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}},function(t,e){t.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}},function(t,e){t.exports=function(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}},function(t,e){t.exports=function(t){if(Array.isArray(t))return t}},function(t,e){t.exports=function(t,e){var n=[],r=!0,o=!1,i=void 0;try{for(var a,c=t[Symbol.iterator]();!(r=(a=c.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==c.return||c.return()}finally{if(o)throw i}}return n}},function(t,e){t.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}},function(t,e,n){"use strict";n.r(e);var r=n(0),o=n.n(r),i=n(1),a=n.n(i),c=n(2),u=n.n(c),s=n(3),l=n.n(s);function f(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:document,n="string"==typeof t?e.querySelector(t):t;if(!n)throw new Error('Ops! There is no DOM element matching "'.concat(t,'" selector.'));var r=n.cloneNode(!0);return{e:n,content:function(t){return n.innerHTML=t,Array.prototype.slice.call(n.querySelectorAll("[data-export]")).map(function(t){return f(t,n)})},appendChild:function(t){return n.appendChild(t),this},css:function(t,e){return void 0!==e?(n.style[t]=e,this):n.style[t]},prop:function(t,e){return void 0!==e?(n[t]=e,this):n[t]},attr:function(t,e){return void 0!==e?(n.setAttribute(t,e),this):n.getAttribute(t)},onClick:function(t){return n.addEventListener("click",t),function(){return n.removeEventListener("click",t)}},onKeyUp:function(t){return n.addEventListener("keyup",t),function(){return n.removeEventListener("keyup",t)}},find:function(t){return f(t,n)},restoreToInitialDOM:function(){var t=r.cloneNode(!0);n.parentNode.replaceChild(t,n),n=t}}}function p(t,e,n,r){return h.apply(this,arguments)}function h(){return(h=a()(o.a.mark(function t(e,n,r,i){var a,c,u;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return a=CodeMirror(f(".js-code-editor").e,l()({value:n||"",mode:"jsx",tabSize:2,lineNumbers:!1,autofocus:!0,foldGutter:!1,gutters:[],styleSelectedText:!0},e)),c=function(){return r(a.getValue())},u=function(){return i(a.getValue())},a.on("change",u),a.setOption("extraKeys",{"Ctrl-S":c,"Cmd-S":c}),CodeMirror.normalizeKeyMap(),a.focus(),t.abrupt("return",a);case 8:case"end":return t.stop()}},t,this)}))).apply(this,arguments)}var d={presets:["react",["es2015",{modules:!1}]],plugins:["transform-es2015-modules-commonjs"]};function v(t){return Babel.transform(t,d).code}function m(t,e){try{var n=e.map(function(t){var e=t.filename,n=t.content;return'\n      {\n        filename: "'.concat(e,'",\n        func: function (require, exports) {\n          ').concat(v(n),"\n        },\n        exports: {}\n      }\n    ")}),r="\n      const modules = [".concat(n.join(","),"];\n      const require = function(file) {\n        const module = modules.find(({ filename }) => filename === file);\n\n        if (!module) {\n          throw new Error('Demoit can not find \"' + file + '\" file.');\n        }\n        module.func(require, module.exports);\n        return module.exports;\n      };\n      modules[").concat(t,"].func(require, modules[").concat(t,"].exports);\n    ");new Function(v(r))()}catch(t){console.error(t)}}var g=27;function y(t,e){var n=f("body").onKeyUp(function(t){t.keyCode===g&&(n(),e())});t.find(".cancel").onClick(function(){n(),e()})}var w=n(4),x=n.n(w),b="demoit-split-sizes-v2";function j(){var t=void 0!==window.localStorage,e=[25,75,75,25],n=function(){if(t){var n=localStorage.getItem(b);if(n&&4===(n=n.split(",")).length){var r=n.map(parseInt);if(r.every(function(t){return!isNaN(t)}))return r}}return e}(),r=x()(n,4),o=r[0],i=r[1],a=r[2],c=r[3],u=Split([".left",".right"],{sizes:[o,i],gutterSize:4}),s=Split([".output",".console"],{sizes:[a,c],gutterSize:4,direction:"vertical"});t&&setInterval(function(){localStorage.setItem(b,u.getSizes().join(",")+","+s.getSizes().join(","))},2e3)}function S(t){return function(){var e=a()(o.a.mark(function e(){var n;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t(),n=f(".output"),"undefined"!=typeof ReactDOM&&ReactDOM.unmountComponentAtNode(n.e),n.content('<div class="hint">&lt;div id="output" /&gt;</div>');case 4:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()}var k='<svg width="48" height="48" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1596 476q14 14 28 36h-472v-472q22 14 36 28zm-476 164h544v1056q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1600q0-40 28-68t68-28h800v544q0 40 28 68t68 28zm160 736v-64q0-14-9-23t-23-9h-704q-14 0-23 9t-9 23v64q0 14 9 23t23 9h704q14 0 23-9t9-23zm0-256v-64q0-14-9-23t-23-9h-704q-14 0-23 9t-9 23v64q0 14 9 23t23 9h704q14 0 23-9t9-23zm0-256v-64q0-14-9-23t-23-9h-704q-14 0-23 9t-9 23v64q0 14 9 23t23 9h704q14 0 23-9t9-23z"/></svg>',q=function(){try{return localStorage.setItem("test","test"),localStorage.removeItem("test"),!0}catch(t){return!1}},E=function(){var t=a()(o.a.mark(function t(){var e,n=arguments;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e=n.length>0&&void 0!==n[0]?n[0]:1,t.abrupt("return",new Promise(function(t){return setTimeout(t,e)}));case 2:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),O=function(t){var e=!1;return function(){e||(e=!0,t.apply(void 0,arguments))}},C=function(t){var e=null,n=[];return location.search.substr(1).split("&").forEach(function(r){(n=r.split("="))[0]===t&&(e=decodeURIComponent(n[1]))}),e},F={},L=function(t,e){if(F[t])return e();var n=document.createElement("script");n.src=t,n.addEventListener("load",function(){F[t]=!0,e()}),document.body.appendChild(n)},M=function(t,e){if(F[t])return e();var n=document.createElement("link");n.setAttribute("rel","stylesheet"),n.setAttribute("type","text/css"),n.setAttribute("href",t),n.addEventListener("load",function(){F[t]=!0,e()}),document.body.appendChild(n)},I=function(){var t=a()(o.a.mark(function t(e){var n,r=arguments;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=r.length>1&&void 0!==r[1]?r[1]:function(){},t.abrupt("return",new Promise(function(t){!function r(o){if(n(o),o!==e.length){var i=e[o],a=i.split(".").pop().toLowerCase();"js"===a?L(i,function(){return r(o+1)}):"css"===a?M(i,function(){return r(o+1)}):r(o+1)}else t()}(0)}));case 2:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}();function P(t){var e=t.storage,n=t.changePage;return{name:"dependencies",didMount:function(){var t=a()(o.a.mark(function t(r){var i,a,c,s;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return i=r.el,a=i(".value"),c=i(".file"),s=["./vendor/codemirror/codemirror.js","./vendor/codemirror/javascript.js","./vendor/codemirror/xml.js","./vendor/codemirror/jsx.js","./vendor/codemirror/mark-selection.js","./vendor/split.js","./vendor/babel-6.26.0.min.js","./vendor/babel-polyfill@6.26.0.js","./vendor/codemirror/theme/".concat(e.getEditorSettings().theme,".css")].concat(u()(e.getDependencies())),t.next=6,I(s,function(t){a.css("width",t/s.length*100+"%"),t<s.length?c.content(s[t].split(/\//).pop()):(c.css("opacity",0),n("editor"))});case 6:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}()}}var A={content:"",filename:"untitled.js",editing:!1},z="DEMOIT_v2",N={editor:{theme:"material"},dependencies:[],files:[A]},D=function(t){var e=location.hash.replace(/^#/,"");if(""!==e){var n=t.findIndex(function(t){return t.filename===e});if(n>=0)return n}return 0};var _,T={cls:"as-button newProject",title:"Start a new project",text:"A blank file. No dependencies.",icon:'<svg width="48" height="48" viewBox="0 0 1792 1792"><path d="M1600 736v192q0 40-28 68t-68 28h-416v416q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-416h-416q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h416v-416q0-40 28-68t68-28h192q40 0 68 28t28 68v416h416q40 0 68 28t28 68z"/></svg>'},R=function(t){return{title:"Ops!",icon:'<svg width="48" height="48" viewBox="0 0 1792 1792"><path d="M1024 1375v-190q0-14-9.5-23.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 23.5v190q0 14 9.5 23.5t22.5 9.5h192q13 0 22.5-9.5t9.5-23.5zm-2-374l18-459q0-12-10-19-13-11-24-11h-220q-11 0-24 11-10 7-10 21l17 457q0 10 10 16.5t24 6.5h185q14 0 23.5-6.5t10.5-16.5zm-14-934l768 1408q35 63-2 126-17 29-46.5 46t-63.5 17h-1536q-34 0-63.5-17t-46.5-46q-37-63-2-126l768-1408q17-31 47-49t65-18 65 18 47 49z"/></svg>',text:"".concat(t," can not be loaded or it contains broken JSON.")}},G=function(t){return{title:"Code samples",icon:k,text:"Loading ".concat(t," file ..."),cls:"notClickable"}},B=function(t){return{title:"Code samples",icon:k,text:t.map(function(t){return'\n    <a href="javascript:void(0);" data-export="jsonFile" data-file="'.concat(t,'">').concat(t.split(/\//).pop(),"</a>\n  ")}).join(""),cls:"notClickable"}},J=function(t){return{cls:"as-button restoreFromLocalStorage",title:"Your latest changes",icon:'<svg width="48" height="48" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M128 1408h1024v-128h-1024v128zm0-512h1024v-128h-1024v128zm1568 448q0-40-28-68t-68-28-68 28-28 68 28 68 68 28 68-28 28-68zm-1568-960h1024v-128h-1024v128zm1568 448q0-40-28-68t-68-28-68 28-28 68 28 68 68 28 68-28 28-68zm0-512q0-40-28-68t-68-28-68 28-28 68 28 68 68 28 68-28 28-68zm96 832v384h-1792v-384h1792zm0-512v384h-1792v-384h1792zm0-512v384h-1792v-384h1792z"/></svg>',text:t.join("<br />")}},K=function(){if(q()){var t=localStorage.getItem(z);try{if(t)return JSON.parse(t)}catch(t){console.error("There is some data in the local storage under the ".concat(z," key. However, it is not a valid JSON."))}}return null},Y=function(){var t=a()(o.a.mark(function t(e){var n;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch(e);case 2:return n=t.sent,t.next=5,n.json();case 5:return t.abrupt("return",t.sent);case 6:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),U=function(){var t=C("state");return null!==t?t.split(","):null},H=function(t,e){var n=[{}].concat(u()(t),[T,{}]).filter(function(t){return null!==t}),r=e.content(n.map(function(t){var e=t.title,n=t.text,r=t.icon,o=t.cls;return e?'\n        <div class="'.concat(o||"as-button",'">\n          ').concat(r,"\n          <h2>").concat(e,"</h2>\n          <hr />\n          <p>").concat(n,"</p>\n        </div>\n      "):"<div></div>"}).join(""));return e.css("grid-template-columns",n.map(function(t){return t.title?"250px":"1fr"}).join(" ")),r};function V(t){var e=t.storage,n=t.changePage;return{isGrid:!0,name:"home",didMount:function(){var t=a()(o.a.mark(function t(r){var i,c,u,s,l,f,p;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(i=r.el,c=r.pageDOMElement,u=U(),s=K(),l=null,f=null,p=C("autoOpenCodeSample"),u&&(l=B(u)),!p){t.next=20;break}return t.prev=8,t.t0=e,t.next=12,Y(p);case 12:t.t1=t.sent,t.t0.setState.call(t.t0,t.t1),n("dependencies"),t.next=20;break;case 17:t.prev=17,t.t2=t.catch(8),l=R(p);case 20:s&&(f=J(s.files.map(function(t){return t.filename}))),H([l,f],c).filter(function(t){return t.attr("data-file")}).forEach(function(t){t.onClick(a()(o.a.mark(function r(){var i;return o.a.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return i=t.attr("data-file"),H([G(i),f],c),r.prev=2,r.t0=e,r.next=6,Y(i);case 6:r.t1=r.sent,r.t0.setState.call(r.t0,r.t1),n("dependencies"),r.next=14;break;case 11:r.prev=11,r.t2=r.catch(2),H([R(i),f],c);case 14:case"end":return r.stop()}},r,this,[[2,11]])})))}),i(".newProject").onClick(function(){e.setState(N),n("dependencies")}),s&&i(".restoreFromLocalStorage").onClick(function(){e.setState(s),n("dependencies")});case 25:case"end":return t.stop()}},t,this,[[8,17]])}));return function(e){return t.apply(this,arguments)}}()}}function Q(){var t=f(".console"),e=!0,n=function(n){var r=document.createElement("div"),o=n?function(t){return t.replace(/[&<>"']/g,function(t){return"&"+{"&":"amp","<":"lt",">":"gt",'"':"quot","'":"#39"}[t]+";"})}(n.toString()):n;r.innerHTML="<p>"+o+"</p>",e&&(t.content(""),e=!1),t.appendChild(r)};return function(){var e=console.error,r=console.log,o=console.warn,i=console.info,a=console.clear;console.error=function(t){n(t.toString()+t.stack),e.apply(console,arguments)},console.log=function(){for(var t=arguments.length,e=new Array(t),o=0;o<t;o++)e[o]=arguments[o];e.forEach(n),r.apply(console,e)},console.warn=function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];e.forEach(n),o.apply(console,e)},console.info=function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];e.forEach(n),i.apply(console,e)},console.clear=function(){t.content("");for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];a.apply(console,n)}}(),function(){e=!0,t.content('<div class="hint">console.log</div>')}}function W(t,e,n,r,o,i){var a=f(".files .nav"),c=f(".files .storage"),u=f(".files .manageDependencies"),s=function(){var e=[];e.push("<ul>"),t.getFiles().forEach(function(n,r){var o=n.filename,i=n.editing;e.push('<li><a href="javascript:window.showFile('.concat(r,');void(0);" ').concat(t.isCurrentIndex(r)?'class="active"':"",'" oncontextmenu="javascript:window.editFile(').concat(r,');return false;">').concat(o).concat(i?" *":"","</a></li>"))}),e.push("</ul>"),e.push('<ul class="with-icons"><li><a href="javascript:window.newFile()"><svg width="24" height="24" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 736v192q0 40-28 68t-68 28h-416v416q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-416h-416q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h416v-416q0-40 28-68t68-28h192q40 0 68 28t28 68v416h416q40 0 68 28t28 68z"/></svg></a></li></ul>'),a.content(e.join(""))};s(),window.showFile=function(t){return e(t)},window.editFile=function(t){return r(t)},window.newFile=function(){return n()},t.listen(s),c.onClick(o),u.onClick(i)}function X(t){var e=t.storage,n=t.changePage;return{editor:null,name:"editor",permanentInDOM:!0,didMount:function(){var t=a()(o.a.mark(function t(r){var i,c,u,s,l;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return r.el,j(),i=e.getCurrentFile(),c=i.content,u=S(Q()),s=function(){return m(e.getCurrentIndex(),e.getFiles())},t.next=7,p(e.getEditorSettings(),c,function(){var t=a()(o.a.mark(function t(n){return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u();case 2:e.editCurrentFile({content:n,editing:!1}),s();case 4:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),function(t){e.editCurrentFile({editing:!0})});case 7:_=t.sent,l=function(){var t=a()(o.a.mark(function t(n){return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u();case 2:_.setValue(n.content),_.focus(),e.editCurrentFile({editing:!1}),s();case 6:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),W(e,function(t){l(e.changeActiveFile(t))},function(){l(e.addNewFile())},function(t){n("fileEdit",t)},function(){n("manageStorage")},function(){n("manageDependencies")}),s();case 11:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),didShow:function(){_&&_.focus()}}}var Z=13;function $(t){var e=t.storage,n=t.changePage;return{name:"fileEdit",didMount:function(t,r){var o=t.el,i=t.pageDOMElement,a=e.getFileAt(r),c=o('input[name="filename"]'),u=o(".save"),s=o(".delete"),l=function(){e.editFile(r,{filename:c.prop("value")}),c.prop("value",""),n("editor")};c.prop("value",a.filename),c.e.focus(),c.onKeyUp(function(t){t.keyCode===Z&&l()}),c.e.setSelectionRange(0,a.filename.lastIndexOf(".")),e.getFiles().length>1?s.css("display","block"):s.css("display","none"),u.onClick(l),s.onClick(function(){e.deleteFile(r),c.prop("value",""),n("editor")}),y(i,function(){return n("editor")})}}}function tt(t){var e=t.storage,n=t.changePage;return{name:"manageStorage",didMount:function(t){var r=t.el,o=t.pageDOMElement,i=r(".state-json"),a=r(".clear-storage");i.prop("value",JSON.stringify(e.dump(),null,2)),a.onClick(function(){e.clear(),window.location.reload()}),y(o,function(){return n("editor")})}}}function et(t){var e=t.storage,n=t.changePage;return{name:"manageDependencies",didMount:function(t){var r=t.el,i=t.pageDOMElement,c=r(".save"),u=r(".dependencies-list");u.prop("value",e.getDependencies().join("\n")),c.onClick(a()(o.a.mark(function t(){return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:e.setDependencies(u.prop("value").split(/\r?\n/).filter(function(t){return""!==t||"\n"!==t})),n("dependencies");case 2:case"end":return t.stop()}},t,this)}))),y(i,function(){return n("editor")})}}}var nt=function(t){var e=null,n=function(){var t=q(),e=[],n=N,r=D(n.files),o=function(){return e.forEach(function(t){return t()})},i=function(){t&&localStorage.setItem(z,JSON.stringify(n))},a={setState:function(t){r=D((n=t).files),i()},getCurrentIndex:function(){return r},setCurrentIndex:function(t){r=t,location.hash=n.files[t].filename,o()},isCurrentIndex:function(t){return r===t},getCurrentFile:function(){return this.getFiles()[r]},getFiles:function(){return n.files},dump:function(){return n},getDependencies:function(){return n.dependencies},setDependencies:function(t){n.dependencies=t,i(),o()},getEditorSettings:function(){return n.editor},getFileAt:function(t){return this.getFiles()[t]},makeSureOneFileAtLeast:function(){0===this.getFiles().length&&(n.files.push(A),this.setCurrentIndex(0),i())},editFile:function(t,e){n.files[t]=l()({},n.files[t],e),i(),o(),this.setCurrentIndex(r)},editCurrentFile:function(t){this.editFile(r,t)},changeActiveFile:function(t){return this.setCurrentIndex(t),this.getCurrentFile()},addNewFile:function(){return n.files.push(A),i(),this.changeActiveFile(n.files.length-1)},deleteFile:function(t){if(t===r)n.files.splice(t,1),i(),this.setCurrentIndex(0);else{var e=this.getCurrentFile();n.files.splice(t,1),i(),this.setCurrentIndex(this.getFiles().findIndex(function(t){return t===e})||0)}},clear:function(){q&&localStorage.clear(),o()},listen:function(t){e.push(t)}};return a.makeSureOneFileAtLeast(),a}(),r=function(){var t=a()(o.a.mark(function t(n,r){var a;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(a=i.find(function(t){return t.name===n})){t.next=3;break}throw new Error("There's no a page with name \"".concat(n,'".'));case 3:if(!e){t.next=6;break}return t.next=6,e.hide();case 6:a.show(r),e=a;case 8:case"end":return t.stop()}},t,this)}));return function(e,n){return t.apply(this,arguments)}}(),i=t.map(function(t){return function(t){var e=t.name,n=t.didMount,r=t.didShow,i=t.isGrid,c=t.permanentInDOM;if(!e)throw new Error("The page definition requires a name.");var u=f("body > ."+e),s={pageDOMElement:u,el:function(t){return u.find(t)}};return c&&(n=O(n)),{name:e,show:function(){var t=a()(o.a.mark(function t(e){return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return u.css("display",i?"grid":"block"),t.next=3,E();case 3:u.css("opacity",1),u.css("transform","translateY(0)"),n&&n(s,e),r&&r(s,e);case 7:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),hide:function(){var t=a()(o.a.mark(function t(){return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return u.css("opacity",0),u.css("transform","translateY(-20px)"),t.next=4,E(200);case 4:u.css("display","none"),!c&&u.restoreToInitialDOM();case 6:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}()}}(t({changePage:r,storage:n}))});return function(t){return r(t)}};window.onload=a()(o.a.mark(function t(){return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:nt([V,P,X,$,tt,et])("home");case 1:case"end":return t.stop()}},t,this)}))}]);