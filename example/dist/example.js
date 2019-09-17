(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      keys.push.apply(keys, Object.getOwnPropertySymbols(object));
    }

    if (enumerableOnly) keys = keys.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var _ = {
    extend: function extend(obj1, obj2) {
      var _this = this;

      var type = this.isType(obj2);

      if (type === 'object') {
        this.forin(obj2, function (k, v) {
          var vType = _this.isType(v);

          if (vType !== 'object' && vType !== 'array') {
            obj1[k] = v;
          } else {
            if (_this.isType(obj1[k]) !== vType || obj1[k] === null) {
              obj1[k] = vType === 'object' ? {} : [];
            }

            _this.extend(obj1[k], v);
          }
        });
      } else if (type === 'array') {
        for (var i = 0; i < obj2.length; i++) {
          obj1[i] = obj2[i];
        }
      }

      return obj1;
    },
    loadImage: function loadImage(image, loaded, error) {
      var img = new Image();

      if (image.indexOf('http') === 0) {
        img.crossOrigin = '*';
      }

      img.onload = function () {
        loaded(img);
        setTimeout(function () {
          return img = null;
        }, 1000);
      };

      img.onerror = function () {
        error('img load error');
      };

      img.src = image;
    },
    isObject: function isObject(tar) {
      return this.isObjFunc(tar, 'Object');
    },
    isBoolean: function isBoolean(tar) {
      return this.isObjFunc(tar, 'Boolean');
    },
    isArr: function isArr(tar) {
      return this.isObjFunc(tar, 'Array');
    },
    getImage: function getImage(image, cbk, error) {
      if (typeof image === 'string') {
        this.loadImage(image, function (img) {
          cbk(img);
        }, error);
      } else if (_typeof(image) === 'object') {
        cbk(image);
      } else {
        console.log('add image error');
        return;
      }
    },
    forin: function forin(obj, cbk) {
      for (var k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
          cbk(k, obj[k]);
        }
      }
    },
    isIos8: function isIos8() {
      var UA = window.navigator.userAgent.toLowerCase();
      var IOS = /(iPhone|iPad|iPod|iOS)/gi.test(UA);
      var IPAD = /(iPad)/gi.test(UA);

      if (IOS) {
        return IPAD ? UA.match(/cpu os (\d*)/)[1] < 9 : UA.match(/iphone os (\d*)/)[1] < 9;
      } else {
        return false;
      }
    },
    deepCopy: function deepCopy(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    isObjFunc: function isObjFunc(tar, name) {
      return Object.prototype.toString.call(tar) === '[object ' + name + ']';
    },
    isType: function isType(tar) {
      return Object.prototype.toString.call(tar).split(' ')[1].replace(']', '').toLowerCase();
    },
    getSize: function getSize(img) {
      var iw, ih;

      if (img.tagName === 'IMG') {
        iw = img.naturalWidth;
        ih = img.naturalHeight;
      } else if (img.tagName === 'CANVAS') {
        iw = img.width;
        ih = img.height;
      } else {
        iw = img.offsetWidth;
        ih = img.offsetHeight;
      }

      return {
        iw: iw,
        ih: ih
      };
    }
  };

  var PrintCanvas =
  /*#__PURE__*/
  function () {
    function PrintCanvas() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, PrintCanvas);

      // 配置canvas初始大小；
      // width：画布宽度，Number,选填，默认为 500;
      // height: 画布高度，Number，选填，默认与宽度一致；
      this.ops = Object.assign({
        width: 500,
        height: 500,
        backgroundColor: ''
      }, options); // 全局画布；

      this.canvas = null;
      this.ctx = null; // 绘制函数队列；

      this.queue = []; // 回调函数池；

      this.fn = {
        // 最后执行的函数；
        success: function success() {},
        // 错误回调；
        error: function error() {}
      };
      this.data = {
        // 文字id；
        textId: 0,
        // 文字绘制数据；
        text: {},
        // 背景图数据;
        bgConfig: null
      }; // 初始化创建画布；

      this._init();
    }

    _createClass(PrintCanvas, [{
      key: "_init",
      value: function _init() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.ops.width;
        this.canvas.height = this.ops.height;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.save();
        document.querySelector('body').appendChild(this.canvas);
      }
    }, {
      key: "background",
      value: function background(image) {
        var _this2 = this;

        var bg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
          type: 'origin'
        };

        if (!image) {
          console.error('PrintCanvas error : the init background must has a image.');
          return;
        } // 缓存bg options， 用于重置；


        if (!image) {
          bg = this.data.bgConfig;
        } else {
          bg.image = image;
          this.data.bgConfig = bg;
        }

        this.queue.push(function () {
          if (bg.color) {
            _this2.setBgColor(bg.color);
          }

          _.getImage(bg.image, function (img) {
            _this2._background(img, bg);
          }, _this2.fn.error);
        });
        return this;
      }
    }, {
      key: "setBgColor",
      value: function setBgColor(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }, {
      key: "_getBgAlign",
      value: function _getBgAlign(pos, iwh, cwh, cropScale) {
        var rv;

        if (typeof pos === 'string') {
          if (pos === '50%' || pos === 'center') {
            rv = !cropScale ? (cwh - iwh) / 2 : Math.abs((iwh - cwh / cropScale) / 2);
          } else if (pos === '100%') {
            rv = !cropScale ? Math.abs(cwh - iwh) : Math.abs(iwh - cwh / cropScale);
          } else if (pos === '0%') {
            rv = 0;
          }
        } else if (typeof pos === 'number') {
          rv = pos;
        } else {
          rv = 0;
        }

        return rv;
      }
    }, {
      key: "_background",
      value: function _background(img, bg) {
        var _$getSize = _.getSize(img),
            iw = _$getSize.iw,
            ih = _$getSize.ih; // 图片与canvas的长宽比；


        var iRatio = iw / ih;
        var cRatio = this.canvas.width / this.canvas.height; // 背景绘制参数；

        var sx, sy, swidth, sheight, dx, dy, dwidth, dheight;
        var cropScale;

        switch (bg.type) {
          // 裁剪模式，固定canvas大小，原图铺满，超出的部分裁剪；
          case 'crop':
            if (iRatio > cRatio) {
              swidth = ih * cRatio;
              sheight = ih;
              cropScale = this.canvas.height / ih;
            } else {
              swidth = iw;
              sheight = swidth / cRatio;
              cropScale = this.canvas.width / iw;
            }

            sx = this._getBgAlign(bg.left, iw, this.canvas.width, cropScale);
            sy = this._getBgAlign(bg.top, ih, this.canvas.height, cropScale);
            dy = dx = 0;
            dheight = this.canvas.height;
            dwidth = this.canvas.width;
            break;
          // 包含模式，固定canvas大小，包含背景图；

          case 'contain':
            sy = sx = 0;
            swidth = iw;
            sheight = ih;

            if (iRatio > cRatio) {
              dwidth = this.canvas.width;
              dheight = dwidth / iRatio;
              dx = bg.left || 0;
              dy = this._getBgAlign(bg.top, dheight, this.canvas.height, false);
            } else {
              dheight = this.canvas.height;
              dwidth = dheight * iRatio;
              dy = bg.top || 0;
              dx = this._getBgAlign(bg.left, dwidth, this.canvas.width, false);
            }

            break;
          // 原图模式：canvas与原图大小一致，忽略初始化 传入的宽高参数；
          // 同时，background 传入的 left/top 均被忽略；

          case 'origin':
            this.canvas.width = iw;
            this.canvas.height = ih;
            sx = sy = 0;
            swidth = iw;
            sheight = ih;
            dx = dy = 0;
            dwidth = this.canvas.width;
            dheight = this.canvas.height;
            break;

          default:
            console.error('PrintCanvas error: background type error!');
            return;
        }

        this.ctx.drawImage(img, sx, sy, swidth, sheight, dx, dy, dwidth, dheight);

        this._next();
      } // 通用绘制图层函数；
      // 使用方式：
      // 多张图: add([{image:'',options:{}},{image:'',options:{}}]);
      // 单张图: add(image,options);

    }, {
      key: "add",
      value: function add() {
        var _this3 = this;

        var image = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        // 默认参数；
        var def = {
          width: '100%',
          crop: {
            x: 0,
            y: 0,
            width: '100%',
            height: '100%'
          },
          pos: {
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0
          }
        };
        if (!_.isArr(image)) image = [{
          image: image,
          options: options
        }];
        image.forEach(function (v) {
          // 将封装好的 add函数 推入队列中待执行；
          // 参数经过 _handleOps 加工；
          _this3.queue.push(function () {
            _.getImage(v.image, function (img) {
              _this3._add(img, _this3._handleOps(_.extend(def, v.options), img));
            }, _this3.fn.error);
          });
        });
        return this;
      }
    }, {
      key: "_add",
      value: function _add(img, ops) {
        if (ops.width === 0) console.warn("mcanvas warn: the width of mc-element is zero");

        var _$getSize2 = _.getSize(img),
            iw = _$getSize2.iw,
            ih = _$getSize2.ih; // let ratio = iw / ih;
        // 画布canvas参数；


        var cdx, cdy, cdw, cdh; // 素材canvas参数；

        var _ops$crop = ops.crop,
            lsx = _ops$crop.x,
            lsy = _ops$crop.y,
            lsw = _ops$crop.width,
            lsh = _ops$crop.height; // 裁剪尺寸的宽高比

        var cratio = lsw / lsh;
        var ldx, ldy, ldw, ldh; // 素材canvas的绘制;

        var lcvs = document.createElement('canvas');
        var lctx = lcvs.getContext('2d'); // 图片宽高比 * 1.4 是一个最安全的宽度，旋转任意角度都不会被裁剪；
        // 没有旋转却长宽比很高大的图，会导致放大倍数太大，因此设置了最高倍数为5；
        // _ratio 为 较大边 / 较小边 的比例；

        var _ratio = iw > ih ? iw / ih : ih / iw;

        var lctxScale = _ratio * 1.4 > 5 ? 5 : _ratio * 1.4;
        var spaceX, spaceY;
        lcvs.width = Math.round(lsw * lctxScale);
        lcvs.height = Math.round(lsh * lctxScale); // 限制canvas的大小，ios8以下为 2096, 其余平台均限制为 4096;

        var shrink;

        if (_.isIos8() && (lcvs.width > 2096 || lcvs.height > 2096)) {
          if (cratio > 1) {
            shrink = 2096 / lcvs.width;
          } else {
            shrink = 2096 / lcvs.height;
          }
        } else if (lcvs.width > 4096 || lcvs.height > 4096) {
          if (cratio > 1) {
            shrink = 4096 / lcvs.width;
          } else {
            shrink = 4096 / lcvs.height;
          }
        } // 从素材canvas的中心点开始绘制；


        ldx = -Math.round(lsw / 2);
        ldy = -Math.round(lsh / 2);
        ldw = lsw;
        ldh = Math.round(lsw / cratio); // 获取素材最终的宽高;

        if (shrink) {
          var _map = [lcvs.width, lcvs.height, ldx, ldy, ldw, ldh].map(function (v) {
            return Math.round(v * shrink);
          });

          var _map2 = _slicedToArray(_map, 6);

          lcvs.width = _map2[0];
          lcvs.height = _map2[1];
          ldx = _map2[2];
          ldy = _map2[3];
          ldw = _map2[4];
          ldh = _map2[5];
        }

        lctx.translate(lcvs.width / 2, lcvs.height / 2);
        lctx.rotate(ops.pos.rotate);
        lctx.drawImage(img, lsx, lsy, lsw, lsh, ldx, ldy, ldw, ldh);
        cdw = Math.round(ops.width * lctxScale);
        cdh = Math.round(cdw / cratio);
        spaceX = (lctxScale - 1) * ops.width / 2;
        spaceY = spaceX / cratio; // 获取素材的位置；
        //    配置的位置 - 缩放的影响 - 绘制成正方形的影响；

        cdx = Math.round(ops.pos.x + cdw * (1 - ops.pos.scale) / 2 - spaceX);
        cdy = Math.round(ops.pos.y + cdh * (1 - ops.pos.scale) / 2 - spaceY);
        cdw *= ops.pos.scale;
        cdh *= ops.pos.scale;
        this.ctx.drawImage(lcvs, cdx, cdy, cdw, cdh);
        lcvs = lctx = null;

        this._next();
      } // 参数加工函数；

    }, {
      key: "_handleOps",
      value: function _handleOps(ops, img) {
        var cw = this.canvas.width,
            ch = this.canvas.height;

        var _$getSize3 = _.getSize(img),
            iw = _$getSize3.iw,
            ih = _$getSize3.ih; // 图片宽高比；


        var ratio = iw / ih; // 根据参数计算后的绘制宽度；

        var width = this._get(cw, iw, ops.width, 'pos'); // 裁剪的最大宽高；


        var maxLsw, maxLsh; // 裁剪参数；

        var _ops$crop2 = ops.crop,
            cropx = _ops$crop2.x,
            cropy = _ops$crop2.y,
            cropw = _ops$crop2.width,
            croph = _ops$crop2.height;
        var crop = {};
        crop.width = this._get(cw, iw, cropw, 'crop');
        crop.height = this._get(ch, ih, croph, 'crop');
        crop.x = this._get(iw, crop.width, cropx, 'crop');
        crop.y = this._get(ih, crop.height, cropy, 'crop'); // 最大值判定；

        if (crop.x > iw) crop.x = iw;
        if (crop.y > ih) crop.y = ih;
        maxLsw = iw - crop.x;
        maxLsh = ih - crop.y;
        if (crop.width > maxLsw) crop.width = maxLsw;
        if (crop.height > maxLsh) crop.height = maxLsh; // 位置参数；

        var _ops$pos = ops.pos,
            px = _ops$pos.x,
            py = _ops$pos.y,
            pr = _ops$pos.rotate,
            ps = _ops$pos.scale;
        var pos = {
          x: this._get(cw, width, px, 'pos'),
          y: this._get(ch, width / ratio, py, 'pos'),
          scale: ps,
          rotate: parseFloat(pr) * Math.PI / 180
        };
        return {
          width: width,
          crop: crop,
          pos: pos
        };
      } // 重置ctx属性;

    }, {
      key: "_resetCtx",
      value: function _resetCtx() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.restore();
        return this;
      } // --------------------------------------------------------
      // 绘制文字部分；
      // --------------------------------------------------------

    }, {
      key: "text",
      value: function text() {
        var _this4 = this;

        var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var ops = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        // 默认字体；
        var fontFamily = "helvetica neue,hiragino sans gb,Microsoft YaHei,arial,tahoma,sans-serif"; // 默认的字体大小;

        var size = this.canvas.width / 20;
        this.queue.push(function () {
          var defaultStyle = {
            width: 300,
            fontSize: size,
            fontFamily: fontFamily,
            align: 'left',
            color: '#000',
            lineHeight: size * 1.2,
            type: 'fill',
            // strokeText or fillText,
            lineWidth: 1,
            shadow: {
              color: null,
              blur: 0,
              offsetX: 0,
              offsetY: 0
            },
            pos: {
              x: 0,
              y: 0,
              rotate: 0
            }
          };

          var option = _.extend(defaultStyle, ops); // 当设置的宽度小于字体宽度时，强行将设置宽度设为与字体一致；


          var maxFontSize = parseInt(option.fontSize);
          if (maxFontSize && option.width < maxFontSize) option.width = maxFontSize;
          var _this = _this4;
          setTimeout(function () {
            _this._text(context, option);
          }, 0);

          _this4._resetCtx()._next();
        });

        this._next();

        return this;
      }
    }, {
      key: "_text",
      value: function _text(text, option) {
        var _this5 = this;

        this.data.textId++;
        this.data.text[this.data.textId] = {}; // 处理宽度参数；

        option.width = this._get(this.canvas.width, 0, option.width, 'pos');

        var line = 1,
            length = 0,
            x = this._get(this.canvas.width, option.width, 0, 'pos'),
            y = this._get(this.canvas.height, 0, 0, 'pos') + option.lineHeight; // data:字体数据；
        // lineWidth:行宽；


        this.data.text[this.data.textId][line] = {
          data: [],
          lineWidth: 0
        };
        this.ctx.font = "".concat(option.fontSize, "px ").concat(option.fontFamily);
        var width = this.ctx.measureText(text).width; // 处理 <br> 换行，先替换成 '|',便于单字绘图时进行判断；

        var context = text.replace(/<br>/g, '|'); // 先进行多字超出判断，超出宽度后再进行单字超出判断；

        if (width > option.width || context.indexOf('|') !== -1) {
          for (var i = 0, fontLength = context.length; i < fontLength; i++) {
            var font = context[i];
            width = this.ctx.measureText(font).width; // 当字体的计算宽度 > 设置的宽度 || 内容中包含换行时,进入换行逻辑；

            if (width > option.width || font === '|') {
              length = 0;
              x = this._get(this.canvas.width, option.width, 0, 'pos');
              y += option.lineHeight;
              line += 1;
              this.data.text[this.data.textId][line] = {
                data: [],
                lineWidth: 0
              };
              if (font === '|') continue;
            }

            this.data.text[this.data.textId][line]['data'].push(_objectSpread2({
              context: font,
              x: x,
              y: y,
              width: width
            }, option));
            length += width;
            x += width;
            this.data.text[this.data.textId][line]['lineWidth'] = length;
          }
        } else {
          this.data.text[this.data.textId][line]['data'].push(_objectSpread2({
            context: context,
            x: x,
            y: y,
            width: width
          }, option));
          length += width;
          x += width;
          this.data.text[this.data.textId][line]['lineWidth'] = length;
        } // 创建文字画布；


        var tcvs = document.createElement('canvas');
        var tctx = tcvs.getContext('2d');

        var tdx = this._get(this.canvas.width, option.width, option.pos.x, 'pos'),
            tdy = this._get(this.canvas.height, 0, option.pos.y, 'pos');

        var tdw, tdh;
        tdw = tcvs.width = option.width;
        tdh = tcvs.height = this._getTextRectHeight(line);
        console.log('tdh: ', tdh);
        console.log('this.data: ', this.data); // 通过字体数据进行文字的绘制；

        _.forin(this.data.text[this.data.textId], function (k, v) {
          // 增加 align 的功能；
          var add = 0;

          if (option.lineWidth < option.width) {
            if (option.align === 'center') {
              add = (option.width - option.lineWidth) / 2;
            } else if (option.align === 'right') {
              add = option.width - option.lineWidth;
            }
          }

          v.data.forEach(function (text) {
            text.x += add;

            _this5._fillText(tctx, text);
          });
        }); // 绘制文字画布；


        var originX = tdx + tdw / 2,
            originY = tdy + tdh / 2;
        this.ctx.translate(originX, originY);
        this.ctx.rotate(parseFloat(option.pos.rotate) * Math.PI / 180);
        this.ctx.drawImage(tcvs, -tdw / 2, -tdh / 2, tdw, tdh);
      }
    }, {
      key: "_fillText",
      value: function _fillText(ctx, text) {
        var context = text.context,
            x = text.x,
            y = text.y,
            fontSize = text.fontSize,
            fontFamily = text.fontFamily,
            align = text.align,
            color = text.color,
            type = text.type,
            lineWidth = text.lineWidth,
            shadow = text.shadow,
            gradient = text.gradient,
            lineHeight = text.lineHeight;
        var blur = shadow.blur,
            offsetX = shadow.offsetX,
            offsetY = shadow.offsetY;
        ctx.font = "".concat(fontSize, "px ").concat(fontFamily);
        ctx.textAlign = align;
        ctx.textBaseline = 'alphabetic';
        ctx.lineWidth = lineWidth;
        ctx.shadowColor = shadow.color;
        ctx.shadowBlur = blur;
        ctx.shadowOffsetX = offsetX;
        ctx.shadowOffsetY = offsetY;

        if (gradient) {
          var gradType = gradient.gradType,
              colorStop = gradient.colorStop;
          var x1, y1, x2, y2;

          if (gradType === 1) {
            x1 = x;
            y1 = y;
            x2 = x + text.width;
            y2 = y;
          } else {
            x1 = x;
            y1 = y - lineHeight;
            x2 = x;
            y2 = y;
          }

          var grad = ctx.createLinearGradient(x1, y1, x2, y2);
          var colorNum = colorStop.length || 0;

          _.forin(colorStop, function (i, v) {
            grad.addColorStop(1 / colorNum * (+i + 1), v);
          });

          ctx["".concat(type, "Style")] = grad;
        } else {
          ctx["".concat(type, "Style")] = color;
        }

        ctx["".concat(type, "Text")](context, x, y);

        this._resetCtx();
      }
    }, {
      key: "_getTextRectHeight",
      value: function _getTextRectHeight(lastLine) {
        var lastLineData = this.data.text[this.data.textId][lastLine].data[0];
        return lastLineData.y + lastLineData.lineHeight;
      } // --------------------------------------------------------
      // 业务功能函数部分
      // --------------------------------------------------------
      // 参数加工函数；
      // 兼容 5 种 value 值：
      // x:250, x:'250px', x:'100%', x:'left:250',x:'center',
      // width:100,width:'100px',width:'100%'

    }, {
      key: "_get",
      value: function _get(par, child, str, type) {
        var result = str;

        if (typeof str === 'string') {
          if (str.indexOf(':') !== -1 && type === 'pos') {
            var arr = str.split(':');

            switch (arr[0]) {
              case 'left':
              case 'top':
                result = +arr[1].replace('px', '');
                break;

              case 'right':
              case 'bottom':
                result = par - +arr[1].replace('px', '') - child;
                break;

              default:
            }
          } else if (str.indexOf('px') !== -1) {
            result = +str.replace('px', '');
          } else if (str.indexOf('%') !== -1) {
            if (type === 'crop') {
              result = child * +str.replace('%', '') / 100;
            } else {
              result = par * +str.replace('%', '') / 100;
            }
          } else if (str === 'center') {
            result = (par - child) / 2;
          } else if (str === 'origin') {
            result = child;
          } else {
            result = +str;
          }
        }

        return Math.round(result);
      } // 绘制函数；

    }, {
      key: "draw",
      value: function draw(ops) {
        var _this6 = this;

        var _ops = {
          type: 'jpeg',
          quality: .9,
          success: function success() {},
          error: function error() {}
        },
            b64;

        if (typeof ops === 'function') {
          _ops.success = ops;
        } else {
          _ops = _.extend(_ops, ops);
          if (_ops.type === 'jpg') _ops.type = 'jpeg';
        }

        this.fn.error = _ops.error;

        this.fn.success = function () {
          setTimeout(function () {
            b64 = _this6.canvas.toDataURL("image/".concat(_ops.type), _ops.quality);

            _ops.success(b64);
          }, 0);
        };

        this._next();

        return this;
      }
    }, {
      key: "_next",
      value: function _next() {
        if (this.queue.length > 0) {
          this.queue.shift()();
        } else {
          this.fn.success();
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        return this;
      }
    }]);

    return PrintCanvas;
  }();

  var addOps = {
    width: '100%',
    pos: {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 1
    }
  };
  var textOps = {
    width: 300,
    fontSize: 40,
    align: 'left',
    color: '#000',
    type: 'fill',
    // strokeText or fillText,
    lineWidth: 1,
    shadow: {
      color: '#0f0',
      blur: 1,
      offsetX: 1,
      offsetY: 1
    },
    // 文字渐变
    gradient: {
      type: 2,
      // 1: 横向渐变； 2: 纵向渐变；
      colorStop: ['red', 'blue']
    },
    pos: {
      x: 0,
      y: 0,
      rotate: 0
    }
  };

  window.onload = function () {
    var PC = new PrintCanvas({
      width: 600,
      height: 800,
      backgroundColor: '#fff'
    }).background('./images/hair1.png', {
      left: 0,
      top: 0,
      color: '#ccc',
      type: 'origin'
    }).add('./images/debug1.png', addOps).add('./images/debug2.png', addOps).text('Hey codecode', textOps);
  };

}));
