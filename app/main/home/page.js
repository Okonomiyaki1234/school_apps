"use client";
import HeaderSwitcher from "@/components/Header/HeaderSwitcher";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function SchoolHome() {
	const [notices, setNotices] = useState([]);
	useEffect(() => {
		(async () => {
			const { data, error } = await supabase
				.from("notice")
				.select("*")
				.order("created_at", { ascending: false });
			if (!error && Array.isArray(data)) {
				setNotices(data.slice(0, 3));
			}
		})();
	}, []);

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
					{/* 情報エリア：最新のお知らせ3件 */}
					<div style={{ flex: 1, minWidth: 260 }}>
						<h2 style={{ fontSize: 22, marginBottom: 12 }}>最新のお知らせ</h2>
						<ul style={{ paddingLeft: 20, color: "#444", marginBottom: 12 }}>
							{notices.length === 0 ? (
								<li style={{ color: '#aaa' }}>お知らせはありません</li>
							) : (
								notices.map(n => (
									<li key={n.id} style={{ marginBottom: 8 }}>
										<span style={{ fontWeight: 600 }}>{n.title}</span>
										<span style={{ color: '#888', fontSize: 13, marginLeft: 8 }}>{new Date(n.created_at).toLocaleDateString()}</span>
										<div style={{ fontSize: 15, color: '#444', marginTop: 2 }}>{n.content}</div>
									</li>
								))
							)}
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
												<div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>マイページ</div>
												<div style={{ fontSize: 15, color: '#444' }}>自分のプロフィールや設定を確認・編集できます</div>
											</div>
										</div>
									</Link>
									<Link href="/main/notice" style={{ textDecoration: "none" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
											<img src="https://placehold.jp/120x80.png" alt="お知らせ" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
											<div>
												<div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>お知らせ</div>
												<div style={{ fontSize: 15, color: '#444' }}>最新のお知らせを確認できます</div>
											</div>
										</div>
									</Link>
									<Link href="/main/task" style={{ textDecoration: "none" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
											<img src="https://placehold.jp/120x80.png" alt="課題" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
											<div>
												<div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>課題</div>
												<div style={{ fontSize: 15, color: '#444' }}>課題を確認できます</div>
											</div>
										</div>
									</Link>
									<Link href="/main/achievement" style={{ textDecoration: "none" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
											<img src="https://placehold.jp/120x80.png" alt="称号" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
											<div>
												<div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>実績</div>
												<div style={{ fontSize: 15, color: '#444' }}>称号を確認できます</div>
											</div>
										</div>
									</Link>
									<Link href="/main/question" style={{ textDecoration: "none" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
											<img src="https://placehold.jp/120x80.png" alt="匿名質問" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
											<div>
												<div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>匿名質問</div>
												<div style={{ fontSize: 15, color: '#444' }}>匿名で質問を投稿・閲覧できます</div>
											</div>
										</div>
									</Link>
									<Link href="/main/calendar" style={{ textDecoration: "none" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
											<img src="https://placehold.jp/120x80.png" alt="カレンダー" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
											<div>
												<div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>イベントカレンダー</div>
												<div style={{ fontSize: 15, color: '#444' }}>学校行事やイベントをカレンダーで確認できます</div>
											</div>
										</div>
									</Link>
									<a href="https://studio-delta-six-29.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
											<img src="https://placehold.jp/120x80.png" alt="アドバンス" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
											<div>
												<div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>淑徳アドバンス デジタルサイネージ</div>
												<div style={{ fontSize: 15, color: '#444' }}>淑徳アドバンスのサイネージが確認できます。</div>
											</div>
										</div>
									</a>
									<Link href="/main/cafeteria" style={{ textDecoration: "none" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
											<img src="https://placehold.jp/120x80.png" alt="食堂" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
											<div>
												<div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>食堂</div>
												<div style={{ fontSize: 15, color: '#444' }}>食堂のメニューを確認できます</div>
											</div>
										</div>
									</Link>
									<Link href="/main/exam_list" style={{ textDecoration: "none" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
											<img src="https://placehold.jp/120x80.png" alt="試験範囲" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
											<div>
												<div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>試験範囲</div>
												<div style={{ fontSize: 15, color: '#444' }}>試験範囲を確認できます</div>
											</div>
										</div>
									</Link>
									<a href="https://attendance-register-by-watashimori-kohl.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
											<img src="https://placehold.jp/120x80.png" alt="出欠登録サイト(同製作者による外部サイト)" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
											<div>
												<div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>出欠登録サイト</div>
												<div style={{ fontSize: 15, color: '#444' }}>出欠登録を行うことができます。※同製作者による外部サイトです。</div>
											</div>
										</div>
									</a>
									<Link href="/main/tutorial" style={{ textDecoration: "none" }}>
										<div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
											<img src="https://placehold.jp/120x80.png" alt="チュートリアル" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
											<div>
												<div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>チュートリアル</div>
												<div style={{ fontSize: 15, color: '#444' }}>チュートリアルを確認できます</div>
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
			<Footer/>
		</>
	);
}
