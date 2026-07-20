import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { firm } from "@/lib/firm";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().or(z.literal("")),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
  partner: z.string().max(80).optional().or(z.literal("")),
  matterType: z.string().max(80).optional().or(z.literal("")),
  preferredDate: z.string().max(40).optional().or(z.literal("")),
  preferredTime: z.string().max(40).optional().or(z.literal("")),
});

const rateMap = new Map<string, { count: number; reset: number }>();

function rateLimit(ip: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const to = process.env.CONTACT_TO_EMAIL || firm.email;
    const apiKey = process.env.RESEND_API_KEY;
    const isAppointment = Boolean(
      data.preferredDate || data.preferredTime || data.matterType
    );

    if (!apiKey) {
      console.info("[contact enquiry]", data);
      return NextResponse.json({
        ok: true,
        mode: "logged",
        message: "Enquiry logged (RESEND_API_KEY not set)",
      });
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || "Enquiry <onboarding@resend.dev>",
      to: [to],
      replyTo: data.email,
      subject: isAppointment
        ? `[Appointment] ${data.subject}`
        : `[Website Enquiry] ${data.subject}`,
      text: [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone || "—"}`,
        `Preferred partner: ${data.partner || "—"}`,
        `Matter type: ${data.matterType || "—"}`,
        `Preferred date: ${data.preferredDate || "—"}`,
        `Preferred time: ${data.preferredTime || "—"}`,
        "",
        data.message,
      ].join("\n"),
    });

    if (error) {
      console.error("[resend]", error);
      return NextResponse.json({ error: "Failed to send" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
