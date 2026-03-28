
"use client";
import React from "react";

export default function PrivacyPolicy() {
	return (
		<div style={{ maxWidth: 800, margin: "48px auto 0 auto", padding: 32, background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px #e3e3e3", minHeight: 500 }}>
			<h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>プライバシーポリシー（仮）</h1>
			<p style={{ marginBottom: 16 }}>
				本ポータルサイト（以下「本サービス」）は、淑徳中学・高等学校の生徒・教職員等の学校関係者向けに提供されています。本サービスでは、以下の方針で個人情報を取り扱います。
			</p>
			<h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32 }}>1. 取得する情報</h2>
			<ul style={{ marginLeft: 24, marginBottom: 16 }}>
				<li>メールアドレス、氏名、学年・クラス等のプロフィール情報</li>
				<li>広告申請・質問投稿・クラブ活動等の利用履歴</li>
				<li>アップロードされた画像・ファイル等</li>
				<li>サービス利用時のアクセスログ（不正利用防止・運用改善目的）</li>
			</ul>
			<h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32 }}>2. 利用目的</h2>
			<ul style={{ marginLeft: 24, marginBottom: 16 }}>
				<li>本サービスの提供・運用・本人確認</li>
				<li>お知らせ・連絡・メンテナンス等の通知</li>
				<li>不正利用防止・セキュリティ向上</li>
				<li>広告・イベント等の管理・運営</li>
			</ul>
			<h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32 }}>3. 第三者提供・外部サービス</h2>
			<ul style={{ marginLeft: 24, marginBottom: 16 }}>
				<li>本サービスはクラウドサービス上で運用され、データは安全に管理されます。</li>
				<li>法令に基づく場合や、本人の同意がある場合を除き、第三者に個人情報を提供しません。</li>
			</ul>
			<h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32 }}>4. 安全管理</h2>
			<p style={{ marginBottom: 16 }}>
				個人情報の漏洩・滅失・毀損防止のため、適切な安全管理措置を講じます。
			</p>
			<h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 32 }}>5. お問い合わせ</h2>
			<p style={{ marginBottom: 16 }}>
				プライバシーに関するご質問・ご相談は、学校運営または担当教員までご連絡ください。
			</p>
			<div style={{ color: '#888', fontSize: 13, marginTop: 40 }}>2026年3月 制定</div>
		</div>
	);
}
