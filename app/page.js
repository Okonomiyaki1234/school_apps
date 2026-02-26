
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!isMounted) return;

                if (session) {
                    router.replace("/main/home");
                } else {
                    setChecking(false);
                }
            } finally {
                if (isMounted) {
                    setChecking(false);
                }
            }
        };
        checkSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                router.replace("/main/home");
            } else {
                setChecking(false);
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) {
            setError(error.message);
        }
        // 成功時はonAuthStateChangeで遷移
    };

    if (checking) {
        return null; // ローディング画面を出したい場合はここで表示
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh", paddingTop: 56 }}>
            <h1 style={{ marginBottom: 32 }}>ログイン</h1>
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
            {/* 新規登録ページへ遷移するボタン */}
            <a href="/auth/register" style={{ marginTop: 32, textDecoration: "none" }}>
                <button style={{ fontSize: 18, padding: "16px 32px", borderRadius: 8, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 2px 8px #eee" }}>
                    新規登録ページへ
                </button>
            </a>
        </div>
    );
}