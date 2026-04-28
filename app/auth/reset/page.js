"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/reset/new` : undefined,
        });
        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh", paddingTop: 56 }}>
            <h1 style={{ marginBottom: 32 }}>パスワードリセット</h1>
            {success ? (
                <div style={{ color: "#1976d2", fontSize: 18, textAlign: "center", maxWidth: 400 }}>
                    パスワードリセット用メールを送信しました。<br />
                    メール内のリンクから新しいパスワードを設定してください。
                </div>
            ) : (
                <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
                    <input
                        type="email"
                        placeholder="メールアドレス"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{ padding: 12, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ fontSize: 18, padding: "16px 32px", borderRadius: 8, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 2px 8px #eee" }}
                    >
                        {loading ? "送信中..." : "リセットメール送信"}
                    </button>
                    {error && <div style={{ color: "#d00", fontSize: 15 }}>{error}</div>}
                </form>
            )}
            {/* ログインページへのリンク */}
            <a href="/" style={{ marginTop: 32, textDecoration: "none" }}>
                <button type="button" style={{ fontSize: 18, padding: "16px 32px", borderRadius: 8, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 2px 8px #eee" }}>
                    ログインページへ戻る
                </button>
            </a>
            {/* 新規登録ページへのダミーリンク */}
            <a href="/auth/register" style={{ marginTop: 16, textDecoration: "none" }}>
                <button type="button" style={{ fontSize: 18, padding: "16px 32px", borderRadius: 8, background: "#fff", color: "#1976d2", border: "1px solid #1976d2", cursor: "pointer", boxShadow: "0 2px 8px #eee" }}>
                    新規登録ページへ
                </button>
            </a>
        </div>
    );
}
