"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Whiteboard = void 0;

require("core-js/modules/es.json.stringify.js");

require("core-js/modules/web.url.to-json.js");

require("core-js/modules/es.parse-int.js");

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireWildcard(require("react"));

var _indexModule = _interopRequireDefault(require("./index.module.scss"));

var _all = require("react-icons/all");

var _fabric = require("fabric");

var _core = require("@material-ui/core");

var _PdfReader = _interopRequireDefault(require("../PdfReader"));

var _fileSaver = require("file-saver");

var _cursors = _interopRequireDefault(require("./cursors"));

require("./eraserBrush");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let drawInstance = null;
let origX;
let origY;
let mouseDown = false;
const options = {
  currentMode: '',
  currentColor: '#000000',
  currentWidth: 5,
  fill: false,
  group: {}
};
const modes = {
  RECTANGLE: 'RECTANGLE',
  TRIANGLE: 'TRIANGLE',
  ELLIPSE: 'ELLIPSE',
  LINE: 'LINE',
  PENCIL: 'PENCIL',
  ERASER: 'ERASER'
};

const initCanvas = () => {
  const canvas = new _fabric.fabric.Canvas('canvas', {
    height: 700,
    width: 900
  });
  _fabric.fabric.Object.prototype.transparentCorners = false;
  _fabric.fabric.Object.prototype.cornerStyle = 'circle';
  _fabric.fabric.Object.prototype.borderColor = '#4447A9';
  _fabric.fabric.Object.prototype.cornerColor = '#4447A9';
  _fabric.fabric.Object.prototype.cornerSize = 6;
  _fabric.fabric.Object.prototype.padding = 10;
  _fabric.fabric.Object.prototype.borderDashArray = [5, 5];
  canvas.on('object:added', e => {
    e.target.on('mousedown', removeObject(canvas));
  });
  canvas.on('path:created', e => {
    e.path.on('mousedown', removeObject(canvas));
  });
  return canvas;
};

function removeObject(canvas) {
  return e => {
    if (options.currentMode === modes.ERASER) {
      canvas.remove(e.target);
    }
  };
}

function stopDrawing() {
  mouseDown = false;
}

function removeCanvasListener(canvas) {
  canvas.off('mouse:down');
  canvas.off('mouse:move');
  canvas.off('mouse:up');
}
/*  ==== line  ==== */


function createLine(canvas) {
  if (modes.currentMode !== modes.LINE) {
    options.currentMode = modes.LINE;
    removeCanvasListener(canvas);
    canvas.on('mouse:down', startAddLine(canvas));
    canvas.on('mouse:move', startDrawingLine(canvas));
    canvas.on('mouse:up', stopDrawing);
    canvas.selection = false;
    canvas.hoverCursor = 'auto';
    canvas.isDrawingMode = false;
    canvas.getObjects().map(item => item.set({
      selectable: false
    }));
    canvas.discardActiveObject().requestRenderAll();
  }
}

function startAddLine(canvas) {
  return _ref => {
    let {
      e
    } = _ref;
    mouseDown = true;
    let pointer = canvas.getPointer(e);
    drawInstance = new _fabric.fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      strokeWidth: options.currentWidth,
      stroke: options.currentColor,
      selectable: false
    });
    canvas.add(drawInstance);
    canvas.requestRenderAll();
  };
}

function startDrawingLine(canvas) {
  return _ref2 => {
    let {
      e
    } = _ref2;

    if (mouseDown) {
      const pointer = canvas.getPointer(e);
      drawInstance.set({
        x2: pointer.x,
        y2: pointer.y
      });
      drawInstance.setCoords();
      canvas.requestRenderAll();
    }
  };
}
/* ==== rectangle ==== */


function createRect(canvas) {
  if (options.currentMode !== modes.RECTANGLE) {
    options.currentMode = modes.RECTANGLE;
    removeCanvasListener(canvas);
    canvas.on('mouse:down', startAddRect(canvas));
    canvas.on('mouse:move', startDrawingRect(canvas));
    canvas.on('mouse:up', stopDrawing);
    canvas.selection = false;
    canvas.hoverCursor = 'auto';
    canvas.isDrawingMode = false;
    canvas.getObjects().map(item => item.set({
      selectable: false
    }));
    canvas.discardActiveObject().requestRenderAll();
  }
}

