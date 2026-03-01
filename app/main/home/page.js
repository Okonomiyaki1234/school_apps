"use client";
import HeaderSwitcher from "@/components/Header/HeaderSwitcher";
import Link from "next/link";

export default function SchoolHome() {
	return (
		<>
			<HeaderSwitcher />
			<div style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
				<h1 style={{ fontSize: 32, marginBottom: 24 }}>ホーム</h1>
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
								{/* 機能リンク＋画像のリスト（ブロック全体がリンク） */}
								<div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
									{/* マイページ */}
									<Link href="/main/my_page" style={{ textDecoration: "none" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
											<img src="https://placehold.jp/120x80.png" alt="マイページ" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
											<div>
												<div style={{ fontSize: 20, fontWeight: 600, color: '#1976d2', marginBottom: 6 }}>マイページ</div>
												<div style={{ fontSize: 15, color: '#444' }}>自分のプロフィールや設定を確認・編集できます</div>
											</div>
										</div>
									</Link>
									<Link href="/questions" style={{ textDecoration: "none" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
											<img src="https://placehold.jp/120x80.png" alt="匿名質問" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
											<div>
												<div style={{ fontSize: 20, fontWeight: 600, color: '#1976d2', marginBottom: 6 }}>匿名質問</div>
												<div style={{ fontSize: 15, color: '#444' }}>匿名で質問を投稿・閲覧できます</div>
											</div>
										</div>
									</Link>
									<Link href="/main/calendar" style={{ textDecoration: "none" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
											<img src="https://placehold.jp/120x80.png" alt="カレンダー" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
											<div>
												<div style={{ fontSize: 20, fontWeight: 600, color: '#1976d2', marginBottom: 6 }}>イベントカレンダー</div>
												<div style={{ fontSize: 15, color: '#444' }}>学校行事やイベントをカレンダーで確認できます</div>
											</div>
										</div>
									</Link>
									<a href="https://studio-delta-six-29.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
											<img src="https://placehold.jp/120x80.png" alt="アドバンス" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
											<div>
												<div style={{ fontSize: 20, fontWeight: 600, color: '#1976d2', marginBottom: 6 }}>淑徳アドバンス デジタルサイネージ</div>
												<div style={{ fontSize: 15, color: '#444' }}>淑徳アドバンスのサイネージが確認できます。</div>
											</div>
										</div>
									</a>
									<Link href="/main/cafeteria" style={{ textDecoration: "none" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
											<img src="https://placehold.jp/120x80.png" alt="食堂" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
											<div>
												<div style={{ fontSize: 20, fontWeight: 600, color: '#1976d2', marginBottom: 6 }}>食堂</div>
												<div style={{ fontSize: 15, color: '#444' }}>食堂のメニューを確認できます</div>
											</div>
										</div>
									</Link>
									<Link href="/main/exam_list" style={{ textDecoration: "none" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
											<img src="https://placehold.jp/120x80.png" alt="試験範囲" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
											<div>
												<div style={{ fontSize: 20, fontWeight: 600, color: '#1976d2', marginBottom: 6 }}>試験範囲</div>
												<div style={{ fontSize: 15, color: '#444' }}>試験範囲を確認できます</div>
											</div>
										</div>
									</Link>
									{/* Coming Soon... */}
									<div style={{ opacity: 0.6, pointerEvents: 'none' }}>
										<div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18 }}>
											<img src="https://placehold.jp/120x80.png?text=Coming+Soon" alt="Coming Soon" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
											<div>
												<div style={{ fontSize: 20, fontWeight: 600, color: '#888', marginBottom: 6 }}>Coming Soon...</div>
												<div style={{ fontSize: 15, color: '#888' }}>新しい機能を準備中です</div>
											</div>
										</div>
									</div>
									{/* ここに新しい機能を追加する場合は同じ構造で行を増やせばOK */}
								</div>
			</div>
		</>
	);
}
