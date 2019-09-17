import _ from './utils';

class PrintCanvas {
    constructor(options = {}) {

        // 配置canvas初始大小；
        // width：画布宽度，Number,选填，默认为 500;
        // height: 画布高度，Number，选填，默认与宽度一致；
        this.ops = Object.assign({
            width: 500,
            height: 500,
            backgroundColor : '',
        }, options); 

        // 全局画布；
        this.canvas = null;
        this.ctx = null;

        // 绘制函数队列；
        this.queue = [];

        // 回调函数池；
        this.fn = {
            // 最后执行的函数；
            success(){},
            // 错误回调；
            error(){},
        };

        this.data = {
            // 文字id；
            textId: 0,
            // 文字绘制数据；
            text : {},
            // 背景图数据;
            bgConfig : null,
        };

        // 初始化创建画布；
        this._init();
    }
    _init() {
        this.canvas = document.createElement('canvas');
        
        this.canvas.width = this.ops.width;
        this.canvas.height = this.ops.height;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.save();

        document.querySelector('body').appendChild( this.canvas);
    }

    background (image, bg = { type : 'origin', }){
        if(!image){
            console.error('PrintCanvas error : the init background must has a image.');
            return;
        }
    
        // 缓存bg options， 用于重置；
        if(!image){
            bg = this.data.bgConfig;
        }else{
            bg.image = image;
            this.data.bgConfig = bg;
        }

        this.queue.push(() => {
            if(bg.color) {
                this.setBgColor(bg.color);
            }
            _.getImage(bg.image, img =>{
                this._background(img, bg);
            }, this.fn.error);
        });
        return this;
    }

