
"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Footer() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    if (!window.confirm("強制ログアウトしますか？")) return;
    await signOut();
  };
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
        <a href="https://shukutoku.ed.jp/" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", margin: "0 16px", textDecoration: "none", fontWeight: 500 }}>
          学校公式ホームページ
        </a>
        <Link href="/read/terms" style={{ color: "#1976d2", margin: "0 16px", textDecoration: "none", fontWeight: 500 }}>
          利用規約
        </Link>
        <Link href="/read/privacy" style={{ color: "#1976d2", margin: "0 16px", textDecoration: "none", fontWeight: 500 }}>
          プライバシーポリシー
        </Link>
        <a href="https://forms.gle/Us1XA89gTS3fpuBn6" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", margin: "0 16px", textDecoration: "none", fontWeight: 500 }}>
          フィードバック
        </a>
      </div>
      <div
        style={{
          fontSize: 20,
          color: '#1565c0',
          fontWeight: 800,
          marginBottom: 12,
          letterSpacing: 2,
          textShadow: '0 2px 8px #b3d1f7',
        }}
      >
        「利他共生」
      </div>
      <div style={{ fontSize: 14, color: '#1976d2', marginBottom: 8, fontWeight: 500 }}>
        「ここでの大抵の不具合は、リロードすれば直る！」
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
