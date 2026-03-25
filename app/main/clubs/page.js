"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";

export default function ClubsPage() {
	const [clubs, setClubs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { user, profile } = useAuth();
	const isAdmin = profile?.role === "admin";
	const router = useRouter();

	useEffect(() => {
		const fetchClubs = async () => {
			setLoading(true);
			const { data, error } = await supabase.from("clubs").select("*");
			if (error) {
				setError(error.message);
			} else {
				setClubs(data);
			}
			setLoading(false);
		};
		fetchClubs();
	}, []);

	const handleCreate = () => {
		router.push("/main/clubs/new");
	};

	const handleEdit = (id) => {
		router.push(`/main/clubs/${id}/edit`);
	};

	const handleDelete = async (id) => {
		if (!confirm("本当に削除しますか？")) return;
		const { error } = await supabase.from("clubs").delete().eq("id", id);
		if (error) {
			alert("削除に失敗しました: " + error.message);
		} else {
			setClubs(clubs.filter((club) => club.id !== id));
		}
	};

	if (loading) return <div>読み込み中...</div>;
	if (error) return <div>エラー: {error}</div>;

			return (
				<div style={{ maxWidth: 700, margin: "48px auto 0 auto", padding: 24, background: "#f7faff", borderRadius: 16, boxShadow: "0 2px 12px #e3e3e3" }}>
					<div style={{ marginBottom: 24 }}>
						<Link href="/main/clubs/public" style={{ color: '#1976d2', marginRight: 16 }}>公開一覧ページを見る</Link>
						<Link href="/" style={{ color: '#1976d2' }}>ホームに戻る</Link>
					</div>
					<h1 style={{ fontSize: 28, marginBottom: 24, fontWeight: 700, letterSpacing: 1 }}>部活・委員会一覧</h1>
					{isAdmin && (
						<div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
							<Link href="/main/clubs/new" style={{ padding: '10px 24px', borderRadius: 8, background: '#1976d2', color: '#fff', fontWeight: 600, textDecoration: 'none', fontSize: 16 }}>＋ 新しい部活/委員会を作成</Link>
							<Link href="/main/clubs/image_upload" style={{ padding: '10px 24px', borderRadius: 8, background: '#388e3c', color: '#fff', fontWeight: 600, textDecoration: 'none', fontSize: 16 }}>画像アップロード</Link>
						</div>
					)}
					<div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
					{clubs.map((club) => {
						// タイトルブロック（複数ある場合は先頭のみ表示）
						let titleBlock = null;
						let titleCount = 0;
						if (Array.isArray(club.content)) {
							const allTitles = club.content.filter(b => b.type === "title" && b.value);
							titleBlock = allTitles.length > 0 ? allTitles[0] : null;
							titleCount = allTitles.length;
						}
						const thumbBlock = Array.isArray(club.content) ? club.content.find(b => b.type === "image" && b.value) : null;
						return (
							<Link key={club.id} href={`/main/clubs/${club.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
								<div style={{ border: "1px solid #b0bec5", borderRadius: 12, padding: 20, background: '#fff', boxShadow: '0 1px 4px #e0e0e0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'box-shadow 0.2s', marginBottom: 0 }}>
									{thumbBlock && (
										<img src={thumbBlock.value} alt="サムネイル" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8, boxShadow: '0 1px 4px #e0e0e0' }} />
									)}
									<div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4, color: '#1976d2', textAlign: 'center' }}>
										{titleBlock ? titleBlock.value : "タイトル未設定"}
									</div>
									{titleCount > 1 && (
										<div style={{ color: '#1976d2', fontSize: 13, marginBottom: 4, textAlign: 'center' }}>
											※ タイトルブロックが複数ある場合、先頭のものが表示されます
										</div>
									)}
									{isAdmin && (
										<div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
											<button onClick={e => { e.preventDefault(); handleEdit(club.id); }} style={{ padding: '6px 18px', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', fontSize: 15 }}>編集</button>
											<button onClick={e => { e.preventDefault(); handleDelete(club.id); }} style={{ padding: '6px 18px', borderRadius: 6, background: '#d32f2f', color: '#fff', border: 'none', fontSize: 15 }}>削除</button>
										</div>
									)}
								</div>
							</Link>
						);
					})}
					{clubs.length === 0 && <div style={{ color: '#888', fontSize: 16, textAlign: 'center', marginTop: 32 }}>部活・委員会が登録されていません。</div>}
				</div>
			</div>
		);
}
