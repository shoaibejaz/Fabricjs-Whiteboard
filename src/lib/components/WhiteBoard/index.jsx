import React, { useState, useRef, useEffect } from 'react';
//          Importing CSS Files
import styles from './index.module.scss';
//          Importing Icons
import { 
  HiChevronDoubleRight, HiChevronDoubleLeft, GiArrowCursor, MdModeEditOutline, FaShapes, MdClear, SiWritedotas, FaEraser, IoDocument 
} from "react-icons/all";
//          Importing Components
import { fabric } from 'fabric';
import { Tooltip } from '@material-ui/core';
import PdfReader from '../PdfReader';
import { saveAs } from 'file-saver';
import getCursor from './cursors';

import './eraserBrush';


let drawInstance = null;
let origX;
let origY;
let mouseDown = false;

const options = {
  currentMode: '',
  currentColor: '#000000',
  currentWidth: 5,
  fill: false,
  group: {},
};

const modes = {
  RECTANGLE: 'RECTANGLE',
  TRIANGLE: 'TRIANGLE',
  ELLIPSE: 'ELLIPSE',
  LINE: 'LINE',
  PENCIL: 'PENCIL',
  ERASER: 'ERASER',
};

const initCanvas = () => {
  const canvas = new fabric.Canvas('canvas', { height: 700, width: 900 });
  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerStyle = 'circle';
  fabric.Object.prototype.borderColor = '#4447A9';
  fabric.Object.prototype.cornerColor = '#4447A9';
  fabric.Object.prototype.cornerSize = 6;
  fabric.Object.prototype.padding = 10;
  fabric.Object.prototype.borderDashArray = [ 5, 5 ];

  canvas.on('object:added', (e) => {
    e.target.on('mousedown', removeObject(canvas));
  });
  canvas.on('path:created', (e) => {
    e.path.on('mousedown', removeObject(canvas));
  });

  return canvas;
};

function removeObject(canvas) {
  return (e) => {
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
    canvas.getObjects().map((item) => item.set({ selectable: false }));
    canvas.discardActiveObject().requestRenderAll();
  }
}

function startAddLine(canvas) {
  return ({ e }) => {
    mouseDown = true;

    let pointer = canvas.getPointer(e);
    drawInstance = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      strokeWidth: options.currentWidth,
      stroke: options.currentColor,
      selectable: false,
    });

    canvas.add(drawInstance);
    canvas.requestRenderAll();
  };
}