function startAddRect(canvas) {
  return _ref3 => {
    let {
      e
    } = _ref3;
    mouseDown = true;
    const pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;
    drawInstance = new _fabric.fabric.Rect({
      stroke: options.currentColor,
      strokeWidth: options.currentWidth,
      fill: options.fill ? options.currentColor : 'transparent',
      left: origX,
      top: origY,
      width: 0,
      height: 0,
      selectable: false
    });
    canvas.add(drawInstance);
    drawInstance.on('mousedown', e => {
      if (options.currentMode === modes.ERASER) {
        console.log('刪除', e);
        canvas.remove(e.target);
      }
    });
  };
}

function startDrawingRect(canvas) {
  return _ref4 => {
    let {
      e
    } = _ref4;

    if (mouseDown) {
      const pointer = canvas.getPointer(e);

      if (pointer.x < origX) {
        drawInstance.set('left', pointer.x);
      }

      if (pointer.y < origY) {
        drawInstance.set('top', pointer.y);
      }

      drawInstance.set({
        width: Math.abs(pointer.x - origX),
        height: Math.abs(pointer.y - origY)
      });
      drawInstance.setCoords();
      canvas.renderAll();
    }
  };
}
/* ==== Ellipse ==== */


function createEllipse(canvas) {
  if (options.currentMode !== modes.ELLIPSE) {
    options.currentMode = modes.ELLIPSE;
    removeCanvasListener(canvas);
    canvas.on('mouse:down', startAddEllipse(canvas));
    canvas.on('mouse:move', startDrawingEllipse(canvas));
    canvas.on('mouse:up', stopDrawing);
    canvas.selection = false;
    canvas.hoverCursor = 'auto';
    canvas.isDrawingMode = false;
    canvas.getObjects().map(item => item.set({
      selectable: false
    }));
    canvas.discardActiveObject().requestRenderAll();
  }
}

function startAddEllipse(canvas) {
  return _ref5 => {
    let {
      e
    } = _ref5;
    mouseDown = true;
    const pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;
    drawInstance = new _fabric.fabric.Ellipse({
      stroke: options.currentColor,
      strokeWidth: options.currentWidth,
      fill: options.fill ? options.currentColor : 'transparent',
      left: origX,
      top: origY,
      cornerSize: 7,
      objectCaching: false,
      selectable: false
    });
    canvas.add(drawInstance);
  };
}

function startDrawingEllipse(canvas) {
  return _ref6 => {
    let {
      e
    } = _ref6;

    if (mouseDown) {
      const pointer = canvas.getPointer(e);

      if (pointer.x < origX) {
        drawInstance.set('left', pointer.x);
      }

      if (pointer.y < origY) {
        drawInstance.set('top', pointer.y);
      }

      drawInstance.set({
        rx: Math.abs(pointer.x - origX) / 2,
        ry: Math.abs(pointer.y - origY) / 2
      });
      drawInstance.setCoords();
      canvas.renderAll();
    }
  };
}
/* === triangle === */


function createTriangle(canvas) {
  removeCanvasListener(canvas);
  canvas.on('mouse:down', startAddTriangle(canvas));
  canvas.on('mouse:move', startDrawingTriangle(canvas));
  canvas.on('mouse:up', stopDrawing);
  canvas.selection = false;
  canvas.hoverCursor = 'auto';
  canvas.isDrawingMode = false;
  canvas.getObjects().map(item => item.set({
    selectable: false
  }));
  canvas.discardActiveObject().requestRenderAll();
}

function startAddTriangle(canvas) {
  return _ref7 => {
    let {
      e
    } = _ref7;
    mouseDown = true;
    options.currentMode = modes.TRIANGLE;
    const pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;
    drawInstance = new _fabric.fabric.Triangle({
      stroke: options.currentColor,
      strokeWidth: options.currentWidth,
      fill: options.fill ? options.currentColor : 'transparent',
      left: origX,
      top: origY,
      width: 0,
      height: 0,
      selectable: false
    });
    canvas.add(drawInstance);
  };
}

function startDrawingTriangle(canvas) {
  return _ref8 => {
    let {
      e
    } = _ref8;

    if (mouseDown) {
      const pointer = canvas.getPointer(e);

      if (pointer.x < origX) {
        drawInstance.set('left', pointer.x);
      }

      if (pointer.y < origY) {
        drawInstance.set('top', pointer.y);
      }

      drawInstance.set({
        width: Math.abs(pointer.x - origX),
        height: Math.abs(pointer.y - origY)
      });
      drawInstance.setCoords();
      canvas.renderAll();
    }
  };
}

