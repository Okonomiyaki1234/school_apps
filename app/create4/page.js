"use client";
import Calendar from "@/components/Calendar";

export default function CalendarPage() {
  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
      <Calendar />
    </div>
  );
}
