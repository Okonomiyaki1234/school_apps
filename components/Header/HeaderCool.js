"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";


export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // ローディング完了後に未ログインならリダイレクト
    if (!loading && !user) {
      if (pathname !== "/" && pathname !== "/auth/register") {
        router.replace("/");
      }
    }
  }, [loading, user, pathname, router]);

  const handleLogout = async () => {
    if (!window.confirm("本当にログアウトしますか？")) return;
    setLoggingOut(true);
    await supabase.auth.signOut();
    setLoggingOut(false);
    router.replace("/"); // ログインページへ自動遷移
  };

  // ページトップへスクロールする関数
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: 56,
        background: "#0097a7",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        zIndex: 2000,
        boxShadow: "0 2px 8px #0097a766"
      }}
    >
      {/* ハンバーガーメニュー（モバイル） */}
      <div className="header-left" style={{ display: "flex", alignItems: "center" }}>
        <div className="hamburger" style={{ display: "none" }}>
          <button
            aria-label="メニュー"
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: 28,
              cursor: "pointer",
              marginRight: 12
            }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span style={{ fontWeight: "bold" }}>&#9776;</span>
          </button>
        </div>
        <nav className="header-nav" style={{ display: "flex", gap: 0 }}>
          <Link
            href="/main/home"
            style={{
              color: "#fff",
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
              background: "#0097a7",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 16px",
              fontWeight: 600,
              fontSize: 15,
              marginLeft: 8,
              cursor: "pointer"
            }}
          >トップへ</button>
        </nav>
      </div>
      <div className="header-right" style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 14, color: "#fff", opacity: 0.9 }}>
          {loading
            ? "認証確認中..."
            : user
              ? `ログイン中: ${user.email}`
              : "ログインしていません"}
        </span>
        <button
          onClick={handleLogout}
          disabled={loggingOut || loading}
          style={{
            background: "#fff",
            color: "#0097a7",
            border: "none",
            borderRadius: 6,
            padding: "8px 20px",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer"
          }}
        >
          {loggingOut ? "ログアウト中..." : "ログアウト"}
        </button>
      </div>
      {/* レスポンシブ用CSS */}
      <style jsx>{`
        @media (max-width: 700px) {
          .header-nav {
            display: ${menuOpen ? "flex" : "none"};
            position: absolute;
            top: 56px;
            left: 0;
            width: 100vw;
            background: #0097a7;
            flex-direction: column;
            z-index: 3000;
            box-shadow: 0 2px 8px #0097a766;
          }
          .header-left {
            width: 100%;
          }
          .hamburger {
            display: block;
          }
        }
        @media (min-width: 701px) {
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
        }
      `}</style>
    </header>
  );
}
