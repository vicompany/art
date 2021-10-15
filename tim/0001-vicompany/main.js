function createRenderer({
  canvas,
  padding,
  paths,
  scale,
}) {
  const context = canvas.getContext('2d');

  const update = (time) => {
    requestAnimationFrame(update);

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    context.translate(padding, padding);
    context.scale(scale, scale);

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 4;

    for (const [index, path] of paths.entries()) {
      const t = index / paths.length;
      let length = t * path.getTotalLength() + (time / 3000) * path.getTotalLength();

      context.beginPath();

      for (let i = 0; i < 32; i++) {
        const { x, y } = path.getPointAtLength(length % path.getTotalLength());

        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }

        length += path.getTotalLength() / 128;
      }

      context.strokeStyle = path.getAttribute('fill');
      context.stroke();
    }

    context.restore();
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
  paths: Array.from(logo.querySelectorAll('path')),
  scale,
  padding,
});

renderer.start();
