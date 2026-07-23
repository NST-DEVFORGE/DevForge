/**
 * Generates PWA icons from public/logo.png.
 *
 *   npx tsx scripts/generate-pwa-icons.ts
 *
 * Two families are produced:
 *  - `any`: the logo on a transparent ground, used as a normal app icon.
 *  - `maskable`: the logo inset to ~60% on an opaque ground, so platforms that
 *    crop to a circle or squircle never clip it. A transparent maskable icon
 *    renders as a black blob on Android, which is why these are separate.
 */
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SOURCE = "public/logo.png";
const OUT = "public/icons";

// Matches --bg-primary in app/globals.css, so the icon sits on the site's ground.
const GROUND = { r: 1, g: 1, b: 7, alpha: 1 };

const SIZES = [64, 96, 128, 192, 256, 384, 512];
const MASKABLE_SIZES = [192, 512];
const APPLE_TOUCH = 180;

async function main() {
    await mkdir(OUT, { recursive: true });
    const written: string[] = [];

    for (const size of SIZES) {
        const file = `${OUT}/icon-${size}.png`;
        await sharp(SOURCE).resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(file);
        written.push(file);
    }

    for (const size of MASKABLE_SIZES) {
        const inner = Math.round(size * 0.6);
        const pad = Math.round((size - inner) / 2);
        const logo = await sharp(SOURCE).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
        const file = `${OUT}/maskable-${size}.png`;
        await sharp({ create: { width: size, height: size, channels: 4, background: GROUND } })
            .composite([{ input: logo, top: pad, left: pad }])
            .png()
            .toFile(file);
        written.push(file);
    }

    // iOS ignores the manifest icons and has no maskable concept: it needs one
    // opaque square, or it composites the transparency onto black.
    const appleInner = Math.round(APPLE_TOUCH * 0.72);
    const applePad = Math.round((APPLE_TOUCH - appleInner) / 2);
    const appleLogo = await sharp(SOURCE).resize(appleInner, appleInner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
    await sharp({ create: { width: APPLE_TOUCH, height: APPLE_TOUCH, channels: 4, background: GROUND } })
        .composite([{ input: appleLogo, top: applePad, left: applePad }])
        .png()
        .toFile("public/apple-touch-icon.png");
    written.push("public/apple-touch-icon.png");

    await sharp(SOURCE).resize(32, 32).png().toFile("public/favicon-32x32.png");
    written.push("public/favicon-32x32.png");

    await writeFile(`${OUT}/.gitkeep`, "");
    console.log(`generated ${written.length} icons:`);
    for (const file of written) console.log(`  ${file}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
