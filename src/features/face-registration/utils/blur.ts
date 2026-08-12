export function estimateBlur(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const { data } = ctx.getImageData(0, 0, width, height);

  const gray = new Uint8Array(width * height);

  // RGB -> Gray
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    gray[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }

  const laplace: number[] = [];

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;

      const value =
        gray[i - width] +
        gray[i - 1] +
        gray[i + 1] +
        gray[i + width] -
        4 * gray[i];

      laplace.push(value);
    }
  }

  let mean = 0;

  for (const v of laplace) {
    mean += v;
  }

  mean /= laplace.length;

  let variance = 0;

  for (const v of laplace) {
    variance += (v - mean) * (v - mean);
  }

  variance /= laplace.length;

  return variance;
}
