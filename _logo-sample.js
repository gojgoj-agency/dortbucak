const sharp = require("sharp");

(async () => {
  const { data, info } = await sharp("public/images/logo.webp")
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r < 248 || g < 248 || b < 248) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  console.log({ width, height, minX, minY, maxX, maxY, boxW: maxX - minX + 1, boxH: maxY - minY + 1 });

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  const { data: d2, info: i2 } = await sharp("public/images/logo.webp")
    .extract({ left: minX, top: minY, width: cropW, height: cropH })
    .resize(40, Math.max(8, Math.round((40 * cropH) / cropW)))
    .raw()
    .toBuffer({ resolveWithObject: true });

  const chars = " .:-=+*#%@";
  for (let y = 0; y < i2.height; y++) {
    let row = "";
    for (let x = 0; x < i2.width; x++) {
      const i = (y * i2.width + x) * i2.channels;
      const r = d2[i], g = d2[i + 1], b = d2[i + 2];
      const lum = (r + g + b) / 3;
      // tint: B if blue-ish, R if red-ish
      let mark = chars[Math.min(9, Math.floor((255 - lum) / 26))];
      if (b > r + 20 && b > g) mark = "B";
      else if (r > g + 30 && r > b + 20) mark = "R";
      row += mark;
    }
    console.log(row);
  }
})();
