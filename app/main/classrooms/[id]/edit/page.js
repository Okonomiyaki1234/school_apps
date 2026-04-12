"use client";
import ClubImageList from "@/app/main/classrooms/image_list";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const blockTypes = [
  { type: "title", label: "タイトル" },
  { type: "text", label: "本文" },
  { type: "image", label: "画像" },
];

export default function ClassroomEditPage() {
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [grade, setGrade] = useState("");
  const [className, setClassName] = useState("");
  const router = useRouter();
  const params = useParams();
  const { user, profile } = useAuth();
  const id = params?.id;

  useEffect(() => {
    if (!id) return;
    const fetchClassroom = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("classrooms").select("*").eq("id", id).single();
      if (error) {
        setError(error.message);
      } else {
        setClassroom(data);
        setBlocks(data.content || []);
        setGrade(data.grade || "");
        setClassName(data.class || "");
      }
      setLoading(false);
    };
    fetchClassroom();
  }, [id]);

  const handleBlockChange = (idx, newBlock) => {
    setBlocks(blocks.map((b, i) => (i === idx ? newBlock : b)));
  };
  const handleBlockDelete = (idx) => {
    setBlocks(blocks.filter((_, i) => i !== idx));
  };
  const handleAddBlock = (type) => {
    setBlocks([...blocks, { type, value: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!grade || !className) {
      setError("学年・クラスを入力してください");
      return;
    }
    const { error } = await supabase.from("classrooms").update({ content: blocks, grade, class: className }).eq("id", id);
    if (error) {
      setError(error.message);
    } else {
      router.push(`/main/classrooms/${id}`);
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;
  if (!classroom) return <div>クラスが見つかりません。</div>;

  return (
    <div style={{ maxWidth: 700, margin: "48px auto 0 auto", padding: 24, background: "#f7faff", borderRadius: 16, boxShadow: "0 2px 12px #e3e3e3" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>クラス内容を編集</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>学年</label>
          <input type="text" value={grade} onChange={e => setGrade(e.target.value)} style={{ width: "100%", fontSize: 18, padding: 8, borderRadius: 6, border: "1px solid #ccc" }} required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>クラス</label>
          <input type="text" value={className} onChange={e => setClassName(e.target.value)} style={{ width: "100%", fontSize: 18, padding: 8, borderRadius: 6, border: "1px solid #ccc" }} required />
        </div>
        {blocks.map((block, idx) => (
          <div key={idx} style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px #eee", padding: 16, marginBottom: 16 }}>
            <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 15 }}>{blockTypes.find(b => b.type === block.type)?.label}</div>
            {block.type === "title" && (
              <input type="text" value={block.value || ""} onChange={e => handleBlockChange(idx, { ...block, value: e.target.value })} placeholder="タイトルを入力" style={{ width: "100%", fontSize: 20, padding: 8, borderRadius: 6, border: "1px solid #ccc" }} required />
            )}
            {block.type === "text" && (
              <textarea value={block.value || ""} onChange={e => handleBlockChange(idx, { ...block, value: e.target.value })} placeholder="本文を入力" rows={4} style={{ width: "100%", fontSize: 16, padding: 8, borderRadius: 6, border: "1px solid #ccc" }} required />
            )}
            {block.type === "image" && (
              <div>
                <ClubImageList
                  selectedUrl={block.value || ""}
                  onSelect={url => handleBlockChange(idx, { ...block, value: url })}
                />
                <input
                  type="text"
                  value={block.value || ""}
                  onChange={e => handleBlockChange(idx, { ...block, value: e.target.value })}
                  placeholder="画像URLを入力（または上から選択）"
                  style={{ width: "100%", fontSize: 16, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                />
              </div>
            )}
            <button type="button" onClick={() => handleBlockDelete(idx)} style={{ marginTop: 8, color: '#e53935', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>削除</button>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {blockTypes.map(bt => (
            <button type="button" key={bt.type} onClick={() => handleAddBlock(bt.type)} style={{ padding: '8px 16px', borderRadius: 8, background: '#1976d2', color: '#fff', fontWeight: 600, border: 'none', fontSize: 15 }}>{bt.label}追加</button>
          ))}
        </div>
        {error && <div style={{ color: "#e53935", marginBottom: 12 }}>{error}</div>}
        <button type="submit" style={{ padding: '10px 24px', borderRadius: 8, background: '#1976d2', color: '#fff', fontWeight: 600, border: 'none', fontSize: 16 }}>保存</button>
      </form>
    </div>
  );
}
