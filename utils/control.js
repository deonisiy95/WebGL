export function setMouseControl (callback) {
  let duration = 'x';
  let processing = false;

  function onMouseMove (event) {
    if (!processing) {
      duration = event.movementX > event.movementY ? 'x' : 'y';
    }

    processing = true;

    const x = duration === 'x' ? event.movementX / 10 : 0;
    const y = duration === 'y' ? event.movementY / 10 : 0;

    callback(x,y);
  }

  document.addEventListener('mousedown', () => {
    document.addEventListener('mousemove', onMouseMove);
  });

  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', onMouseMove);
    processing = false;
  })
}
