"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import HeaderSwitcher from "@/components/Header/HeaderSwitcher";

// role取得用
async function getUserRole(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return error ? null : data?.role;
}

export default function NoticePage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [role, setRole] = useState("");
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "", image: null });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  // created_byのroleキャッシュ
  const [userRoles, setUserRoles] = useState({});

  // セッション・role取得
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(session);
      if (session?.user) {
        const r = await getUserRole(session.user.id);
        setRole(r);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // notice一覧取得
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("notice")
        .select("*")
        .order("created_at", { ascending: false });
      if (!mounted) return;
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setNotices(data || []);
      // created_byのroleを一括取得
      const userIds = Array.from(new Set((data || []).map(n => n.created_by).filter(Boolean)));
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id,role")
          .in("id", userIds);
        const roleMap = {};
        (profiles || []).forEach(p => { roleMap[p.id] = p.role; });
        setUserRoles(roleMap);
      }
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  // 投稿権限判定
  const canPost = role === "admin" || role === "council" || role === "operator";

  // 投稿処理
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setUploading(true);
    let imageUrl = null;
    try {
      // 画像アップロード
      if (form.image) {
        const file = form.image;
        const ext = file.name.split(".").pop();
        const fileName = `${session.user.id}_${Date.now()}.${ext}`;
        const { data, error: uploadError } = await supabase.storage
          .from("notice-images")
          .upload(fileName, file, { upsert: false });
        if (uploadError) throw new Error("画像アップロード失敗: " + uploadError.message);
        // URL取得
        const { data: urlData } = supabase.storage
          .from("notice-images")
          .getPublicUrl(fileName);
        imageUrl = urlData?.publicUrl || null;
      }
      // notice insert (created_byはsession.user.id)
      const { error: insertError } = await supabase
        .from("notice")
        .insert({
          title: form.title,
          description: form.description,
          image_url: imageUrl,
          created_by: session.user.id,
        });
      if (insertError) throw new Error("投稿失敗: " + insertError.message);
      setForm({ title: "", description: "", image: null });
      if (fileInputRef.current) fileInputRef.current.value = "";
      // 再取得
      const { data } = await supabase
        .from("notice")
        .select("*")
        .order("created_at", { ascending: false });
      setNotices(data || []);
      // created_byのrole再取得
      const userIds = Array.from(new Set((data || []).map(n => n.created_by).filter(Boolean)));
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id,role")
          .in("id", userIds);
        const roleMap = {};
        (profiles || []).forEach(p => { roleMap[p.id] = p.role; });
        setUserRoles(roleMap);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <HeaderSwitcher />
      <div style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
        <h1 style={{ fontSize: 28, marginBottom: 24 }}>お知らせ</h1>
        {/* 投稿フォーム（権限者のみ） */}
        {canPost && (
          <form onSubmit={handleSubmit} style={{ marginBottom: 32, background: "#f7faff", padding: 24, borderRadius: 12, boxShadow: "0 2px 8px #eee" }}>
            <div style={{ marginBottom: 12 }}>
              <input
                type="text"
                placeholder="タイトル"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
                style={{ width: "100%", padding: 10, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <textarea
                placeholder="説明文"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                required
                rows={3}
                style={{ width: "100%", padding: 10, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={e => setForm(f => ({ ...f, image: e.target.files[0] }))}
                style={{ fontSize: 15 }}
              />
            </div>
            <button
              type="submit"
              disabled={uploading}
              style={{ fontSize: 17, padding: "12px 28px", borderRadius: 8, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer" }}
            >
              {uploading ? "投稿中..." : "投稿する"}
            </button>
            {error && <div style={{ color: "#d00", marginTop: 10 }}>{error}</div>}
          </form>
        )}
        {/* 一覧表示 */}
        {loading ? (
          <div>読み込み中...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {notices.length === 0 ? (
              <div>お知らせはありません</div>
            ) : (
              notices.map(notice => {
                let roleLabel = "";
                const role = userRoles[notice.created_by];
                if (role === "council") roleLabel = "生徒会";
                else if (role === "admin") roleLabel = "教員";
                else if (role === "operator") roleLabel = "運営";
                else roleLabel = "";
                return (
                  <div key={notice.id} style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px #eee", padding: 18 }}>
                    <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>{notice.title}</div>
                    <div style={{ fontSize: 15, color: "#444", marginBottom: 8 }}>{notice.description}</div>
                    {notice.image_url && (
                      <img src={notice.image_url} alt="お知らせ画像" style={{ maxWidth: "100%", borderRadius: 8, marginBottom: 8 }} />
                    )}
                    <div style={{ fontSize: 13, color: "#888" }}>
                      投稿日: {new Date(notice.created_at).toLocaleString()} {roleLabel && `| 投稿者: ${roleLabel}`}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </>
  );
}
