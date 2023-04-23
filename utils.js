export function createShader(context, type, source) {
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

export function createProgram(context, vertexShader, fragmentShader) {
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

export function resizeCanvasToDisplaySize(canvas) {
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
