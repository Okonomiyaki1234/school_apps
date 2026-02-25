
"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleRegister = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess(false);
		const { error } = await supabase.auth.signUp({ email, password });
		setLoading(false);
		if (error) {
			setError(error.message);
		} else {
			setSuccess(true);
		}
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh", paddingTop: 56 }}>
			<h1 style={{ marginBottom: 32 }}>新規登録</h1>
			{success ? (
				<div style={{ color: "#1976d2", fontSize: 18, textAlign: "center", maxWidth: 400 }}>
					登録用メールを送信しました。<br />
					メール内のリンクから認証を完了してください。
				</div>
			) : (
				<form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
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
						{loading ? "登録中..." : "登録"}
					</button>
					{error && <div style={{ color: "#d00", fontSize: 15 }}>{error}</div>}
				</form>
			)}
			{/* app/page.js（ログインページ）へ戻るボタン */}
			<a href="/" style={{ marginTop: 32, textDecoration: "none" }}>
				<button style={{ fontSize: 18, padding: "16px 32px", borderRadius: 8, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 2px 8px #eee" }}>
					ログインページへ戻る
				</button>
			</a>
		</div>
	);
}