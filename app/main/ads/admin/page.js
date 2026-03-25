"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { useAuth } from "../../../../context/AuthContext";

const AD_SPECS = {
  vertical: { label: "縦長バナー(120×600)" },
  horizontal: { label: "横長バナー(728×90)" },
};

export default function AdAdminPage() {
  const { user, profile } = useAuth();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [userNames, setUserNames] = useState({});
  const [userRoles, setUserRoles] = useState({});

  useEffect(() => {
    if (!profile?.role || profile.role !== "admin") return;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setAds(data || []);
      // user_id一覧からprofiles取得
      const userIds = Array.from(new Set((data || []).map(ad => ad.user_id).filter(Boolean)));
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
  }, [profile]);

  const handleAction = async (id, status) => {
    setActionMsg("");
    const { error } = await supabase
      .from("ads")
      .update({ status, approved_by: user.id, approved_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      setActionMsg("操作失敗: " + error.message);
    } else {
      setActionMsg("更新しました");
      setAds(ads => ads.map(ad => ad.id === id ? { ...ad, status, approved_by: user.id, approved_at: new Date().toISOString() } : ad));
    }
  };

  // 削除処理
  const handleDelete = async (id) => {
    if (!window.confirm("本当に削除しますか？")) return;
    setActionMsg("");
    const { error } = await supabase
      .from("ads")
      .delete()
      .eq("id", id);
    if (error) {
      setActionMsg("削除失敗: " + error.message);
    } else {
      setActionMsg("削除しました");
      setAds(ads => ads.filter(ad => ad.id !== id));
    }
  };

  if (!profile?.role || profile.role !== "admin") {
    return <div>権限がありません。</div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: "48px auto", padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #e0e7ef' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1976d2', marginBottom: 24 }}>広告申請管理</h2>
      {loading ? <div style={{ fontSize: 16, color: '#888', margin: '32px 0' }}>読み込み中...</div> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, background: '#f8fafc', borderRadius: 8, boxShadow: '0 2px 8px #f0f4fa' }}>
            <thead>
              <tr style={{ background: "#e3f2fd" }}>
                <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: 15 }}>画像</th>
                <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: 15 }}>タイプ</th>
                <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: 15 }}>メッセージ（メモ）</th>
                <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: 15 }}>学年クラス</th>
                <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: 15 }}>出席番号</th>
                <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: 15 }}>申請者</th>
                <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: 15 }}>状態</th>
                <th style={{ padding: '12px 8px', fontWeight: 700, fontSize: 15 }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {ads.map(ad => (
                <tr key={ad.id} style={{ borderBottom: "1px solid #e3e3e3", background: ad.status === 'pending' ? '#fffde7' : '#fff' }}>
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}><img src={ad.image_url} alt="ad" style={{ maxWidth: 80, maxHeight: 80, borderRadius: 6, border: '1px solid #b0bec5' }} /></td>
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>{AD_SPECS[ad.ad_type]?.label || ad.ad_type}</td>
                  <td style={{ padding: '10px 8px', maxWidth: 220, wordBreak: "break-all", fontSize: 14 }}>
                    {ad.editing ? (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          setActionMsg("");
                          const form = e.target;
                          const newMsg = form.elements["msg"].value;
                          const { error } = await supabase
                            .from("ads")
                            .update({ message: newMsg })
                            .eq("id", ad.id);
                          if (error) {
                            setActionMsg("メッセージ更新失敗: " + error.message);
                          } else {
                            setActionMsg("メッセージを更新しました");
                            setAds(ads => ads.map(a => a.id === ad.id ? { ...a, message: newMsg, editing: false } : a));
                          }
                        }}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <input
                          name="msg"
                          defaultValue={ad.message}
                          style={{ fontSize: 14, width: 140, marginRight: 8, padding: 4, borderRadius: 4, border: '1px solid #b0bec5' }}
                        />
                        <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginRight: 4 }}>保存</button>
                        <button type="button" onClick={() => setAds(ads => ads.map(a => a.id === ad.id ? { ...a, editing: false } : a))} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>キャンセル</button>
                      </form>
                    ) : (
                      <>
                        <span>{ad.message}</span>
                        <button onClick={() => setAds(ads => ads.map(a => a.id === ad.id ? { ...a, editing: true } : a))} style={{ marginLeft: 8, background: '#fbc02d', color: '#333', border: 'none', borderRadius: 6, padding: '2px 8px', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>編集</button>
                      </>
                    )}
                  </td>
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>{ad.grade || "-"}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>{ad.class_number || "-"}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center', fontSize: 13 }}>
                    {userNames[ad.user_id] || ad.user_id}
                    <span style={{ color: '#888', fontSize: 12, marginLeft: 4 }}>
                      {userRoles[ad.user_id] ? `(${userRoles[ad.user_id]})` : ''}
                    </span>
                  </td>
                  <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 600, color: ad.status === 'approved' ? '#388e3c' : ad.status === 'rejected' ? '#d32f2f' : '#fbc02d' }}>
                    {ad.status === "pending" ? "申請中" : ad.status === "approved" ? "承認" : "却下"}
                  </td>
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                    {ad.status === "pending" && (
                      <>
                        <button onClick={() => handleAction(ad.id, "approved")} style={{ marginRight: 8, background: '#388e3c', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>承認</button>
                        <button onClick={() => handleAction(ad.id, "rejected")} style={{ marginRight: 8, background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>却下</button>
                      </>
                    )}
                    <button onClick={() => handleDelete(ad.id)} style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginLeft: 4 }}>削除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {error && <div style={{ color: '#d32f2f', marginTop: 24, fontWeight: 600 }}>{error}</div>}
      {actionMsg && <div style={{ color: '#388e3c', marginTop: 24, fontWeight: 600 }}>{actionMsg}</div>}
    </div>
  );
}
