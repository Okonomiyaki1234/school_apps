"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Header({
  bgColor = "#1976d2",
  textColor = "#fff",
  accentColor = "#1976d2",
  shadowColor = "#0002",
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { user, profile, loading, signOut, getRoleLabel } = useAuth();

  const handleLogout = async () => {
    if (!window.confirm("本当にログアウトしますか？")) return;
    setLoggingOut(true);
    await signOut();
    setLoggingOut(false);
  };


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // PWA用リロードボタン
  const handleReload = () => {
    window.location.reload();
  };

  const userDisplay = loading
    ? "認証確認中..."
    : user && profile
      ? `ログイン中: ${profile.name}（${getRoleLabel(profile.role)}）`
      : user
        ? "ユーザー情報取得中..."
        : "ログインしていません";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: 56,
        background: bgColor,
        color: textColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        zIndex: 2000,
        boxShadow: `0 2px 8px ${shadowColor}`
      }}
    >
      {/* ハンバーガーメニュー（モバイル） */}
      <div className="header-left" style={{ display: "flex", alignItems: "center" }}>
        <div className="hamburger">
          <button
            aria-label="メニュー"
            style={{
              background: "none",
              border: "none",
              color: textColor,
              fontSize: 28,
              cursor: "pointer",
              marginRight: 12
            }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span style={{ fontWeight: "bold" }}>&#9776;</span>
          </button>
        </div>
        {/* PC用ナビゲーション */}
        <nav className="header-nav" style={{ gap: 0 }}>
          <Link
            href="/main/home"
            style={{
              color: textColor,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 18,
              padding: "0 16px",
              height: 56,
              display: "flex",
              alignItems: "center",
              borderRight: "1px solid #fff4"
            }}
          >ホーム</Link>
          <button
            onClick={scrollToTop}
            style={{
              background: bgColor,
              color: textColor,
              border: "none",
              borderRadius: 6,
              padding: "8px 16px",
              fontWeight: 600,
              fontSize: 15,
              marginLeft: 8,
              cursor: "pointer"
            }}
          >トップへ</button>
          <button
            onClick={handleReload}
            style={{
              background: bgColor,
              color: textColor,
              border: "none",
              borderRadius: 6,
              padding: "8px 16px",
              fontWeight: 600,
              fontSize: 15,
              marginLeft: 8,
              cursor: "pointer"
            }}
          >リロード</button>
        </nav>
      </div>
      {/* PC用ユーザー情報・ログアウト */}
      <div className="header-right" style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 14, color: textColor, opacity: 0.9 }}>
          {userDisplay}
        </span>
        <button
          onClick={handleLogout}
          disabled={loggingOut || loading}
          style={{
            background: "#fff",
            color: accentColor,
            border: "none",
            borderRadius: 6,
            padding: "8px 20px",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
            boxShadow: "0 1px 4px #0001"
          }}
        >
          {loggingOut ? "ログアウト中..." : "ログアウト"}
        </button>
      </div>

      {/* モバイル用オーバーレイメニュー */}
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu" onClick={e => e.stopPropagation()}>
            <button
              aria-label="閉じる"
              style={{
                background: "none",
                border: "none",
                color: accentColor,
                fontSize: 32,
                position: "absolute",
                top: 12,
                right: 16,
                cursor: "pointer"
              }}
              onClick={() => setMenuOpen(false)}
            >×</button>
            <nav style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
              <Link
                href="/main/home"
                style={{
                  color: accentColor,
                  background: "#fff",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: 20,
                  padding: "12px 32px",
                  borderRadius: 8,
                  margin: "12px 0",
                  width: 180,
                  textAlign: "center",
                  boxShadow: "0 1px 4px #0001"
                }}
                onClick={() => setMenuOpen(false)}
              >ホーム</Link>
              <button
                onClick={() => { scrollToTop(); setMenuOpen(false); }}
                style={{
                  background: "#fff",
                  color: accentColor,
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 32px",
                  fontWeight: 600,
                  fontSize: 20,
                  margin: "12px 0",
                  width: 180,
                  boxShadow: "0 1px 4px #0001",
                  textAlign: "center"
                }}
              >トップへ</button>
              <button
                onClick={() => { handleReload(); setMenuOpen(false); }}
                style={{
                  background: "#fff",
                  color: accentColor,
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 32px",
                  fontWeight: 600,
                  fontSize: 20,
                  margin: "12px 0",
                  width: 180,
                  boxShadow: "0 1px 4px #0001",
                  textAlign: "center"
                }}
              >リロード</button>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                disabled={loggingOut || loading}
                style={{
                  background: bgColor,
                  color: textColor,
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 32px",
                  fontWeight: 600,
                  fontSize: 20,
                  margin: "12px 0",
                  width: 180,
                  boxShadow: "0 1px 4px #0001",
                  textAlign: "center"
                }}
              >{loggingOut ? "ログアウト中..." : "ログアウト"}</button>
              <span style={{ fontSize: 14, color: accentColor, opacity: 0.9, margin: "16px 0" }}>
                {userDisplay}
              </span>
            </nav>
          </div>
        </div>
      )}

      {/* レスポンシブ用CSS */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .header-nav {
            display: none !important;
          }
          .header-right {
            display: none !important;
          }
          .hamburger {
            display: block;
          }
          .mobile-menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.25);
            z-index: 3000;
            display: flex;
            align-items: flex-start;
            justify-content: center;
          }
          .mobile-menu {
            position: relative;
            background: #fff;
            color: ${accentColor};
            border-radius: 16px;
            margin-top: 60px;
            min-width: 240px;
            min-height: 220px;
            box-shadow: 0 4px 24px ${shadowColor};
            padding: 32px 0 24px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
        @media (min-width: 1025px) {
          .header-nav {
            display: flex !important;
            position: static;
            flex-direction: row;
            background: none;
            box-shadow: none;
          }
          .hamburger {
            display: none !important;
          }
          .header-right {
            display: flex !important;
          }
          .mobile-menu-overlay {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
