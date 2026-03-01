"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import TagFilter from "../../../components/TagFilter";

const NG_WORDS = ["死ね", "バカ", "アホ", "殺す", "うざい", "消えろ"];

function containsNGWord(text) {
  return NG_WORDS.some(word => text.includes(word));
}

export default function NewQuestionPage() {
    const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");
  // ユーザーIDはuseEffectで取得し、useStateで管理
  const [userId, setUserId] = useState("");
  React.useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      setUserId(userData?.user?.id || "");
    })();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !body) {
      setError("タイトルと内容は必須です");
      return;
    }
    if (containsNGWord(title) || containsNGWord(body)) {
      setError("NGワードが含まれています");
      return;
    }
    // Supabase AuthからログインユーザーID取得（awaitで）
    if (!userId) {
      setError("ログイン情報が取得できません");
      return;
    }
    // "自分の質問"タグ（userId）を自動追加
    const tagsWithUser = [...tags, userId];
    const { error: dbError } = await supabase
      .from("questions")
      .insert([
        {
          user_id: userId,
          title,
          body,
          tags: tagsWithUser,
        }
      ]);
    if (dbError) {
      setError("投稿に失敗しました");
      return;
    }
    // 投稿成功時の処理
    setError("投稿に成功しました。");
    setTimeout(() => {
      router.push("/questions");
    }, 1200);
  }

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh", paddingTop: "64px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 0" }}>
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", padding: 32 }}>
          <h1 style={{ fontWeight: 700, fontSize: "1.5rem", marginBottom: 24, textAlign: "center" }}>質問投稿</h1>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <input
                type="text"
                placeholder="タイトル"
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #ccc", fontSize: "1rem" }}
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <textarea
                placeholder="質問内容"
                value={body}
                onChange={e => setBody(e.target.value)}
                style={{ width: "100%", minHeight: 80, padding: "10px 12px", borderRadius: 8, border: "1px solid #ccc", fontSize: "1rem" }}
              />
            </div>
            <div style={{ marginBottom: 18 }}>
              <TagFilter selectedTags={tags} setSelectedTags={setTags} userId={userId} />
            </div>
            {error && (
              <div
                style={{
                  color: error === "投稿に成功しました。" ? "#27ae60" : "#e74c3c",
                  marginBottom: 12,
                  textAlign: "center"
                }}
              >
                {error}
              </div>
            )}
            <button type="submit" style={{ background: "#222", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, fontSize: "1rem", cursor: "pointer", width: "100%" }}>投稿</button>
          </form>
        </div>
      </div>
    </div>
  );
}
