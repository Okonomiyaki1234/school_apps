"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext(null);

// 認証不要のパス
const PUBLIC_PATHS = ["/", "/auth/register"];

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
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
        new Promise((resolve) => setTimeout(() => resolve({ data: { session: null } }), timeoutMs)),
      ]);
    } catch (e) {
      return { data: { session: null } };
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
      const { data: { session } } = await getSessionWithTimeout();
      if (!isMounted) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      await fetchProfile(currentUser);
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
      if (!loading && !user && !PUBLIC_PATHS.includes(pathname)) {
        alert("正式なログインが必要です。");
        router.replace("/");
        return;
      }
      // roleがuserのときも強制サインアウト・リダイレクト
      if (!loading && user && profile?.role === "user" && !PUBLIC_PATHS.includes(pathname) && !didForceSignOut) {
        didForceSignOut = true;
        alert("組織側で登録されていないため、ログインできません。");
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        router.replace("/");
      }
    };
    forceSignOutIfUserRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, profile, pathname]);

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
        signOut,
        refreshProfile,
        getRoleLabel,
      }}
    >
      {/* 認証確認中UI改善例 */}
      {loading ? (
        <div style={{ textAlign: "center", marginTop: 80 }}>
          <div>認証確認中…</div>
          {error && <div style={{ color: 'red', marginTop: 16 }}>認証ストレージの初期化に失敗しました。<br />リロードやPWAの再起動をお試しください。</div>}
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
