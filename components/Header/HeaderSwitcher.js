"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import HeaderDefault from "./HeaderDefault";
import HeaderDark from "./HeaderDark";
import HeaderCool from "./HeaderCool";
import HeaderCute from "./HeaderCute";
import HeaderNatural from "./HeaderNatural";

const HEADER_MAP = {
  default: HeaderDefault,
  dark: HeaderDark,
  cool: HeaderCool,
  cute: HeaderCute,
  natural: HeaderNatural,
};

const ALL_THEMES = ["default", "dark", "cool", "cute", "natural"];
const THEME_LABELS = {
  default: "ライト",
  dark: "ダーク",
  cool: "クール",
  cute: "キュート",
  natural: "ナチュラル"
};

export default function HeaderSwitcher() {
  const { user, profile, loading } = useAuth();
  const [themeId, setThemeId] = useState("default");
  const [availableThemes, setAvailableThemes] = useState(["default"]);

  // AuthContext のプロフィールからテーマ情報を取得（追加の通信なし）
  useEffect(() => {
    if (loading) return;

    if (user && profile) {
      const themes = Array.isArray(profile.themes) && profile.themes.length > 0
        ? profile.themes
        : ["default"];
      setAvailableThemes(themes);
      const stored = localStorage.getItem("themeId");
      const id = stored && HEADER_MAP[stored] ? stored : themes[0] || "default";
      setThemeId(id);
    } else {
      localStorage.setItem("themeId", "default");
      setThemeId("default");
      setAvailableThemes(["default"]);
    }
  }, [user, profile, loading]);

  useEffect(() => {
    document.body.classList.remove(
      "theme-default",
      "theme-dark",
      "theme-cool",
      "theme-cute",
      "theme-natural"
    );
    document.body.classList.add(`theme-${themeId}`);
  }, [themeId]);

  const handleThemeChange = (id) => {
    setThemeId(id);
    localStorage.setItem("themeId", id);
    // bodyクラスはthemeId変更時のuseEffectで自動反映
  };

  const HeaderComponent = HEADER_MAP[themeId] || HeaderDefault;

  return (
    <>
      <HeaderComponent />
      <div style={{
        position: "fixed",
        top: 56,
        right: 16,
        zIndex: 2100,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 12px #0002",
        padding: "10px 18px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        minWidth: 180
      }}>
        <span style={{ fontWeight: 600, color: "#222", fontSize: 15, marginRight: 8, display: "flex", alignItems: "center", gap: 6 }}>
          テーマ切替
        </span>
        <select
          value={themeId}
          onChange={e => handleThemeChange(e.target.value)}
          style={{
            padding: "7px 16px",
            borderRadius: 8,
            border: "1px solid #bcd",
            fontSize: 15,
            background: "#f7faff",
            color: "#222",
            fontWeight: 600,
            outline: "none",
            boxShadow: "0 1px 4px #1976d211"
          }}
          disabled={loading}
        >
          {ALL_THEMES.map(theme => (
            <option
              key={theme}
              value={theme}
              disabled={!availableThemes.includes(theme)}
              style={{
                color: availableThemes.includes(theme) ? "#222" : "#aaa",
                background: availableThemes.includes(theme) ? "#fff" : "#eee"
              }}
            >
              {THEME_LABELS[theme]}
              {!availableThemes.includes(theme) ? "（ロック）" : ""}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
