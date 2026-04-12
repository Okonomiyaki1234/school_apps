"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function ClassroomDetailPage() {
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      }
      setLoading(false);
    };
    fetchClassroom();
  }, [id]);

  // アクセス制御: 通常生徒は自分のクラス以外はリダイレクト
  useEffect(() => {
    if (!classroom || !profile) return;
    const allowedRoles = ["admin", "council", "operator"];
    if (!allowedRoles.includes(profile.role)) {
      // 生徒は自分のクラスのみ閲覧可
      if (!(profile.grade === classroom.grade && profile.class === classroom.class)) {
        alert("自分のクラスページのみ閲覧できます");
        router.push("/main/classrooms");
      }
    }
  }, [classroom, profile, router]);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;
  if (!classroom) return <div>クラスが見つかりません。</div>;

  return (
    <div style={{ maxWidth: 700, margin: "48px auto 0 auto", padding: 24, background: "#f7faff", borderRadius: 16, boxShadow: "0 2px 12px #e3e3e3" }}>
      <div style={{ marginBottom: 24 }}>
        <a href="/main/classrooms" style={{ color: '#1976d2', marginRight: 16 }}>一覧に戻る</a>
        <a href="/" style={{ color: '#1976d2' }}>ホームに戻る</a>
      </div>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>{classroom.name}</h2>
      {/* content配列の内容を順番に表示 */}
      {Array.isArray(classroom.content) && classroom.content.length > 0 ? (
        classroom.content.map((block, idx) => {
          if (block.type === "title") {
            return <h3 key={idx} style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>{block.value}</h3>;
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
        <h3 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, textAlign: 'center' }}>内容未設定</h3>
      )}
      <div style={{ color: '#888', fontSize: 13, marginTop: 32 }}>作成日: {classroom.created_at && new Date(classroom.created_at).toLocaleString()}</div>
    </div>
  );
}
