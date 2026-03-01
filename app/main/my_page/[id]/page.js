"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import HeaderSwitcher from "@/components/Header/HeaderSwitcher";

const DEFAULT_ACHIEVEMENT_LIST = [
	"皆勤賞", "優秀賞", "部活リーダー", "生徒会", "ボランティア", "英検合格", "漢検合格"
];

export default function OtherUserPage({ params }) {
	const { id } = params;
	const [profile, setProfile] = useState({
		name: "",
		grade: "",
		class: "",
		description: "",
		achievement: [],
		achievement_list: DEFAULT_ACHIEVEMENT_LIST
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let isMounted = true;
		const fetchProfile = async () => {
			const { data, error } = await supabase
				.from("profiles")
				.select("name, grade, class, description, achievement, achievement_list")
				.eq("id", id)
				.single();
			if (!isMounted) return;
			if (data) {
				setProfile(prev => ({
					...prev,
					...data,
					achievement_list: Array.isArray(data.achievement_list) ? data.achievement_list : DEFAULT_ACHIEVEMENT_LIST
				}));
			} else {
				setError("ユーザー情報が見つかりません");
			}
			setLoading(false);
		};
		if (id) fetchProfile();
		return () => { isMounted = false; };
	}, [id]);

	if (loading) return <div>読み込み中...</div>;
	if (error) return <div style={{ color: "#d32f2f" }}>{error}</div>;

	return (
		<>
			<HeaderSwitcher />
			<div
				style={{
					margin: "56px auto 0",
					padding: 32,
					maxWidth: 1200,
					minHeight: "70vh",
					display: "flex",
					flexWrap: "wrap",
					gap: 32,
					background: "var(--background)",
					borderRadius: 24,
					boxShadow: "0 4px 32px #0002"
				}}
			>
				<div style={{ flex: "1 1 340px", minWidth: 320, background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px #1976d211", padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
					<h2 style={{ fontSize: 28, color: "#333", marginBottom: 18, textAlign: "center", letterSpacing: 1 }}>ユーザープロフィール</h2>
					<div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
						<div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 1px 6px #0001", padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
							<span style={{ fontWeight: 600, color: "#333", minWidth: 80 }}>名前</span>
							<span style={{ fontSize: 17 }}>{profile.name || <span style={{ color: '#aaa' }}>未登録</span>}</span>
						</div>
						<div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 1px 6px #0001", padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
							<span style={{ fontWeight: 600, color: "#333", minWidth: 80 }}>学年</span>
							<span style={{ fontSize: 17 }}>{profile.grade || <span style={{ color: '#aaa' }}>未登録</span>}</span>
						</div>
						<div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 1px 6px #0001", padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
							<span style={{ fontWeight: 600, color: "#333", minWidth: 80 }}>クラス</span>
							<span style={{ fontSize: 17 }}>{profile.class || <span style={{ color: '#aaa' }}>未登録</span>}</span>
						</div>
						<div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 1px 6px #0001", padding: 16, display: "flex", alignItems: "flex-start", gap: 12 }}>
							<span style={{ fontWeight: 600, color: "#333", minWidth: 80 }}>自己紹介</span>
							<span style={{ fontSize: 16, whiteSpace: "pre-line", color: profile.description ? "#444" : "#aaa" }}>{profile.description || "未登録"}</span>
						</div>
						<div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 1px 6px #0001", padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
							<span style={{ fontWeight: 600, color: "#333", minWidth: 80 }}>称号</span>
							<span style={{ fontSize: 16, color: Array.isArray(profile.achievement) && profile.achievement.length ? "#444" : "#aaa" }}>
								{Array.isArray(profile.achievement) && profile.achievement.length
									? profile.achievement.join(", ")
									: "未登録"}
							</span>
						</div>
					</div>
				</div>
				{/* 今後追加予定の要素はここに新しいdivを追加していけばOK */}
			</div>
		</>
	);
}
