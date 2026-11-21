// Small canvas drawing helpers shared by every scene painter.
// All helpers draw in the caller's coordinate space; none loads anything.

export function circle(ctx, x, y, r, fill, stroke, lineWidth) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth || 2;
    ctx.stroke();
  }
}

export function ellipse(ctx, x, y, rx, ry, fill, stroke, lineWidth) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth || 2;
    ctx.stroke();
  }
}

export function rect(ctx, x, y, w, h, fill, stroke, lineWidth) {
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth || 2;
    ctx.stroke();
  }
}

export function roundRect(ctx, x, y, w, h, r, fill, stroke, lineWidth) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth || 2;
    ctx.stroke();
  }
}

export function poly(ctx, points, fill, stroke, lineWidth) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth || 2;
    ctx.stroke();
  }
}

export function line(ctx, x1, y1, x2, y2, stroke, lineWidth) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth || 2;
  ctx.stroke();
}

export function star(ctx, x, y, r, fill, points) {
  const n = points || 5;
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (i * Math.PI) / n - Math.PI / 2;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function skyGradient(ctx, w, h, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

export function text(ctx, str, x, y, size, fill, align, weight, font) {
  ctx.font = `${weight || '700'} ${size}px ${font || 'Georgia, serif'}`;
  ctx.textAlign = align || 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = fill;
  ctx.fillText(str, x, y);
}

export function cloud(ctx, x, y, s, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 20 * s, y - 8 * s, 14 * s, 0, Math.PI * 2);
  ctx.arc(x + 40 * s, y, 17 * s, 0, Math.PI * 2);
  ctx.arc(x + 20 * s, y + 6 * s, 15 * s, 0, Math.PI * 2);
  ctx.fill();
}

// A simple flat-style bird: two arcs.
export function bird(ctx, x, y, s, stroke) {
  ctx.beginPath();
  ctx.arc(x - 8 * s, y, 9 * s, Math.PI * 1.15, Math.PI * 1.95);
  ctx.arc(x + 8 * s, y, 9 * s, Math.PI * 1.05, Math.PI * 1.85);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2.5 * s;
  ctx.stroke();
}

// A paper lantern: ribbed oval with a tassel.
export function lantern(ctx, x, y, r, colour, sway) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(sway || 0);
  ellipse(ctx, 0, 0, r, r * 1.18, colour, '#7a2e12', 2);
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.abs(i) * r * 0.32, r * 1.18, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(122,46,18,0.45)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  rect(ctx, -r * 0.32, -r * 1.18 - 6, r * 0.64, 7, '#7a2e12');
  line(ctx, 0, r * 1.18, 0, r * 1.18 + 16, '#ffd166', 3);
  ctx.restore();
}

// A small sitting cat, drawn from circles and triangles.
export function cat(ctx, x, y, s, colour, tailUp) {
  ctx.fillStyle = colour;
  ellipse(ctx, x, y, 22 * s, 18 * s, colour);
  circle(ctx, x + 2 * s, y - 22 * s, 13 * s, colour);
  poly(ctx, [[x - 8 * s, y - 30 * s], [x - 11 * s, y - 44 * s], [x - 1 * s, y - 34 * s]], colour);
  poly(ctx, [[x + 10 * s, y - 32 * s], [x + 15 * s, y - 45 * s], [x + 18 * s, y - 30 * s]], colour);
  circle(ctx, x - 2 * s, y - 24 * s, 1.8 * s, '#14101f');
  circle(ctx, x + 7 * s, y - 24 * s, 1.8 * s, '#14101f');
  ctx.beginPath();
  if (tailUp) {
    ctx.moveTo(x + 20 * s, y + 6 * s);
    ctx.quadraticCurveTo(x + 38 * s, y - 2 * s, x + 34 * s, y - 22 * s);
  } else {
    ctx.moveTo(x + 20 * s, y + 6 * s);
    ctx.quadraticCurveTo(x + 36 * s, y + 14 * s, x + 30 * s, y + 22 * s);
  }
  ctx.strokeStyle = colour;
  ctx.lineWidth = 5 * s;
  ctx.stroke();
}
