"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

// クラス用画像アップロードページ
export default function ClassroomImageUploadPage() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [copyMsg, setCopyMsg] = useState("");

  // 画像一覧取得
  const fetchImages = async () => {
    setLoadingImages(true);
    const { data, error } = await supabase
      .from("club_images")
      .select("file_name, url, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setImages(data || []);
    setLoadingImages(false);
  };

  useEffect(() => {
    if (user?.id) fetchImages();
    // eslint-disable-next-line
  }, [user, success]);

  // ファイル選択時
  const handleFileChange = (e) => {
    setError("");
    setSuccess("");
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl("");
    }
  };

  // 画像アップロード
  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!file) {
      setError("ファイルを選択してください。");
      return;
    }
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `classroom_${Date.now()}_${Math.floor(Math.random()*10000)}.${ext}`;
    const { error } = await supabase.storage.from("club-images").upload(fileName, file, { upsert: false });
    if (error) {
      setError("アップロード失敗: " + error.message);
      setUploading(false);
      return;
    }
    // 公開URL取得
    const { data: urlData } = supabase.storage.from("club-images").getPublicUrl(fileName);
    if (urlData?.publicUrl) {
      // メタ情報をclub_imagesテーブルに保存
      const { error: metaError } = await supabase.from("club_images").insert({
        user_id: user.id,
        file_name: fileName,
        url: urlData.publicUrl
      });
      if (metaError) {
        setError("メタ情報保存失敗: " + metaError.message);
        setUploading(false);
        return;
      }
      setSuccess("アップロード成功！URL: " + urlData.publicUrl);
    } else {
      setError("URL取得失敗");
    }
    setUploading(false);
    setFile(null);
    setPreviewUrl("");
  };

  // 画像削除
  const handleDelete = async (img) => {
    setError("");
    setSuccess("");
    if (!window.confirm(`本当に画像「${img.file_name}」を削除しますか？`)) return;
    // ストレージから削除
    const { error: storageError } = await supabase.storage.from("club-images").remove([img.file_name]);
    if (storageError) {
      setError("ストレージ削除失敗: " + storageError.message);
      return;
    }
    // DBから削除
    const { error: dbError } = await supabase.from("club_images").delete().eq("file_name", img.file_name);
    if (dbError) {
      setError("DB削除失敗: " + dbError.message);
      return;
    }
    setSuccess("画像を削除しました。");
    fetchImages();
  };

  return (
    <div style={{ maxWidth: 600, margin: "48px auto 0 auto", padding: 24 }}>
      <h2 style={{ fontSize: 22, marginBottom: 16 }}>クラス用画像アップロード</h2>
      <form onSubmit={handleUpload} style={{ marginBottom: 24 }}>
        <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
        <button type="submit" disabled={uploading} style={{ marginLeft: 12, padding: '8px 20px', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', fontSize: 15 }}>{uploading ? "アップロード中..." : "アップロード"}</button>
      </form>
      {previewUrl && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>プレビュー</div>
          <img src={previewUrl} alt="プレビュー" style={{ maxWidth: 200, borderRadius: 8, boxShadow: '0 2px 8px #eee' }} />
        </div>
      )}
      {error && <div style={{ color: '#d32f2f', marginTop: 12 }}>{error}</div>}
      {success && <div style={{ color: '#388e3c', marginTop: 12, wordBreak: 'break-all' }}>{success}</div>}

      <h3 style={{ fontSize: 18, margin: '32px 0 12px 0' }}>アップロード済み画像一覧</h3>
      {loadingImages ? (
        <div>画像一覧を読み込み中...</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {images.map(img => (
            <div key={img.file_name} style={{ border: '1px solid #b0bec5', borderRadius: 8, padding: 8, background: '#fff', width: 120, textAlign: 'center', position: 'relative' }}>
              <img src={img.url} alt={img.file_name} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 6, marginBottom: 4 }} />
              <div style={{ fontSize: 12, wordBreak: 'break-all', marginBottom: 4 }}>{img.file_name}</div>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{new Date(img.created_at).toLocaleString()}</div>
              <button onClick={() => {navigator.clipboard.writeText(img.url); setCopyMsg(img.file_name); setTimeout(()=>setCopyMsg(""), 1200);}} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: 4 }}>URLコピー</button>
              {copyMsg === img.file_name && <span style={{ color: '#388e3c', fontSize: 11, marginLeft: 4 }}>コピーしました</span>}
              <button onClick={() => handleDelete(img)} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: '#d32f2f', color: '#fff', border: 'none', cursor: 'pointer', marginTop: 4 }}>削除</button>
            </div>
          ))}
          {images.length === 0 && <div style={{ color: '#888', fontSize: 14 }}>画像がありません。</div>}
        </div>
      )}
    </div>
  );
}
