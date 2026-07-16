import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const calendarLink = "https://calendar.google.com/calendar/render?action=TEMPLATE&tmeid=M3V1bGp1dGZybXByOWtpanI4OGlzdXE5anIgZ295YWxnZWV0YW5zaEBt&tmsrc=goyalgeetansh%40gmail.com";

// HTML template generator matching the website theme
function generateEmailHtml(name: string) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>DevForge Orientation Session</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #05070d; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
          
          <!-- Outer Atmospheric Glow Wrapper -->
          <div style="width: 100%; background-color: #05070d; background-image: radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.15), transparent 50%), radial-gradient(circle at 50% 100%, rgba(139, 92, 246, 0.08), transparent 50%); padding: 50px 0;">
            
            <!-- Glassmorphic Container -->
            <div style="max-width: 600px; margin: 0 auto; background-color: #070a14; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);">
              
              <!-- Shimmering Gradient Top Border -->
              <div style="height: 4px; background: linear-gradient(90deg, #06b6d4 0%, #8b5cf6 50%, #06b6d4 100%);"></div>
              
              <!-- Premium Cyber-Tech Header -->
              <div style="padding: 40px 20px 30px 20px; text-align: center; background: radial-gradient(ellipse at 50% 0%, rgba(6, 182, 212, 0.1), transparent 70%);">
                <div style="font-size: 32px; font-weight: 900; color: #ffffff; margin: 0; letter-spacing: -0.05em; text-shadow: 0 0 15px rgba(6, 182, 212, 0.3);">
                  DEV<span style="color: #06b6d4;">FORGE</span>
                </div>
                <div style="font-size: 11px; color: #94a3b8; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 0.25em; font-weight: 700;">
                  Newton School of Technology • Bengaluru
                </div>
                
                <!-- Glowing Orientation Badge -->
                <div style="display: inline-block; margin-top: 25px; padding: 6px 16px; background-color: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 999px;">
                  <span style="font-size: 12px; font-weight: 800; color: #22d3ee; letter-spacing: 0.1em; text-transform: uppercase; text-shadow: 0 0 8px rgba(34, 211, 238, 0.4);">
                    ✨ Orientation Invite
                  </span>
                </div>
              </div>
              
              <!-- Content Body -->
              <div style="padding: 10px 35px 40px 35px;">
                <p style="font-size: 18px; font-weight: 700; color: #ffffff; margin-top: 0; margin-bottom: 16px; letter-spacing: -0.02em;">Hey ${name}! 👋</p>
                
                <p style="font-size: 15px; line-height: 1.6; color: #94a3b8; margin-bottom: 20px;">
                  Thank you for showing interest in joining <strong>DevForge</strong>, the official developer community at Newton School of Technology, Bengaluru!
                </p>
                
                <p style="font-size: 15px; line-height: 1.6; color: #94a3b8; margin-bottom: 28px;">
                  Before you step foot on campus, we want to kick off the journey. We are hosting an exclusive virtual <strong>Orientation Session</strong> where you'll meet the founders, learn about our vision, explore upcoming projects, check out learning tracks, and discover how you can grow with the community.
                </p>
                
                <!-- Event Info Card (Frosted Glass with Gradient Border Mock) -->
                <div style="background-color: #0a0d18; border: 1px solid rgba(6, 182, 212, 0.2); border-radius: 16px; padding: 24px; margin-bottom: 30px; box-shadow: inset 0 0 12px rgba(6, 182, 212, 0.05);">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr style="vertical-align: middle;">
                      <td style="padding: 8px 0; font-size: 22px; width: 40px; text-align: center;">🗓</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #f8fafc; font-weight: 500;">
                        <span style="color: #06b6d4; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 0.05em; display: block; margin-bottom: 2px;">Date</span>
                        Monday, 20 July 2026
                      </td>
                    </tr>
                    <tr style="vertical-align: middle;">
                      <td style="padding: 8px 0; font-size: 22px; width: 40px; text-align: center;">🕖</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #f8fafc; font-weight: 500;">
                        <span style="color: #06b6d4; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 0.05em; display: block; margin-bottom: 2px;">Time</span>
                        7:00 PM – 8:00 PM (IST)
                      </td>
                    </tr>
                    <tr style="vertical-align: middle;">
                      <td style="padding: 8px 0; font-size: 22px; width: 40px; text-align: center;">📍</td>
                      <td style="padding: 8px 0; font-size: 15px; color: #f8fafc; font-weight: 500;">
                        <span style="color: #06b6d4; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 0.05em; display: block; margin-bottom: 2px;">Platform</span>
                        Google Meet
                      </td>
                    </tr>
                  </table>
                </div>

                <!-- Agenda Section Title -->
                <div style="font-size: 18px; font-weight: 800; color: #ffffff; margin-bottom: 20px; letter-spacing: -0.02em; display: flex; align-items: center;">
                  <span style="display: inline-block; width: 4px; height: 18px; background-color: #8b5cf6; margin-right: 10px; border-radius: 2px;"></span>
                  What We'll Cover
                </div>
                
                <!-- Alternating Cyan-Violet Agenda Timeline -->
                <div style="margin-bottom: 35px; space-y: 10px;">
                  <div style="font-size: 15px; color: #f8fafc; padding: 16px; margin-bottom: 12px; background-color: #0a0d18; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.03); border-left: 4px solid #06b6d4;">
                    <div style="font-weight: 700; color: #ffffff; margin-bottom: 4px;">🚀 What is DevForge?</div>
                    <span style="font-size: 13px; color: #94a3b8; line-height: 1.5; display: block;">Our identity, ecosystem position, and standard developer track paths.</span>
                  </div>
                  <div style="font-size: 15px; color: #f8fafc; padding: 16px; margin-bottom: 12px; background-color: #0a0d18; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.03); border-left: 4px solid #8b5cf6;">
                    <div style="font-weight: 700; color: #ffffff; margin-bottom: 4px;">💙 Our Vision & Culture</div>
                    <span style="font-size: 13px; color: #94a3b8; line-height: 1.5; display: block;">How we build collaboratively, mentorship networks, and our community culture.</span>
                  </div>
                  <div style="font-size: 15px; color: #f8fafc; padding: 16px; margin-bottom: 12px; background-color: #0a0d18; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.03); border-left: 4px solid #06b6d4;">
                    <div style="font-weight: 700; color: #ffffff; margin-bottom: 4px;">🛠️ Upcoming Projects & Events</div>
                    <span style="font-size: 13px; color: #94a3b8; line-height: 1.5; display: block;">Get early insights into upcoming hackathons, tech workshops, and projects.</span>
                  </div>
                  <div style="font-size: 15px; color: #f8fafc; padding: 16px; margin-bottom: 12px; background-color: #0a0d18; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.03); border-left: 4px solid #8b5cf6;">
                    <div style="font-weight: 700; color: #ffffff; margin-bottom: 4px;">🌟 Member Benefits & Growth</div>
                    <span style="font-size: 13px; color: #94a3b8; line-height: 1.5; display: block;">Resume building, open-source portfolio opportunities, and tech rewards.</span>
                  </div>
                  <div style="font-size: 15px; color: #f8fafc; padding: 16px; margin-bottom: 12px; background-color: #0a0d18; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.03); border-left: 4px solid #06b6d4;">
                    <div style="font-weight: 700; color: #ffffff; margin-bottom: 4px;">🤝 Team Structure & Operations</div>
                    <span style="font-size: 13px; color: #94a3b8; line-height: 1.5; display: block;">How committees function and how you can join the operations teams.</span>
                  </div>
                  <div style="font-size: 15px; color: #f8fafc; padding: 16px; background-color: #0a0d18; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.03); border-left: 4px solid #8b5cf6;">
                    <div style="font-weight: 700; color: #ffffff; margin-bottom: 4px;">❓ Interactive Live Q&A</div>
                    <span style="font-size: 13px; color: #94a3b8; line-height: 1.5; display: block;">Ask senior leadership, GSoC achievers, and core developers anything.</span>
                  </div>
                </div>

                <p style="font-size: 14.5px; line-height: 1.6; color: #94a3b8; margin-bottom: 25px; text-align: center;">
                  Don't forget to save the session to your calendar so you don't miss it!
                </p>

                <!-- High-contrast Neon/Glow CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${calendarLink}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%); color: #ffffff !important; text-decoration: none; font-size: 16px; font-weight: 800; padding: 16px 40px; border-radius: 14px; box-shadow: 0 0 25px rgba(6, 182, 212, 0.35); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); transition: all 0.2s ease;">
                    📅 Add to Google Calendar
                  </a>
                </div>

                <p style="font-size: 15px; line-height: 1.6; color: #94a3b8; margin-top: 35px; border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 25px;">
                  We are super excited to welcome you and start building together. See you online!
                </p>
                
                <p style="font-size: 15px; line-height: 1.6; color: #94a3b8; margin-bottom: 0;">
                  Best regards,<br>
                  <strong style="color: #ffffff;">DevForge Core Team</strong>
                </p>
              </div>
              
              <!-- Footer Section -->
              <div style="text-align: center; padding: 30px 24px; background-color: #05070d; border-top: 1px solid rgba(255, 255, 255, 0.06);">
                <p style="font-size: 12px; color: #64748b; margin: 0 0 8px 0; line-height: 1.6;">
                  This is an official invitation sent to prospective students joining NST Bengaluru in 2026.
                </p>
                <p style="font-size: 12px; color: #64748b; margin: 0; line-height: 1.6;">
                  Have questions? Connect with us at <a href="mailto:contact@devforge.club" style="color: #06b6d4; text-decoration: none;">contact@devforge.club</a> or explore <a href="https://devforge.club" style="color: #06b6d4; text-decoration: none;">devforge.club</a>
                </p>
              </div>

            </div>
          </div>
        </body>
        </html>
    `;
}

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const { name, email, secret } = body;

        // 1. Basic field validation
        if (!name || !email || !secret) {
            return NextResponse.json(
                { error: "Missing required fields: 'name', 'email', or 'secret'" },
                { status: 400 }
            );
        }

        // 2. Secret authentication
        const rsvpSecret = process.env.RSVP_API_SECRET;
        if (!rsvpSecret || secret !== rsvpSecret) {
            return NextResponse.json(
                { error: "Unauthorized access: Invalid secret token" },
                { status: 401 }
            );
        }

        // 3. Time cutoff validation (No email after July 20, 2026, 8:00 PM IST)
        const cutoffDate = new Date("2026-07-20T20:00:00+05:30");
        const currentDate = new Date();
        
        if (currentDate > cutoffDate) {
            return NextResponse.json(
                { error: "Orientation session has ended. RSVPs and invitation emails are closed." },
                { status: 400 }
            );
        }

        // 4. Configure Nodemailer transporter using system env
        const smtpHost = process.env.SMTP_HOST || 'smtp.purelymail.com';
        const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const smtpFrom = process.env.SMTP_FROM || 'DevForge <contact@devforge.club>';

        if (!smtpUser || !smtpPass) {
            return NextResponse.json(
                { error: "Server configuration issue: Mail SMTP credentials are not configured" },
                { status: 500 }
            );
        }

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
                user: smtpUser,
                pass: smtpPass
            }
        });

        // 5. Send email
        const htmlContent = generateEmailHtml(name);
        const textContent = `Hey ${name}!\n\nThank you for showing interest in DevForge.\n\nWe are hosting an Orientation Session:\nDate: Monday, 20 July 2026\nTime: 7:00 PM – 8:00 PM (IST)\nPlatform: Google Meet\n\nAdd to Google Calendar: ${calendarLink}\n\nWe look forward to welcoming you to the DevForge community!\n\nBest regards,\nDevForge Core Team`;

        const mailOptions = {
            from: smtpFrom,
            to: email,
            subject: `DevForge Orientation Session — Welcome, ${name}! 👋`,
            html: htmlContent,
            text: textContent
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({
            success: true,
            message: `Invitation email sent successfully to ${name} (${email}).`
        });

    } catch (error: any) {
        console.error("Error processing orientation RSVP API:", error);
        return NextResponse.json(
            { error: error.message || "Failed to process orientation RSVP" },
            { status: 500 }
        );
    }
}
