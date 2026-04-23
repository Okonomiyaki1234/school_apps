"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

// ロール表示用ラベル・色
const getRoleLabelAndColor = (role, isParent = false) => {
	if (role === "user") return { label: "未登録", color: "#d32f2f" };
	if (role === "student" && isParent) return { label: "保護者", color: "#388e3c" };
	if (role === "student") return { label: "生徒", color: "#222" };
	if (role === "admin") return { label: "教員", color: "#1976d2" };
	if (role === "council") return { label: "生徒会", color: "#ff9800" };
	if (role === "operator") return { label: "管理者", color: "#8e24aa" };
	return { label: role || "", color: "#888" };
};

export default function OperatorPage() {
	const { user, profile, loading: authLoading } = useAuth();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");
	// 編集モーダル用
	const [editUser, setEditUser] = useState(null); // 編集対象ユーザー
	const [editForm, setEditForm] = useState({ name: "", grade: "", class: "", role: "", isParent: false });
	const [showEditModal, setShowEditModal] = useState(false);
	const [saving, setSaving] = useState(false);
	const [editError, setEditError] = useState("");

	useEffect(() => {
		if (authLoading) return;
		// 認証済みかつoperator以外はアクセス不可
		if (!profile || profile.role !== "operator") {
			setError("このページは運営のみ閲覧可能です。");
			setLoading(false);
			return;
		}
		// ユーザー一覧取得
		(async () => {
			const { data, error } = await supabase
				.from("profiles")
				.select("id, name, grade, class, role, isParent")
				.order("grade", { ascending: true })
				.order("class", { ascending: true });
			if (error) {
				setError("ユーザー一覧の取得に失敗しました: " + error.message);
				setLoading(false);
				return;
			}
			setUsers(data || []);
			setLoading(false);
		})();
	}, [authLoading, profile]);

	if (authLoading || loading) return <div>読み込み中...</div>;
	if (error) return <div style={{ color: "#d32f2f", margin: 32 }}>{error}</div>;

	// 検索フィルタ
	const filtered = users.filter(u =>
	  !search || (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
	);

	// ユーザー分類
	const students = filtered.filter(u => (u.role === "student" || u.role === "council") && !u.isParent);
	const teachers = filtered.filter(u => u.role === "admin");
	const parents = filtered.filter(u => u.role === "student" && u.isParent);
	const operators = filtered.filter(u => u.role === "operator");

	const renderTable = (title, list) => (
		<div style={{ marginBottom: 40 }}>
			<h3 style={{ fontSize: 22, color: "#1976d2", marginBottom: 12 }}>{title}</h3>
			<table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #1976d211" }}>
				<thead>
					<tr style={{ background: "#f5f7fa" }}>
						<th style={{ padding: 12, borderBottom: "1px solid #e0e0e0" }}>ユーザー名</th>
						<th style={{ padding: 12, borderBottom: "1px solid #e0e0e0" }}>学年</th>
						<th style={{ padding: 12, borderBottom: "1px solid #e0e0e0" }}>クラス</th>
						<th style={{ padding: 12, borderBottom: "1px solid #e0e0e0" }}>ロール</th>
						<th style={{ padding: 12, borderBottom: "1px solid #e0e0e0" }}></th>
					</tr>
				</thead>
				<tbody>
					{list.map(u => {
						const { label, color } = getRoleLabelAndColor(u.role, u.isParent);
						const isCurrent = user && user.id === u.id;
						return (
							<tr key={u.id} style={{ borderBottom: "1px solid #f0f0f0", background: isCurrent ? "#e3f2fd" : undefined }}>
								<td style={{ padding: 10, fontWeight: isCurrent ? 700 : 400 }}>{u.name || <span style={{ color: '#aaa' }}>未登録</span>}</td>
								<td style={{ padding: 10 }}>{u.grade || <span style={{ color: '#aaa' }}>未登録</span>}</td>
								<td style={{ padding: 10 }}>{u.class || <span style={{ color: '#aaa' }}>未登録</span>}</td>
								<td style={{ padding: 10, fontWeight: 600, color }}>{label}</td>
								<td style={{ padding: 10 }}>
									<button
										style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "#1976d2", color: "#fff", cursor: "pointer", fontSize: 14 }}
										onClick={() => {
											setEditUser(u);
											setEditForm({
												name: u.name || "",
												grade: u.grade || "",
												class: u.class || "",
												role: u.role || "user",
												isParent: !!u.isParent
											});
											setShowEditModal(true);
										}}
									>編集</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);

	return (
		<div style={{ margin: "56px auto 0", padding: 32, maxWidth: 900, minHeight: "70vh", background: "var(--background)", borderRadius: 24, boxShadow: "0 4px 32px #0002" }}>
			<h2 style={{ fontSize: 28, color: "#1976d2", marginBottom: 24, textAlign: "center", letterSpacing: 1 }}>ユーザー一覧（運営専用）</h2>
			<div style={{ marginBottom: 32, textAlign: "center" }}>
				<input
					type="text"
					value={search}
					onChange={e => setSearch(e.target.value)}
					placeholder="ユーザー名で検索"
					style={{
						padding: "10px 16px",
						borderRadius: 8,
						border: "1px solid #bbb",
						fontSize: 16,
						width: 260,
						marginRight: 8
					}}
				/>
				{search && (
					<button onClick={() => setSearch("")} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#eee", cursor: "pointer" }}>クリア</button>
				)}
			</div>
			{renderTable("生徒・生徒会", students)}
			{renderTable("教員", teachers)}
			{renderTable("保護者", parents)}
			{renderTable("管理者", operators)}

			{/* 編集モーダル */}
			{showEditModal && (
				<div style={{
					position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#0008", zIndex: 1000,
					display: "flex", alignItems: "center", justifyContent: "center"
				}}>
					<div style={{ background: "#fff", borderRadius: 16, padding: 32, minWidth: 340, boxShadow: "0 2px 16px #0004", position: "relative" }}>
						<h3 style={{ fontSize: 20, marginBottom: 18 }}>ユーザー情報編集</h3>
						<div style={{ marginBottom: 16 }}>
							<label>名前: <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={{ width: 200, padding: 6, borderRadius: 6, border: "1px solid #bbb" }} /></label>
						</div>
						<div style={{ marginBottom: 16 }}>
							<label>学年: <input type="text" value={editForm.grade} onChange={e => setEditForm(f => ({ ...f, grade: e.target.value }))} style={{ width: 80, padding: 6, borderRadius: 6, border: "1px solid #bbb" }} /></label>
						</div>
						<div style={{ marginBottom: 16 }}>
							<label>クラス: <input type="text" value={editForm.class} onChange={e => setEditForm(f => ({ ...f, class: e.target.value }))} style={{ width: 80, padding: 6, borderRadius: 6, border: "1px solid #bbb" }} /></label>
						</div>
						<div style={{ marginBottom: 16 }}>
							<label>ロール: 
								<select value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))} style={{ padding: 6, borderRadius: 6, border: "1px solid #bbb" }}>
									<option value="user">未登録</option>
									<option value="student">生徒</option>
									<option value="council">生徒会</option>
									<option value="admin">教員</option>
									<option value="operator">管理者</option>
								</select>
							</label>
						</div>
						<div style={{ marginBottom: 16 }}>
							<label><input type="checkbox" checked={editForm.isParent} onChange={e => setEditForm(f => ({ ...f, isParent: e.target.checked }))} /> 保護者</label>
						</div>
						<div style={{ display: "flex", gap: 12, marginTop: 24 }}>
							<button onClick={() => setShowEditModal(false)} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#bbb", color: "#fff", cursor: "pointer" }}>キャンセル</button>
							<button
								style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: saving ? "#bbb" : "#1976d2", color: "#fff", cursor: saving ? "not-allowed" : "pointer" }}
								disabled={saving}
								onClick={async () => {
									setEditError("");
									if (!editUser) return;
									const diffs = [];
									if ((editUser.name || "") !== editForm.name) diffs.push(`名前: "${editUser.name || "未登録"}" → "${editForm.name || "未登録"}"`);
									if ((editUser.grade || "") !== editForm.grade) diffs.push(`学年: "${editUser.grade || "未登録"}" → "${editForm.grade || "未登録"}"`);
									if ((editUser.class || "") !== editForm.class) diffs.push(`クラス: "${editUser.class || "未登録"}" → "${editForm.class || "未登録"}"`);
									if ((editUser.role || "user") !== editForm.role) diffs.push(`ロール: "${getRoleLabelAndColor(editUser.role).label}" → "${getRoleLabelAndColor(editForm.role, editForm.isParent).label}"`);
									if (!!editUser.isParent !== !!editForm.isParent) diffs.push(`保護者: "${editUser.isParent ? "はい" : "いいえ"}" → "${editForm.isParent ? "はい" : "いいえ"}"`);
									if (diffs.length === 0) {
										alert("変更はありません。");
										return;
									}
									const confirmMsg = `以下の内容で変更しますか？\n\n${diffs.join("\n")}`;
									if (!window.confirm(confirmMsg)) return;
									setSaving(true);
									try {
										const { error: upError } = await supabase
											.from("profiles")
											.update({
												name: editForm.name,
												grade: editForm.grade,
												class: editForm.class,
												role: editForm.role,
												isParent: editForm.isParent
											})
											.eq("id", editUser.id);
										if (upError) {
											setEditError("保存に失敗しました: " + upError.message);
											setSaving(false);
											return;
										}
										// 一覧再取得
										const { data, error: reloadError } = await supabase
											.from("profiles")
											.select("id, name, grade, class, role, isParent")
											.order("grade", { ascending: true })
											.order("class", { ascending: true });
										if (reloadError) {
											setEditError("保存後の再取得に失敗: " + reloadError.message);
											setSaving(false);
											return;
										}
										setUsers(data || []);
										setShowEditModal(false);
									} catch (e) {
										setEditError("予期せぬエラー: " + (e?.message || e));
									} finally {
										setSaving(false);
									}
								}}
							>{saving ? "保存中..." : "保存"}</button>
						</div>
						{editError && <div style={{ color: "#d32f2f", marginTop: 16 }}>{editError}</div>}
					</div>
				</div>
			)}
		</div>
	);
}
