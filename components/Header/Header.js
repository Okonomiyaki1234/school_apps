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
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async (user) => {
      if (!user) {
        setUserProfile(null);
        return;
      }
      // プロフィール取得（profilesテーブルにname, roleがある前提）
      const { data, error } = await supabase
        .from("profiles")
        .select("name, role")
        .eq("id", user.id)
        .single();
      if (!error) {
        setUserProfile(data);
      } else {
        setUserProfile(null);
      }
    };

    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;
      setUser(session?.user ?? null);
      await fetchProfile(session?.user ?? null);
      setLoading(false);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
      await fetchProfile(session?.user ?? null);
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
      // auth/registerページではリダイレクトしない
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
        background: "#1976d2",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        zIndex: 2000,
        boxShadow: "0 2px 8px #0002"
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
        <nav className="header-nav" style={{ gap: 0 }}>
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
              background: "#1976d2",
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
          {/* モバイル時のみユーザー情報とログアウトボタンをメニュー内に表示 */}
          <div className="header-mobile-user">
            <span style={{ fontSize: 14, color: "#fff", opacity: 0.9, margin: "12px 0" }}>
              {loading
                ? "認証確認中..."
                : user && userProfile
                  ? `ログイン中: ${userProfile.name}（${(() => {
                      switch (userProfile.role) {
                        case "student": return "生徒";
                        case "council": return "生徒会";
                        case "admin": return "教員";
                        case "operator": return "運営";
                        default: return userProfile.role;
                      }
                    })()}）`
                  : user
                    ? "ユーザー情報取得中..."
                    : "ログインしていません"}
            </span>
            <button
              onClick={handleLogout}
              disabled={loggingOut || loading}
              style={{
                background: "#fff",
                color: "#1976d2",
                border: "none",
                borderRadius: 6,
                padding: "8px 20px",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "0 1px 4px #0001",
                margin: "12px 0"
              }}
            >
              {loggingOut ? "ログアウト中..." : "ログアウト"}
            </button>
          </div>
        </nav>
      </div>
      <div className="header-right" style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 14, color: "#fff", opacity: 0.9 }}>
          {loading
            ? "認証確認中..."
            : user && userProfile
              ? `ログイン中: ${userProfile.name}（${(() => {
                  switch (userProfile.role) {
                    case "student": return "生徒";
                    case "council": return "生徒会";
                    case "admin": return "教員";
                    case "operator": return "運営";
                    default: return userProfile.role;
                  }
                })()}）`
              : user
                ? "ユーザー情報取得中..."
                : "ログインしていません"}
        </span>
        <button
          onClick={handleLogout}
          disabled={loggingOut || loading}
          style={{
            background: "#fff",
            color: "#1976d2",
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
      {/* レスポンシブ用CSS */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .header-nav {
            display: ${menuOpen ? "flex" : "none"};
            position: absolute;
            top: 56px;
            left: 0;
            width: 100vw;
            background: #1976d2;
            flex-direction: column;
            z-index: 3000;
            box-shadow: 0 2px 8px #0002;
          }
          .header-left {
            width: 100%;
          }
          .hamburger {
            display: block;
          }
          .header-mobile-user {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 0 16px;
          }
          .header-right {
            display: none !important;
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
          .header-mobile-user {
            display: none !important;
          }
          .header-right {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
