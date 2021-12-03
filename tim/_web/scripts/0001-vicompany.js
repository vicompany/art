// eslint-disable-next-line import/extensions, import/no-unresolved
import * as Vector from 'https://unpkg.com/@bieb/vector@1.2.0/lib/vector.esm.js';

function createPathFromSvgPath(svgPath, detail = 1024) {
  const svgPathLength = svgPath.getTotalLength();

  const path = Array.from({ length: detail }, (_, index) => {
    const t = index / detail;
    const { x, y } = svgPath.getPointAtLength(t * svgPathLength);

    return [x, y];
  });

  return {
    style: svgPath.getAttribute('fill'),

    getPointAt(t) {
      const indexFloat = (t * path.length) % path.length;
      const indexBefore = Math.floor(indexFloat) % path.length;
      const indexAfter = (indexBefore + 1) % path.length;
      const indexRemainder = indexFloat - indexBefore;

      return Vector.mix(path[indexBefore], path[indexAfter], indexRemainder);
    },
  };
}

function createRenderer({
  canvas,
  padding,
  paths,
  scale,
  trailDetal,
  trailLength,
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

    const tOffset = (time / 1000) / 3;

    for (const path of paths) {
      context.beginPath();

      for (let i = 0; i < trailDetal; i++) {
        const t = trailLength * (i / trailDetal);
        const [x, y] = path.getPointAt(t + tOffset);

        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.strokeStyle = path.style;
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

const pathDetail = 2048;
const paths = Array.from(logo.querySelectorAll('path'))
  .map((svgPath) => createPathFromSvgPath(svgPath, pathDetail));

const renderer = createRenderer({
  canvas,
  padding,
  paths,
  scale,
  trailDetal: 512,
  trailLength: 0.75,
});

renderer.start();
