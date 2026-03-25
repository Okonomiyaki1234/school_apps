"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AdBanner from "@/components/AdBanner";

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
				{/* 上部広告スペース */}
				<div style={{ maxWidth: 900, margin: "32px auto 0 auto", padding: 0 }}>
					<AdBanner type="horizontal" />
				</div>
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
										 <Link href="/main/clubs" style={{ textDecoration: "none" }}>
											 <div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
												 <img src="https://placehold.jp/120x80.png" alt="部活・委員会" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
												 <div>
													 <div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>部活・委員会</div>
													 <div style={{ fontSize: 15, color: '#444' }}>部活・委員会の情報を確認できます</div>
												 </div>
											 </div>
										 </Link>
										 <Link href="/main/tools" style={{ textDecoration: "none" }}>
											 <div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
												 <img src="https://placehold.jp/120x80.png" alt="便利ツール" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
												 <div>
													 <div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>ツール</div>
													 <div style={{ fontSize: 15, color: '#444' }}>便利なツールが集合しています</div>
												 </div>
											 </div>
										 </Link>
										 <Link href="/main/tutorial" style={{ textDecoration: "none" }}>
											 <div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
												 <img src="https://placehold.jp/120x80.png" alt="チュートリアル" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
												 <div>
													 <div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>チュートリアル</div>
													 <div style={{ fontSize: 15, color: '#444' }}>チュートリアルを確認できます</div>
												 </div>
											 </div>
										 </Link>
					 </div>
					 {/* 下部広告スペース（機能リンク群の直下に移動） */}
					 <div style={{ maxWidth: 900, margin: "0 auto 32px auto", padding: 0 }}>
						 <AdBanner type="horizontal" />
					 </div>
				  </div>
			  </>
		  );
}
