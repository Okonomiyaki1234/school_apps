
"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading: authLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const reason = searchParams.get("reason");

    // AuthContext がログイン済みを検知したらホームへ遷移
    if (authLoading) {
        return null;
    }
    if (user) {
        router.replace("/main/home");
        return null;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
            setLoading(false);
            setError(signInError.message);
            return;
        }
        // ログイン成功時、roleを取得して判定
        if (data && data.session && data.session.user) {
            const userId = data.session.user.id;
            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", userId)
                .single();
            if (profileError) {
                setLoading(false);
                setError("ユーザー情報の取得に失敗しました");
                return;
            }
            if (profile?.role === "user") {
                setError("組織側で登録されていないため、ログインできません。");
                await supabase.auth.signOut();
                setLoading(false);
                return;
            }
            // 称号判定ロジック呼び出し
            try {
                const { handleLoginAchievement } = await import("@/lib/achievement");
                await handleLoginAchievement(userId);
            } catch (e) {
                console.error("称号判定ロジックの呼び出しに失敗", e);
            }
        }
        setLoading(false);
        // 成功時はAuthContextのonAuthStateChangeで遷移
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh", paddingTop: 56 }}>
            <h1 style={{ marginBottom: 32 }}>ログイン</h1>
            {reason === "auth" && (
                <div style={{ color: "#d00", fontSize: 16, marginBottom: 16 }}>
                    ログインが必要です。ログイン状態でこのメッセージが表示される場合、組織側で登録されていない可能性があります。管理者にお問い合わせください。
                </div>
            )}
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
                <input
                    type="email"
                    placeholder="メールアドレス"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{ padding: 12, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
                />
                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ padding: 12, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{ fontSize: 18, padding: "16px 32px", borderRadius: 8, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 2px 8px #eee" }}
                >
                    {loading ? "ログイン中..." : "ログイン"}
                </button>
                {error && <div style={{ color: "#d00", fontSize: 15 }}>{error}</div>}
            </form>
            {/* Googleログインボタン */}
            <button
                onClick={async () => {
                    setLoading(true);
                    setError("");
                    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
                    if (error) setError(error.message);
                    setLoading(false);
                }}
                disabled={loading}
                style={{ marginTop: 24, fontSize: 18, padding: "16px 32px", borderRadius: 8, background: "#fff", color: "#1976d2", border: "1px solid #1976d2", cursor: "pointer", boxShadow: "0 2px 8px #eee", display: "flex", alignItems: "center", gap: 8 }}
            >
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" style={{ width: 24, height: 24 }} />
                Googleでログイン
            </button>
            {/* 新規登録ページへ遷移するボタン */}
            <Link href="/auth/register" style={{ marginTop: 32, textDecoration: "none" }}>
                <button type="button" style={{ fontSize: 18, padding: "16px 32px", borderRadius: 8, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 2px 8px #eee" }}>
                    新規登録ページへ
                </button>
            </Link>
        </div>
    );
}