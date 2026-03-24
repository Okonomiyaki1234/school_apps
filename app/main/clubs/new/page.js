"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import { useAuth } from "../../../../context/AuthContext";

export default function ClubNewPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const router = useRouter();

  if (profile?.role !== "admin") {
    return <div>権限がありません。</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("clubs").insert({
      name,
      description,
      image_url: imageUrl,
      created_by: user.id,
    });
    setLoading(false);
    if (error) {
      alert("作成に失敗しました: " + error.message);
    } else {
      router.push("/main/clubs");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "48px auto 0 auto", padding: 16 }}>
      <h2>新しい部活/委員会を作成</h2>
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
        <button type="submit" disabled={loading}>{loading ? "作成中..." : "作成"}</button>
      </form>
    </div>
  );
}
