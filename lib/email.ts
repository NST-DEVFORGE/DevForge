import nodemailer from "nodemailer";

/**
 * Email clients don't support CSS variables, so templates can't use the site's
 * theme engine, they lock to the default Aurora palette, matching the
 * orientation invite in app/api/orientation-rsvp.
 */
const BRAND = {
    accent: "#06b6d4",
    accentBright: "#22d3ee",
    accent2: "#8b5cf6",
    ground: "#05070d",
    card: "#070a14",
    text: "#f8fafc",
    muted: "#94a3b8",
};

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
    if (transporter) return transporter;

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
    const missing = [
        !SMTP_HOST && "SMTP_HOST",
        !SMTP_PORT && "SMTP_PORT",
        !SMTP_USER && "SMTP_USER",
        !SMTP_PASS && "SMTP_PASS",
    ].filter(Boolean);
    if (missing.length) throw new Error(`SMTP is not configured: missing ${missing.join(", ")}`);

    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: SMTP_SECURE === "true" || Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    return transporter;
}

function shell(inner: string) {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:${BRAND.ground};font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${BRAND.text};">
<div style="width:100%;background-color:${BRAND.ground};background-image:radial-gradient(circle at 50% 0%,rgba(6,182,212,.15),transparent 50%);padding:50px 0;">
<div style="max-width:600px;margin:0 auto;background-color:${BRAND.card};border:1px solid rgba(255,255,255,.08);border-radius:24px;overflow:hidden;">
<div style="height:4px;background:linear-gradient(90deg,${BRAND.accent} 0%,${BRAND.accent2} 50%,${BRAND.accent} 100%);"></div>
<div style="padding:40px 20px 24px;text-align:center;">
<div style="font-size:32px;font-weight:900;letter-spacing:-.05em;color:#fff;">DEV<span style="color:${BRAND.accent};">FORGE</span></div>
<div style="font-size:11px;color:${BRAND.muted};margin-top:8px;text-transform:uppercase;letter-spacing:.25em;font-weight:700;">Newton School of Technology</div>
</div>
<div style="padding:0 35px 40px;">${inner}</div>
</div></div></body></html>`;
}

export interface CredentialsEmail {
    to: string;
    name: string;
    username: string;
    password: string;
    loginUrl?: string;
}

export function renderCredentialsEmail({
    name,
    username,
    password,
    loginUrl = "https://www.devforge.club/login",
}: CredentialsEmail) {
    const row = (label: string, value: string) =>
        `<tr><td style="padding:10px 0;color:${BRAND.muted};font-size:13px;width:110px;">${label}</td>
         <td style="padding:10px 0;font-family:ui-monospace,'SF Mono',Menlo,monospace;font-size:15px;color:#fff;font-weight:700;letter-spacing:.02em;">${value}</td></tr>`;

    return shell(`
<p style="font-size:18px;font-weight:700;color:#fff;margin:0 0 16px;">Hey ${name}! 👋</p>
<p style="font-size:15px;line-height:1.6;color:${BRAND.muted};margin:0 0 24px;">
Your <strong style="color:${BRAND.text};">DevForge</strong> member account is ready. You can now sign in to upload projects, RSVP to sessions, and track your contributions.</p>

<div style="background:rgba(6,182,212,.06);border:1px solid rgba(6,182,212,.25);border-radius:16px;padding:8px 20px;margin-bottom:24px;">
<table style="width:100%;border-collapse:collapse;">${row("Username", username)}${row("Password", password)}</table>
</div>

<div style="background:rgba(251,191,36,.08);border-left:3px solid #fbbf24;border-radius:8px;padding:14px 16px;margin-bottom:28px;">
<p style="margin:0;font-size:13px;line-height:1.6;color:#fcd34d;">
<strong>Change this password when you first sign in.</strong> You'll be prompted automatically. Don't reuse it anywhere else, and don't forward this email.</p>
</div>

<div style="text-align:center;">
<a href="${loginUrl}" style="display:inline-block;background:${BRAND.accentBright};color:#04121a;font-weight:800;font-size:15px;text-decoration:none;padding:14px 32px;border-radius:999px;">Sign in to DevForge</a>
</div>

<p style="font-size:12px;color:${BRAND.muted};margin:28px 0 0;text-align:center;line-height:1.6;">
Didn't expect this? Reply to this email and we'll sort it out.</p>`);
}

export async function sendCredentialsEmail(payload: CredentialsEmail) {
    const info = await getTransporter().sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: payload.to,
        subject: "Your DevForge member account",
        html: renderCredentialsEmail(payload),
        text:
            `Hey ${payload.name}!\n\nYour DevForge member account is ready.\n\n` +
            `Username: ${payload.username}\nPassword: ${payload.password}\n\n` +
            `Change this password when you first sign in: ${payload.loginUrl ?? "https://www.devforge.club/login"}\n`,
    });
    return { messageId: info.messageId };
}

export interface OfferLetterEmail {
    to: string;
    name: string;
    /** The rendered offer-letter PDF. */
    pdf: Uint8Array;
    /** Attachment filename, e.g. DevForge-Offer-Letter-Aditi-Sharma.pdf. */
    filename: string;
}

/**
 * A deliberately classic, formal notice — a white page with a typographic
 * letterhead and serif body — rather than the dark marketing shell the other
 * emails use. It should read like an official letter, matching the attached PDF.
 */
export function renderOfferLetterEmail({ name }: { name: string }) {
    const first = name.trim().split(/\s+/)[0] || name;
    const serif = "Georgia, 'Times New Roman', Times, serif";
    const sans = "Arial, Helvetica, sans-serif";
    const p = `font-size:15px;line-height:1.7;color:#26282c;margin:0 0 18px;`;
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f2f2f4;font-family:${serif};color:#26282c;">
<div style="max-width:600px;margin:0 auto;padding:32px 16px;">
<div style="background-color:#ffffff;border:1px solid #e2e2e6;padding:44px 46px;">

<div style="text-align:center;padding-bottom:18px;border-bottom:2px solid #1a1c20;margin-bottom:30px;">
<div style="font-family:${sans};font-size:25px;font-weight:bold;letter-spacing:1px;color:#1a1c20;">DEVFORGE</div>
<div style="font-family:${sans};font-size:10px;letter-spacing:1.5px;color:#71717a;text-transform:uppercase;margin-top:6px;">Newton School of Technology, SVYASA, Bengaluru</div>
</div>

<p style="${p}">Dear ${first},</p>
<p style="${p}">We are pleased to inform you that, following your application and interview, you have been selected for membership of <strong>DevForge</strong>, the developer community at Newton School of Technology, SVYASA, Bengaluru.</p>
<p style="${p}">Your official offer letter is enclosed with this email as a PDF. You are welcome to keep it and to share it, including on LinkedIn.</p>
<p style="${p}">Details regarding your member account and next steps will follow separately. We look forward to welcoming you to the community.</p>

<p style="font-size:15px;line-height:1.7;color:#26282c;margin:30px 0 4px;">Warm regards,</p>
<p style="font-size:15px;line-height:1.5;color:#1a1c20;margin:0;font-weight:bold;">The DevForge Executive Council</p>

</div>
<div style="text-align:center;font-family:${sans};font-size:11px;color:#9b9ba3;margin-top:22px;line-height:1.7;">
DevForge · www.devforge.club<br>Newton School of Technology, SVYASA, Bengaluru
</div>
</div>
</body></html>`;
}

export async function sendOfferLetterEmail(payload: OfferLetterEmail) {
    const first = payload.name.trim().split(/\s+/)[0] || payload.name;
    const info = await getTransporter().sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: payload.to,
        subject: "Your DevForge membership offer",
        html: renderOfferLetterEmail({ name: payload.name }),
        text:
            `Dear ${first},\n\n` +
            `We are pleased to inform you that, following your application and interview, you have ` +
            `been selected for membership of DevForge, the developer community at Newton School of ` +
            `Technology, SVYASA, Bengaluru.\n\n` +
            `Your official offer letter is enclosed with this email as a PDF. You are welcome to keep ` +
            `it and to share it, including on LinkedIn.\n\n` +
            `Details regarding your member account and next steps will follow separately. We look ` +
            `forward to welcoming you to the community.\n\n` +
            `Warm regards,\nThe DevForge Executive Council\n`,
        attachments: [
            {
                filename: payload.filename,
                content: Buffer.from(payload.pdf),
                contentType: "application/pdf",
            },
        ],
    });
    return { messageId: info.messageId };
}
