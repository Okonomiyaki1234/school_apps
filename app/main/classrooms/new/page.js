"use client";
// クラスごとの最大ページ数（変更しやすいよう定数化）
const MAX_PAGES_PER_CLASS = 10;
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function ClassroomNewPage() {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [className, setClassName] = useState("");
  const { user, profile } = useAuth();
  const allowedRoles = ["admin", "council", "operator"];
  const isPrivileged = allowedRoles.includes(profile?.role);
  const [content, setContent] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  // 生徒は自分の学年・クラスを自動セット＆編集不可
  useEffect(() => {
    if (!isPrivileged && profile) {
      setGrade(profile.grade || "");
      setClassName(profile.class || "");
    }
  }, [profile, isPrivileged]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !grade || !className) {
      setError("ページ名・学年・クラスをすべて入力してください");
      return;
    }
    // 既存ページ数をチェック
    const { data: existing, error: fetchError } = await supabase
      .from("classrooms")
      .select("id", { count: "exact" })
      .eq("grade", grade)
      .eq("class", className);
    if (fetchError) {
      setError("既存ページ数の取得に失敗しました: " + fetchError.message);
      return;
    }
    if (existing && existing.length >= MAX_PAGES_PER_CLASS) {
      setError(`この学年・クラスのページは最大${MAX_PAGES_PER_CLASS}件までです。`);
      return;
    }
    const { error } = await supabase.from("classrooms").insert({ name, grade, class: className, content });
    if (error) {
      setError(error.message);
    } else {
      router.push("/main/classrooms");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "48px auto 0 auto", padding: 24, background: "#f7faff", borderRadius: 16, boxShadow: "0 2px 12px #e3e3e3" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>新しいページを作成</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>ページ名</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", fontSize: 18, padding: 8, borderRadius: 6, border: "1px solid #ccc" }} required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>学年</label>
          <input
            type="text"
            value={grade}
            onChange={e => setGrade(e.target.value)}
            style={{ width: "100%", fontSize: 18, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            required
            disabled={!isPrivileged}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>クラス名</label>
          <input
            type="text"
            value={className}
            onChange={e => setClassName(e.target.value)}
            style={{ width: "100%", fontSize: 18, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            required
            disabled={!isPrivileged}
          />
        </div>
        {/* content編集UIは必要に応じて追加 */}
        {error && <div style={{ color: "#e53935", marginBottom: 12 }}>{error}</div>}
        <button type="submit" style={{ padding: '10px 24px', borderRadius: 8, background: '#1976d2', color: '#fff', fontWeight: 600, border: 'none', fontSize: 16 }}>作成</button>
      </form>
    </div>
  );
}
