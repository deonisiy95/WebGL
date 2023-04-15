import {vertexShaderSource} from './shaders/vertex.js';
import {fragmentShaderSource} from './shaders/fragment.js';

function createShader(context, type, source) {
  const shader = context.createShader(type);
  context.shaderSource(shader, source);
  context.compileShader(shader);

  const isSuccess = context.getShaderParameter(shader, context.COMPILE_STATUS);

  if (isSuccess) {
    return shader;
  }

  console.log('Error create shader:', context.getShaderInfoLog(shader));

  context.deleteShader(shader);
}

function createProgram(context, vertexShader, fragmentShader) {
  const program = context.createProgram();

  context.attachShader(program, vertexShader);
  context.attachShader(program, fragmentShader);
  context.linkProgram(program);

  const isSuccess = context.getProgramParameter(program, context.LINK_STATUS);

  if (isSuccess) {
    return program;
  }

  console.log('Error create program:', context.getProgramInfoLog(program));

  context.deleteProgram(program);
}

function resizeCanvasToDisplaySize(canvas) {
  const displayWidth  = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  const needResize = canvas.width  !== displayWidth ||
    canvas.height !== displayHeight;

  if (needResize) {
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
}

window.onload = () => {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('webgl');

  if (!context) {
    console.log('WebGL not supported in your browser');
  }

  const vertexShader = createShader(context, context.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(context, context.FRAGMENT_SHADER, fragmentShaderSource);

  if (!vertexShader || !fragmentShader) {
    return;
  }

  const program = createProgram(context, vertexShader, fragmentShader);

  if (!program) {
    return;
  }

  const positionAttributeLocation = context.getAttribLocation(program, 'a_position');
  const positionBuffer = context.createBuffer();

  context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);

  const positions = [
    0, 0,
    0, 0.5,
    0.7, 0,
  ];

  context.bufferData(context.ARRAY_BUFFER, new Float32Array(positions), context.STATIC_DRAW);

  // -------

  resizeCanvasToDisplaySize(canvas);
  context.viewport(0, 0, context.canvas.width, context.canvas.height);

  context.clearColor(0, 0, 0, 0);
  context.clear(context.COLOR_BUFFER_BIT);

  context.useProgram(program);

  context.enableVertexAttribArray(positionAttributeLocation);

  context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);

  const size = 2;
  const type = context.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  context.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

  const primitiveType = context.TRIANGLES;
  context.drawArrays(primitiveType, 0, 3);
}
