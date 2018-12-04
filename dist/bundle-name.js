(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global['bundle-name'] = factory());
}(this, (function () { 'use strict';

    function index () {
      alert('Hello rollup');
    }

    return index;

})));
