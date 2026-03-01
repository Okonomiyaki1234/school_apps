"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";


export default function Header() {
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
      if (pathname !== "/") {
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

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: 56,
        background: "#a5d6a7",
        color: "#333",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        zIndex: 2000,
        boxShadow: "0 2px 8px #0002"
      }}
    >
        <nav style={{ display: "flex", gap: 0 }}>
          <Link
            href="/main/home"
            style={{
              color: "#333",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 18,
              padding: "0 16px",
              height: 56,
              display: "flex",
              alignItems: "center",
              borderRight: "1px solid #3332"
            }}
          >ホーム</Link>
          <Link
            href="/main/my_page"
            style={{
              color: "#333",
              textDecoration: "none",
              fontWeight: 500,
              padding: "0 16px",
              height: 56,
              display: "flex",
              alignItems: "center",
              borderRight: "1px solid #3332"
            }}
          >マイページ</Link>
          <Link
            href="/main/calendar"
            style={{
              color: "#333",
              textDecoration: "none",
              fontWeight: 500,
              padding: "0 16px",
              height: 56,
              display: "flex",
              alignItems: "center",
              borderRight: "1px solid #3332"
            }}
          >カレンダー</Link>
          <a
            href="https://studio-delta-six-29.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#333",
              textDecoration: "none",
              fontWeight: 500,
              padding: "0 16px",
              height: 56,
              display: "flex",
              alignItems: "center"
            }}
          >淑徳アドバンス デジタルサイネージ</a>
        </nav>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 14, color: "#333", opacity: 0.9 }}>
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
            color: "#333",
            border: "none",
            borderRadius: 6,
            padding: "8px 20px",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
            boxShadow: "0 1px 4px #a5d6a766"
          }}
        >
          {loggingOut ? "ログアウト中..." : "ログアウト"}
        </button>
      </div>
    </header>
  );
}
