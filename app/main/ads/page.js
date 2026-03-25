"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";

const AD_SPECS = {
  vertical: { label: "縦長バナー(120×600)", width: 120, height: 600 },
  horizontal: { label: "横長バナー(728×90)", width: 728, height: 90 },
};

export default function AdApplyPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [adType, setAdType] = useState("vertical");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState("");
  const [gradeClass, setGradeClass] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    setError("");
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

  const validateImage = (img) => {
    return new Promise((resolve, reject) => {
      const image = new window.Image();
      image.onload = () => {
        const { width, height } = AD_SPECS[adType];
        if (image.width === width && image.height === height) {
          resolve();
        } else {
          reject(`画像サイズが正しくありません。${width}×${height}ピクセルの画像を選択してください。`);
        }
      };
      image.onerror = () => reject("画像の読み込みに失敗しました。");
      image.src = URL.createObjectURL(img);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!file) {
      setError("画像ファイルを選択してください。");
      return;
    }
    if (!message.trim()) {
      setError("先生へのメッセージを入力してください。");
      return;
    }
    if (gradeClass && !/^\d{1,2}-[0-9A-Za-z]{1,2}$/.test(gradeClass.trim())) {
      setError("学年クラスは半角数字-半角数字または英字（例: 2-1, 3-A）で入力してください。");
      return;
    }
    if (studentNumber && !/^\d{1,3}$/.test(studentNumber.trim())) {
      setError("出席番号は数字のみで入力してください。");
      return;
    }
    setUploading(true);
    try {
      await validateImage(file);
      const ext = file.name.split('.').pop();
      const fileName = `ad_${adType}_${user.id}_${Date.now()}.${ext}`;
      const bucket = adType === "vertical" ? "ads-vertical" : "ads-horizontal";
      const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: false });
      if (uploadError) throw new Error("画像アップロード失敗: " + uploadError.message);
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      const imageUrl = urlData?.publicUrl;
      if (!imageUrl) throw new Error("画像URL取得失敗");
      const { error: insertError } = await supabase.from("ads").insert({
        user_id: user.id,
        image_url: imageUrl,
        message,
        grade: gradeClass ? gradeClass.trim() : null,
        class_number: studentNumber ? Number(studentNumber) : null,
        ad_type: adType,
        status: "pending",
      });
      if (insertError) throw new Error("申請登録失敗: " + insertError.message);
      setSuccess("申請が完了しました。承認までお待ちください。");
      setFile(null);
      setPreviewUrl("");
      setMessage("");
      setGradeClass("");
      setStudentNumber("");
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #e0e7ef' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1976d2', margin: 0 }}>学内広告申請フォーム</h2>
        {profile?.role === "admin" && (
          <button
            onClick={() => router.push("/main/ads/admin")}
            style={{ background: '#388e3c', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
          >
            承認管理へ
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} style={{ background: '#f8fafc', borderRadius: 8, padding: 24, boxShadow: '0 2px 8px #f0f4fa' }}>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600 }}>広告タイプ</label><br />
          <select value={adType} onChange={e => setAdType(e.target.value)} disabled={uploading} style={{ width: 220, padding: 6, borderRadius: 4, border: '1px solid #b0bec5', marginTop: 4 }}>
            {Object.entries(AD_SPECS).map(([key, spec]) => (
              <option key={key} value={key}>{spec.label}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600 }}>画像ファイル</label><br />
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} style={{ marginTop: 4 }} />
        </div>
        {previewUrl && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>プレビュー</div>
            <img src={previewUrl} alt="preview" style={{ maxWidth: 220, borderRadius: 8, boxShadow: '0 2px 8px #eee', border: '1px solid #b0bec5' }} />
          </div>
        )}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600 }}>先生へのメッセージ</label><br />
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} style={{ width: '100%', borderRadius: 4, border: '1px solid #b0bec5', padding: 8, marginTop: 4 }} disabled={uploading} />
        </div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 600 }}>学年クラス（例: 2-1, 3-A）<span style={{ color: '#888', fontWeight: 400 }}>（任意）</span></label><br />
            <input
              type="text"
              value={gradeClass}
              onChange={e => setGradeClass(e.target.value)}
              maxLength={6}
              disabled={uploading}
              placeholder="例: 2-1, 3-A"
              style={{ width: '100%', borderRadius: 4, border: '1px solid #b0bec5', padding: 6, marginTop: 4 }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 600 }}>出席番号<span style={{ color: '#888', fontWeight: 400 }}>（任意）</span></label><br />
            <input
              type="number"
              value={studentNumber}
              onChange={e => setStudentNumber(e.target.value)}
              min={1}
              max={999}
              disabled={uploading}
              placeholder="例: 12"
              style={{ width: '100%', borderRadius: 4, border: '1px solid #b0bec5', padding: 6, marginTop: 4 }}
            />
          </div>
        </div>
        <button type="submit" disabled={uploading} style={{ width: '100%', padding: '10px 0', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', fontSize: 17, fontWeight: 700, letterSpacing: 1 }}>{uploading ? "申請中..." : "申請する"}</button>
      </form>
      {error && <div style={{ color: '#d32f2f', marginTop: 20, fontWeight: 600 }}>{error}</div>}
      {success && <div style={{ color: '#388e3c', marginTop: 20, fontWeight: 600 }}>{success}</div>}
    </div>
  );
}
