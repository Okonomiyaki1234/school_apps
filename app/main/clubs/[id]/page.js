"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function ClubDetailPage() {
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        setClub(data);
      }
      setLoading(false);
    };
    fetchClub();
  }, [id]);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;
  if (!club) return <div>部活が見つかりません。</div>;

  // content配列の順番通りにすべて表示（タイトル・画像・本文）
  return (
    <div style={{ maxWidth: 700, margin: "48px auto 0 auto", padding: 24, background: "#f7faff", borderRadius: 16, boxShadow: "0 2px 12px #e3e3e3" }}>
      <div style={{ marginBottom: 24 }}>
        <a href="/main/clubs" style={{ color: '#1976d2', marginRight: 16 }}>一覧に戻る</a>
        <a href="/" style={{ color: '#1976d2' }}>ホームに戻る</a>
      </div>
      {Array.isArray(club.content) && club.content.length > 0 ? (
        club.content.map((block, idx) => {
          if (block.type === "title") {
            return <h2 key={idx} style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>{block.value}</h2>;
          }
          if (block.type === "image") {
            return <img key={idx} src={block.value} alt="画像" style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 12, marginBottom: 16, display: 'block', marginLeft: 'auto', marginRight: 'auto', boxShadow: '0 2px 8px #e0e0e0' }} />;
          }
          if (block.type === "text") {
            return <div key={idx} style={{ fontSize: 17, marginBottom: 18, whiteSpace: 'pre-line' }}>{block.value}</div>;
          }
          return null;
        })
      ) : (
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>タイトル未設定</h2>
      )}
      <div style={{ color: '#888', fontSize: 13, marginTop: 32 }}>作成日: {club.created_at && new Date(club.created_at).toLocaleString()}</div>
    </div>
  );
}
