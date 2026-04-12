export const SEGMENT_COLORS = [
  '#FF4757', // red
  '#FFA502', // orange
  '#FFDD59', // yellow
  '#2ED573', // green
  '#1E90FF', // blue
  '#A29BFE', // lavender
  '#FF6B9D', // pink
  '#00CEC9', // teal
  '#FDCB6E', // gold
  '#E17055', // coral
  '#6C5CE7', // purple
  '#00B894', // emerald
];

export const TEXT_COLOR = '#FFFFFF';
export const BORDER_COLOR = '#FFFFFF';

export function getSegmentColor(index) {
  return SEGMENT_COLORS[index % SEGMENT_COLORS.length];
}
