"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function ClubsPublicListPage() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("clubs").select("*");
      if (error) {
        setError(error.message);
      } else {
        setClubs(data);
      }
      setLoading(false);
    };
    fetchClubs();
  }, []);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <div style={{ maxWidth: 700, margin: "48px auto 0 auto", padding: 24, background: "#f7faff", borderRadius: 16, boxShadow: "0 2px 12px #e3e3e3" }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/" style={{ color: '#1976d2' }}>ホームに戻る</Link>
      </div>
      <h1 style={{ fontSize: 28, marginBottom: 24, fontWeight: 700, letterSpacing: 1, textAlign: 'center' }}>部活・委員会一覧（公開）</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {clubs.map((club) => {
          const titleBlock = Array.isArray(club.content) ? club.content.find(b => b.type === "title" && b.value) : null;
          const thumbBlock = Array.isArray(club.content) ? club.content.find(b => b.type === "image" && b.value) : null;
          return (
            <div key={club.id} style={{ border: "1px solid #b0bec5", borderRadius: 12, padding: 20, background: '#fff', boxShadow: '0 1px 4px #e0e0e0', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {thumbBlock && (
                <img src={thumbBlock.value} alt="サムネイル" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8, alignSelf: 'center', boxShadow: '0 1px 4px #e0e0e0' }} />
              )}
              <Link href={`/main/clubs/public/${club.id}`} style={{ fontSize: 20, fontWeight: 600, color: '#1976d2', textDecoration: 'none', marginBottom: 4 }}>
                {titleBlock ? titleBlock.value : "タイトル未設定"}
              </Link>
            </div>
          );
        })}
        {clubs.length === 0 && <div style={{ color: '#888', fontSize: 16, textAlign: 'center', marginTop: 32 }}>部活・委員会が登録されていません。</div>}
      </div>
    </div>
  );
}
