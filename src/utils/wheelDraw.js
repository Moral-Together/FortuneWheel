import { getSegmentColor, TEXT_COLOR } from './colors';

export function drawWheel(
  canvas,
  participants,
  rotation,
  emptyText = 'Add participants',
  glowSegment = -1,
  glowIntensity = 0
) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(cx, cy) - 6;

  ctx.clearRect(0, 0, width, height);

  if (!participants || participants.length === 0) {
    drawEmptyWheel(ctx, cx, cy, radius, emptyText);
    return;
  }

  const count = participants.length;
  const arc = (2 * Math.PI) / count;

  participants.forEach((name, i) => {
    const startAngle = rotation + i * arc;
    const endAngle = startAngle + arc;
    const color = getSegmentColor(i);

    // Segment fill
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // Sheen highlight on each segment
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.closePath();
    const midAngle = startAngle + arc / 2;
    const sheenGrad = ctx.createRadialGradient(
      cx + Math.cos(midAngle) * radius * 0.3,
      cy + Math.sin(midAngle) * radius * 0.3,
      0,
      cx, cy,
      radius
    );
    sheenGrad.addColorStop(0, 'rgba(255,255,255,0.28)');
    sheenGrad.addColorStop(0.5, 'rgba(255,255,255,0.06)');
    sheenGrad.addColorStop(1, 'rgba(0,0,0,0.18)');
    ctx.fillStyle = sheenGrad;
    ctx.fill();
    ctx.restore();

    // Segment border
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Text
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle + arc / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = TEXT_COLOR;

    const fontSize = Math.max(11, Math.min(22, radius * 0.13));
    ctx.font = `bold ${fontSize}px 'Fredoka One', cursive`;
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    const maxWidth = radius * 0.7;
    const textX = radius - 16;

    let displayName = name;
    while (ctx.measureText(displayName).width > maxWidth && displayName.length > 1) {
      displayName = displayName.slice(0, -1);
    }
    if (displayName !== name) displayName += '…';

    ctx.fillText(displayName, textX, fontSize / 3);
    ctx.restore();
  });

  // Winner segment glow overlay
  if (glowSegment >= 0 && glowIntensity > 0 && glowSegment < count) {
    const gStart = rotation + glowSegment * arc;
    const gEnd = gStart + arc;

    // White flash layer
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, gStart, gEnd);
    ctx.closePath();
    ctx.fillStyle = `rgba(255,255,255,${glowIntensity * 0.42})`;
    ctx.fill();

    // Golden border on winner segment
    ctx.save();
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 28 * glowIntensity;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, gStart, gEnd);
    ctx.closePath();
    ctx.strokeStyle = `rgba(255,220,0,${glowIntensity})`;
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.restore();

    // Radial ray from center toward winner midpoint
    const midAngle = gStart + arc / 2;
    const rayGrad = ctx.createLinearGradient(cx, cy,
      cx + Math.cos(midAngle) * radius,
      cy + Math.sin(midAngle) * radius
    );
    rayGrad.addColorStop(0, `rgba(255,215,0,${glowIntensity * 0.5})`);
    rayGrad.addColorStop(1, 'rgba(255,215,0,0)');
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, gStart, gEnd);
    ctx.closePath();
    ctx.fillStyle = rayGrad;
    ctx.fill();
  }

  // Outer rim glow ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Center circle
  const gradient = ctx.createRadialGradient(cx - 8, cy - 8, 0, cx, cy, 38);
  gradient.addColorStop(0, '#FFFFFF');
  gradient.addColorStop(0.3, '#FFD700');
  gradient.addColorStop(1, '#FF6600');
  ctx.beginPath();
  ctx.arc(cx, cy, 36, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Center star
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 4;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', cx, cy);
  ctx.shadowBlur = 0;
  ctx.textBaseline = 'alphabetic';
}

function drawEmptyWheel(ctx, cx, cy, radius, emptyText) {
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  gradient.addColorStop(0, '#3a3a8a');
  gradient.addColorStop(1, '#1a1a4a');
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '600 17px "Nunito", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emptyText, cx, cy);
  ctx.textBaseline = 'alphabetic';
}