function startDrawingLine(canvas) {
  return ({ e }) => {
    if (mouseDown) {
      const pointer = canvas.getPointer(e);
      drawInstance.set({
        x2: pointer.x,
        y2: pointer.y,
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
    canvas.getObjects().map((item) => item.set({ selectable: false }));
    canvas.discardActiveObject().requestRenderAll();
  }
}

function startAddRect(canvas) {
  return ({ e }) => {
    mouseDown = true;

    const pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;

    drawInstance = new fabric.Rect({
      stroke: options.currentColor,
      strokeWidth: options.currentWidth,
      fill: options.fill ? options.currentColor : 'transparent',
      left: origX,
      top: origY,
      width: 0,
      height: 0,
      selectable: false,
    });

    canvas.add(drawInstance);

    drawInstance.on('mousedown', (e) => {
      if (options.currentMode === modes.ERASER) {
        console.log('刪除', e);
        canvas.remove(e.target);
      }
    });
  };
}

function startDrawingRect(canvas) {
  return ({ e }) => {
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
        height: Math.abs(pointer.y - origY),
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
    canvas.getObjects().map((item) => item.set({ selectable: false }));
    canvas.discardActiveObject().requestRenderAll();
  }
}

function startAddEllipse(canvas) {
  return ({ e }) => {
    mouseDown = true;

    const pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;
    drawInstance = new fabric.Ellipse({
      stroke: options.currentColor,
      strokeWidth: options.currentWidth,
      fill: options.fill ? options.currentColor : 'transparent',
      left: origX,
      top: origY,
      cornerSize: 7,
      objectCaching: false,
      selectable: false,
    });

    canvas.add(drawInstance);
  };
}

function startDrawingEllipse(canvas) {
  return ({ e }) => {
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
        ry: Math.abs(pointer.y - origY) / 2,
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
  canvas.getObjects().map((item) => item.set({ selectable: false }));
  canvas.discardActiveObject().requestRenderAll();
}

function startAddTriangle(canvas) {
  return ({ e }) => {
    mouseDown = true;
    options.currentMode = modes.TRIANGLE;

    const pointer = canvas.getPointer(e);
    origX = pointer.x;
    origY = pointer.y;
    drawInstance = new fabric.Triangle({
      stroke: options.currentColor,
      strokeWidth: options.currentWidth,
      fill: options.fill ? options.currentColor : 'transparent',
      left: origX,
      top: origY,
      width: 0,
      height: 0,
      selectable: false,
    });

    canvas.add(drawInstance);
  };
}

function startDrawingTriangle(canvas) {
  return ({ e }) => {
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
        height: Math.abs(pointer.y - origY),
      });

      drawInstance.setCoords();
      canvas.renderAll();
    }
  };
}

function createText(canvas) {
  removeCanvasListener(canvas);

  canvas.isDrawingMode = false;

  const text = new fabric.Textbox('text', {
    left: 100,
    top: 100,
    fill: options.currentColor,
    editable: true,
  });

  canvas.add(text);
  canvas.renderAll();
}

function changeToErasingMode(canvas) {
  if (options.currentMode !== modes.ERASER) {
    removeCanvasListener(canvas);

    canvas.isDrawingMode = false;

    options.currentMode = modes.ERASER;
    canvas.hoverCursor = `url(${getCursor({ type: 'eraser' })}), default`;
  }
}

function onSelectMode(canvas) {
  options.currentMode = '';
  canvas.isDrawingMode = false;

  removeCanvasListener(canvas);

  canvas.getObjects().map((item) => item.set({ selectable: true }));
  canvas.hoverCursor = 'all-scroll';
}

function clearCanvas(canvas) {
  canvas.getObjects().forEach((item) => {
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

    options.currentMode = modes.PENCIL;
    // canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = parseInt(options.currentWidth, 10) || 1;
    canvas.isDrawingMode = true;
  }
}

export const Whiteboard = () => {
  const [ toggle, setToggle ] = useState( false );
  const [canvas, setCanvas] = useState(null);
  const [brushWidth, setBrushWidth] = useState(5);
  const [isFill, setIsFill] = useState(false);
  const [fileReaderInfo, setFileReaderInfo] = useState({
    file: '',
    totalPages: null,
    currentPageNumber: 1,
    currentPage: '',
  });
  const canvasRef = useRef(null);
  const colorPelateRef = useRef(null);
  const uploadImageRef = useRef(null);
  const uploadPdfRef = useRef(null);

  useEffect(() => {
    if (!canvas) {
      setCanvas(() => initCanvas());
    }
  }, []);

  useEffect(() => {
    if (canvas) {
      const center = canvas.getCenter();
      fabric.Image.fromURL(fileReaderInfo.currentPage, (img) => {
        img.scaleToHeight(canvas.height);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          top: center.top,
          left: center.left,
          originX: 'center',
          originY: 'center',
        });

        canvas.renderAll();
      });
    }
  }, [fileReaderInfo.currentPage]);

  function uploadImage(e) {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.addEventListener('load', () => {
      fabric.Image.fromURL(reader.result, (img) => {
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
      saveAs(blob, 'image.png');
    });
  }

  function onFileChange(event) {
    updateFileReaderInfo({ file: event.target.files[0], currentPageNumber: 1 });
  }

  function updateFileReaderInfo(data) {
    setFileReaderInfo({ ...fileReaderInfo, ...data });
  }

  return (
    <>
      <div className={ styles.container }>
        { toggle === false ?
          <div className={ styles.closeContainer }>
            <Tooltip title='Open Menu' placement='bottom'>
              <button className={ `${ styles.button } ${ styles.closeButton }` } onClick={ () => { setToggle( true ) } }>
                <HiChevronDoubleRight className={ styles.icon } />
              </button>
            </Tooltip>
          </div> : 
          <div className={ styles.openContainer }>
            <Tooltip title='Close Menu' placement='right'>
              <button className={ `${ styles.button } ${ styles.openButton }` } onClick={ () => { setToggle( false ) } }>
                <HiChevronDoubleLeft className={ styles.icon } />
              </button>
            </Tooltip>
            <Tooltip title='Cursor' placement='right'>
              <button className={ styles.button } onClick={ () => onSelectMode( canvas ) }>
                <GiArrowCursor className={ styles.icon } />
              </button>
            </Tooltip>
            <Tooltip title='Pencil' placement='right'>
              <button className={ styles.button } onClick={ () => draw( canvas ) }>
                <MdModeEditOutline className={ styles.icon } />
              </button>
            </Tooltip>
            <Tooltip title='Pencil Color' placement='right'>
              <button className={ styles.button } onClick={ () => colorPelateRef.current.click() }>
                <input ref={ colorPelateRef } style={ { width: '25px', height: '25px', border: 'none', backgroundColor: 'transparent', borderRadius: '12px' } } type="color" name="color" id="color" onChange={ changeCurrentColor } />
              </button>
            </Tooltip>
            <Tooltip title='Shapes' placement='bottom'>
              <div className={ styles.uploadDropdown }>
                <button className={ styles.button }>
                  <FaShapes className={ styles.icon } />
                </button>
                <div className={ styles.dropdownContent }>
                  <span onClick={ () => createLine( canvas ) }>Line</span>
                  <span onClick={ () => createRect( canvas ) }>Rectangle</span>
                  <span onClick={ () => createEllipse( canvas ) }>Ellipse</span>
                  <span onClick={ () => createTriangle( canvas ) }>Triangle</span>
                </div>
              </div>
            </Tooltip>
            <Tooltip title='Write' placement='right'>
              <button className={ styles.button } onClick={ () => createText( canvas ) }>
                <SiWritedotas className={ styles.icon } />
              </button>
            </Tooltip>
            <Tooltip title='Erase' placement='bottom'>
              <div className={ styles.uploadDropdown }>
                <button className={ styles.button }>
                  <FaEraser className={ styles.icon } />
                </button>
                <div className={ styles.dropdownContent }>
                  <span onClick={ () => changeToErasingMode( canvas ) }>Erase</span>
                  <span onClick={ () => clearCanvas( canvas ) }>Clear All</span>
                </div>
              </div>
            </Tooltip>
            <Tooltip title='Document' placement='bottom'>
              <div className={ styles.uploadDropdown }>
                <input ref={ uploadImageRef } accept="image/*" type="file" onChange={ uploadImage } />
                <input ref={ uploadPdfRef } accept=".pdf" type="file" onChange={ onFileChange } />
                <button className={ styles.button } onClick={ () => uploadImageRef.current.click() }>
                  <IoDocument className={ styles.icon } />
                </button>
                {/* <div className={ styles.dropdownContent }>
                  <span onClick={ () => uploadImageRef.current.click() }>Image</span>
                  <span onClick={ () => uploadPdfRef.current.click() }>PDF</span>
                </div> */}
              </div>
            </Tooltip>
          </div> }
      </div>
      <div className={ styles.whiteboard }>
        <canvas ref={ canvasRef } id="canvas" />
        {/* <div>
          <PdfReader fileReaderInfo={ fileReaderInfo } updateFileReaderInfo={ updateFileReaderInfo } />
        </div> */}
      </div>
    </>
  );
};
