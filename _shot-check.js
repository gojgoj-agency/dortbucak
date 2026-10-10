const sharp = require("sharp");

function hex(r, g, b) {
  return (
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0")
  );
}

async function grid(file, width, height, top = 0, cropH, left = 0, cropW) {
  const meta = await sharp(file).metadata();
  const extract = {
    left,
    top,
    width: Math.min(cropW || meta.width - left, meta.width - left),
    height: Math.min(cropH || meta.height - top, meta.height - top),
  };
  const { data, info } = await sharp(file)
    .extract(extract)
    .resize(width, height, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  console.log("\n==", file, meta.width + "x" + meta.height, "crop", JSON.stringify(extract));
  for (let y = 0; y < info.height; y++) {
    let row = "";
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      let c = ".";
      if (b > r + 25 && b > 80) c = "B";
      else if (r > 160 && r > g + 40 && r > b + 20) c = "R";
      else if (r > 200 && g > 180 && b > 150 && r > b) c = "g";
      else if (r < 40 && g < 50 && b < 80) c = "#";
      else if (r < 80 && g < 90 && b < 120) c = "N";
      else if (r > 230 && g > 220 && b > 200) c = " ";
      else c = "+";
      row += c;
    }
    console.log(row);
  }
}

(async () => {
  await grid("_shot-home.png", 72, 14, 680, 320);
  await grid("_shot-mobile.png", 32, 16, 480, 420);
})();
