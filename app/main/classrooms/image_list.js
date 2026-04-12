import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function ClubImageList({ onSelect, selectedUrl }) {
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError("");
      const { data, error } = await supabase.from("club_images").select("file_name, url, created_at").eq("user_id", user.id).order("created_at", { ascending: false });
      if (error) {
        setError("画像一覧の取得に失敗しました: " + error.message);
        setLoading(false);
        return;
      }
      setImages(data || []);
      setLoading(false);
    };
    if (user?.id) fetchImages();
  }, [user]);

  if (loading) return <div>画像一覧を読み込み中...</div>;
  if (error) return <div style={{ color: '#d32f2f' }}>{error}</div>;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
      {images.map(img => (
        <div key={img.file_name} style={{ border: selectedUrl === img.url ? '2px solid #1976d2' : '1px solid #ccc', borderRadius: 8, padding: 6, cursor: 'pointer', background: selectedUrl === img.url ? '#e3f2fd' : '#fff' }} onClick={() => onSelect(img.url)}>
          <img src={img.url} alt={img.file_name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, display: 'block', marginBottom: 4 }} />
          <div style={{ fontSize: 12, wordBreak: 'break-all', textAlign: 'center' }}>{img.file_name}</div>
          <div style={{ fontSize: 11, color: '#888', textAlign: 'center' }}>{new Date(img.created_at).toLocaleString()}</div>
        </div>
      ))}
      {images.length === 0 && <div>画像がありません。</div>}
    </div>
  );
}
