"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { partners, practiceAreaIds } from "@/lib/firm";

const timeKeys = ["morning", "afternoon", "evening"] as const;
const matterKeys = [...practiceAreaIds, "other"] as const;

export function AppointmentForm() {
  const t = useTranslations("appointment");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (data.get("company_website")) {
      setStatus("success");
      return;
    }

    const matterType = String(data.get("matterType") || "");
    const preferredDate = String(data.get("preferredDate") || "");
    const preferredTime = String(data.get("preferredTime") || "");

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          subject: `Appointment request${matterType ? ` — ${matterType}` : ""}`,
          message: data.get("message"),
          partner: data.get("partner"),
          matterType,
          preferredDate,
          preferredTime,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-lg border border-gold/40 bg-gold/10 p-6 text-navy"
        role="status"
      >
        <p className="font-medium">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="absolute -left-[9999px] opacity-0" aria-hidden>
        <label htmlFor="company_website">Company website</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input id="name" name="name" required autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="partner">{t("partner")}</Label>
          <select
            id="partner"
            name="partner"
            className="flex h-11 w-full cursor-pointer rounded-md border border-input bg-white px-3 text-sm text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            defaultValue=""
          >
            <option value="">{t("partnerAny")}</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="matterType">{t("matterType")}</Label>
        <select
          id="matterType"
          name="matterType"
          required
          className="flex h-11 w-full cursor-pointer rounded-md border border-input bg-white px-3 text-sm text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          defaultValue=""
        >
          <option value="" disabled>
            —
          </option>
          {matterKeys.map((key) => (
            <option key={key} value={key}>
              {t(`matterTypes.${key}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="preferredDate">{t("preferredDate")}</Label>
          <Input id="preferredDate" name="preferredDate" type="date" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredTime">{t("preferredTime")}</Label>
          <select
            id="preferredTime"
            name="preferredTime"
            required
            className="flex h-11 w-full cursor-pointer rounded-md border border-input bg-white px-3 text-sm text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            defaultValue=""
          >
            <option value="" disabled>
              —
            </option>
            {timeKeys.map((key) => (
              <option key={key} value={key}>
                {t(`times.${key}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t("message")}</Label>
        <Textarea id="message" name="message" required rows={5} />
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive" role="alert">
          {t("error")}
        </p>
      )}

      <Button
        type="submit"
        variant="gold"
        size="lg"
        disabled={status === "loading"}
        className="w-full sm:w-auto"
      >
        {status === "loading" ? t("sending") : t("submit")}
      </Button>
    </form>
  );
}
