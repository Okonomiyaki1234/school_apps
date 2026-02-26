
"use client";
import Header from "@/components/Header";
import Link from "next/link";

export default function SchoolHome() {
	return (
		<>
			<Header />
			<div style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
				<h1 style={{ fontSize: 32, marginBottom: 24 }}>学校ホーム（機能ハブ）</h1>
				<div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 40 }}>
					{/* ダミー画像エリア */}
					<div style={{ width: 260, height: 180, background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, boxShadow: "0 2px 8px #eee" }}>
						<span style={{ color: "#888", fontSize: 18 }}>ここに画像が入ります</span>
					</div>
					{/* 情報エリア例 */}
					<div style={{ flex: 1, minWidth: 260 }}>
						<h2 style={{ fontSize: 22, marginBottom: 12 }}>お知らせ</h2>
						<ul style={{ paddingLeft: 20, color: "#444" }}>
							<li>イベントカレンダーが利用できます</li>
							<li>新機能は順次追加予定です</li>
						</ul>
					</div>
				</div>
				<div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
					{/* 各機能へのリンク例 */}
					<Link href="/main/calender" style={{ textDecoration: "none" }}>
						<button style={{ fontSize: 18, padding: "18px 36px", borderRadius: 8, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 2px 8px #eee" }}>
							イベントカレンダー
						</button>
					</Link>
					<Link href="#" style={{ textDecoration: "none" }}>
						<button style={{ fontSize: 18, padding: "18px 36px", borderRadius: 8, background: "#888", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 2px 8px #eee" }} disabled>
							Coming Soon...
						</button>
					</Link>
				</div>
			</div>
		</>
	);
}
