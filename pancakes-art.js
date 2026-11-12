const MOVIE_SECONDS = 10;
const BATTER = '#f3dca0';
const GOLDEN = '#e2a24e';
const SPRINKLE_COLORS = ['#e63946', '#f4a261', '#2a9d8f', '#8338ec', '#3a86ff', '#ffbe0b'];

const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const easeOut = p => 1 - (1 - p) ** 3;

function seeded(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ellipse(ctx, x, y, rx, ry, fill, stroke, lineWidth = 3) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(rx, 0.1), Math.max(ry, 0.1), 0, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
}

function drawPlate(ctx, cx, cy, r) {
  ellipse(ctx, cx, cy + 8, r, r * 0.4, 'rgba(0,0,0,.1)');
  ellipse(ctx, cx, cy, r, r * 0.4, '#fff', '#e3d7c6');
  ellipse(ctx, cx, cy, r * 0.72, r * 0.29, null, '#efe6d8');
}

// Returns the y position of the top pancake so toppings can be placed on it.
function drawStack(ctx, cx, cy, rx, count) {
  const ry = rx * 0.38;
  let top = cy;
  for (let i = 0; i < count; i++) {
    top = cy - i * 12;
    ellipse(ctx, cx, top + 7, rx, ry, '#b8742e');
    ellipse(ctx, cx, top, rx, ry, GOLDEN);
    ellipse(ctx, cx, top, rx * 0.72, ry * 0.7, '#eab25e');
  }
  return top;
}

function drawToppings(ctx, cx, cy, rx, toppings, progress) {
  const ry = rx * 0.38;
  const random = seeded(7);
  toppings.forEach((topping, index) => {
    const p = clamp(progress * toppings.length - index);
    if (p <= 0) return;
    if (topping === 'Nutella') {
      ellipse(ctx, cx, cy, rx * 0.78 * easeOut(p), ry * 0.78 * easeOut(p), '#5a3214');
      ellipse(ctx, cx - rx * 0.2, cy - ry * 0.2, rx * 0.25 * p, ry * 0.15 * p, 'rgba(255,255,255,.18)');
    } else if (topping === 'Whipped cream') {
      const s = rx / 120 * easeOut(p);
      [[-26, 2, 26], [26, 2, 26], [0, 6, 28], [-12, -14, 22], [12, -14, 22], [0, -30, 18]].forEach(([dx, dy, r]) => {
        ellipse(ctx, cx + dx * s, cy - 10 * s + dy * s, r * s, r * s * 0.8, '#fffdf8', '#efe8dc', 2);
      });
    } else if (topping === 'Sprinkles') {
      const count = Math.floor(50 * p);
      for (let i = 0; i < 50; i++) {
        const a = random() * Math.PI * 2, d = Math.sqrt(random()) * 0.82, rot = random() * Math.PI, color = SPRINKLE_COLORS[Math.floor(random() * SPRINKLE_COLORS.length)];
        if (i >= count) continue;
        ctx.save();
        ctx.translate(cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d);
        ctx.rotate(rot);
        ctx.fillStyle = color;
        ctx.fillRect(-rx * 0.04, -rx * 0.012, rx * 0.08, rx * 0.024);
        ctx.restore();
      }
    } else if (topping === 'Powdered sugar') {
      const count = Math.floor(160 * p);
      for (let i = 0; i < 160; i++) {
        const a = random() * Math.PI * 2, d = Math.sqrt(random()) * 0.9;
        if (i >= count) continue;
        ellipse(ctx, cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d, 1.6, 1.6, 'rgba(255,255,255,.95)');
      }
    }
  });
}

function prepareCanvas(canvas) {
  const width = Number(canvas.getAttribute('width'));
  const height = Number(canvas.getAttribute('height'));
  const ratio = window.devicePixelRatio || 1;
  if (!canvas.dataset.width) {
    canvas.dataset.width = width;
    canvas.dataset.height = height;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
  }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { ctx, width: Number(canvas.dataset.width), height: Number(canvas.dataset.height) };
}

function drawPicture(canvas, pancake) {
  const { ctx, width, height } = prepareCanvas(canvas);
  ctx.clearRect(0, 0, width, height);
  ellipse(ctx, width / 2, height / 2, width * 0.48, height * 0.46, pancake.color + '22');
  const cx = width / 2, cy = height * 0.62;
  drawPlate(ctx, cx, cy, 140);
  const top = drawStack(ctx, cx, cy, 100, 3);
  drawToppings(ctx, cx, top, 100, pancake.toppings, 1);
}

function drawBowl(ctx, cx, cy, contentColor) {
  ctx.beginPath();
  ctx.moveTo(cx - 130, cy);
  ctx.bezierCurveTo(cx - 130, cy + 130, cx + 130, cy + 130, cx + 130, cy);
  ctx.closePath();
  ctx.fillStyle = '#7fb8e0';
  ctx.fill();
  ellipse(ctx, cx, cy, 130, 46, '#5d9cc8', '#a6d0ee', 4);
  if (contentColor) ellipse(ctx, cx, cy + 4, 112, 36, contentColor);
}

function drawPan(ctx, cx, cy) {
  ctx.fillStyle = '#2b2b2b';
  ctx.fillRect(cx + 150, cy - 9, 150, 18);
  ellipse(ctx, cx, cy + 10, 165, 60, '#1f1f1f');
  ellipse(ctx, cx, cy, 165, 58, '#444');
  ellipse(ctx, cx, cy, 145, 49, '#2c2c2c');
}

