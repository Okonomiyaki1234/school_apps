import { supabase } from "@/lib/supabase";

// 称号名リスト
const LOGIN_TITLES = [
  { value: 3, name: "「三顧之礼」" },
  { value: 7, name: "「七転八起」" },
  { value: 30, name: "「日進月歩」" },
  { value: 100, name: "「初志貫徹」" },
  { value: 365, name: "石の上に合計一年" },
];
const KEEP_TITLES = [
  { value: 3, name: "三日坊主卒業" },
  { value: 7, name: "一週間の達人" },
  { value: 30, name: "石の意志" },
  { value: 100, name: "鋼の心" },
  { value: 365, name: "石の上にずっと一年" },
];
const USE_TITLES = {
  calendar: [
    { value: 1, name: "予定の開拓者" },
    { value: 15, name: "ログ：予定確認" },
    { value: 30, name: "記録の番人" },
  ],
  menu: [
    { value: 1, name: "食堂の開拓者" },
    { value: 15, name: "ログ：メニュー確認" },
    { value: 30, name: "食堂の番人" },
  ],
};
const SPECIAL_DATES = [
  { month: 1, day: 1, name: "あけおめ！" },
  { month: 2, day: 3, name: "厄払いの使者" },
  { month: 2, day: 14, name: "訪問者とチョコレゐト" },
  { month: 2, day: 22, name: "にゃんこフレンド" },
  { month: 3, day: 3, name: "桃の節句" },
  { month: 3, day: 14, name: "君に感謝を" },
  { month: 4, day: 1, name: "噓と真実の旅人" },
  { month: 5, day: 5, name: "こどもでいたいけど…" },
  { month: 7, day: 7, name: "星に願いを" },
  { month: 8, day: 31, name: "夏の終わりに…" },
  { month: 10, day: 31, name: "トリック・オア…" },
  { month: 11, day: 11, name: "このよき日" },
  { month: 12, day: 25, name: "聖夜の訪問者" },
  { month: 12, day: 31, name: "年貢の…年納めの旅人" },
];

function isYesterday(dateStr: string, today: Date): boolean {
  const date = new Date(dateStr);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

export async function handleLoginAchievement(userId: string) {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("last_login, total_login, keep_login, achievement_list, created_at, themes")
    .eq("id", userId)
    .single();
  if (error || !profile) return;

  let { last_login, total_login, keep_login, achievement_list, created_at, themes } = profile;
  achievement_list = Array.isArray(achievement_list) ? achievement_list : [];
  themes = Array.isArray(themes) ? themes : [];

  // ログイン判定
  if (last_login === todayStr) return; // 本日ログイン済み
  let isFirstLoginToday = false;
  if (isYesterday(last_login, today)) {
    total_login++;
    keep_login++;
    isFirstLoginToday = true;
  } else {
    total_login++;
    keep_login = 1;
    isFirstLoginToday = true;
  }
  last_login = todayStr;

  // 超低確率称号（0.01%）
  if (isFirstLoginToday) {
    // 「今日 私ツイてるんだっ」
    const lucky = Math.random() < 0.0001;
    if (lucky && !achievement_list.includes("今日 私ツイてるんだっ")) {
      achievement_list.push("今日 私ツイてるんだっ");
    }
    // 「私の一周年」
    if (created_at) {
      const createdDate = new Date(created_at);
      const todayDate = new Date(todayStr);
      const diffDays = Math.floor((todayDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 365 && !achievement_list.includes("私の一周年")) {
        achievement_list.push("私の一周年");
      }
    }
  }

  // 称号付与
  LOGIN_TITLES.forEach(t => {
    if (total_login === t.value && !achievement_list.includes(t.name)) {
      achievement_list.push(t.name);
    }
  });
  KEEP_TITLES.forEach(t => {
    if (keep_login === t.value && !achievement_list.includes(t.name)) {
      achievement_list.push(t.name);
    }
  });

  // 特殊日付称号
  SPECIAL_DATES.forEach(s => {
    if (
      today.getMonth() + 1 === s.month &&
      today.getDate() === s.day &&
      !achievement_list.includes(s.name)
    ) {
      achievement_list.push(s.name);
    }
  });

  // テーマ付与ロジック
  const themeUnlocks = [
    { count: 5, theme: "cool" },
    { count: 10, theme: "cute" },
    { count: 15, theme: "natural" },
  ];
  let themesUpdated = false;
  themeUnlocks.forEach(({ count, theme }) => {
    if (achievement_list.length >= count && !themes.includes(theme)) {
      themes.push(theme);
      themesUpdated = true;
    }
  });

  if (themesUpdated) {
    await supabase
      .from("profiles")
      .update({ last_login, total_login, keep_login, achievement_list, themes })
      .eq("id", userId);
  } else {
    await supabase
      .from("profiles")
      .update({ last_login, total_login, keep_login, achievement_list })
      .eq("id", userId);
  }
}

export async function handleUseAchievement(userId: string, type: "calendar" | "menu") {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(`use_${type}, achievement_list, themes`)
    .eq("id", userId)
    .single();
  if (error || !profile) return;
  let useCount = 0;
  if (type === "calendar" && "use_calendar" in profile) {
    useCount = profile.use_calendar || 0;
  } else if (type === "menu" && "use_menu" in profile) {
    useCount = profile.use_menu || 0;
  }
  let achievement_list = Array.isArray(profile.achievement_list) ? profile.achievement_list : [];
  let themes = Array.isArray(profile.themes) ? profile.themes : [];
  useCount++;
  USE_TITLES[type].forEach(t => {
    if (useCount === t.value && !achievement_list.includes(t.name)) {
      achievement_list.push(t.name);
    }
  });
  // テーマ付与ロジック
  const themeUnlocks = [
    { count: 5, theme: "cool" },
    { count: 10, theme: "cute" },
    { count: 15, theme: "natural" },
  ];
  let themesUpdated = false;
  themeUnlocks.forEach(({ count, theme }) => {
    if (achievement_list.length >= count && !themes.includes(theme)) {
      themes.push(theme);
      themesUpdated = true;
    }
  });
  if (themesUpdated) {
    await supabase
      .from("profiles")
      .update({ [`use_${type}`]: useCount, achievement_list, themes })
      .eq("id", userId);
  } else {
    await supabase
      .from("profiles")
      .update({ [`use_${type}`]: useCount, achievement_list })
      .eq("id", userId);
  }
}
