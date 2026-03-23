"use client";
import Calendar from "@/components/Calendar";
import HeaderSwitcher from "@/components/Header/HeaderSwitcher";
import Footer from "@/components/Footer";

export default function CalendarPage() {
  return (
    <>
      <HeaderSwitcher />
      <div style={{
        maxWidth: 800,
        margin: "40px auto",
        padding: 20,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #eee",
        paddingTop: 56 // ヘッダー高さ分の余白
      }}>
        <Calendar />
      </div>
      <Footer />
    </>
  );
}
