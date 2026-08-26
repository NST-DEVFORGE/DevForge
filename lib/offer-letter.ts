import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import {
    PDFDocument,
    StandardFonts,
    rgb,
    degrees,
    type PDFFont,
    type PDFPage,
    type PDFImage,
    type RGB,
} from "pdf-lib";

/**
 * Generates the club's official membership offer letter as a one-page A4 PDF,
 * laid out like a company letterhead: an address block top-left, the DevForge
 * logo top-right, a sans-serif body, and a legal footer.
 *
 * Pure pdf-lib (plus sharp to recolour the logo) — no headless Chrome — so it
 * runs in a normal Node serverless function on Vercel. The logo is read from
 * public/logo.png (see next.config's outputFileTracingIncludes, which keeps it
 * in the function bundle); everything degrades gracefully if it can't be read,
 * so the letter always renders.
 */

export interface OfferLetterInput {
    /** Recipient's full name, as it should read on the letter. */
    name: string;
    /** Membership role granted, e.g. "Member", "Core Member". */
    role?: string;
    /** Academic term, e.g. "2025–26". Defaults from the issue date. */
    term?: string;
    /** Issue date. Defaults to now. */
    date?: Date;
    /** Reference number. Auto-derived when omitted. */
    refNo?: string;
    /** Name that signs the letter. */
    signatoryName?: string;
    /** Signatory's title, e.g. "President, DevForge Executive Council". */
    signatoryTitle?: string;
    /** Optional extra paragraph before the closing. Plain text. */
    note?: string;
}

// A4 in PDF points.
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 64;
const CONTENT_W = PAGE_W - MARGIN * 2;

const INK = rgb(0.1, 0.11, 0.13);
const MUTED = rgb(0.42, 0.45, 0.5);
const FAINT = rgb(0.6, 0.63, 0.68);
const CYAN = rgb(0.024, 0.714, 0.831);
const HAIRLINE = rgb(0.82, 0.84, 0.87);
/** A single, slightly deeper ink so the seal reads like a real rubber stamp. */
const STAMP = rgb(0.13, 0.15, 0.19);

interface Fonts {
    sans: PDFFont;
    bold: PDFFont;
    italic: PDFFont;
}

/** Academic term string from a date: June onward starts the new one. */
function termFor(date: Date): string {
    const y = date.getFullYear();
    const start = date.getMonth() >= 5 ? y : y - 1;
    return `${start}-${String(start + 1).slice(-2)}`;
}

/** Short, stable-ish reference number derived from the name and issue date. */
function refFor(name: string, date: Date): string {
    let h = 0;
    const seed = `${name}|${date.toDateString()}`;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffff;
    return `DF/${date.getFullYear()}/${String(h % 10000).padStart(4, "0")}`;
}

/** "26th August 2026" — with an ordinal, like a formal letter. */
function formatDate(date: Date): string {
    const d = date.getDate();
    const suffix = d % 10 === 1 && d !== 11 ? "st" : d % 10 === 2 && d !== 12 ? "nd" : d % 10 === 3 && d !== 13 ? "rd" : "th";
    const month = date.toLocaleDateString("en-GB", { month: "long" });
    return `${d}${suffix} ${month} ${date.getFullYear()}`;
}

/** Greedy word-wrap into lines no wider than maxWidth at the given size. */
function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
    const lines: string[] = [];
    for (const paragraph of text.split("\n")) {
        const words = paragraph.split(/\s+/).filter(Boolean);
        let line = "";
        for (const word of words) {
            const candidate = line ? `${line} ${word}` : word;
            if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
                lines.push(line);
                line = word;
            } else {
                line = candidate;
            }
        }
        lines.push(line);
    }
    return lines;
}

function tryLoadLogo(): Uint8Array | null {
    try {
        return readFileSync(join(process.cwd(), "public", "logo.png"));
    } catch {
        return null;
    }
}

/**
 * The logo recoloured to a solid-black silhouette (its own alpha preserved),
 * for the monochrome stamp. Computed once and memoised; falls back to null so
 * the caller can use the colour logo instead.
 */
