"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import HeaderSwitcher from "@/components/Header/HeaderSwitcher";
import { Achievement } from "@/types/achievement";

const LEVEL_COLORS = {
  ブロンズ: "#cd7f32",
  シルバー: "#c0c0c0",
  ゴールド: "#ffd700",
  隠し: "#6a4fb6",
  ロック: "#bdbdbd"
};

export default function AchievementPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState<string>("");
  const [filterObtained, setFilterObtained] = useState<string>("");

  useEffect(() => {
    const fetchAchievements = async () => {
      const { data, error } = await supabase
        .from("achievement")
        .select("id, name, description, level")
        .order("id", { ascending: true });
      if (!error && data) setAchievements(data);
    };
    fetchAchievements();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("achievement_list")
          .eq("id", session.user.id)
          .single();
        if (!error && data) setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;

  // フィルター適用
  let filteredAchievements = achievements;
  if (filterLevel) {
    filteredAchievements = filteredAchievements.filter(a => a.level === filterLevel);
  }
  if (filterObtained) {
    if (filterObtained === "取得済み") {
      filteredAchievements = filteredAchievements.filter(a => Array.isArray(profile?.achievement_list) && profile.achievement_list.includes(a.name));
    } else if (filterObtained === "未取得") {
      filteredAchievements = filteredAchievements.filter(a => !Array.isArray(profile?.achievement_list) || !profile.achievement_list.includes(a.name));
    }
  }
  // 隠しレベルは未取得の場合は表示しない
  filteredAchievements = filteredAchievements.filter(a => {
    if (a.level !== "隠し") return true;
    return Array.isArray(profile?.achievement_list) && profile.achievement_list.includes(a.name);
  });

  return (
    <div>
      <HeaderSwitcher />
      <div style={{ height: 64 }} />
      <h1 style={{
        fontSize: "2.4rem",
        fontWeight: "bold",
        margin: "0 0 24px",
        textAlign: "center",
        letterSpacing: "0.08em",
        color: "#333",
        textShadow: "0 2px 8px #e0c068, 0 0px 2px #fff",
        borderBottom: "3px double #c0c0c0",
        paddingBottom: 8,
        background: "linear-gradient(90deg, #fffbe6 0%, #f7f7f7 100%)",
        borderRadius: 8,
        boxShadow: "none",
        maxWidth: 480,
        marginLeft: "auto",
        marginRight: "auto",
        border: "none"
      }}>称号一覧</h1>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "center", gap: 32 }}>
        <div>
          <label style={{ fontWeight: "bold", marginRight: 8 }}>レベル:</label>
          <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #ccc" }}>
            <option value="">全て</option>
            <option value="ブロンズ">ブロンズ</option>
            <option value="シルバー">シルバー</option>
            <option value="ゴールド">ゴールド</option>
            <option value="隠し">隠し</option>
          </select>
        </div>
        <div>
          <label style={{ fontWeight: "bold", marginRight: 8 }}>取得状況:</label>
          <select value={filterObtained} onChange={e => setFilterObtained(e.target.value)} style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #ccc" }}>
            <option value="">全て</option>
            <option value="取得済み">取得済み</option>
            <option value="未取得">未取得</option>
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, justifyContent: "center" }}>
        {filteredAchievements.map(a => {
          const obtained = Array.isArray(profile?.achievement_list) && profile.achievement_list.includes(a.name);
          const color = obtained ? LEVEL_COLORS[a.level] : LEVEL_COLORS["ロック"];
          const textColor = a.level === "隠し" ? (obtained ? "#111" : "#888") : (obtained ? "#222" : "#888");
          return (
            <div key={a.id} style={{
              boxShadow: "none",
              border: "none",
              borderRadius: 12,
              padding: 0,
              background: color,
              opacity: obtained ? 1 : 0.7,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: 140,
              transition: "box-shadow 0.2s, border 0.2s"
            }}>
              <div style={{
                background: obtained ? "rgba(255,255,255,0.92)" : "rgba(245,245,245,0.92)",
                borderRadius: 8,
                boxShadow: "none",
                padding: 16,
                width: "90%",
                margin: "16px 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "none",
                color: textColor
              }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: 8 }}>{a.name}</h3>
                <div style={{ fontSize: "0.95rem", fontWeight: "bold", marginBottom: 6 }}>レベル: {a.level}</div>
                {obtained ? (
                  <p style={{ textAlign: "center", margin: 0 }}>
                    {a.description.split("\n").map((line, idx) => (
                      <span key={idx}>
                        {line}
                        {idx !== a.description.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                ) : (
                  <p style={{ fontStyle: "italic", margin: 0 }}>ロック中</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
