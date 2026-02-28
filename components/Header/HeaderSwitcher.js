"use client";
import { useEffect, useState } from "react";
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

export default function HeaderSwitcher() {
  const [themeId, setThemeId] = useState("default");

  // 初期化時とthemeId変更時にbodyへテーマクラスを付与
  useEffect(() => {
    const stored = localStorage.getItem("themeId");
    const id = stored && HEADER_MAP[stored] ? stored : "default";
    setThemeId(id);
    document.body.classList.remove(
      "theme-default",
      "theme-dark",
      "theme-cool",
      "theme-cute",
      "theme-natural"
    );
    document.body.classList.add(`theme-${id}`);
  }, []);

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
        >
          <option value="default">ライト</option>
          <option value="dark">ダーク</option>
          <option value="cool">クール</option>
          <option value="cute">キュート</option>
          <option value="natural">ナチュラル</option>
        </select>
      </div>
    </>
  );
}
