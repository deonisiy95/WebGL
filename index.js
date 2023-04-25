import {createShader, createProgram, resizeCanvasToDisplaySize} from './utils/base';
import {vertexShaderSource} from './shaders/vertex2.js';
import {fragmentShaderSource} from './shaders/fragment2.js';
import {mat4} from 'gl-matrix';
import {setMouseControl} from './utils/control'

window.onload = () => {
  const canvas = document.getElementById('canvas');
  const gl = canvas.getContext('webgl');

  if (!gl) {
    console.log('WebGL not supported in your browser');
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  if (!vertexShader || !fragmentShader) {
    return;
  }

  const program = createProgram(gl, vertexShader, fragmentShader);

  if (!program) {
    return;
  }

  const uCube = gl.getUniformLocation(program, 'u_cube');
  const uCamera = gl.getUniformLocation(program, 'u_camera');
  const aPosition = gl.getAttribLocation(program, 'a_position');
  const aColor = gl.getAttribLocation(program, 'a_color');

  const vertexBuffer = gl.createBuffer();
  const vertices = [
    -1, -1, -1,
    1, -1, -1,
    -1, -1, 1,
    // Передняя грань
    -1, -1, -1,
    1, -1, -1,
    -1, -1, 1,

    1, -1, 1,
    -1, -1, 1,
    1, -1, -1,

    // Задняя грань
    -1, 1, -1,
    -1, 1, 1,
    1, 1, -1,

    1, 1, 1,
    1, 1, -1,
    -1, 1, 1,

    // Нижняя грань
    -1, -1, -1,
    -1, 1, -1,
    1, -1, -1,

    1, 1, -1,
    1, -1, -1,
    -1, 1, -1,

    // Верхняя грань
    -1, -1, 1,
    1, -1, 1,
    -1, 1, 1,

    1, 1, 1,
    -1, 1, 1,
    1, -1, 1,

    // Левая грань
    -1, -1, -1,
    -1, -1, 1,
    -1, 1, -1,

    -1, 1, 1,
    -1, 1, -1,
    -1, -1, 1,

    // Правая грань
    1, -1, -1,
    1, 1, -1,
    1, -1, 1,

    1, 1, 1,
    1, -1, 1,
    1, 1, -1
  ];
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const colorBuffer = gl.createBuffer();
  const colors = [
    1, 1, 0.5,
    1, 0.5, 1,
    1, 0.5, 0.5,
    // Передняя грань
    1, 0.5, 0.5,
    1, 0.5, 0.5,
    1, 0.5, 0.5,
    1, 0.5, 0.5,
    1, 0.5, 0.5,
    1, 0.5, 0.5,

    // Задняя грань
    1, 0.5, 0.5,
    1, 0.5, 0.5,
    1, 0.5, 0.5,
    1, 0.5, 0.5,
    1, 0.5, 0.5,
    1, 0.5, 0.5,

    // Нижняя грань
    0.5, 0.7, 1,
    0.5, 0.7, 1,
    0.5, 0.7, 1,
    0.5, 0.7, 1,
    0.5, 0.7, 1,
    0.5, 0.7, 1,

    // Верхняя грань
    0.5, 0.7, 1,
    0.5, 0.7, 1,
    0.5, 0.7, 1,
    0.5, 0.7, 1,
    0.5, 0.7, 1,
    0.5, 0.7, 1,

    // Левая грань
    0.3, 1, 0.3,
    0.3, 1, 0.3,
    0.3, 1, 0.3,
    0.3, 1, 0.3,
    0.3, 1, 0.3,
    0.3, 1, 0.3,

    // Правая грань
    0.3, 1, 0.3,
    0.3, 1, 0.3,
    0.3, 1, 0.3,
    0.3, 1, 0.3,
    0.3, 1, 0.3,
    0.3, 1, 0.3
  ];
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const cubeMatrix = mat4.create();
  const cameraMatrix = mat4.create();
  mat4.perspective(cameraMatrix, 0.785, window.innerWidth / window.innerHeight, 0.1, 1000);
  mat4.translate(cameraMatrix, cameraMatrix, [0, 0, -10]);

  // Запомним время последней отрисовки кадра
  let lastRenderTime = Date.now();

  function render(angleX, angleY) {
    // requestAnimationFrame(render);

    mat4.rotateY(cubeMatrix, cubeMatrix, angleX);
    mat4.rotateX(cubeMatrix, cubeMatrix, angleY);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.enableVertexAttribArray(aColor);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv(uCube, false, cubeMatrix);
    gl.uniformMatrix4fv(uCamera, false, cameraMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, 39);

    lastRenderTime = time;
  }

  render(0, 0);

  window.foo = (a) => render(a);

  setMouseControl(render);
}