function createText(canvas) {
  removeCanvasListener(canvas);
  canvas.isDrawingMode = false;
  const text = new _fabric.fabric.Textbox('text', {
    left: 100,
    top: 100,
    fill: options.currentColor,
    editable: true
  });
  canvas.add(text);
  canvas.renderAll();
}

function changeToErasingMode(canvas) {
  if (options.currentMode !== modes.ERASER) {
    removeCanvasListener(canvas);
    canvas.isDrawingMode = false;
    options.currentMode = modes.ERASER;
    canvas.hoverCursor = "url(".concat((0, _cursors.default)({
      type: 'eraser'
    }), "), default");
  }
}

function onSelectMode(canvas) {
  options.currentMode = '';
  canvas.isDrawingMode = false;
  removeCanvasListener(canvas);
  canvas.getObjects().map(item => item.set({
    selectable: true
  }));
  canvas.hoverCursor = 'all-scroll';
}

function clearCanvas(canvas) {
  canvas.getObjects().forEach(item => {
    if (item !== canvas.backgroundImage) {
      canvas.remove(item);
    }
  });
}

function canvasToJson(canvas) {
  alert(JSON.stringify(canvas.toJSON()));
}

function draw(canvas) {
  if (options.currentMode !== modes.PENCIL) {
    removeCanvasListener(canvas);
    options.currentMode = modes.PENCIL; // canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

    canvas.freeDrawingBrush.width = parseInt(options.currentWidth, 10) || 1;
    canvas.isDrawingMode = true;
  }
}

