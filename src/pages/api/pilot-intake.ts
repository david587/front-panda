import type { APIRoute } from "astro";
import { Resend } from "resend";

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json();
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const emailFrom = import.meta.env.EMAIL_FROM || "onboarding@resend.dev";
    const emailTo = import.meta.env.EMAIL_TO || "delivered@resend.dev";

    console.log(`Attempting to send email from ${emailFrom} to ${emailTo}`);

    if (!resendApiKey) {
      console.error("Missing RESEND_API_KEY environment variable");
      return new Response(JSON.stringify({ error: "Missing Resend API Key on server" }), {
        status: 500,
      });
    }

    if (!payload.email) {
      return new Response(JSON.stringify({ error: "Missing email in payload" }), {
        status: 400,
      });
    }

    const resend = new Resend(resendApiKey);

    const buildText = (p: any) => {
      return [
        "New Pilot Intake Application",
        "",
        `Email: ${p.email}`,
        `Agency size: ${p.agencySize}`,
        `Country: ${p.country}`,
        `Project size: ${p.projectSize}`,
        `Pricing feedback: ${p.pricingFeedback}`,
        `Pricing why: ${p.pricingWhy || "-"}`,
      ].join("\n");
    };

    const buildHtml = (p: any) => {
      const escape = (v: string) =>
        v
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");

      return `
        <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; color: #0f2b1c;">
          <h2 style="margin: 0 0 12px;">New Pilot Intake Application</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 6px 0; font-weight: 700;">Email</td><td style="padding: 6px 0;">${escape(p.email)}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 700;">Agency size</td><td style="padding: 6px 0;">${escape(p.agencySize)}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 700;">Country</td><td style="padding: 6px 0;">${escape(p.country)}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 700;">Project size</td><td style="padding: 6px 0;">${escape(p.projectSize)}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 700;">Pricing feedback</td><td style="padding: 6px 0;">${escape(p.pricingFeedback)}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 700;">Pricing why</td><td style="padding: 6px 0;">${escape(p.pricingWhy || "-")}</td></tr>
          </table>
        </div>
      `;
    };

    const { data, error } = await resend.emails.send({
      from: emailFrom || "onboarding@resend.dev",
      to: emailTo || "delivered@resend.dev",
      replyTo: payload.email,
      subject: "New Pilot Intake Application",
      text: buildText(payload),
      html: buildHtml(payload),
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
    });
  } catch (err: any) {
    console.error("API error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
