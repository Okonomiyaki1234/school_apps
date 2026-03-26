"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext(null);

// 認証不要のパス
const PUBLIC_PATHS = ["/", "/auth/register"];

export function AuthProvider({ children }) {

  // "未判定"状態を明示的に管理
  // loading: true = 判定中, false = 判定済み
  // authStatus: "unknown" | "authenticated" | "unauthenticated" | "timeout"
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState("unknown");
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const initialized = useRef(false);

  const fetchProfile = async (currentUser) => {
    if (!currentUser) {
      setProfile(null);
      return null;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("name, role, grade, class, themes, icon, description, achievement, achievement_list, total_login, keep_login, last_login, created_at")
      .eq("id", currentUser.id)
      .single();
    if (!error && data) {
      setProfile(data);
      return data;
    }
    setProfile(null);
    return null;
  };


  // getSessionにタイムアウトfallbackを追加
  const getSessionWithTimeout = async (timeoutMs = 3000) => {
    try {
      return await Promise.race([
        supabase.auth.getSession(),
        new Promise((resolve) => setTimeout(() => resolve({ timeout: true, data: { session: null } }), timeoutMs)),
      ]);
    } catch (e) {
      return { timeout: true, data: { session: null } };
    }
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    let isMounted = true;

    // 初回のみgetSession（タイムアウト付き）
    const initialize = async () => {
      setLoading(true);
      setError(null);
      setAuthStatus("unknown");
      const result = await getSessionWithTimeout();
      if (!isMounted) return;
      if (result.timeout) {
        // ストレージ遅延・未準備
        setAuthStatus("timeout");
        setLoading(false);
        return;
      }
      const currentUser = result.data.session?.user ?? null;
      setUser(currentUser);
      await fetchProfile(currentUser);
      setAuthStatus(currentUser ? "authenticated" : "unauthenticated");
      setLoading(false);
    };
    initialize();

    // onAuthStateChangeを主軸に
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return;
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        await fetchProfile(currentUser);
        setAuthStatus(currentUser ? "authenticated" : "unauthenticated");
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 未ログイン時のリダイレクト
  useEffect(() => {
    let didForceSignOut = false;
    const forceSignOutIfUserRole = async () => {
      // タイムアウト時はリダイレクトしない
      if (authStatus === "timeout") return;
      if (authStatus === "unauthenticated" && !PUBLIC_PATHS.includes(pathname)) {
        alert("正式なログインが必要です。");
        router.replace("/");
        return;
      }
      // roleがuserのときも強制サインアウト・リダイレクト
      if (authStatus === "authenticated" && user && profile?.role === "user" && !PUBLIC_PATHS.includes(pathname) && !didForceSignOut) {
        didForceSignOut = true;
        alert("組織側で登録されていないため、ログインできません。");
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setAuthStatus("unauthenticated");
        router.replace("/");
      }
    };
    forceSignOutIfUserRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus, user, profile, pathname]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.replace("/");
  };

  const refreshProfile = () => {
    if (user) return fetchProfile(user);
    return Promise.resolve(null);
  };

  // ロール表示用ヘルパー
  const getRoleLabel = (role) => {
    switch (role) {
      case "student": return "生徒";
      case "council": return "生徒会";
      case "admin": return "教員";
      case "operator": return "運営";
      default: return role || "";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        authStatus,
        signOut,
        refreshProfile,
        getRoleLabel,
      }}
    >
      {/* 認証確認中UI改善例＋タイムアウト時の案内・リトライ */}
      {authStatus === "unknown" || loading ? (
        <div style={{ textAlign: "center", marginTop: 80 }}>
          <div>認証確認中…</div>
        </div>
      ) : authStatus === "timeout" ? (
        <div style={{ textAlign: "center", marginTop: 80 }}>
          <div style={{ color: 'red', marginBottom: 16 }}>認証ストレージの初期化に時間がかかっています。<br />リロードやPWAの再起動をお試しください。</div>
          <button onClick={() => window.location.reload()} style={{ padding: '8px 24px', fontSize: 16 }}>再読み込み</button>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
