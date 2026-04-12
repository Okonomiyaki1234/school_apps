"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function ClassroomsPage() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const isCouncil = profile?.role === "council";
  const isOperator = profile?.role === "operator";
  const allowedRoles = ["admin", "council", "operator"];
  const isPrivileged = allowedRoles.includes(profile?.role);
  const router = useRouter();

  useEffect(() => {
    const fetchClassrooms = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("classrooms").select("*");
      if (error) {
        setError(error.message);
      } else {
        setClassrooms(data);
      }
      setLoading(false);
    };
    fetchClassrooms();
  }, []);

  const handleCreate = () => {
    router.push("/main/classrooms/new");
  };

  const handleEdit = (id) => {
    router.push(`/main/classrooms/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (!confirm("本当に削除しますか？")) return;
    const { error } = await supabase.from("classrooms").delete().eq("id", id);
    if (error) {
      alert("削除に失敗しました: " + error.message);
    } else {
      setClassrooms(classrooms.filter((c) => c.id !== id));
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <div style={{ maxWidth: 700, margin: "48px auto 0 auto", padding: 24, background: "#f7faff", borderRadius: 16, boxShadow: "0 2px 12px #e3e3e3" }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/" style={{ color: '#1976d2' }}>ホームに戻る</Link>
      </div>
      <h1 style={{ fontSize: 28, marginBottom: 24, fontWeight: 700, letterSpacing: 1 }}>ページ一覧</h1>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <button onClick={handleCreate} style={{ padding: '10px 24px', borderRadius: 8, background: '#1976d2', color: '#fff', fontWeight: 600, border: 'none', fontSize: 16 }}>＋ 新しいページを作成</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {classrooms
          .filter(c => {
            // 権限者は全件、生徒は自分のクラスのみ
            if (isPrivileged) return true;
            if (!profile) return false;
            return profile.grade === c.grade && profile.class === c.class;
          })
          .sort((a, b) => {
            // 学年→クラス→作成日（昇順）でソート
            if (a.grade !== b.grade) return (a.grade > b.grade ? 1 : -1);
            if (a.class !== b.class) return (a.class > b.class ? 1 : -1);
            return new Date(a.created_at) - new Date(b.created_at);
          })
          .map((c) => {
            // タイトルブロック（複数ある場合は先頭のみ表示）
            let titleBlock = null;
            let titleCount = 0;
            if (Array.isArray(c.content)) {
              const allTitles = c.content.filter(b => b.type === "title" && b.value);
              titleBlock = allTitles.length > 0 ? allTitles[0] : null;
              titleCount = allTitles.length;
            }
            const thumbBlock = Array.isArray(c.content) ? c.content.find(b => b.type === "image" && b.value) : null;
            return (
              <Link key={c.id} href={`/main/classrooms/${c.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ border: "1px solid #b0bec5", borderRadius: 12, padding: 20, background: '#fff', boxShadow: '0 1px 4px #e0e0e0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'box-shadow 0.2s', marginBottom: 0 }}>
                  {thumbBlock && (
                    <img src={thumbBlock.value} alt="サムネイル" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8, boxShadow: '0 1px 4px #e0e0e0' }} />
                  )}
                  <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{titleBlock ? titleBlock.value : c.name}</div>
                  <div style={{ color: '#888', fontSize: 15 }}>{`学年: ${c.grade ?? '-'} / クラス: ${c.class ?? '-'}`}</div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <button type="button" onClick={e => { e.preventDefault(); handleEdit(c.id); }} style={{ padding: '6px 18px', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', fontSize: 15 }}>編集</button>
                    <button type="button" onClick={e => { e.preventDefault(); handleDelete(c.id); }} style={{ padding: '6px 18px', borderRadius: 6, background: '#e53935', color: '#fff', border: 'none', fontSize: 15 }}>削除</button>
                  </div>
                </div>
              </Link>
            );
          })}
        {classrooms.filter(c => isPrivileged || (profile && profile.grade === c.grade && profile.class === c.class)).length === 0 && (
          <div style={{ color: '#888', fontSize: 16, textAlign: 'center', marginTop: 32 }}>クラスが登録されていません。</div>
        )}
      </div>
      {/* 権限者向け: 全クラス一覧ボタン */}
      {isPrivileged && (
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <button onClick={() => router.push("/main/classrooms?all=1")} style={{ padding: '10px 32px', borderRadius: 8, background: '#388e3c', color: '#fff', fontWeight: 600, border: 'none', fontSize: 17 }}>全クラス一覧を見る</button>
        </div>
      )}
    </div>
  );
}