let blackLogoCache: Uint8Array | null | undefined;
async function getBlackLogo(): Promise<Uint8Array | null> {
    if (blackLogoCache !== undefined) return blackLogoCache;
    try {
        const src = tryLoadLogo();
        if (!src) throw new Error("no logo");
        const base = sharp(src).ensureAlpha();
        const { width, height } = await base.metadata();
        if (!width || !height) throw new Error("no dimensions");
        const alpha = await base.clone().extractChannel(3).raw().toBuffer();
        const black = await sharp({ create: { width, height, channels: 3, background: { r: 0, g: 0, b: 0 } } })
            .joinChannel(alpha, { raw: { width, height, channels: 1 } })
            .png()
            .toBuffer();
        blackLogoCache = new Uint8Array(black);
    } catch {
        blackLogoCache = null;
    }
    return blackLogoCache;
}

/** Letterhead: address block left, colour logo + wordmark right, rule under. */
function drawHeader(page: PDFPage, fonts: Fonts, logo: PDFImage | null): number {
    const top = PAGE_H - MARGIN;

    // Left: address / identity block.
    const address: { t: string; f: PDFFont; s: number; c: RGB }[] = [
        { t: "DevForge", f: fonts.bold, s: 11, c: INK },
        { t: "Developer Community", f: fonts.sans, s: 8.5, c: MUTED },
        { t: "Newton School of Technology, SVYASA, Bengaluru", f: fonts.sans, s: 8.5, c: MUTED },
        { t: "www.devforge.club", f: fonts.bold, s: 8.5, c: INK },
    ];
    let ly = top - 9;
    for (const line of address) {
        page.drawText(line.t, { x: MARGIN, y: ly, size: line.s, font: line.f, color: line.c });
        ly -= line.s + 4;
    }

    // Right: colour logo + wordmark, right-aligned to the margin and vertically
    // centred against the address block so the two sides sit level.
    const mark = 44;
    const word = "DEVFORGE";
    const wsize = 20;
    const gap = 11;
    const ww = fonts.bold.widthOfTextAtSize(word, wsize);
    const startX = PAGE_W - MARGIN - (mark + gap + ww);
    const rowCy = top - 26;
    if (logo) {
        page.drawImage(logo, { x: startX, y: rowCy - mark / 2, width: mark, height: mark });
    } else {
        page.drawRectangle({ x: startX, y: rowCy - mark / 2, width: mark, height: mark, color: CYAN });
    }
    const wordBaseline = rowCy - wsize * 0.34;
    page.drawText(word, {
        x: startX + mark + gap,
        y: wordBaseline,
        size: wsize,
        font: fonts.bold,
        color: INK,
    });

    // Tagline under the wordmark, so the right side doesn't read empty. Sized to
    // fit the wordmark's width and right-aligned to the margin beneath it.
    const tagline = "We don't just learn to code. We ship.";
    let tsize = 7;
    while (fonts.sans.widthOfTextAtSize(tagline, tsize) > ww && tsize > 5) tsize -= 0.25;
    page.drawText(tagline, {
        x: PAGE_W - MARGIN - fonts.sans.widthOfTextAtSize(tagline, tsize),
        y: wordBaseline - 11,
        size: tsize,
        font: fonts.sans,
        color: MUTED,
    });

    const ruleY = top - 62;
    page.drawRectangle({ x: MARGIN, y: ruleY, width: CONTENT_W, height: 1.4, color: INK });
    return ruleY - 26;
}

