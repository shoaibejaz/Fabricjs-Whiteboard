(this["webpackJsonpreact-fabricjs-whiteboard"]=this["webpackJsonpreact-fabricjs-whiteboard"]||[]).push([[0],{25:function(e,t,r){e.exports={fileSharing:"PdfReader_fileSharing__13f5X",fileItem:"PdfReader_fileItem__rfngy",fileUploader:"PdfReader_fileUploader__1OBlE",fileName:"PdfReader_fileName__Sfrqr",download:"PdfReader_download__pAVI3",fileContainer:"PdfReader_fileContainer__2gJs-",pageInfo:"PdfReader_pageInfo__27lCr"}},36:function(e,t,r){e.exports={whiteboard:"Whiteboard_whiteboard__34LM6",toolbar:"Whiteboard_toolbar__34zob"}},39:function(e,t){},42:function(e,t,r){e.exports={app:"app_app__3mk8F"}},50:function(e,t){},51:function(e,t){},52:function(e,t){},54:function(e,t){},55:function(e,t){},56:function(e,t){},57:function(e,t){},58:function(e,t){},62:function(e,t){!function(){var e=fabric.StaticCanvas.prototype.__setBgOverlayColor,t=fabric.StaticCanvas.prototype.__setBgOverlay;fabric.util.object.extend(fabric.StaticCanvas.prototype,{backgroundColor:void 0,overlayColor:void 0,__setBgOverlayColor:function(t,r,n,o){var a=this,i=function(){a[t]=new fabric.Rect(fabric.util.object.extend({width:a.width,height:a.height,fill:a[t]},o)),n&&n(a[t])};return e.call(this,t,r,i),!r||!r.colorStops||r instanceof fabric.Gradient||i(),this},__setBgOverlay:function(e,r,n,o){var a=this;"backgroundColor"!==e&&"overlayColor"!==e||!r||"object"!==typeof r||"rect"!==r.type?t.call(this,e,r,n,o):fabric.util.enlivenObjects([r],(function(t){a[e]=t[0],n[e]=!0,o&&o()}))},_renderBackgroundOrOverlay:function(e,t){var r=this[t+"Color"],n=this[t+"Image"],o=this.viewportTransform,a=this[t+"Vpt"];(r||n)&&(r||n)&&(e.save(),a&&e.transform(o[0],o[1],o[2],o[3],o[4],o[5]),r&&r.render(e),n&&n.render(e),e.restore())}});var r=fabric.Object.prototype.toObject;fabric.util.object.extend(fabric.Object.prototype,{erasable:!0,getEraser:function(){return this.clipPath&&this.clipPath.eraser?this.clipPath:null},toObject:function(e){return r.call(this,["erasable"].concat(e))}});var n=fabric.Group.prototype.toObject;fabric.util.object.extend(fabric.Group.prototype,{toObject:function(e){return n.call(this,["eraser"].concat(e))}}),fabric.util.object.extend(fabric.Canvas.prototype,{isErasing:function(){return this.isDrawingMode&&this.freeDrawingBrush&&"eraser"===this.freeDrawingBrush.type&&this.freeDrawingBrush._isErasing},renderAll:function(){if(!this.contextTopDirty||this._groupSelector||this.isDrawingMode||(this.clearContext(this.contextTop),this.contextTopDirty=!1),!this.isErasing()){this.hasLostContext&&this.renderTopLayer(this.contextTop);var e=this.contextContainer;return this.renderCanvas(e,this._chooseObjectsToRender()),this}this.freeDrawingBrush._render()}}),fabric.EraserBrush=fabric.util.createClass(fabric.PencilBrush,{type:"eraser",_ready:!1,_drawOverlayOnTop:!1,_isErasing:!1,initialize:function(e){this.callSuper("initialize",e),this._renderBound=this._render.bind(this),this.render=this.render.bind(this)},forCanvasDrawables:function(e){e.call(this,"background","backgroundImage","setBackgroundImage","backgroundColor","setBackgroundColor"),e.call(this,"overlay","overlayImage","setOverlayImage","overlayColor","setOverlayColor")},hideObject:function(e){e&&(e._originalOpacity=e.opacity,e.set({opacity:0}))},restoreObjectVisibility:function(e){e&&e._originalOpacity&&(e.set({opacity:e._originalOpacity}),e._originalOpacity=void 0)},prepareCanvasBackgroundForLayer:function(e){if("overlay"!==e){var t=this.canvas,r=t.get("backgroundImage"),n=t.get("backgroundColor"),o="top"===e;r&&r.erasable===!o&&this.hideObject(r),n&&n.erasable===!o&&this.hideObject(n)}},prepareCanvasOverlayForLayer:function(e){var t=this.canvas,r=t.get("overlayImage"),n=t.get("overlayColor");if("bottom"===e)return this.hideObject(r),this.hideObject(n),!1;var o="top"===e,a=r&&!r.erasable||n&&!n.erasable;return r&&r.erasable===!o&&this.hideObject(r),n&&n.erasable===!o&&this.hideObject(n),a},restoreCanvasDrawables:function(){var e=this.canvas;this.restoreObjectVisibility(e.get("backgroundImage")),this.restoreObjectVisibility(e.get("backgroundColor")),this.restoreObjectVisibility(e.get("overlayImage")),this.restoreObjectVisibility(e.get("overlayColor"))},prepareCollectionTraversal:function(e){var t=this;e.forEachObject((function(e){e.forEachObject?t.prepareCollectionTraversal(e):e.erasable&&t.hideObject(e)}))},restoreCollectionTraversal:function(e){var t=this;e.forEachObject((function(e){e.forEachObject?t.restoreCollectionTraversal(e):t.restoreObjectVisibility(e)}))},prepareCanvasObjectsForLayer:function(e){"bottom"===e&&this.prepareCollectionTraversal(this.canvas)},restoreCanvasObjectsFromLayer:function(e){"bottom"===e&&this.restoreCollectionTraversal(this.canvas)},prepareCanvasForLayer:function(e){return this.prepareCanvasBackgroundForLayer(e),this.prepareCanvasObjectsForLayer(e),this.prepareCanvasOverlayForLayer(e)},restoreCanvasFromLayer:function(e){this.restoreCanvasDrawables(),this.restoreCanvasObjectsFromLayer(e)},renderBottomLayer:function(){var e=this.canvas;this.prepareCanvasForLayer("bottom"),e.renderCanvas(e.getContext(),e.getObjects().filter((function(e){return!e.erasable||e.isType("group")}))),this.restoreCanvasFromLayer("bottom")},renderTopLayer:function(){var e=this.canvas;this._drawOverlayOnTop=this.prepareCanvasForLayer("top"),e.renderCanvas(e.contextTop,e.getObjects()),this.callSuper("_render"),this.restoreCanvasFromLayer("top")},renderOverlay:function(){this.prepareCanvasForLayer("overlay");var e=this.canvas,t=e.contextTop;this._saveAndTransform(t),e._renderOverlay(t),t.restore(),this.restoreCanvasFromLayer("overlay")},_saveAndTransform:function(e){this.callSuper("_saveAndTransform",e),e.globalCompositeOperation="destination-out"},needsFullRender:function(){return this.callSuper("needsFullRender")||this._drawOverlayOnTop},onMouseDown:function(e,t){this.canvas._isMainEvent(t.e)&&(this._prepareForDrawing(e),this._captureDrawingPath(e),this._isErasing=!0,this.canvas.fire("erasing:start"),this._ready=!0,this._render())},_render:function(){this._ready&&(this.isRendering=1,this.renderBottomLayer(),this.renderTopLayer(),this.renderOverlay(),this.isRendering=0)},render:function(){return!!this._isErasing&&(this.isRendering?this.isRendering=fabric.util.requestAnimFrame(this._renderBound):this._render(),!0)},_addPathToObjectEraser:function(e,t){var r,n=this;if(e.forEachObject)e.forEachObject((function(e){e.erasable&&n._addPathToObjectEraser(e,t)}));else{if(e.getEraser())r=e.clipPath;else{var o=[new fabric.Rect({width:e.width,height:e.height,clipPath:e.clipPath,originX:"center",originY:"center"})];r=new fabric.Group(o,{boundingObjects:o,eraser:!0})}t.clone((function(t){t.globalCompositeOperation="destination-out";var n=fabric.util.multiplyTransformMatrices(fabric.util.invertTransform(e.calcTransformMatrix()),t.calcTransformMatrix());fabric.util.applyTransformToObject(t,n),r.addWithUpdate(t),e.set({clipPath:r,dirty:!0})}))}},applyEraserToCanvas:function(e){var t=this.canvas;this.forCanvasDrawables((function(r,n,o,a){var i=t.get(n),s=t.get(a);i&&i.erasable&&this._addPathToObjectEraser(i,e),s&&s.erasable&&this._addPathToObjectEraser(s,e)}))},_finalizeAndAddPath:function(){var e=this.canvas.contextTop,t=this.canvas;e.closePath(),this.decimate&&(this._points=this.decimatePoints(this._points,this.decimate)),t.clearContext(t.contextTop),this._isErasing=!1;var r=this._points&&this._points.length>1?this.convertPointsToSVGPath(this._points).join(""):"M 0 0 Q 0 0 0 0 L 0 0";if("M 0 0 Q 0 0 0 0 L 0 0"===r)return t.fire("erasing:end"),void t.requestRenderAll();var n=this.createPath(r);t.fire("before:path:created",{path:n}),this.applyEraserToCanvas(n);var o=this;t.forEachObject((function(e){e.erasable&&e.intersectsWithObject(n)&&o._addPathToObjectEraser(e,n)})),t.fire("erasing:end"),t.requestRenderAll(),n.setCoords(),this._resetShadow(),t.fire("path:created",{path:n})}})}()},63:function(e,t,r){},64:function(e,t,r){"use strict";r.r(t);var n=r(1),o=r(40),a=r.n(o),i=r(34),s=r(16),c=r(15),u=r(37),l=r(35),f=r(25),d=r.n(f),b=r(5);l.a.GlobalWorkerOptions.workerSrc="//cdnjs.cloudflare.com/ajax/libs/pdf.js/".concat(l.a.version,"/pdf.worker.js");var h,p,v=function(e){var t=e.fileReaderInfo,r=e.updateFileReaderInfo,n=function(e){r({currentPageNumber:t.currentPageNumber+e})};return Object(b.jsxs)("div",{className:d.a.pdfReader,children:[Object(b.jsx)("div",{className:d.a.fileContainer,children:Object(b.jsx)(u.a,{className:d.a.document,file:t.file,onLoadSuccess:function(e){var t=e.numPages;r({totalPages:t})},onLoadProgress:function(e){var t=e.loaded,r=e.total;return console.log("Loading a document: "+t/r*100+"%")},children:Object(b.jsx)(u.b,{className:"import-pdf-page",onRenderSuccess:function(){var e=document.querySelector(".import-pdf-page canvas").toDataURL();r({currentPage:e})},pageNumber:t.currentPageNumber})})}),Object(b.jsxs)("div",{className:d.a.pageInfo,children:[Object(b.jsxs)("span",{children:["Page ",t.currentPageNumber," of ",t.totalPages||"--"]}),Object(b.jsx)("button",{type:"button",disabled:t.currentPageNumber<=1,onClick:function(){return n(-1)},children:"Previous"}),Object(b.jsx)("button",{type:"button",disabled:t.currentPageNumber>=t.totalPages,onClick:function(){return n(1)},children:"Next"})]})]})},g=r(41),j=(r(62),r(36)),O=r.n(j),m=null,y=!1,C={currentMode:"",currentColor:"#000000",currentWidth:5,fill:!1,group:{}},x={RECTANGLE:"RECTANGLE",TRIANGLE:"TRIANGLE",ELLIPSE:"ELLIPSE",LINE:"LINE",PENCIL:"PENCIL",ERASER:"ERASER"},_=function(e){return function(t){var r=t.e;y=!0;var n=e.getPointer(r);m=new c.fabric.Line([n.x,n.y,n.x,n.y],{strokeWidth:C.currentWidth,stroke:C.currentColor,selectable:!1}),e.add(m),e.requestRenderAll()}},w=function(e){return function(t){var r=t.e;if(y){var n=e.getPointer(r);m.set({x2:n.x,y2:n.y}),m.setCoords(),e.requestRenderAll()}}},E=function(){y=!1},P=function(e){return function(t){var r=t.e;y=!0;var n=e.getPointer(r);h=n.x,p=n.y,m=new c.fabric.Rect({stroke:C.currentColor,strokeWidth:C.currentWidth,fill:C.fill?C.currentColor:"transparent",left:h,top:p,width:0,height:0,selectable:!1}),e.add(m),m.on("mousedown",(function(t){C.currentMode===x.ERASER&&(console.log("\u522a\u9664",t),e.remove(t.target))}))}},L=function(e){return function(t){var r=t.e;if(y){var n=e.getPointer(r);n.x<h&&m.set("left",n.x),n.y<p&&m.set("top",n.y),m.set({width:Math.abs(n.x-h),height:Math.abs(n.y-p)}),m.setCoords(),e.renderAll()}}},R=function(){y=!1},T=function(e){return function(t){var r=t.e;y=!0;var n=e.getPointer(r);h=n.x,p=n.y,m=new c.fabric.Ellipse({stroke:C.currentColor,strokeWidth:C.currentWidth,fill:C.fill?C.currentColor:"transparent",left:h,top:p,cornerSize:7,objectCaching:!1,selectable:!1}),e.add(m)}},k=function(e){return function(t){var r=t.e;if(y){var n=e.getPointer(r);n.x<h&&m.set("left",n.x),n.y<p&&m.set("top",n.y),m.set({rx:Math.abs(n.x-h)/2,ry:Math.abs(n.y-p)/2}),m.setCoords(),e.renderAll()}}},I=function(){y=!1},A=function(e){return function(t){var r=t.e;y=!0,C.currentMode=x.TRIANGLE;var n=e.getPointer(r);h=n.x,p=n.y,m=new c.fabric.Triangle({stroke:C.currentColor,strokeWidth:C.currentWidth,fill:C.fill?C.currentColor:"transparent",left:h,top:p,width:0,height:0,selectable:!1}),e.add(m)}},N=function(e){return function(t){var r=t.e;if(y){var n=e.getPointer(r);n.x<h&&m.set("left",n.x),n.y<p&&m.set("top",n.y),m.set({width:Math.abs(n.x-h),height:Math.abs(n.y-p)}),m.setCoords(),e.renderAll()}}},S=function(){y=!1},M=function(){var e=Object(n.useState)(null),t=Object(s.a)(e,2),r=t[0],o=t[1],a=Object(n.useState)(null),u=Object(s.a)(a,2),l=u[0],f=(u[1],Object(n.useState)(5)),d=Object(s.a)(f,2),h=d[0],p=d[1],j=Object(n.useState)(!1),m=Object(s.a)(j,2),y=m[0],M=m[1],D=Object(n.useState)({file:"",totalPages:null,currentPageNumber:1,currentPage:""}),B=Object(s.a)(D,2),F=B[0],W=B[1],G=Object(n.useRef)(null),q=(Object(n.useRef)(null),Object(n.useRef)(null)),J=Object(n.useRef)(null);Object(n.useEffect)((function(){o((function(){return function(){var e=new c.fabric.Canvas("canvas",{height:600,width:800});return c.fabric.Object.prototype.transparentCorners=!1,c.fabric.Object.prototype.cornerStyle="circle",c.fabric.Object.prototype.borderColor="#4447A9",c.fabric.Object.prototype.cornerColor="#4447A9",c.fabric.Object.prototype.cornerSize=6,c.fabric.Object.prototype.padding=10,c.fabric.Object.prototype.borderDashArray=[5,5],e}()}))}),[]),Object(n.useEffect)((function(){if(r){var e=r.getCenter();c.fabric.Image.fromURL(F.currentPage,(function(t){t.scaleToHeight(r.height),r.setBackgroundImage(t,r.renderAll.bind(r),{top:e.top,left:e.left,originX:"center",originY:"center"}),r.renderAll()}))}}),[F.currentPage]),Object(n.useEffect)((function(){r&&(V(r),r.loadFromJSON(l),r.renderAll())}),[r]);var V=function(e){e.on("mouse:up",(function(t){JSON.stringify(e.toJSON())}))},U=function(e){W(Object(i.a)(Object(i.a)({},F),e))};return Object(b.jsxs)("div",{className:O.a.whiteboard,children:[Object(b.jsxs)("div",{className:O.a.toolbar,children:[Object(b.jsx)("button",{type:"button",onClick:function(){return function(e){x.currentMode!==x.LINE&&(C.currentMode=x.LINE,e.off("mouse:down"),e.off("mouse:move"),e.off("mouse:up"),e.on("mouse:down",_(e)),e.on("mouse:move",w(e)),e.on("mouse:up",E),e.selection=!1,e.hoverCursor="auto",e.isDrawingMode=!1,e.getObjects().map((function(e){return e.set({selectable:!1})})),e.discardActiveObject().requestRenderAll())}(r)},children:"Line"}),Object(b.jsx)("button",{type:"button",onClick:function(){return function(e){C.currentMode!==x.RECTANGLE&&(C.currentMode=x.RECTANGLE,e.off("mouse:down"),e.off("mouse:move"),e.off("mouse:up"),e.on("mouse:down",P(e)),e.on("mouse:move",L(e)),e.on("mouse:up",R),e.selection=!1,e.hoverCursor="auto",e.isDrawingMode=!1,e.getObjects().map((function(e){return e.set({selectable:!1})})),e.discardActiveObject().requestRenderAll())}(r)},children:"Rectangle"}),Object(b.jsx)("button",{type:"button",onClick:function(){return function(e){C.currentMode!==x.ELLIPSE&&(C.currentMode=x.ELLIPSE,e.off("mouse:down"),e.off("mouse:move"),e.off("mouse:up"),e.on("mouse:down",T(e)),e.on("mouse:move",k(e)),e.on("mouse:up",I),e.selection=!1,e.hoverCursor="auto",e.isDrawingMode=!1,e.getObjects().map((function(e){return e.set({selectable:!1})})),e.discardActiveObject().requestRenderAll())}(r)},children:"Ellipse"}),Object(b.jsx)("button",{type:"button",onClick:function(){return function(e){e.off("mouse:down"),e.off("mouse:move"),e.off("mouse:up"),e.on("mouse:down",A(e)),e.on("mouse:move",N(e)),e.on("mouse:up",S),e.selection=!1,e.hoverCursor="auto",e.isDrawingMode=!1,e.getObjects().map((function(e){return e.set({selectable:!1})})),e.discardActiveObject().requestRenderAll()}(r)},children:"Triangle"}),Object(b.jsx)("button",{type:"button",onClick:function(){return function(e){C.currentMode!==x.PENCIL&&(e.off("mouse:down"),e.off("mouse:move"),e.off("mouse:up"),C.currentMode=x.PENCIL,e.freeDrawingBrush=new c.fabric.PencilBrush(e),e.freeDrawingBrush.width=parseInt(C.currentWidth,10)||1,e.isDrawingMode=!0)}(r)},children:"Pencil"}),Object(b.jsx)("button",{type:"button",onClick:function(){return function(e){e.off("mouse:down"),e.off("mouse:move"),e.off("mouse:up"),e.isDrawingMode=!1;var t=new c.fabric.Textbox("text",{left:100,top:100,fill:C.currentColor,editable:!0});e.add(t),e.renderAll()}(r)},children:"Text"}),Object(b.jsx)("button",{type:"button",onClick:function(){return function(e){C.currentMode="",e.isDrawingMode=!1,e.off("mouse:down"),e.off("mouse:move"),e.off("mouse:up"),e.getObjects().map((function(e){return e.set({selectable:!0})})),e.hoverCursor="all-scroll"}(r)},children:"Selection mode"}),Object(b.jsx)("button",{type:"button",onClick:function(){return function(e){C.currentMode!==x.ERASER&&(e.off("mouse:down"),e.off("mouse:move"),e.off("mouse:up"),C.currentMode=x.ERASER,e.freeDrawingBrush=new c.fabric.EraserBrush(e),e.freeDrawingBrush.width=C.currentWidth,e.isDrawingMode=!0)}(r)},children:"Eraser"}),Object(b.jsx)("button",{type:"button",onClick:function(){return function(e){e.getObjects().forEach((function(t){t!==e.backgroundImage&&e.remove(t)}))}(r)},children:"Delete"}),Object(b.jsxs)("div",{children:[Object(b.jsx)("input",{type:"checkbox",name:"fill",id:"fill",checked:y,onChange:function(e){C.fill=e.target.checked,M((function(){return e.target.checked}))}}),Object(b.jsx)("label",{htmlFor:"fill",children:"fill"})]}),Object(b.jsx)("div",{children:Object(b.jsx)("input",{type:"color",name:"color",id:"color",onChange:function(e){C.currentColor=e.target.value,r.freeDrawingBrush.color=e.target.value}})}),Object(b.jsx)("input",{type:"range",min:1,max:20,step:1,value:h,onChange:function(e){var t=parseInt(e.target.value);C.currentWidth=t,r.freeDrawingBrush.width=t,p((function(){return t}))}}),Object(b.jsxs)("div",{className:"uploadInput",children:[Object(b.jsx)("label",{htmlFor:"uploadImage",children:"+Image"}),Object(b.jsx)("input",{ref:q,accept:"image/*",type:"file",onChange:function(e){var t=new FileReader,n=e.target.files[0];t.addEventListener("load",(function(){c.fabric.Image.fromURL(t.result,(function(e){e.scaleToHeight(r.height),r.add(e)}))})),t.readAsDataURL(n)}})]}),Object(b.jsxs)("div",{className:"uploadInput",children:[Object(b.jsx)("label",{htmlFor:"uploadPDF",children:"+PDF"}),Object(b.jsx)("input",{ref:J,accept:".pdf",type:"file",onChange:function(e){U({file:e.target.files[0],currentPageNumber:1})}})]}),Object(b.jsx)("button",{onClick:function(){return function(e){alert(JSON.stringify(e.toJSON()))}(r)},children:"To Json"}),Object(b.jsx)("button",{onClick:function(){G.current.toBlob((function(e){Object(g.saveAs)(e,"image.png")}))},children:"save as image"})]}),Object(b.jsx)("canvas",{ref:G,id:"canvas"}),Object(b.jsx)("div",{children:Object(b.jsx)(v,{fileReaderInfo:F,updateFileReaderInfo:U})})]})},D=function(){return Object(b.jsx)(M,{})},B=r(42),F=r.n(B),W=function(){return Object(b.jsx)("div",{className:F.a.app,children:Object(b.jsx)(D,{})})};r(63);a.a.render(Object(b.jsx)(W,{}),document.getElementById("root"))}},[[64,1,2]]]);
//# sourceMappingURL=main.a28b9ea2.chunk.js.map