"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";
import { useAuth } from "../../../../context/AuthContext";

const blockTypes = [
  { type: "title", label: "タイトル" },
  { type: "text", label: "本文" },
  { type: "image", label: "画像" },
];

import { useRef, useState as useLocalState } from "react";
import ClubImageList from "../image_list.js";

function BlockEditor({ block, onChange, onDelete, index, moveUp, moveDown, total }) {
  const fileInputRef = useRef();
  const [uploading, setUploading] = useLocalState(false);
  const [uploadError, setUploadError] = useLocalState("");

  // 画像アップロード処理
  const handleFileChange = async (e) => {
    setUploadError("");
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `club_${Date.now()}_${Math.floor(Math.random()*10000)}.${ext}`;
    const { data, error } = await supabase.storage.from("club-images").upload(fileName, file, { upsert: false });
    if (error) {
      setUploadError("アップロード失敗: " + error.message);
      setUploading(false);
      return;
    }
    // 公開URL取得
    const { data: urlData } = supabase.storage.from("club-images").getPublicUrl(fileName);
    if (urlData?.publicUrl) {
      onChange({ ...block, value: urlData.publicUrl });
    } else {
      setUploadError("URL取得失敗");
    }
    setUploading(false);
  };

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

export default function ClubNewPage() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

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
    // タイトル必須チェック
    if (!blocks.some(b => b.type === "title" && b.value.trim() !== "")) {
      setError("タイトルブロックを1つ以上追加してください。");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("clubs").insert({
      content: blocks,
      created_by: user.id,
    });
    setLoading(false);
    if (error) {
      setError("作成に失敗しました: " + error.message);
    } else {
      router.push("/main/clubs");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "48px auto 0 auto", padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/main/clubs" style={{ color: '#1976d2', marginRight: 16 }}>一覧に戻る</Link>
        <Link href="/" style={{ color: '#1976d2' }}>ホームに戻る</Link>
      </div>
      <h2 style={{ fontSize: 24, marginBottom: 20 }}>新しい部活/委員会ページ作成</h2>
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
        <button type="submit" disabled={loading} style={{ padding: "10px 32px", borderRadius: 8, background: "#388e3c", color: "#fff", border: "none", fontSize: 17, fontWeight: 600 }}>{loading ? "作成中..." : "ページを作成"}</button>
      </form>
    </div>
  );
}
