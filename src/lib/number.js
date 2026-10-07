/**
 * Làm tròn x tới d chữ số thập phân, tránh sai số dấu phẩy động
 * (vd 8.45 * 10 = 84.49999999999999 trong JS).
 */
export function roundTo(x, d) {
  const factor = 10 ** d;
  return Math.round(Number((x * factor).toPrecision(12))) / factor;
}
