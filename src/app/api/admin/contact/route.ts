import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { firstName, email, phone, message } = await req.json();

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"${firstName}" <${email}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL,
      subject: `New Contact Form Submission from ${firstName}`,
      html: `
  <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f3f4f6; padding: 40px;">
    <!-- Outer Container -->
    <div style="max-width: 640px; margin: auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 30px rgba(0,0,0,0.08); border: 1px solid #f0f0f0;">

      <!-- Header -->
      <div style="background: linear-gradient(135deg, #dc2626, #ef4444, #f87171); color: #ffffff; text-align: center; padding: 40px 25px 30px;">
        <h1 style="margin: 0; font-size: 26px; letter-spacing: 0.3px;">New Contact Form Submission</h1>
        <p style="margin-top: 8px; font-size: 15px; color: #ffeaea;">Received via Dikshant IAS Official Website</p>
      </div>

      <!-- Body -->
      <div style="padding: 35px 35px 25px; color: #1f2937; line-height: 1.75;">
        <p style="margin-bottom: 25px; font-size: 15px; color: #4b5563;">
          You’ve received a new message from your website contact form. Here are the details:
        </p>

        <table style="width: 100%; border-collapse: collapse; font-size: 15px; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
          <tr style="background-color: #f9fafb;">
            <td style="padding: 14px 18px; font-weight: 600; color: #374151; width: 130px;">Name</td>
            <td style="padding: 14px 18px; color: #111827;">${firstName}</td>
          </tr>
          <tr style="background-color: #ffffff;">
            <td style="padding: 14px 18px; font-weight: 600; color: #374151;">Email</td>
            <td style="padding: 14px 18px; color: #111827;">${email}</td>
          </tr>
          <tr style="background-color: #f9fafb;">
            <td style="padding: 14px 18px; font-weight: 600; color: #374151;">Phone</td>
            <td style="padding: 14px 18px; color: #111827;">${
              phone || "N/A"
            }</td>
          </tr>
          <tr style="background-color: #ffffff;">
            <td style="padding: 14px 18px; font-weight: 600; color: #374151; vertical-align: top;">Message</td>
            <td style="padding: 14px 18px; color: #111827;">${message}</td>
          </tr>
        </table>

        <!-- CTA Buttons -->
        <div style="text-align: center; margin-top: 40px;">
          <a href="mailto:${email}" 
             style="background: linear-gradient(135deg, #dc2626, #ef4444); 
                    color: #ffffff; text-decoration: none; 
                    padding: 12px 32px; border-radius: 8px; 
                    font-weight: 600; letter-spacing: 0.3px; 
                    box-shadow: 0 4px 10px rgba(239,68,68,0.3);
                    margin-right: 10px; display: inline-block;">
            Reply
          </a>
          ${
            phone
              ? `<a href="tel:${phone}" 
                     style="background: linear-gradient(135deg, #f87171, #ef4444); 
                            color: #ffffff; text-decoration: none; 
                            padding: 12px 32px; border-radius: 8px; 
                            font-weight: 600; letter-spacing: 0.3px; 
                            box-shadow: 0 4px 10px rgba(248,113,113,0.3);
                            display: inline-block;">
                   Call
                 </a>`
              : ""
          }
        </div>
      </div>

      <!-- Divider -->
      <div style="height: 1px; background-color: #e5e7eb; margin: 0 35px;"></div>

      <!-- Footer -->
      <div style="background-color: #f9fafb; padding: 24px; text-align: center; font-size: 13px; color: #6b7280;">
        <p style="margin: 0;">© ${new Date().getFullYear()} <strong>Dikshant IAS</strong>. All rights reserved.</p>
      </div>
    </div>
  </div>
`,
    };

    // Wrap await in try/catch to satisfy parser
    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error("Mail error:", mailError);
      return NextResponse.json(
        { success: false, error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      // message: "Email sent successfully!",
      message:
        "Thanks! Your message has been sent. We’ll get back to you soon.",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
