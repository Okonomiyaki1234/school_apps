"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NewPasswordPage() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);
        // SupabaseのupdateUserでパスワードをリセット
        const { error } = await supabase.auth.updateUser({ password });
        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
            // 任意: 数秒後にログインページへリダイレクト
            setTimeout(() => {
                router.replace("/");
            }, 2000);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh", paddingTop: 56 }}>
            <h1 style={{ marginBottom: 32 }}>新しいパスワード設定</h1>
            {success ? (
                <div style={{ color: "#1976d2", fontSize: 18, textAlign: "center", maxWidth: 400 }}>
                    パスワードを変更しました。<br />
                    自動的にログインページへ移動します。
                </div>
            ) : (
                <form onSubmit={handleSetPassword} style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
                    <input
                        type="password"
                        placeholder="新しいパスワード"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        minLength={6}
                        style={{ padding: 12, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ fontSize: 18, padding: "16px 32px", borderRadius: 8, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 2px 8px #eee" }}
                    >
                        {loading ? "変更中..." : "パスワードを変更"}
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
        </div>
    );
}
