"use client";

import AdBanner from "@/components/AdBanner";
import Calendar from "@/components/Calendar";

export default function CalendarPage() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      width: '100%',
      minHeight: '100vh',
      background: '#f7f7fa',
      paddingTop: 56
    }}>
      <AdBanner type="vertical" />
      <div style={{
        maxWidth: 800,
        width: '100%',
        margin: '40px 0',
        padding: 20,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 8px #eee',
        minHeight: 600
      }}>
        <Calendar />
      </div>
      <AdBanner type="vertical" />
    </div>
  );
}