const Whiteboard = () => {
  const [toggle, setToggle] = (0, _react.useState)(false);
  const [canvas, setCanvas] = (0, _react.useState)(null);
  const [brushWidth, setBrushWidth] = (0, _react.useState)(5);
  const [isFill, setIsFill] = (0, _react.useState)(false);
  const [fileReaderInfo, setFileReaderInfo] = (0, _react.useState)({
    file: '',
    totalPages: null,
    currentPageNumber: 1,
    currentPage: ''
  });
  const canvasRef = (0, _react.useRef)(null);
  const colorPelateRef = (0, _react.useRef)(null);
  const uploadImageRef = (0, _react.useRef)(null);
  const uploadPdfRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    if (!canvas) {
      setCanvas(() => initCanvas());
    }
  }, []);
  (0, _react.useEffect)(() => {
    if (canvas) {
      const center = canvas.getCenter();

      _fabric.fabric.Image.fromURL(fileReaderInfo.currentPage, img => {
        img.scaleToHeight(canvas.height);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          top: center.top,
          left: center.left,
          originX: 'center',
          originY: 'center'
        });
        canvas.renderAll();
      });
    }
  }, [fileReaderInfo.currentPage]);

  function uploadImage(e) {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.addEventListener('load', () => {
      _fabric.fabric.Image.fromURL(reader.result, img => {
        img.scaleToHeight(canvas.height);
        canvas.add(img);
      });
    });
    reader.readAsDataURL(file);
  }

  function changeCurrentWidth(e) {
    const intValue = parseInt(e.target.value);
    options.currentWidth = intValue;
    canvas.freeDrawingBrush.width = intValue;
    setBrushWidth(() => intValue);
  }

  function changeCurrentColor(e) {
    options.currentColor = e.target.value;
    canvas.freeDrawingBrush.color = e.target.value;
  }

  function changeFill(e) {
    options.fill = e.target.checked;
    setIsFill(() => e.target.checked);
  }

  function onSaveCanvasAsImage() {
    canvasRef.current.toBlob(function (blob) {
      (0, _fileSaver.saveAs)(blob, 'image.png');
    });
  }

  function onFileChange(event) {
    updateFileReaderInfo({
      file: event.target.files[0],
      currentPageNumber: 1
    });
  }

  function updateFileReaderInfo(data) {
    setFileReaderInfo(_objectSpread(_objectSpread({}, fileReaderInfo), data));
  }

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.container
  }, toggle === false ? /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.closeContainer
  }, /*#__PURE__*/_react.default.createElement(_core.Tooltip, {
    title: "Open Menu",
    placement: "bottom"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "".concat(_indexModule.default.button, " ").concat(_indexModule.default.closeButton),
    onClick: () => {
      setToggle(true);
    }
  }, /*#__PURE__*/_react.default.createElement(_all.HiChevronDoubleRight, {
    className: _indexModule.default.icon
  })))) : /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.openContainer
  }, /*#__PURE__*/_react.default.createElement(_core.Tooltip, {
    title: "Close Menu",
    placement: "right"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "".concat(_indexModule.default.button, " ").concat(_indexModule.default.openButton),
    onClick: () => {
      setToggle(false);
    }
  }, /*#__PURE__*/_react.default.createElement(_all.HiChevronDoubleLeft, {
    className: _indexModule.default.icon
  }))), /*#__PURE__*/_react.default.createElement(_core.Tooltip, {
    title: "Cursor",
    placement: "right"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: _indexModule.default.button,
    onClick: () => onSelectMode(canvas)
  }, /*#__PURE__*/_react.default.createElement(_all.GiArrowCursor, {
    className: _indexModule.default.icon
  }))), /*#__PURE__*/_react.default.createElement(_core.Tooltip, {
    title: "Pencil",
    placement: "right"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: _indexModule.default.button,
    onClick: () => draw(canvas)
  }, /*#__PURE__*/_react.default.createElement(_all.MdModeEditOutline, {
    className: _indexModule.default.icon
  }))), /*#__PURE__*/_react.default.createElement(_core.Tooltip, {
    title: "Pencil Color",
    placement: "right"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: _indexModule.default.button,
    onClick: () => colorPelateRef.current.click()
  }, /*#__PURE__*/_react.default.createElement("input", {
    ref: colorPelateRef,
    style: {
      width: '25px',
      height: '25px',
      border: 'none',
      backgroundColor: 'transparent',
      borderRadius: '12px'
    },
    type: "color",
    name: "color",
    id: "color",
    onChange: changeCurrentColor
  }))), /*#__PURE__*/_react.default.createElement(_core.Tooltip, {
    title: "Shapes",
    placement: "bottom"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.uploadDropdown
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: _indexModule.default.button
  }, /*#__PURE__*/_react.default.createElement(_all.FaShapes, {
    className: _indexModule.default.icon
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.dropdownContent
  }, /*#__PURE__*/_react.default.createElement("span", {
    onClick: () => createLine(canvas)
  }, "Line"), /*#__PURE__*/_react.default.createElement("span", {
    onClick: () => createRect(canvas)
  }, "Rectangle"), /*#__PURE__*/_react.default.createElement("span", {
    onClick: () => createEllipse(canvas)
  }, "Ellipse"), /*#__PURE__*/_react.default.createElement("span", {
    onClick: () => createTriangle(canvas)
  }, "Triangle")))), /*#__PURE__*/_react.default.createElement(_core.Tooltip, {
    title: "Write",
    placement: "right"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: _indexModule.default.button,
    onClick: () => createText(canvas)
  }, /*#__PURE__*/_react.default.createElement(_all.SiWritedotas, {
    className: _indexModule.default.icon
  }))), /*#__PURE__*/_react.default.createElement(_core.Tooltip, {
    title: "Erase",
    placement: "bottom"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.uploadDropdown
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: _indexModule.default.button
  }, /*#__PURE__*/_react.default.createElement(_all.FaEraser, {
    className: _indexModule.default.icon
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.dropdownContent
  }, /*#__PURE__*/_react.default.createElement("span", {
    onClick: () => changeToErasingMode(canvas)
  }, "Erase"), /*#__PURE__*/_react.default.createElement("span", {
    onClick: () => clearCanvas(canvas)
  }, "Clear All")))), /*#__PURE__*/_react.default.createElement(_core.Tooltip, {
    title: "Document",
    placement: "bottom"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.uploadDropdown
  }, /*#__PURE__*/_react.default.createElement("input", {
    ref: uploadImageRef,
    accept: "image/*",
    type: "file",
    onChange: uploadImage
  }), /*#__PURE__*/_react.default.createElement("input", {
    ref: uploadPdfRef,
    accept: ".pdf",
    type: "file",
    onChange: onFileChange
  }), /*#__PURE__*/_react.default.createElement("button", {
    className: _indexModule.default.button,
    onClick: () => uploadImageRef.current.click()
  }, /*#__PURE__*/_react.default.createElement(_all.IoDocument, {
    className: _indexModule.default.icon
  })))))), /*#__PURE__*/_react.default.createElement("div", {
    className: _indexModule.default.whiteboard
  }, /*#__PURE__*/_react.default.createElement("canvas", {
    ref: canvasRef,
    id: "canvas"
  })));
};

exports.Whiteboard = Whiteboard;