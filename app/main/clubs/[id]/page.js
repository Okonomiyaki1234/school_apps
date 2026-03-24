"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

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

  return (
    <div style={{ maxWidth: 600, margin: "48px auto 0 auto", padding: 16 }}>
      <h2>{club.name}</h2>
      {club.image_url && <img src={club.image_url} alt={club.name} style={{ maxWidth: 300, marginBottom: 16 }} />}
      <div style={{ marginBottom: 16 }}>{club.description}</div>
      <div style={{ color: '#888', fontSize: 13 }}>作成日: {club.created_at && new Date(club.created_at).toLocaleString()}</div>
    </div>
  );
}
