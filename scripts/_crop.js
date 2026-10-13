import sharp from "sharp";
import { mkdirSync } from "fs";

const dir = "scripts/_shots";
mkdirSync(dir, { recursive: true });

async function info(name) {
  const img = sharp(`${dir}/${name}`);
  const m = await img.metadata();
  console.log(name, m.width, m.height);
}

await info("home-desktop.png");
await info("home-mobile.png");
await info("kultur.png");

async function crop(src, out, top, height) {
  const meta = await sharp(`${dir}/${src}`).metadata();
  const h = Math.min(height, meta.height - top);
  await sharp(`${dir}/${src}`)
    .extract({ left: 0, top, width: meta.width, height: h })
    .jpeg({ quality: 70 })
    .toFile(`${dir}/${out}`);
  console.log("wrote", out, meta.width, h);
}

await crop("home-desktop.png", "d-header.jpg", 0, 700);
await crop("home-desktop.png", "d-mid.jpg", 900, 800);
await crop("home-desktop.png", "d-low.jpg", 1700, 900);
await crop("home-mobile.png", "m-top.jpg", 0, 900);
await crop("kultur.png", "k-top.jpg", 0, 900);
await crop("kultur.png", "k-mid.jpg", 800, 1000);
