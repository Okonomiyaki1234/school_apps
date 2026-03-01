"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

const NG_WORDS = ["死ね", "バカ", "アホ", "殺す", "うざい", "消えろ"];
function containsNGWord(text) {
  return NG_WORDS.some(word => text.includes(word));
}

export default function QuestionDetailPage({ params }) {
  const { id } = React.use(params);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerBody, setAnswerBody] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuestion();
    fetchAnswers();
  }, [id]);

  async function fetchQuestion() {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("id", id)
      .single();
    if (!error && data) setQuestion(data);
  }
  async function fetchAnswers() {
    // Supabaseから回答一覧取得（回答者名も取得）
    const { data, error } = await supabase
      .from("answers")
      .select("*, profiles(name)")
      .eq("question_id", id)
      .order("created_at", { ascending: true });
    if (!error && data) {
      // user_nameにprofiles.nameをセット
      setAnswers(data.map(ans => ({
        ...ans,
        user_name: ans.profiles?.name || "匿名"
      })));
    }
  }

  async function handleAnswerSubmit(e) {
    e.preventDefault();
    if (!answerBody) {
      setError("回答内容は必須です");
      return;
    }
    if (containsNGWord(answerBody)) {
      setError("NGワードが含まれています");
      return;
    }
    // Supabase AuthからログインユーザーID取得
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) {
      setError("ログイン情報が取得できません");
      return;
    }
    // Supabaseへ回答登録
    const { error: dbError } = await supabase
      .from("answers")
      .insert([
        {
          question_id: id,
          user_id: userId,
          body: answerBody,
        }
      ]);
    if (dbError) {
      setError("回答の投稿に失敗しました");
      return;
    }
    setAnswerBody("");
    setError("");
    fetchAnswers();
  }

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh", paddingTop: "64px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 0" }}>
        <div style={{ marginBottom: 24, textAlign: "left" }}>
          <button
            style={{ background: "#222", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 600, fontSize: "1rem", cursor: "pointer" }}
            onClick={() => window.location.href = "/questions"}
          >
            ← 一覧に戻る
          </button>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", padding: 32, marginBottom: 32 }}>
          <h1 style={{ fontWeight: 700, fontSize: "1.5rem", marginBottom: 18, textAlign: "center" }}>質問詳細</h1>
          {question && (
            <div>
              <div style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: 8 }}>{question.title}</div>
              <div style={{ marginBottom: 12 }}>{question.body}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                {question.tags?.filter(tag => !/^([0-9a-fA-F-]{36})$/.test(tag)).map(tag => (
                  <span key={tag} style={{ background: "#e0e0e0", borderRadius: 8, padding: "2px 10px", fontSize: "0.95rem" }}>{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", padding: 32, marginBottom: 32 }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: 18 }}>回答一覧</h2>
          {answers.length === 0 ? (
            <div style={{ color: "#888", textAlign: "center" }}>まだ回答はありません。</div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {answers.map(ans => (
                <li key={ans.id} style={{ marginBottom: 18, borderBottom: "1px solid #eee", paddingBottom: 12 }}>
                  <div style={{ fontSize: "1rem", marginBottom: 6 }}>{ans.body}</div>
                  <div style={{ color: "#888", fontSize: "0.95rem" }}>回答者: {ans.user_name}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", padding: 32 }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: 18 }}>回答投稿</h2>
          <form onSubmit={handleAnswerSubmit}>
            <textarea
              placeholder="回答内容"
              value={answerBody}
              onChange={e => setAnswerBody(e.target.value)}
              style={{ width: "100%", minHeight: 80, padding: "10px 12px", borderRadius: 8, border: "1px solid #ccc", fontSize: "1rem", marginBottom: 12 }}
            />
            {error && <div style={{color: "#e74c3c", marginBottom: 12, textAlign: "center"}}>{error}</div>}
            <button type="submit" style={{ background: "#222", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, fontSize: "1rem", cursor: "pointer", width: "100%" }}>回答する</button>
          </form>
        </div>
      </div>
    </div>
  );
}
