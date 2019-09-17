import PrintCanvas from '../src/index.js';

//import PrintCanvas from '../src/mcanvas.js';

let addOps = {
    width:'100%',
    pos:{
        x:0,
        y:0,
        scale:1,
        rotate:1,
    },
};

let textOps = {

    width : 300,
    fontSize: 40,
    align : 'left',
    color:'#000',
    type : 'fill',   // strokeText or fillText,
    lineWidth : 1,
    shadow:{
        color: '#0f0',
        blur: 1,
        offsetX: 1,
        offsetY: 1,
    },
    // 文字渐变
    gradient:{
        type: 2,  // 1: 横向渐变； 2: 纵向渐变；
        colorStop: ['red','blue'],
    },
    pos:{
        x: 0,
        y: 0,
        rotate: 0,
    },

};


window.onload = function () {
    let PC = new PrintCanvas({
        width: 600,
        height: 800,
        backgroundColor : '#fff',
    })
    .background ('./images/hair1.png', {
        left: 0,
        top: 0,
        color:'#ccc',
        type:'origin',
    })
    .add ('./images/debug1.png', addOps)
    .add ('./images/debug2.png', addOps)
    .text('Hey codecode', textOps)
  




    
}
