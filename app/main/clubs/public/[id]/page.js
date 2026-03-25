"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";

export default function ClubPublicDetailPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchClub = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("clubs").select("*").eq("id", id).single();
      if (error) {
        setError(error.message);
      } else {
        setClub(data);
      }
      setLoading(false);
    };
    fetchClub();
  }, [id]);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;
  if (!club) return <div>データがありません。</div>;

  // タイトル・サムネイル取得
  const titleBlock = Array.isArray(club.content) ? club.content.find(b => b.type === "title" && b.value) : null;
  const thumbBlock = Array.isArray(club.content) ? club.content.find(b => b.type === "image" && b.value) : null;

  return (
    <div style={{ maxWidth: 700, margin: "48px auto 0 auto", padding: 24, background: "#f7faff", borderRadius: 16, boxShadow: "0 2px 12px #e3e3e3" }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/main/clubs/public" style={{ color: '#1976d2', marginRight: 16 }}>一覧に戻る</Link>
        <Link href="/" style={{ color: '#1976d2' }}>ホームに戻る</Link>
      </div>
      {thumbBlock && (
        <img src={thumbBlock.value} alt="サムネイル" style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 12, marginBottom: 16, display: 'block', marginLeft: 'auto', marginRight: 'auto', boxShadow: '0 2px 8px #e0e0e0' }} />
      )}
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>{titleBlock ? titleBlock.value : "タイトル未設定"}</h2>
      <div style={{ marginTop: 24 }}>
        {Array.isArray(club.content) && club.content.map((block, idx) => {
          if (block.type === "title") return null;
          if (block.type === "image") return null;
          if (block.type === "text") {
            return <div key={idx} style={{ fontSize: 17, marginBottom: 18, whiteSpace: 'pre-line' }}>{block.value}</div>;
          }
          return null;
        })}
      </div>
    </div>
  );
}
