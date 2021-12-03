function createRenderer({
  canvas,
  padding,
  pointCount,
}) {
  const context = canvas.getContext('2d');

  const update = () => {
    requestAnimationFrame(update);

    // TODO
  };

  return {
    start() {
      requestAnimationFrame(update);
    },
  };
}

const canvas = document.getElementById('canvas');
const logo = document.getElementById('logo');
const scale = 8;
const padding = scale * 64;

const [,, width, height] = logo.getAttribute('viewBox').split(/\s+/);

canvas.height = scale * height + 2 * padding;
canvas.width = scale * width + 2 * padding;

const renderer = createRenderer({
  canvas,
  padding,
  pointCount: 1024,
});

renderer.start();
