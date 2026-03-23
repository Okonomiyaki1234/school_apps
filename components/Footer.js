
"use client";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useCallback } from "react";

export default function Footer() {
  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    window.location.reload();
  }, []);
  return (
    <footer
      style={{
        width: "100%",
        background: "#f5f5f7",
        color: "#444",
        padding: "32px 0 18px 0",
        marginTop: 48,
        borderTop: "1px solid #e0e0e0",
        textAlign: "center",
        position: "relative"
      }}
    >
      <div style={{ marginBottom: 12 }}>
        {/* 外部リンク例 */}
        <a href="https://www.example.com" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", margin: "0 16px", textDecoration: "none", fontWeight: 500 }}>
          外部サイト
        </a>
        <Link href="/terms" style={{ color: "#1976d2", margin: "0 16px", textDecoration: "none", fontWeight: 500 }}>
          利用規約
        </Link>
        <Link href="/privacy" style={{ color: "#1976d2", margin: "0 16px", textDecoration: "none", fontWeight: 500 }}>
          プライバシーポリシー
        </Link>
      </div>
      <div style={{ fontSize: 13, color: "#888" }}>
        &copy; {new Date().getFullYear()} 淑徳中学・高等学校ポータル
      </div>
      {/* 強制ログアウトボタン（目立たない・右下） */}
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          right: 12,
          bottom: 8,
          background: "none",
          border: "none",
          color: "#bbb",
          fontSize: 11,
          cursor: "pointer",
          opacity: 0.5,
          padding: 0,
          zIndex: 10,
          textDecoration: "underline"
        }}
        aria-label="強制ログアウト"
        tabIndex={0}
      >
        強制ログアウト
      </button>
    </footer>
  );
}
