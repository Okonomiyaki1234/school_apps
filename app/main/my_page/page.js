"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { iconList } from "@/lib/iconList";

const DEFAULT_ACHIEVEMENT_LIST = [
  "皆勤賞", "優秀賞", "部活リーダー", "生徒会", "ボランティア", "英検合格", "漢検合格"
];
const DEFAULT_ICON = iconList[0]?.icons?.[0] || "";
// isParentのデフォルト値
const DEFAULT_IS_PARENT = false;

const GRADE_OPTIONS = [
  "中学1年生", "中学2年生", "中学3年生",
  "高校1年生", "高校2年生", "高校3年生",
  "卒業生", "その他"
];


export default function MyPage() {
	const { user, profile: authProfile, loading: authLoading, refreshProfile } = useAuth();
	const [profile, setProfile] = useState({
		name: "",
		grade: "",
		gradeOther: "",
		class: "",
		description: "",
		achievement: [],
		achievement_list: DEFAULT_ACHIEVEMENT_LIST,
		icon: DEFAULT_ICON,
		isParent: DEFAULT_IS_PARENT
	});
	// アイコングループの展開状態
	const [openGroups, setOpenGroups] = useState(() => iconList.map(g => g.group === '保存'));
	const JUNIOR_CLASSES = ["A", "B", "C", "D", "E"];
	const HIGH_CLASSES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
	const [inputError, setInputError] = useState("");
	const [loading, setLoading] = useState(true);
	const [editMode, setEditMode] = useState(false);
	const [message, setMessage] = useState("");
	const handleGoAchievement = () => {
		window.location.href = "/main/achievement";
	};

	// AuthContext のプロフィールを反映
	useEffect(() => {
		if (authLoading) return;
		if (authProfile) {
			setProfile(prev => ({
				...prev,
				name: authProfile.name || "",
				grade: authProfile.grade || "",
				class: authProfile.class || "",
				description: authProfile.description || "",
				achievement: Array.isArray(authProfile.achievement) ? authProfile.achievement : [],
				achievement_list: Array.isArray(authProfile.achievement_list) ? authProfile.achievement_list : DEFAULT_ACHIEVEMENT_LIST,
				icon: authProfile.icon || DEFAULT_ICON,
				isParent: typeof authProfile.isParent === "boolean" ? authProfile.isParent : DEFAULT_IS_PARENT
			}));
		}
		setLoading(false);
	}, [authProfile, authLoading]);

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
				icon: profile.icon,
				isParent: profile.isParent
			})
			.eq("id", user.id);
		setLoading(false);
		setEditMode(false);
		setMessage(error ? "更新失敗" : "更新しました");
		if (!error) refreshProfile && refreshProfile();
	};

	if (loading) return <div>読み込み中...</div>;
	if (!user) return <div>ログインしてください</div>;

	return (
		<>
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
					{/* 保護者モードスイッチ（studentのみ表示） */}
					{!editMode && authProfile?.role === "student" && (
						<div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, justifyContent: "center" }}>
							<span style={{ fontWeight: 600, color: "#1976d2" }}>保護者モード</span>
							<label style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
								<input
									type="checkbox"
									checked={profile.isParent}
									onChange={async e => {
										setProfile(prev => ({ ...prev, isParent: e.target.checked }));
										// すぐ保存
										setLoading(true);
										const { error } = await supabase
											.from("profiles")
											.update({ isParent: e.target.checked })
											.eq("id", user.id);
										setLoading(false);
										setMessage(error ? "切替失敗" : e.target.checked ? "保護者モードに切替" : "生徒モードに切替");
										if (!error) refreshProfile && refreshProfile();
									}}
									style={{ width: 32, height: 32, accentColor: "#1976d2" }}
								/>
								<span style={{ marginLeft: 8, color: profile.isParent ? "#1976d2" : "#888", fontWeight: 600 }}>
									{profile.isParent ? "ON（保護者）" : "OFF（生徒）"}
								</span>
							</label>
						</div>
					)}
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
							<div style={{ display: "flex", gap: 16, marginTop: 18 }}>
								<button onClick={() => setEditMode(true)} style={{ flex: 1, padding: "10px 0", background: "#333", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: "pointer", boxShadow: "0 2px 8px #1976d222", transition: "background 0.2s" }}>編集</button>
								<button onClick={handleGoAchievement} style={{ flex: 1, padding: "10px 0", background: "#ffd700", color: "#333", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 16, cursor: "pointer", boxShadow: "0 2px 8px #ffd70044", transition: "background 0.2s" }}>称号ページへ</button>
							</div>
						</div>
					) : (
						<form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
							{inputError && <div style={{ color: "#d32f2f", fontWeight: 600, marginBottom: 4 }}>{inputError}</div>}
							{/* アイコン選択 */}
							<div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 1px 6px #0001", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
								<label style={{ fontWeight: 600, color: "#1976d2", marginBottom: 8 }}>アイコン</label>
								<div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
									{iconList.map((group, idx) => (
										<button
											key={group.group}
											type="button"
											onClick={() => setProfile(prev => ({ ...prev, icon: group.icons[0] }))}
											style={{
												background: profile.icon && group.icons.includes(profile.icon) ? "#1976d2" : "#eee",
												color: profile.icon && group.icons.includes(profile.icon) ? "#fff" : "#1976d2",
												border: "none",
												borderRadius: 8,
												padding: "4px 10px 4px 4px",
												fontWeight: 600,
												fontSize: 15,
												cursor: "pointer",
												minWidth: 90,
												display: "flex",
												alignItems: "center",
												gap: 6
											}}
										>
											<img src={group.icons[0]} alt={group.group + " 01"} style={{ width: 28, height: 28, borderRadius: "50%", border: "1.5px solid #bcd", objectFit: "cover" }} />
											<span>{group.group}</span>
										</button>
									))}
								</div>
								{/* 色ボタン群 */}
								{(() => {
									// 色名リスト
									const colorNames = [
										"薄黄色", "薄橙色", "橙色", "赤色", "ピンク色", "薄紫色", "薄青色", "空色", "黄緑色", "白色",
										"灰色", "黒色", "抹茶色", "緑色", "青緑色", "藍色", "紫色", "薩摩芋色", "茶色", "木色"
									];
									// 選択中グループを特定
									const currentGroup = iconList.find(g => g.icons.includes(profile.icon)) || iconList[0];
									return (
										<>
											<div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
												{currentGroup.icons.map((icon, i) => (
													<button
														key={icon}
														type="button"
														onClick={() => setProfile(prev => ({ ...prev, icon }))}
														style={{
															background: profile.icon === icon ? "#1976d2" : "#eee",
															color: profile.icon === icon ? "#fff" : "#1976d2",
															border: "none",
															borderRadius: 6,
															padding: "4px 10px",
															fontWeight: 600,
															fontSize: 14,
															cursor: "pointer",
															minWidth: 48
														}}
													>{colorNames[i] || String(i+1).padStart(2, "0")}</button>
												))}
											</div>
											{/* 選択中アイコンのプレビュー */}
											<div style={{ textAlign: "center", margin: "8px 0" }}>
												<img src={profile.icon} alt="icon" style={{ width: 56, height: 56, borderRadius: "50%", border: "2px solid #1976d2", objectFit: "cover", boxShadow: "0 2px 8px #1976d233" }} />
											</div>
										</>
									);
								})()}
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
		</>
	);
}
