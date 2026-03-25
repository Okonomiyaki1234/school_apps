"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import { useAuth } from "../../../../../context/AuthContext.js";

import ClubImageList from "../../image_list.js";

const blockTypes = [
  { type: "title", label: "タイトル" },
  { type: "text", label: "本文" },
  { type: "image", label: "画像" },
];

function BlockEditor({ block, onChange, onDelete, index, moveUp, moveDown, total }) {
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  return (
    <div style={{
      background: "#f7faff",
      borderRadius: 10,
      boxShadow: "0 2px 8px #eee",
      padding: 16,
      marginBottom: 16,
      position: "relative"
    }}>
      <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 15 }}>{blockTypes.find(b => b.type === block.type)?.label}</div>
      {block.type === "title" && (
        <input
          type="text"
          value={block.value || ""}
          onChange={e => onChange({ ...block, value: e.target.value })}
          placeholder="タイトルを入力"
          style={{ width: "100%", fontSize: 20, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          required
        />
      )}
      {block.type === "text" && (
        <textarea
          value={block.value || ""}
          onChange={e => onChange({ ...block, value: e.target.value })}
          placeholder="本文を入力"
          rows={4}
          style={{ width: "100%", fontSize: 16, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          required
        />
      )}
      {block.type === "image" && (
        <div>
          <div style={{ marginBottom: 8 }}>
            <ClubImageList
              selectedUrl={block.value || ""}
              onSelect={url => onChange({ ...block, value: url })}
            />
            <input
              type="text"
              value={block.value || ""}
              onChange={e => onChange({ ...block, value: e.target.value })}
              placeholder="画像URLを直接入力も可"
              style={{ width: "100%", fontSize: 15, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            />
          </div>
          {block.value && (
            <img src={block.value} alt="プレビュー" style={{ maxWidth: 200, marginTop: 8, borderRadius: 6, boxShadow: "0 2px 8px #eee" }} />
          )}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button type="button" onClick={moveUp} disabled={index === 0} style={{ fontSize: 13 }}>↑</button>
        <button type="button" onClick={moveDown} disabled={index === total - 1} style={{ fontSize: 13 }}>↓</button>
        <button type="button" onClick={onDelete} style={{ color: '#d32f2f', fontSize: 13 }}>削除</button>
      </div>
    </div>
  );
}


export default function ClubEditPage() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { user, profile } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    if (!id) return;
    const fetchClub = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("clubs").select("content").eq("id", id).single();
      if (error) {
        setError(error.message);
      } else {
        setBlocks(Array.isArray(data.content) ? data.content : []);
      }
      setLoading(false);
    };
    fetchClub();
  }, [id]);

  if (profile?.role !== "admin") {
    return <div>権限がありません。</div>;
  }

  const addBlock = (type) => {
    setBlocks([...blocks, { type, value: "" }]);
  };

  const updateBlock = (idx, newBlock) => {
    setBlocks(blocks.map((b, i) => (i === idx ? newBlock : b)));
  };

  const deleteBlock = (idx) => {
    setBlocks(blocks.filter((_, i) => i !== idx));
  };

  const moveBlock = (from, to) => {
    if (to < 0 || to >= blocks.length) return;
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(from, 1);
    newBlocks.splice(to, 0, moved);
    setBlocks(newBlocks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (blocks.length === 0) {
      setError("最低1つ以上のブロックを追加してください。");
      return;
    }
    if (!blocks.some(b => b.type === "title" && b.value.trim() !== "")) {
      setError("タイトルブロックを1つ以上追加してください。");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("clubs").update({
      content: blocks
    }).eq("id", id);
    setSaving(false);
    if (error) {
      setError("更新に失敗しました: " + error.message);
    } else {
      router.push(`/main/clubs/${id}`);
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <div style={{ maxWidth: 600, margin: "48px auto 0 auto", padding: 24 }}>
      <h2 style={{ fontSize: 24, marginBottom: 20 }}>部活/委員会ページ編集</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ color: '#1976d2', fontSize: 14, marginBottom: 12 }}>
          ※ 一覧のサムネイル画像は「一番上に配置されている画像ブロック」が自動的に使われます。
        </div>
        {blocks.map((block, idx) => (
          <BlockEditor
            key={idx}
            block={block}
            index={idx}
            total={blocks.length}
            onChange={b => updateBlock(idx, b)}
            onDelete={() => deleteBlock(idx)}
            moveUp={() => moveBlock(idx, idx - 1)}
            moveDown={() => moveBlock(idx, idx + 1)}
          />
        ))}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          {blockTypes.map(bt => (
            <button type="button" key={bt.type} onClick={() => addBlock(bt.type)} style={{ padding: "8px 16px", borderRadius: 6, background: "#1976d2", color: "#fff", border: "none", fontSize: 15 }}>{bt.label}を追加</button>
          ))}
        </div>
        {error && <div style={{ color: '#d32f2f', marginBottom: 12 }}>{error}</div>}
        <button type="submit" disabled={saving} style={{ padding: "10px 32px", borderRadius: 8, background: "#388e3c", color: "#fff", border: "none", fontSize: 17, fontWeight: 600 }}>{saving ? "保存中..." : "保存"}</button>
      </form>
    </div>
  );
}