function caption(ctx, width, text) {
  ctx.font = '800 30px "Baloo 2", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const w = ctx.measureText(text).width + 40;
  ctx.fillStyle = 'rgba(255,255,255,.9)';
  ctx.beginPath();
  ctx.roundRect(width / 2 - w / 2, 18, w, 48, 24);
  ctx.fill();
  ctx.fillStyle = '#3b2a1a';
  ctx.fillText(text, width / 2, 44);
}

function toppingSentence(toppings) {
  const names = toppings.map(t => (t === 'Nutella' ? t : t.toLowerCase()));
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} & ${names.at(-1)}` : names[0];
}

function drawMovieFrame(canvas, pancake, t) {
  const { ctx, width, height } = prepareCanvas(canvas);
  const cx = width / 2;
  ctx.fillStyle = '#fdf0d5';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#e9c99a';
  ctx.fillRect(0, height * 0.74, width, height * 0.26);

  if (t < 2.5) {
    const bowlY = 210;
    const items = [
      { start: 0, label: 'Flour', color: '#fffaf0', after: '#f7f1e3', draw: (x, y) => { ellipse(ctx, x, y, 26, 20, '#fffaf0', '#e8dcc6', 2); } },
      { start: 0.8, label: 'Eggs', color: '#fff', after: '#f6e3a5', draw: (x, y) => { ellipse(ctx, x - 16, y, 15, 20, '#fff6e6', '#e3cfae', 2); ellipse(ctx, x + 16, y, 15, 20, '#fff6e6', '#e3cfae', 2); } },
      { start: 1.6, label: 'Milk', color: '#fff', after: BATTER, draw: (x, y) => { ctx.fillStyle = '#fff'; ctx.strokeStyle = '#cfe3f2'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - 18, y - 30, 36, 60, 6); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#3a86ff'; ctx.fillRect(x - 18, y - 4, 36, 12); } }
    ];
    let content = null;
    items.forEach(item => { if (t >= item.start + 0.6) content = item.after; });
    drawBowl(ctx, cx, bowlY, content);
    const falling = items.find(item => t >= item.start && t < item.start + 0.6);
    if (falling) {
      const y = 90 + (bowlY - 90) * ((t - falling.start) / 0.6) ** 2;
      falling.draw(cx, y);
      ctx.font = '700 22px "Baloo 2", system-ui, sans-serif';
      ctx.fillStyle = '#3b2a1a';
      ctx.textAlign = 'left';
      ctx.fillText(falling.label, cx + 40, y);
    }
    caption(ctx, width, 'Add flour, eggs and milk');
  } else if (t < 4.5) {
    drawBowl(ctx, cx, 210, BATTER);
    const a = t * 10;
    ctx.strokeStyle = '#e4c67f';
    ctx.lineWidth = 3;
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      ctx.ellipse(cx, 214, 30 + k * 25, 10 + k * 8, 0, a + k, a + k + 2);
      ctx.stroke();
    }
    const wx = cx + Math.cos(a) * 45, wy = 212 + Math.sin(a) * 14;
    ctx.strokeStyle = '#9aa3ad';
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + 70, 90); ctx.stroke();
    ctx.strokeStyle = '#c2410c';
    ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(wx + 62, 104); ctx.lineTo(wx + 85, 62); ctx.stroke();
    caption(ctx, width, 'Mix until smooth');
  } else if (t < 6.5) {
    const panY = 230;
    drawPan(ctx, cx, panY);
    const p = clamp((t - 4.5) / 1.3);
    if (p < 1) {
      ctx.fillStyle = BATTER;
      ctx.fillRect(cx - 5, 70, 10, panY - 70);
    }
    ellipse(ctx, cx, panY, 115 * easeOut(p), 40 * easeOut(p), BATTER);
    if (t > 5.8) {
      const random = seeded(3);
      const bubbles = Math.floor(clamp((t - 5.8) / 0.6) * 18);
      for (let i = 0; i < bubbles; i++) {
        const a = random() * Math.PI * 2, d = Math.sqrt(random()) * 0.8;
        ellipse(ctx, cx + Math.cos(a) * 115 * d, panY + Math.sin(a) * 40 * d, 4, 3, '#e8c97f', '#d9b765', 1.5);
      }
    }
    caption(ctx, width, t > 5.8 ? 'Wait for bubbles…' : 'Pour into a hot pan');
  } else if (t < 8) {
    const panY = 230;
    drawPan(ctx, cx, panY);
    const f = (t - 6.5) / 1.5;
    const lift = Math.sin(f * Math.PI) * 110;
    const squash = Math.abs(Math.cos(f * Math.PI));
    ellipse(ctx, cx, panY - lift, 115, 40 * squash + 3, f < 0.5 ? BATTER : GOLDEN, f < 0.5 ? '#e4c67f' : '#b8742e', 3);
    caption(ctx, width, 'Flip it!');
  } else {
    const p = clamp((t - 8) / 1.5);
    drawPlate(ctx, cx, 255, 175);
    const top = drawStack(ctx, cx, 250, 120, 2);
    drawToppings(ctx, cx, top, 120, pancake.toppings, p);
    caption(ctx, width, t >= 9.6 ? 'Yum! 😋' : `Add ${toppingSentence(pancake.toppings)}`);
  }
}