/** Draws a word curved along a circle; `bottom` reads upright along the lower arc. */
function drawCircularText(
    page: PDFPage,
    text: string,
    cx: number,
    cy: number,
    radius: number,
    font: PDFFont,
    size: number,
    color: RGB,
    { bottom = false, tiltDeg = 0 }: { bottom?: boolean; tiltDeg?: number } = {},
) {
    const chars = [...text];
    const spacing = 1.2;
    const arcWidths = chars.map((c) => (font.widthOfTextAtSize(c, size) + spacing) / radius);
    const totalArc = arcWidths.reduce((a, b) => a + b, 0);
    const dir = bottom ? 1 : -1;
    const center = ((bottom ? -90 : 90) + tiltDeg) * (Math.PI / 180);
    let angle = center - (dir * totalArc) / 2;

    chars.forEach((ch, i) => {
        const mid = angle + (dir * arcWidths[i]) / 2;
        const rotDeg = (mid * 180) / Math.PI + (bottom ? 90 : -90);
        const rad = (rotDeg * Math.PI) / 180;
        const w = font.widthOfTextAtSize(ch, size);
        const cap = size * 0.34;
        const ox = -(w / 2) * Math.cos(rad) + (cap / 2) * Math.sin(rad);
        const oy = -(w / 2) * Math.sin(rad) - (cap / 2) * Math.cos(rad);
        page.drawText(ch, {
            x: cx + radius * Math.cos(mid) + ox,
            y: cy + radius * Math.sin(mid) + oy,
            size,
            font,
            color,
            rotate: degrees(rotDeg),
        });
        angle += dir * arcWidths[i];
    });
}

/**
 * A round rubber-stamp seal: double ring, curved wording, and the monochrome
 * logo in the centre. Given a small tilt so it reads as hand-stamped, not
 * machine-perfect.
 */
function drawSeal(page: PDFPage, cx: number, cy: number, fonts: Fonts, logo: PDFImage | null) {
    const tiltDeg = -7;
    page.drawCircle({ x: cx, y: cy, size: 42, borderColor: STAMP, borderWidth: 1.7 });
    page.drawCircle({ x: cx, y: cy, size: 33, borderColor: STAMP, borderWidth: 0.7 });

    drawCircularText(page, "DEVFORGE • EXECUTIVE COUNCIL", cx, cy, 37.5, fonts.bold, 5, STAMP, { tiltDeg });
    drawCircularText(page, "NST × SVYASA • EST. 2025", cx, cy, 37.5, fonts.sans, 5, STAMP, { bottom: true, tiltDeg });

    if (logo) {
        const L = 34;
        const t = (tiltDeg * Math.PI) / 180;
        // Rotate the logo about its own centre so it tilts with the stamp.
        const originX = cx - (L / 2) * (Math.cos(t) - Math.sin(t));
        const originY = cy - (L / 2) * (Math.sin(t) + Math.cos(t));
        page.drawImage(logo, { x: originX, y: originY, width: L, height: L, rotate: degrees(tiltDeg) });
    } else {
        page.drawText("DF", {
            x: cx - fonts.bold.widthOfTextAtSize("DF", 16) / 2,
            y: cy - 6,
            size: 16,
            font: fonts.bold,
            color: STAMP,
        });
    }
}

