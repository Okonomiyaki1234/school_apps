"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import { useAuth } from "../../../../context/AuthContext";

export default function ClubEditPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
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
      const { data, error } = await supabase.from("clubs").select("*").eq("id", id).single();
      if (error) {
        setError(error.message);
      } else {
        setName(data.name || "");
        setDescription(data.description || "");
        setImageUrl(data.image_url || "");
      }
      setLoading(false);
    };
    fetchClub();
  }, [id]);

  if (profile?.role !== "admin") {
    return <div>権限がありません。</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("clubs").update({
      name,
      description,
      image_url: imageUrl,
    }).eq("id", id);
    setSaving(false);
    if (error) {
      alert("更新に失敗しました: " + error.message);
    } else {
      router.push(`/main/clubs/${id}`);
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <div style={{ maxWidth: 500, margin: "48px auto 0 auto", padding: 16 }}>
      <h2>部活/委員会を編集</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>名前<br />
            <input value={name} onChange={e => setName(e.target.value)} required style={{ width: "100%" }} />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>説明<br />
            <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ width: "100%" }} />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>画像URL（任意）<br />
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={{ width: "100%" }} />
          </label>
        </div>
        <button type="submit" disabled={saving}>{saving ? "保存中..." : "保存"}</button>
      </form>
    </div>
  );
}
