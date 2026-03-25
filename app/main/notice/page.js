"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import TagFilter from "@/components/TagFilter";

export default function NoticePage() {
  const router = useRouter();
  const { user, profile: authProfile, loading: authLoading } = useAuth();
  const role = authProfile?.role || "";
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "", files: [], tags: [] });
    // タグ選択（一覧フィルタ用）
    const [selectedTags, setSelectedTags] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const [userRoles, setUserRoles] = useState({});
  const [userNames, setUserNames] = useState({});
  const [search, setSearch] = useState("");

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
      // created_byのrole・nameを一括取得
      const userIds = Array.from(new Set((data || []).map(n => n.created_by).filter(Boolean)));
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id,role,name")
          .in("id", userIds);
        const roleMap = {};
        const nameMap = {};
        (profiles || []).forEach(p => {
          roleMap[p.id] = p.role;
          nameMap[p.id] = p.name || "(名無し)";
        });
        setUserRoles(roleMap);
        setUserNames(nameMap);
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
    try {
      // ファイルアップロード
      let uploadedFiles = [];
      if (form.files && form.files.length > 0) {
        for (let i = 0; i < form.files.length; i++) {
          const file = form.files[i];
          const ext = file.name.split(".").pop();
          const fileName = `${user.id}_${Date.now()}_${i}.${ext}`;
          const { data, error: uploadError } = await supabase.storage
            .from("notice-files")
            .upload(fileName, file, { upsert: false });
          if (uploadError) throw new Error("ファイルアップロード失敗: " + uploadError.message);
          const { data: urlData } = supabase.storage
            .from("notice-files")
            .getPublicUrl(fileName);
          uploadedFiles.push({
            url: urlData?.publicUrl || null,
            name: file.name,
            type: file.type
          });
        }
      }
      // notice insert (created_byはsession.user.id)
      const { error: insertError } = await supabase
        .from("notice")
        .insert({
          title: form.title,
          description: form.description,
          files: uploadedFiles.length > 0 ? uploadedFiles : null,
          tags: form.tags,
          created_by: user.id,
        });
      if (insertError) throw new Error("投稿失敗: " + insertError.message);
      setForm({ title: "", description: "", files: [], tags: [] });
      setFilePreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      // 再取得
      const { data } = await supabase
        .from("notice")
        .select("*")
        .order("created_at", { ascending: false });
      setNotices(data || []);
      // created_byのrole・name再取得
      const userIds = Array.from(new Set((data || []).map(n => n.created_by).filter(Boolean)));
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id,role,name")
          .in("id", userIds);
        const roleMap = {};
        const nameMap = {};
        (profiles || []).forEach(p => {
          roleMap[p.id] = p.role;
          nameMap[p.id] = p.name || "(名無し)";
        });
        setUserRoles(roleMap);
        setUserNames(nameMap);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <div style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
        <h1 style={{ fontSize: 28, marginBottom: 24 }}>お知らせ</h1>
        {/* 検索フォーム */}
        <div style={{ marginBottom: 24 }}>
          <input
            type="text"
            placeholder="タイトル・説明文で検索"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: 10, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
          />
        </div>
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
            {/* タグ選択 */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 15, marginBottom: 4 }}>タグ（複数選択可）</div>
              <TagFilter selectedTags={form.tags} setSelectedTags={tags => setForm(f => ({ ...f, tags }))} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>
                添付ファイル（最大10件・形式自由）
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={e => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;
                    setForm(f => {
                      if (f.files.length >= 10) return f;
                      // すでに同名ファイルがあれば追加しない
                      if (f.files.some(existing => existing.name === file.name && existing.size === file.size)) return f;
                      const newFiles = [...f.files, file];
                      // プレビュー生成
                      const previews = newFiles.map(file => {
                        let url = null;
                        if (file.type.startsWith("image/")) {
                          url = URL.createObjectURL(file);
                        }
                        return { url, name: file.name, type: file.type };
                      });
                      setFilePreviews(previews);
                      return { ...f, files: newFiles };
                    });
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  style={{ fontSize: 15 }}
                  disabled={form.files.length >= 10}
                />
                <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} style={{ padding: '6px 16px', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 15 }} disabled={form.files.length >= 10}>追加</button>
                <span style={{ fontSize: 13, color: '#888' }}>{form.files.length}/10</span>
              </div>
              {form.files.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>ファイルリスト:</div>
                  <ul style={{ paddingLeft: 18 }}>
                    {form.files.map((file, idx) => (
                      <li key={file.name + file.size} style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {file.type && file.type.startsWith("image/") ? (
                          <img src={filePreviews[idx]?.url} alt={file.name} style={{ maxWidth: 80, maxHeight: 60, borderRadius: 6, boxShadow: '0 2px 8px #eee', marginRight: 4, verticalAlign: 'middle' }} />
                        ) : (
                          <span style={{ marginRight: 4, fontSize: 15, color: '#888' }}>📄</span>
                        )}
                        <span style={{ fontSize: 13 }}>{file.name}</span>
                        <button type="button" onClick={() => {
                          setForm(f => {
                            const newFiles = f.files.filter((_, i) => i !== idx);
                            // プレビューも更新
                            const previews = newFiles.map(file => {
                              let url = null;
                              if (file.type.startsWith("image/")) {
                                url = URL.createObjectURL(file);
                              }
                              return { url, name: file.name, type: file.type };
                            });
                            setFilePreviews(previews);
                            return { ...f, files: newFiles };
                          });
                        }} style={{ marginLeft: 4, color: '#d32f2f', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15 }}>削除</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
        {/* タグフィルタ */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 15, marginBottom: 4 }}>タグで絞り込み</div>
          <TagFilter selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        </div>
        {/* 一覧表示 */}
        {loading ? (
          <div>読み込み中...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* 検索語・タグでフィルタ */}
            {(() => {
              let filtered = notices;
              // タグフィルタ
              if (selectedTags.length > 0) {
                filtered = filtered.filter(n => Array.isArray(n.tags) && n.tags.some(t => selectedTags.includes(t)));
              }
              // 検索フィルタ
              if (search.trim() !== "") {
                filtered = filtered.filter(n =>
                  n.title?.toLowerCase().includes(search.toLowerCase()) ||
                  n.description?.toLowerCase().includes(search.toLowerCase())
                );
              }
              if (filtered.length === 0) {
                return <div>お知らせはありません</div>;
              }
              return filtered.map(notice => {
                const role = userRoles[notice.created_by];
                const name = userNames[notice.created_by] || "(名無し)";
                let roleLabel = "";
                if (role === "council") roleLabel = "生徒会";
                else if (role === "admin") roleLabel = "教員";
                else if (role === "operator") roleLabel = "運営";
                else roleLabel = "";
                return (
                  <div key={notice.id} style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px #eee", padding: 18 }}>
                    <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>{notice.title}</div>
                    {/* タグ表示 */}
                    {Array.isArray(notice.tags) && notice.tags.length > 0 && (
                      <div style={{ marginBottom: 6 }}>
                        {notice.tags.map(tag => (
                          <span key={tag} style={{ display: 'inline-block', background: '#e3f2fd', color: '#1976d2', borderRadius: 8, padding: '2px 10px', fontSize: 13, marginRight: 6, marginBottom: 2 }}>{tag}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize: 15, color: "#444", marginBottom: 8 }}>
                      {notice.description?.split("\n").map((line, idx, arr) => (
                        <span key={idx}>
                          {line}
                          {idx !== arr.length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                    {/* files配列の表示 */}
                    {Array.isArray(notice.files) && notice.files.length > 0 && (
                      <div style={{ marginBottom: 8 }}>
                        {notice.files.map((f, idx) => (
                          <div key={idx} style={{ marginBottom: 6 }}>
                            {f.type && f.type.startsWith("image/") ? (
                              <img src={f.url} alt={f.name} style={{ maxWidth: 240, maxHeight: 160, borderRadius: 8, boxShadow: '0 2px 8px #eee', marginBottom: 2 }} />
                            ) : (
                              <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'underline', fontSize: 15 }}>
                                {f.name} をダウンロード
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize: 13, color: "#888" }}>
                      投稿日: {new Date(notice.created_at).toLocaleString()} | 投稿者: {name}{roleLabel ? `（${roleLabel}）` : ""}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>
    </>
  );
}