    setBgColor (color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    _getBgAlign (pos, iwh, cwh, cropScale){
        let rv;
        if(typeof pos === 'string'){
            if(pos === '50%' || pos === 'center'){
                rv = !cropScale ? (cwh - iwh) / 2 : Math.abs((iwh - cwh / cropScale) / 2);
            }else if(pos === '100%'){
                rv = !cropScale ? Math.abs(cwh - iwh) : Math.abs(iwh - cwh / cropScale);
            }else if(pos === '0%'){
                rv = 0;
            }
        }else if(typeof pos === 'number'){
            rv = pos;
        }else{
            rv = 0;
        }
        return rv;
    }

    _background (img, bg){
        let { iw, ih } = _.getSize(img);
        // 图片与canvas的长宽比；
        let iRatio = iw / ih;
        let cRatio = this.canvas.width / this.canvas.height;
        // 背景绘制参数；
        let sx, sy, swidth, sheight, dx, dy, dwidth, dheight;
        let cropScale;
        switch (bg.type) {
            // 裁剪模式，固定canvas大小，原图铺满，超出的部分裁剪；
            case 'crop':
                if(iRatio > cRatio){
                    swidth = ih * cRatio;
                    sheight = ih;
                    cropScale = this.canvas.height / ih;
                }else{
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
                if(iRatio > cRatio){
                    dwidth = this.canvas.width;
                    dheight = dwidth / iRatio;
                    dx = bg.left || 0;

                    dy = this._getBgAlign(bg.top, dheight, this.canvas.height, false);

                }else{
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
    }

    // 通用绘制图层函数；
    // 使用方式：
    // 多张图: add([{image:'',options:{}},{image:'',options:{}}]);
    // 单张图: add(image,options);
    add(image = '', options = {}){
        // 默认参数；
        let def = {
            width:'100%',
            crop:{
                x:0,
                y:0,
                width:'100%',
                height:'100%',
            },
            pos:{
                x:0,
                y:0,
                scale:1,
                rotate:0,
            },
        };
    
        if(!_.isArr(image))image = [{image, options}];
    
        image.forEach( v =>{
            // 将封装好的 add函数 推入队列中待执行；
            // 参数经过 _handleOps 加工；
            this.queue.push(() => {
                _.getImage(v.image, img => {
                    this._add(img, this._handleOps(_.extend(def, v.options), img));
                }, this.fn.error); 
            });

        });
        return this;
    }

    _add (img, ops){
        if(ops.width === 0)console.warn(`mcanvas warn: the width of mc-element is zero`);
        let { iw, ih } = _.getSize(img);
        // let ratio = iw / ih;
        // 画布canvas参数；
        let cdx, cdy, cdw, cdh;
        // 素材canvas参数；
        let { x: lsx, y: lsy, width: lsw, height: lsh } = ops.crop;
    
        // 裁剪尺寸的宽高比
        let cratio = lsw / lsh;
        let ldx, ldy, ldw, ldh;
        // 素材canvas的绘制;
        let lcvs = document.createElement('canvas');
        let lctx = lcvs.getContext('2d');
        // 图片宽高比 * 1.4 是一个最安全的宽度，旋转任意角度都不会被裁剪；
        // 没有旋转却长宽比很高大的图，会导致放大倍数太大，因此设置了最高倍数为5；
        // _ratio 为 较大边 / 较小边 的比例；
        let _ratio = iw > ih ? iw / ih : ih / iw;
        let lctxScale = _ratio * 1.4 > 5 ? 5 : _ratio * 1.4;
        let spaceX, spaceY;
    
        lcvs.width =  Math.round(lsw * lctxScale);
        lcvs.height = Math.round(lsh * lctxScale);
    
        // 限制canvas的大小，ios8以下为 2096, 其余平台均限制为 4096;
        let shrink;
        if(_.isIos8() && (lcvs.width > 2096 || lcvs.height > 2096)){
            if(cratio > 1){
                shrink = 2096 / lcvs.width;
            }else{
                shrink = 2096 / lcvs.height;
            }
        }else if(lcvs.width > 4096 || lcvs.height > 4096){
            if(cratio > 1){
                shrink = 4096 / lcvs.width;
            }else{
                shrink = 4096 / lcvs.height;
            }
        }
    
        // 从素材canvas的中心点开始绘制；
        ldx = - Math.round(lsw / 2);
        ldy = - Math.round(lsh / 2);
        ldw = lsw;
        ldh = Math.round(lsw / cratio);
    
        // 获取素材最终的宽高;
        if(shrink){
            [lcvs.width, lcvs.height, ldx, ldy, ldw, ldh] = [lcvs.width, lcvs.height, ldx, ldy, ldw, ldh].map(v => Math.round(v * shrink));
        }
    
        lctx.translate(lcvs.width / 2, lcvs.height / 2);
        lctx.rotate(ops.pos.rotate);
        
        lctx.drawImage(img, lsx, lsy, lsw, lsh, ldx, ldy, ldw, ldh);
    
        cdw = Math.round(ops.width * lctxScale);
        cdh = Math.round(cdw / cratio);
    
        spaceX = (lctxScale - 1) * ops.width / 2;
        spaceY = spaceX / cratio;
    
        // 获取素材的位置；
        // 配置的位置 - 缩放的影响 - 绘制成正方形的影响；
        cdx = Math.round(ops.pos.x + cdw * ( 1 - ops.pos.scale ) / 2 - spaceX);
        cdy = Math.round(ops.pos.y + cdh * ( 1 - ops.pos.scale ) / 2 - spaceY);
    
        cdw *= ops.pos.scale;
        cdh *= ops.pos.scale;
    
        this.ctx.drawImage(lcvs, cdx, cdy, cdw, cdh);
    
        lcvs = lctx = null;
        this._next();
    }

    // 参数加工函数；
    _handleOps (ops, img){
        let cw = this.canvas.width,
            ch = this.canvas.height;
        let { iw, ih } = _.getSize(img);

        // 图片宽高比；
        let ratio = iw / ih;

        // 根据参数计算后的绘制宽度；
        let width =  this._get(cw, iw, ops.width, 'pos');

        // 裁剪的最大宽高；
        let maxLsw, maxLsh;

        // 裁剪参数；
        let { x:cropx, y:cropy, width:cropw, height:croph } = ops.crop;

        let crop = {};
        crop.width = this._get(cw, iw, cropw, 'crop');
        crop.height = this._get(ch, ih, croph, 'crop');
        crop.x = this._get(iw, crop.width, cropx, 'crop');
        crop.y = this._get(ih, crop.height, cropy, 'crop');

        // 最大值判定；
        if(crop.x > iw)crop.x = iw;
        if(crop.y > ih)crop.y = ih;
        maxLsw = iw - crop.x;
        maxLsh = ih - crop.y;
        if(crop.width > maxLsw)crop.width = maxLsw;
        if(crop.height > maxLsh)crop.height = maxLsh;

        // 位置参数；
        let { x: px, y: py, rotate: pr, scale: ps } = ops.pos;
        let pos = {
            x:this._get(cw, width, px, 'pos'),
            y:this._get(ch, width / ratio, py, 'pos'),
            scale : ps,
            rotate : parseFloat(pr) * Math.PI / 180,
        };
        return {width, crop, pos};
    }

    // 重置ctx属性;
    _resetCtx (){
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.restore();
        return this;
    }

    // --------------------------------------------------------
    // 绘制文字部分；
    // --------------------------------------------------------
    text (context = '', ops={}){
        // 默认字体；
        let fontFamily = `helvetica neue,hiragino sans gb,Microsoft YaHei,arial,tahoma,sans-serif`;
        // 默认的字体大小;
        let size = this.canvas.width / 20;
        this.queue.push(()=>{
            let defaultStyle = {
                width : 300,
                fontSize: size,
                fontFamily: fontFamily,
                align : 'left',
                color:'#000',
                lineHeight: size * 1.2,
                type : 'fill',   // strokeText or fillText,
                lineWidth : 1,
                shadow:{
                    color: null,
                    blur: 0,
                    offsetX: 0,
                    offsetY: 0,
                },
                pos:{
                    x: 0,
                    y: 0,
                    rotate: 0,
                },
            };

            let option = _.extend(defaultStyle, ops);

            // 当设置的宽度小于字体宽度时，强行将设置宽度设为与字体一致；
            let maxFontSize = parseInt(option.fontSize);

            if (maxFontSize && option.width < maxFontSize) option.width = maxFontSize;

            let _this = this;
            setTimeout(function() {
                _this._text(context, option);
            }, 0);

            
            this._resetCtx()._next();   
        });
        this._next(); 
        return this;
    }

    _text (text, option){

        this.data.textId++;
        this.data.text[this.data.textId] = {};
    
        // 处理宽度参数；
        option.width = this._get(this.canvas.width, 0, option.width, 'pos');
    
        let line = 1, length = 0,
            x = this._get(this.canvas.width, option.width, 0, 'pos'),
            y = (this._get(this.canvas.height, 0, 0, 'pos')) + option.lineHeight;
    
        // data:字体数据；
        // lineWidth:行宽；
        this.data.text[this.data.textId][line] = {
            data:[],
            lineWidth:0,
        };

        this.ctx.font = `${option.fontSize}px ${option.fontFamily}`;
        let width = this.ctx.measureText(text).width;

        // 处理 <br> 换行，先替换成 '|',便于单字绘图时进行判断；
        let context = text.replace(/<br>/g, '|');

        // 先进行多字超出判断，超出宽度后再进行单字超出判断；
        if(width > option.width || context.indexOf('|') !== -1){
            for (let i = 0, fontLength = context.length; i < fontLength; i++) {
                let font = context[i];
                width = this.ctx.measureText(font).width;

                // 当字体的计算宽度 > 设置的宽度 || 内容中包含换行时,进入换行逻辑；
                if(width > option.width || font === '|'){

                    length = 0;
                    x = this._get(this.canvas.width, option.width, 0, 'pos');

                    y += option.lineHeight;
                    line += 1;

                    this.data.text[this.data.textId][line] = {
                        data:[],
                        lineWidth:0,
                    };

                    if(font === '|') continue;
                }
                this.data.text[this.data.textId][line]['data'].push({
                    context:font, x, y, width, ...option,
                });
                length += width;
                x += width;

                this.data.text[this.data.textId][line]['lineWidth'] = length;
            }
        }else{
            this.data.text[this.data.textId][line]['data'].push({
                context, x, y, width, ...option,
            });
            length += width;
            x += width;
            this.data.text[this.data.textId][line]['lineWidth'] = length;

        }

        // 创建文字画布；
        const tcvs = document.createElement('canvas');
        const tctx = tcvs.getContext('2d');
        const tdx = this._get(this.canvas.width, option.width, option.pos.x, 'pos'), 
              tdy = this._get(this.canvas.height, 0, option.pos.y, 'pos');

        let tdw, tdh;
        tdw = tcvs.width = option.width;
        tdh = tcvs.height = this._getTextRectHeight(line);
        console.log('tdh: ', tdh);

        console.log('this.data: ', this.data);
        
        // 通过字体数据进行文字的绘制；
        _.forin(this.data.text[this.data.textId], (k, v)=>{  
            
            // 增加 align 的功能；
            let add = 0;
            if(option.lineWidth < option.width){
                if(option.align === 'center'){
                    add = (option.width - option.lineWidth) / 2;
                }else if (option.align === 'right') {
                    add = option.width - option.lineWidth;
                }
            }
            v.data.forEach(text=>{
                text.x += add;
                this._fillText(tctx, text);
            });

        });
        
        // 绘制文字画布；
        const originX = tdx + tdw / 2,
              originY = tdy + tdh / 2;
        this.ctx.translate(originX, originY);
        this.ctx.rotate(parseFloat(option.pos.rotate) * Math.PI / 180);
        this.ctx.drawImage(tcvs, -tdw / 2, -tdh / 2, tdw, tdh);
    }

    _fillText  (ctx, text){
        let {context, x, y, fontSize, fontFamily, align, color, type, lineWidth, shadow, gradient, lineHeight} = text;
 
        let {blur, offsetX, offsetY} = shadow;
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.textAlign = align;
        ctx.textBaseline = 'alphabetic';
        ctx.lineWidth = lineWidth;
        ctx.shadowColor = shadow.color;
        ctx.shadowBlur = blur;
        ctx.shadowOffsetX = offsetX;
        ctx.shadowOffsetY = offsetY;

        if(gradient){
            let { gradType, colorStop } = gradient;
            let x1, y1, x2, y2;
            if(gradType === 1){
                x1 = x; y1 = y;
                x2 = x + text.width; y2 = y;
            }else{
                x1 = x; y1 = y - lineHeight;
                x2 = x; y2 = y;
            }
            let grad  = ctx.createLinearGradient(x1, y1, x2, y2);
            let colorNum = colorStop.length || 0;
            _.forin(colorStop, (i, v)=>{
                grad.addColorStop(1 / colorNum * (+i + 1), v);
            });
            ctx[`${type}Style`] = grad;
        }else{
            ctx[`${type}Style`] = color;
        }
    
        ctx[`${type}Text`](context, x, y);

        this._resetCtx();
    }

    _getTextRectHeight (lastLine) {
        const lastLineData = this.data.text[this.data.textId][lastLine].data[0];
        return lastLineData.y + lastLineData.lineHeight;
    }

    // --------------------------------------------------------
    // 业务功能函数部分
    // --------------------------------------------------------

    // 参数加工函数；
    // 兼容 5 种 value 值：
    // x:250, x:'250px', x:'100%', x:'left:250',x:'center',
    // width:100,width:'100px',width:'100%'
    _get (par, child, str, type){
        let result = str;
        if(typeof str === 'string'){
            if(str.indexOf(':') !== -1 && type === 'pos'){
                let arr = str.split(':');
                switch (arr[0]) {
                    case 'left':
                    case 'top':
                        result = +(arr[1].replace('px', ''));
                        break;
                    case 'right':
                    case 'bottom':
                        result = par - (+(arr[1].replace('px', ''))) - child;
                        break;
                    default:
                }
            } else if (str.indexOf('px') !== -1) {
                result = (+str.replace('px', ''));
            } else if (str.indexOf('%') !== -1) {
                if(type === 'crop'){
                    result = child * (+str.replace('%', '')) / 100;
                }else{
                    result = par * (+str.replace('%', '')) / 100;
                }
            } else if (str === 'center'){
                result = (par - child) / 2;
            } else if (str === 'origin') {
                result = child;
            } else {
                result = +str;
            }
        }
        return Math.round(result);
    }

    // 绘制函数；
    draw (ops){
        let _ops = {
            type:'jpeg',
            quality:.9,
            success(){},
            error(){},
        }, b64;
        if(typeof ops === 'function'){
            _ops.success = ops;
        }else{
            _ops = _.extend(_ops, ops)
            if(_ops.type === 'jpg')_ops.type = 'jpeg';
        }
        this.fn.error = _ops.error;
        this.fn.success = () => {
            setTimeout(()=>{
                b64 = this.canvas.toDataURL(`image/${_ops.type}`, _ops.quality);
                _ops.success(b64);
            }, 0);
        };
        this._next(); 
        return this;
    }

    _next () {
        if(this.queue.length > 0){
            this.queue.shift()();

            
        }else{
            this.fn.success();
        }


    }
    
    clear () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        return this;
    }
}

export default PrintCanvas;


