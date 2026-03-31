"use client";
import React from "react";

export default function CreditsPage() {
	return (
		<div style={{ maxWidth: 800, margin: "48px auto 0 auto", padding: 32, background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px #e3e3e3", minHeight: 400 }}>
			<h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>クレジット（仮）</h1>
			<p style={{ marginBottom: 20 }}>
				本サービスの制作・運用・素材等にご協力いただいた方々・サービスを記載します。
			</p>
			<h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32 }}>ユーザーアイコンイラスト</h2>
			<ul style={{ marginLeft: 24, marginBottom: 16 }}>
				<li>
					イラスト作成：
					<a
						href=""
						target="_blank"
						rel="noopener noreferrer"
						style={{ fontWeight: 600, color: "#1976d2", textDecoration: "underline" }}
					>
						Misa（仮）
					</a>
				</li>
			</ul>
			<h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32 }}>運営・開発</h2>
			<ul style={{ marginLeft: 24, marginBottom: 16 }}>
                <li>
					全部：
					<a
						href=""
						target="_blank"
						rel="noopener noreferrer"
						style={{ fontWeight: 600, color: "#1976d2", textDecoration: "underline" }}
					>
						渡し守
					</a>
				</li>
			</ul>
			<div style={{ color: '#888', fontSize: 13, marginTop: 40 }}>2026年3月31日 制定</div>
		</div>
	);
}
