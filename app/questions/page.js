'use client';
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import TagFilter from "../../components/TagFilter";

const SORT_OPTIONS = [
  { value: "new", label: "新着順" },
  { value: "few_answers", label: "回答数が少ない順" },
];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sort, setSort] = useState("new");

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line
  }, [selectedTags, sort]);

  async function fetchQuestions() {
    let query = supabase
      .from("questions")
      .select("*, answers(count)");

    // タグ絞り込み
    if (selectedTags.length > 0) {
      query = query.contains("tags", selectedTags);
    }

    // 並び替え（新着順のみDB側で）
    if (sort === "new") {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;
    if (error) return;
    // answers_countを集計（answers[0].countを利用）
    let questionsWithCount = (data || []).map(q => ({
      ...q,
      answers_count: Array.isArray(q.answers) && q.answers[0]?.count !== undefined ? q.answers[0].count : 0
    }));
    // 回答数が少ない順はフロント側でソート
    if (sort === "few_answers") {
      questionsWithCount = [...questionsWithCount].sort((a, b) => a.answers_count - b.answers_count);
    }
    setQuestions(questionsWithCount);
  }

  return (
    <div style={{ paddingTop: "64px", background: "#fafafa", minHeight: "100vh" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px" }}>
        <h1 style={{ fontWeight: 700, fontSize: "2rem", marginBottom: 24, textAlign: "center" }}>質問一覧</h1>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <a href="/questions/new">
            <button style={{ background: "#222", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 600, fontSize: "1rem", cursor: "pointer" }}>＋ 質問を投稿する</button>
          </a>
        </div>
        <div style={{ marginBottom: 16 }}>
          <TagFilter selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        </div>
        <div style={{ marginBottom: 24, textAlign: "right" }}>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc" }}>
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {questions.map(q => (
            <div
              key={q.id}
              style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", padding: 24, position: "relative", cursor: "pointer", transition: "box-shadow 0.2s", border: "1px solid transparent" }}
              onClick={() => window.location.href = `/questions/${q.id}`}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') window.location.href = `/questions/${q.id}`; }}
              tabIndex={0}
              role="button"
              aria-label={`質問詳細: ${q.title}`}
            >
              <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: 8 }}>{q.title}</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                {q.tags?.filter(tag => !/^([0-9a-fA-F-]{36})$/.test(tag)).map(tag => (
                  <span key={tag} style={{ background: "#e0e0e0", borderRadius: 8, padding: "2px 10px", fontSize: "0.95rem" }}>{tag}</span>
                ))}
              </div>
              <div style={{ color: "#888", fontSize: "0.95rem" }}>回答数: {q.answers_count ?? 0}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
