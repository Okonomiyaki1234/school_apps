"use client";
import { useEffect, useState, useContext } from "react";
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
		<div style={{ maxWidth: 600, margin: "48px auto 0 auto", padding: 16 }}>
			<h1>部活・委員会一覧</h1>
			{isAdmin && (
				<button onClick={handleCreate} style={{ marginBottom: 16 }}>
					＋ 新しい部活/委員会を作成
				</button>
			)}
			<ul style={{ listStyle: "none", padding: 0 }}>
				{clubs.map((club) => (
					<li key={club.id} style={{ marginBottom: 16, border: "1px solid #ccc", borderRadius: 8, padding: 12 }}>
						<Link href={`/main/clubs/${club.id}`}>{club.name}</Link>
						<div style={{ color: '#666', fontSize: 14 }}>{club.description}</div>
						{isAdmin && (
							<div style={{ marginTop: 8 }}>
								<button onClick={() => handleEdit(club.id)} style={{ marginRight: 8 }}>編集</button>
								<button onClick={() => handleDelete(club.id)} style={{ color: 'red' }}>削除</button>
							</div>
						)}
					</li>
				))}
			</ul>
			{clubs.length === 0 && <div>部活・委員会が登録されていません。</div>}
		</div>
	);
}
