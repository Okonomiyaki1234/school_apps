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

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
    // ログイン状態の変化を監視
    const { data: listener } = supabase.auth.onAuthStateChange(() => getUser());
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  const handleLogout = async () => {
    if (!window.confirm("本当にログアウトしますか？")) return;
    setLoggingOut(true);
    await supabase.auth.signOut();
    setLoggingOut(false);
    router.push("/");
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
      <nav style={{ display: "flex", gap: 24 }}>
        <Link href="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: 18 }}>ホーム</Link>
        <Link href="/create4_calender" style={{ color: "#fff", textDecoration: "none", fontWeight: 500 }}>カレンダー</Link>
        <Link href="/create2" style={{ color: "#fff", textDecoration: "none", fontWeight: 500 }}>（未実装）</Link>
        <Link href="/create3_login" style={{ color: "#fff", textDecoration: "none", fontWeight: 500 }}>ログイン</Link>
      </nav>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 14, color: "#fff", opacity: 0.9 }}>
          {user ? `ログイン中: ${user.email}` : "ログインしていません"}
        </span>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
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
    </header>
  );
}
