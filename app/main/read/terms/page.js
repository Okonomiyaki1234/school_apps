"use client";
import React from "react";

export default function TermsOfService() {
	return (
		<div style={{ maxWidth: 800, margin: "48px auto 0 auto", padding: 32, background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px #e3e3e3", minHeight: 500 }}>
			<h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>利用規約（仮）</h1>
			<p style={{ marginBottom: 16 }}>
				本ポータルサイト（以下「本サービス」）は、淑徳中学・高等学校の生徒・教職員等の学校関係者向けに提供されています。ご利用にあたり、以下の規約に同意いただく必要があります。
			</p>
			<h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32 }}>1. 利用対象</h2>
			<p style={{ marginBottom: 16 }}>
				本サービスは、運営が認めた関係者のみが利用できます。無断での第三者利用は禁止します。
			</p>
			<h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32 }}>2. アカウント管理</h2>
			<ul style={{ marginLeft: 24, marginBottom: 16 }}>
				<li>登録情報（メールアドレス・氏名等）は正確に入力してください。</li>
				<li>パスワード等の管理は利用者自身の責任で行ってください。</li>
				<li>不正利用が判明した場合、アカウント停止等の措置を行う場合があります。</li>
			</ul>
			<h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32 }}>3. 禁止事項</h2>
			<ul style={{ marginLeft: 24, marginBottom: 16 }}>
				<li>他者へのなりすまし、不正アクセス、迷惑行為</li>
				<li>著作権・プライバシー等を侵害する投稿・アップロード</li>
				<li>広告・イベント等の虚偽申請や不正利用</li>
				<li>その他、運営が不適切と判断する行為</li>
			</ul>
			<h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32 }}>4. 免責事項</h2>
			<ul style={{ marginLeft: 24, marginBottom: 16 }}>
				<li>本サービスの内容・運用は予告なく変更・停止される場合があります。</li>
				<li>利用により生じた損害等について、学校及び運営者は一切の責任を負いません。</li>
			</ul>
			<h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32 }}>5. 規約の変更</h2>
			<p style={{ marginBottom: 16 }}>
				本規約は必要に応じて改定されることがあります。最新の内容は本ページでご確認ください。
			</p>
			<div style={{ color: '#888', fontSize: 13, marginTop: 40 }}>2026年3月 制定</div>
		</div>
	);
}
