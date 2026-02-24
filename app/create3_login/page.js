
"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) {
            setError(error.message);
        } else {
            router.push("/");
        }
    };

    return (
        <>
            <Header />
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
                <Link href="/" style={{ marginTop: 32 }}>
                    <button style={{ fontSize: 18, padding: "16px 32px", borderRadius: 8, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 2px 8px #eee" }}>
                        ホームへ戻る
                    </button>
                </Link>
            </div>
        </>
    );
}