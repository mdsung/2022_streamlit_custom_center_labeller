(this.webpackJsonpstreamlit_custom_image_labeller=this.webpackJsonpstreamlit_custom_image_labeller||[]).push([[0],{11:function(e,t,a){e.exports=a(19)},19:function(e,t,a){"use strict";a.r(t);var n=a(4),c=a.n(n),l=a(9),i=a.n(l),o=a(2),r=a(1),s=a(7),u=Object(s.b)((function(e){var t=e.args.pointColor,a=e.args,l=a.canvasWidth,i=a.canvasHeight,u=a.imageData,m=Object(n.useRef)(null),g=Object(n.useState)({x:e.args.point.x,y:e.args.point.y}),b=Object(r.a)(g,2),f=b[0],p=b[1],d=Object(n.useState)(u),h=Object(r.a)(d,2),j=h[0];h[1];return Object(n.useEffect)((function(){var e=m.current.getContext("2d"),a=e.createImageData(l,i);a.data.set(j),e.putImageData(a,0,0),e.fillStyle=t,e.fillRect(f.x,f.y,3,3),s.a.setFrameHeight(),console.log(f.x,f.y),s.a.setComponentValue({x:f.x,y:f.y})}),[f]),c.a.createElement("div",null,c.a.createElement("canvas",{ref:m,onClick:function(e){!function(e){p(Object(o.a)(Object(o.a)({},f),{},{x:e.clientX,y:e.clientY})),console.log(e.clientX,e.clientY)}(e)},width:l,height:i}))}));i.a.render(c.a.createElement(c.a.StrictMode,null,c.a.createElement(u,null)),document.getElementById("root"))}},[[11,1,2]]]);
//# sourceMappingURL=main.2dfe3910.chunk.js.map