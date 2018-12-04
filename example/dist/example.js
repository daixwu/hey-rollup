(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (factory());
}(this, (function () { 'use strict';

    function bundle () {
      alert('Hello rollup');
    }

    window.onload = function () {
      bundle();
    };

})));
