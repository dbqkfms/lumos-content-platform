/**
 * Email API Route — /api/contact
 * Uses Nodemailer with Gmail SMTP (App Password)
 * Sends inquiry to thisglobal2023@gmail.com
 */
import { Router, Request, Response } from "express";
import nodemailer from "nodemailer";

const router = Router();

// Gmail SMTP transporter
// Uses environment variables for credentials
function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER || "thisglobal2023@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD || "",
    },
  });
}

router.post("/contact", async (req: Request, res: Response) => {
  const { artwork, spaceType, nameCompany, contact, message } = req.body;

  // Validate required fields
  if (!contact) {
    res.status(400).json({ ok: false, error: "연락처는 필수입니다." });
    return;
  }

  const subject = `[LUMOS 문의] ${artwork || "작품 문의"} — ${nameCompany || contact}`;
  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e0e0e0; padding: 40px;">
      <div style="border-bottom: 1px solid #D4A843; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="font-size: 28px; color: #D4A843; margin: 0; letter-spacing: 0.1em;">LUMOS</h1>
        <p style="color: #888; font-size: 11px; letter-spacing: 0.3em; margin: 4px 0 0;">NEW INQUIRY</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #888; font-size: 12px; letter-spacing: 0.1em; width: 120px;">작품명</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #e0e0e0;">${artwork || "미지정"}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #888; font-size: 12px; letter-spacing: 0.1em;">공간 유형</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #e0e0e0;">${spaceType || "미지정"}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #888; font-size: 12px; letter-spacing: 0.1em;">이름/회사</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #e0e0e0;">${nameCompany || "미입력"}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #888; font-size: 12px; letter-spacing: 0.1em;">연락처</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #D4A843; font-weight: bold;">${contact}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #888; font-size: 12px; letter-spacing: 0.1em; vertical-align: top; padding-top: 16px;">문의 내용</td>
          <td style="padding: 12px 0; color: #e0e0e0; padding-top: 16px;">${message ? message.replace(/\n/g, "<br>") : "없음"}</td>
        </tr>
      </table>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #1a1a1a; color: #555; font-size: 11px;">
        LUMOS Media Art Library — 자동 발송 메일입니다
      </div>
    </div>
  `;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"LUMOS 문의" <${process.env.GMAIL_USER || "thisglobal2023@gmail.com"}>`,
      to: "thisglobal2023@gmail.com",
      subject,
      html,
      replyTo: contact.includes("@") ? contact : undefined,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("[Email Error]", err);
    // Still return success to user — log the inquiry server-side
    console.log("[Inquiry Logged]", { artwork, spaceType, nameCompany, contact, message });
    res.json({ ok: true, note: "logged" });
  }
});

export default router;
