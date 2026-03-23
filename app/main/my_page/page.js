"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import HeaderSwitcher from "@/components/Header/HeaderSwitcher";
import Footer from "@/components/Footer";
import { iconList } from "@/lib/iconList";

const DEFAULT_ACHIEVEMENT_LIST = [
	"皆勤賞", "優秀賞", "部活リーダー", "生徒会", "ボランティア", "英検合格", "漢検合格"
];
const DEFAULT_ICON = iconList[0];

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
		achievement_list: DEFAULT_ACHIEVEMENT_LIST,
		icon: DEFAULT_ICON
	});
	const JUNIOR_CLASSES = ["A", "B", "C", "D", "E"];
	const HIGH_CLASSES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
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
					.select("name, grade, class, description, achievement, achievement_list, icon")
					.eq("id", session.user.id)
					.single();
				if (data) {
					setProfile(prev => ({
						...prev,
						...data,
						achievement_list: Array.isArray(data.achievement_list) ? data.achievement_list : DEFAULT_ACHIEVEMENT_LIST,
						icon: data.icon || DEFAULT_ICON
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
		// 卒業生・その他の場合はclassを自動で"なし"に
		if (name === "gradeOther" && (profile.grade === "卒業生" || profile.grade === "その他")) {
			setProfile(prev => ({ ...prev, [name]: value, class: "なし" }));
		} else {
			setProfile(prev => ({ ...prev, [name]: value }));
		}
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
		let classValue = "";
		if (value === "卒業生" || value === "その他") {
			classValue = "なし";
		}
		setProfile(prev => ({ ...prev, grade: value, gradeOther: "", class: classValue }));
	};

	// アイコン選択
	const handleIconChange = e => {
		setProfile(prev => ({ ...prev, icon: e.target.value }));
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
		let classValue = profile.class;
		if (profile.grade === "卒業生" || profile.grade === "その他") {
			classValue = "なし";
		}
		const { error } = await supabase
			.from("profiles")
			.update({
				name: profile.name,
				grade: gradeValue,
				class: classValue,
				description: profile.description,
				achievement: profile.achievement,
				icon: profile.icon
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
				<div style={{ flex: "1 1 340px", minWidth: 320, background: "#ffffff", borderRadius: 16, boxShadow: "0 2px 12px #1976d211", padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
					<h2 style={{ fontSize: 28, color: "#333", marginBottom: 18, textAlign: "center", letterSpacing: 1 }}>マイページ</h2>
					{message && <div style={{ color: message === "更新失敗" ? "#d32f2f" : "#388e3c", fontWeight: 600, marginBottom: 12, textAlign: "center" }}>{message}</div>}
					{!editMode ? (
						<div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
							{/* アイコンを大きく中央に表示 */}
							<div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
								<img
									src={profile.icon}
									alt="icon"
									style={{
										width: 96,
										height: 96,
										borderRadius: "50%",
										border: "2px solid #bcd",
										objectFit: "cover",
										boxShadow: "0 2px 16px #1976d233"
									}}
								/>
							</div>
							{/* 名前 */}
							<div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 1px 6px #0001", padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
								<span style={{ fontWeight: 600, color: "#333", minWidth: 80 }}>名前</span>
								<span style={{ fontSize: 17 }}>{profile.name || <span style={{ color: '#aaa' }}>未登録</span>}</span>
							</div>
							{/* 学年 */}
							<div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 1px 6px #0001", padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
								<span style={{ fontWeight: 600, color: "#333", minWidth: 80 }}>学年</span>
								<span style={{ fontSize: 17 }}>{profile.grade || <span style={{ color: '#aaa' }}>未登録</span>}</span>
							</div>
							{/* クラス */}
							<div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 1px 6px #0001", padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
								<span style={{ fontWeight: 600, color: "#333", minWidth: 80 }}>クラス</span>
								<span style={{ fontSize: 17 }}>{profile.class || <span style={{ color: '#aaa' }}>未登録</span>}</span>
							</div>
							{/* 自己紹介 */}
							<div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 1px 6px #0001", padding: 16, display: "flex", alignItems: "flex-start", gap: 12 }}>
								<span style={{ fontWeight: 600, color: "#333", minWidth: 80 }}>自己紹介</span>
								<span style={{ fontSize: 16, whiteSpace: "pre-line", color: profile.description ? "#444" : "#aaa" }}>{profile.description || "未登録"}</span>
							</div>
							{/* 称号 */}
							<div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 1px 6px #0001", padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
								<span style={{ fontWeight: 600, color: "#333", minWidth: 80 }}>称号</span>
								<span style={{ fontSize: 16, color: Array.isArray(profile.achievement) && profile.achievement.length ? "#444" : "#aaa" }}>
									{Array.isArray(profile.achievement) && profile.achievement.length
										? profile.achievement.join(", ")
										: "未登録"}
								</span>
							</div>
							<button onClick={() => setEditMode(true)} style={{ marginTop: 18, padding: "10px 32px", background: "#333", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: "pointer", boxShadow: "0 2px 8px #1976d222", transition: "background 0.2s" }}>編集</button>
						</div>
					) : (
						<form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
							{inputError && <div style={{ color: "#d32f2f", fontWeight: 600, marginBottom: 4 }}>{inputError}</div>}
							{/* アイコン選択 */}
							<div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 1px 6px #0001", padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
								<label style={{ fontWeight: 600, color: "#1976d2" }}>アイコン</label>
								<div style={{ display: "flex", gap: 12, alignItems: "center" }}>
									{iconList.map(icon => (
										<label key={icon} style={{ cursor: "pointer" }}>
											<input
												type="radio"
												name="icon"
												value={icon}
												checked={profile.icon === icon}
												onChange={handleIconChange}
												style={{ marginRight: 6 }}
											/>
											<img src={icon} alt="icon" style={{ width: 40, height: 40, borderRadius: "50%", border: profile.icon === icon ? "2px solid #1976d2" : "1px solid #bcd", objectFit: "cover" }} />
										</label>
									))}
								</div>
							</div>
							{/* ...existing code... */}
							<div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 1px 6px #0001", padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
								<label style={{ fontWeight: 600, color: "#1976d2" }}>名前</label>
								<input name="name" value={profile.name} onChange={handleChange} style={{ padding: "8px 12px", fontSize: 16, borderRadius: 6, border: "1px solid #bcd" }} autoComplete="off" />
							</div>
							{/* ...existing code... */}
							<div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 1px 6px #0001", padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
								<label style={{ fontWeight: 600, color: "#1976d2" }}>学年</label>
								<select name="grade" value={profile.grade} onChange={handleGradeChange} style={{ padding: "8px 12px", fontSize: 16, borderRadius: 6, border: "1px solid #bcd", background: "#fff" }}>
									<option value="">選択してください</option>
									{GRADE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
								</select>
								{profile.grade === "その他" && (
									<input name="gradeOther" value={profile.gradeOther} onChange={handleChange} placeholder="学年を入力" style={{ marginTop: 6, padding: "8px 12px", fontSize: 15, borderRadius: 6, border: "1px solid #bcd" }} autoComplete="off" />
								)}
							</div>
							<div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 1px 6px #0001", padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
								<label style={{ fontWeight: 600, color: "#1976d2" }}>クラス</label>
								{profile.grade.startsWith("中学") && (
									<select name="class" value={profile.class} onChange={handleChange} style={{ padding: "8px 12px", fontSize: 16, borderRadius: 6, border: "1px solid #bcd", background: "#fff" }}>
										<option value="">選択してください</option>
										{JUNIOR_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
									</select>
								)}
								{profile.grade.startsWith("高校") && (
									<select name="class" value={profile.class} onChange={handleChange} style={{ padding: "8px 12px", fontSize: 16, borderRadius: 6, border: "1px solid #bcd", background: "#fff" }}>
										<option value="">選択してください</option>
										{HIGH_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
									</select>
								)}
								{(profile.grade === "卒業生" || profile.grade === "その他") && (
									<input name="class" value="なし" disabled style={{ padding: "8px 12px", fontSize: 16, borderRadius: 6, border: "1px solid #bcd", background: "#eee", color: "#aaa" }} />
								)}
							</div>
							<div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 1px 6px #0001", padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
								<label style={{ fontWeight: 600, color: "#1976d2" }}>自己紹介</label>
								<textarea name="description" value={profile.description} onChange={handleChange} rows={3} style={{ padding: "8px 12px", fontSize: 15, borderRadius: 6, border: "1px solid #bcd", resize: "vertical" }} autoComplete="off" />
							</div>
							<div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 1px 6px #0001", padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
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
				{/* 今後追加予定の要素はここに新しいdivを追加していけばOK */}
			</div>
			<Footer />
		</>
	);
}