export async function generateOfferLetterPdf(input: OfferLetterInput): Promise<Uint8Array> {
    const name = input.name.trim();
    if (!name) throw new Error("A recipient name is required.");

    const date = input.date ?? new Date();
    const role = (input.role ?? "Member").trim() || "Member";
    const term = (input.term ?? termFor(date)).trim();
    const refNo = (input.refNo ?? refFor(name, date)).trim();
    const signatoryName = (input.signatoryName ?? "").trim();
    const signatoryTitle = (input.signatoryTitle ?? "DevForge Executive Council").trim();

    const doc = await PDFDocument.create();
    doc.setTitle(`DevForge Offer of Membership - ${name}`);
    doc.setAuthor("DevForge");
    doc.setSubject("Offer of Club Membership");

    const fonts: Fonts = {
        sans: await doc.embedFont(StandardFonts.Helvetica),
        bold: await doc.embedFont(StandardFonts.HelveticaBold),
        italic: await doc.embedFont(StandardFonts.HelveticaOblique),
    };

    const colorBytes = tryLoadLogo();
    const colorLogo = colorBytes ? await doc.embedPng(colorBytes) : null;
    const blackBytes = await getBlackLogo();
    const blackLogo = blackBytes ? await doc.embedPng(blackBytes) : colorLogo;

    const page = doc.addPage([PAGE_W, PAGE_H]);
    let y = drawHeader(page, fonts, colorLogo);

    // Ref (left) + place & date (right).
    page.drawText(`Ref: ${refNo}`, { x: MARGIN, y, size: 9, font: fonts.sans, color: MUTED });
    const dateLine = `Bengaluru, ${formatDate(date)}`;
    page.drawText(dateLine, {
        x: PAGE_W - MARGIN - fonts.sans.widthOfTextAtSize(dateLine, 9.5),
        y,
        size: 9.5,
        font: fonts.sans,
        color: INK,
    });
    y -= 34;

    // Title.
    page.drawText("Offer of Club Membership", { x: MARGIN, y, size: 16, font: fonts.bold, color: INK });
    y -= 28;

    // Salutation.
    page.drawText(`Dear ${name},`, { x: MARGIN, y, size: 11, font: fonts.sans, color: INK });
    y -= 22;

    const bodySize = 10.5;
    const leading = 15.5;
    const drawParagraph = (text: string, gap = 10) => {
        for (const line of wrapText(text, fonts.sans, bodySize, CONTENT_W)) {
            page.drawText(line, { x: MARGIN, y, size: bodySize, font: fonts.sans, color: INK });
            y -= leading;
        }
        y -= gap;
    };

    drawParagraph(
        `Congratulations! Following your application and interview, it is our great pleasure to offer you membership of DevForge, the developer community at Newton School of Technology, SVYASA, Bengaluru.`,
    );
    drawParagraph(
        `This letter confirms your selection as a ${role} of DevForge for the ${term} term. You are joining a community that doesn't just learn to code. It ships real projects, open-source contributions, hackathons, and sessions run by members, for members.`,
    );
    drawParagraph(
        `As a member, we ask for your commitment to participate actively, support your peers, and uphold the club's culture of curiosity and craft. In return, you gain access to the member portal, club projects and events, mentorship, and everything the community builds together.`,
    );
    if (input.note) drawParagraph(input.note);
    drawParagraph(`We're excited to see what you build with us. Welcome to DevForge.`, 20);

    // Closing + signature block (left) with the seal (right).
    page.drawText("Warm regards,", { x: MARGIN, y, size: bodySize, font: fonts.sans, color: INK });
    const sealCx = PAGE_W - MARGIN - 48;
    const sealCy = y - 26;
    drawSeal(page, sealCx, sealCy, fonts, blackLogo);

    y -= 46;
    if (signatoryName) {
        page.drawText(signatoryName, { x: MARGIN, y, size: 12, font: fonts.italic, color: INK });
    }
    y -= 15;
    page.drawText(signatoryTitle, { x: MARGIN, y, size: 9.5, font: fonts.sans, color: MUTED });
    y -= 12;
    page.drawText("On behalf of the DevForge Executive Council", {
        x: MARGIN,
        y,
        size: 9.5,
        font: fonts.sans,
        color: MUTED,
    });

    // Footer: thin rule + centred legal print, like a company letterhead.
    const footerY = MARGIN - 24;
    page.drawRectangle({ x: MARGIN, y: footerY + 26, width: CONTENT_W, height: 0.8, color: HAIRLINE });
    const footerLines = [
        "DevForge · A student developer community at Newton School of Technology, SVYASA, Bengaluru",
        "www.devforge.club · Established 2025",
        "This letter is issued electronically by DevForge and is valid without a physical signature.",
    ];
    let fy = footerY + 14;
    for (const line of footerLines) {
        page.drawText(line, {
            x: PAGE_W / 2 - fonts.sans.widthOfTextAtSize(line, 7.5) / 2,
            y: fy,
            size: 7.5,
            font: fonts.sans,
            color: FAINT,
        });
        fy -= 10;
    }

    return doc.save();
}

/** Safe ASCII filename for the attachment/download. */
export function offerLetterFilename(name: string): string {
    const slug = name.trim().replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "member";
    return `DevForge-Offer-Letter-${slug}.pdf`;
}
