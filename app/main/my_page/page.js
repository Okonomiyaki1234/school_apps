"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import HeaderSwitcher from "@/components/Header/HeaderSwitcher";

const DEFAULT_ACHIEVEMENT_LIST = [
	"皆勤賞", "優秀賞", "部活リーダー", "生徒会", "ボランティア", "英検合格", "漢検合格"
];

const GRADE_OPTIONS = [
	"中学1年生", "中学2年生", "中学3年生",
	"高校1年生", "高校2年生", "高校3年生",
	"卒業生", "その他"
];

export default function MyPage() {
	const [user, setUser] = useState(null);
	const [profile, setProfile] = useState({
		name: "",
		grade: "",
		gradeOther: "",
		class: "",
		description: "",
		achievement: [],
		achievement_list: DEFAULT_ACHIEVEMENT_LIST
	});
	const [inputError, setInputError] = useState("");
	const [loading, setLoading] = useState(true);
	const [editMode, setEditMode] = useState(false);
	const [message, setMessage] = useState("");

	// 認証ユーザー取得
	useEffect(() => {
		let isMounted = true;
		const fetchProfile = async () => {
			const { data: { session } } = await supabase.auth.getSession();
			if (!isMounted) return;
			setUser(session?.user ?? null);
			if (session?.user) {
				const { data, error } = await supabase
					.from("profiles")
					.select("name, grade, class, description, achievement, achievement_list")
					.eq("id", session.user.id)
					.single();
				if (data) {
					setProfile(prev => ({
						...prev,
						...data,
						achievement_list: Array.isArray(data.achievement_list) ? data.achievement_list : DEFAULT_ACHIEVEMENT_LIST
					}));
				}
			}
			setLoading(false);
		};
		fetchProfile();
		return () => { isMounted = false; };
	}, []);

	// 記号禁止バリデーション
	const symbolRegex = /[!-/:-@\[-`{-~]/;
	const handleChange = e => {
		const { name, value } = e.target;
		if (symbolRegex.test(value)) {
			setInputError("記号は使用できません");
			return;
		}
		setInputError("");
		setProfile(prev => ({ ...prev, [name]: value }));
	};
	// achievement複数選択
	const handleAchievementChange = e => {
		const options = e.target.options;
		const selected = [];
		for (let i = 0; i < options.length; i++) {
			if (options[i].selected) selected.push(options[i].value);
		}
		setProfile(prev => ({ ...prev, achievement: selected }));
	};

	// 学年選択変更
	const handleGradeChange = e => {
		const value = e.target.value;
		setProfile(prev => ({ ...prev, grade: value, gradeOther: "" }));
	};

	// 更新処理
	const handleSubmit = async e => {
		e.preventDefault();
		// 入力バリデーション
		if (symbolRegex.test(profile.name) || symbolRegex.test(profile.class) || symbolRegex.test(profile.description) || symbolRegex.test(profile.gradeOther)) {
			setInputError("記号は使用できません");
			return;
		}
		setInputError("");
		setLoading(true);
		let gradeValue = profile.grade === "その他" ? profile.gradeOther : profile.grade;
		const { error } = await supabase
			.from("profiles")
			.update({
				name: profile.name,
				grade: gradeValue,
				class: profile.class,
				description: profile.description,
				achievement: profile.achievement
			})
			.eq("id", user.id);
		setLoading(false);
		setEditMode(false);
		setMessage(error ? "更新失敗" : "更新しました");
	};

	if (loading) return <div>読み込み中...</div>;
	if (!user) return <div>ログインしてください</div>;

	return (
		<>
			<HeaderSwitcher />
			<div style={{ maxWidth: 520, margin: "56px auto 0", padding: 32, background: "#f7faff", borderRadius: 16, boxShadow: "0 4px 24px #0002" }}>
				<h2 style={{ fontSize: 28, color: "#1976d2", marginBottom: 18, textAlign: "center", letterSpacing: 1 }}>マイページ</h2>
				{message && <div style={{ color: message === "更新失敗" ? "#d32f2f" : "#388e3c", fontWeight: 600, marginBottom: 12, textAlign: "center" }}>{message}</div>}
				{!editMode ? (
					<div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
						<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
							<span style={{ fontWeight: 600, color: "#333", minWidth: 80 }}>名前</span>
							<span style={{ fontSize: 17 }}>{profile.name || <span style={{ color: '#aaa' }}>未登録</span>}</span>
						</div>
						<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
							<span style={{ fontWeight: 600, color: "#333", minWidth: 80 }}>学年</span>
							<span style={{ fontSize: 17 }}>{profile.grade || <span style={{ color: '#aaa' }}>未登録</span>}</span>
						</div>
						<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
							<span style={{ fontWeight: 600, color: "#333", minWidth: 80 }}>クラス</span>
							<span style={{ fontSize: 17 }}>{profile.class || <span style={{ color: '#aaa' }}>未登録</span>}</span>
						</div>
						<div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
							<span style={{ fontWeight: 600, color: "#333", minWidth: 80 }}>自己紹介</span>
							<span style={{ fontSize: 16, whiteSpace: "pre-line", color: profile.description ? "#444" : "#aaa" }}>{profile.description || "未登録"}</span>
						</div>
						<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
							<span style={{ fontWeight: 600, color: "#333", minWidth: 80 }}>称号</span>
							<span style={{ fontSize: 16, color: Array.isArray(profile.achievement) && profile.achievement.length ? "#444" : "#aaa" }}>
								{Array.isArray(profile.achievement) && profile.achievement.length
									? profile.achievement.join(", ")
									: "未登録"}
							</span>
						</div>
						<button onClick={() => setEditMode(true)} style={{ marginTop: 18, padding: "10px 32px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: "pointer", boxShadow: "0 2px 8px #1976d222", transition: "background 0.2s" }}>編集</button>
					</div>
				) : (
					<form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
						{inputError && <div style={{ color: "#d32f2f", fontWeight: 600, marginBottom: 4 }}>{inputError}</div>}
						<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
							<label style={{ fontWeight: 600, color: "#1976d2" }}>名前</label>
							<input name="name" value={profile.name} onChange={handleChange} style={{ padding: "8px 12px", fontSize: 16, borderRadius: 6, border: "1px solid #bcd" }} autoComplete="off" />
						</div>
						<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
							<label style={{ fontWeight: 600, color: "#1976d2" }}>学年</label>
							<select name="grade" value={profile.grade} onChange={handleGradeChange} style={{ padding: "8px 12px", fontSize: 16, borderRadius: 6, border: "1px solid #bcd", background: "#fff" }}>
								<option value="">選択してください</option>
								{GRADE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
							</select>
							{profile.grade === "その他" && (
								<input name="gradeOther" value={profile.gradeOther} onChange={handleChange} placeholder="学年を入力" style={{ marginTop: 6, padding: "8px 12px", fontSize: 15, borderRadius: 6, border: "1px solid #bcd" }} autoComplete="off" />
							)}
						</div>
						<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
							<label style={{ fontWeight: 600, color: "#1976d2" }}>クラス</label>
							<input name="class" value={profile.class} onChange={handleChange} style={{ padding: "8px 12px", fontSize: 16, borderRadius: 6, border: "1px solid #bcd" }} autoComplete="off" />
						</div>
						<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
							<label style={{ fontWeight: 600, color: "#1976d2" }}>自己紹介</label>
							<textarea name="description" value={profile.description} onChange={handleChange} rows={3} style={{ padding: "8px 12px", fontSize: 15, borderRadius: 6, border: "1px solid #bcd", resize: "vertical" }} autoComplete="off" />
						</div>
						<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
							<label style={{ fontWeight: 600, color: "#1976d2" }}>称号（複数選択可）</label>
							<select
								multiple
								name="achievement"
								value={Array.isArray(profile.achievement) ? profile.achievement : []}
								onChange={handleAchievementChange}
								style={{ minWidth: 200, padding: "8px 12px", fontSize: 15, borderRadius: 6, border: "1px solid #bcd", background: "#fff" }}
							>
								{Array.isArray(profile.achievement_list)
									? profile.achievement_list.map(a => <option key={a} value={a}>{a}</option>)
									: DEFAULT_ACHIEVEMENT_LIST.map(a => <option key={a} value={a}>{a}</option>)}
							</select>
						</div>
						<div style={{ display: "flex", gap: 16, marginTop: 8 }}>
							<button type="submit" style={{ flex: 1, padding: "10px 0", background: "#1976d2", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: "pointer", boxShadow: "0 2px 8px #1976d222", transition: "background 0.2s" }}>保存</button>
							<button type="button" onClick={() => setEditMode(false)} style={{ flex: 1, padding: "10px 0", background: "#eee", color: "#1976d2", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: "pointer", boxShadow: "0 2px 8px #eee" }}>キャンセル</button>
						</div>
					</form>
				)}
			</div>
		</>
	);
}
