(this.webpackJsonpstreamlit_custom_image_labeller=this.webpackJsonpstreamlit_custom_image_labeller||[]).push([[0],{11:function(e,t,a){e.exports=a(19)},19:function(e,t,a){"use strict";a.r(t);var n=a(4),c=a.n(n),l=a(9),r=a.n(l),i=a(2),s=a(1),o=a(7),u=Object(o.b)((function(e){var t=e.args.pointColor,a=e.args,l=a.canvasWidth,r=a.canvasHeight,u=a.imageData,m=Object(n.useRef)(null),g=Object(n.useState)({x:e.args.point.x,y:e.args.point.y}),b=Object(s.a)(g,2),f=b[0],p=b[1];return Object(n.useEffect)((function(){var e=m.current.getContext("2d"),a=e.createImageData(l,r);a.data.set(u),e.putImageData(a,0,0),e.fillStyle=t,e.fillRect(f.x,f.y,3,3),o.a.setFrameHeight(),o.a.setComponentValue({x:f.x,y:f.y})}),[f,u]),c.a.createElement("div",null,c.a.createElement("canvas",{ref:m,onClick:function(e){!function(e){p(Object(i.a)(Object(i.a)({},f),{},{x:e.clientX,y:e.clientY}))}(e)},width:l,height:r}))}));r.a.render(c.a.createElement(c.a.StrictMode,null,c.a.createElement(u,null)),document.getElementById("root"))}},[[11,1,2]]]);
//# sourceMappingURL=main.ff1eb52e.chunk.js.map