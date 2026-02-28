"use client";
// タグ選択肢（今はファイル内で定義）
const TAG_OPTIONS = [
  "中学1年", "中学2年", "中学3年", "高校1年", "高校2年", "高校3年", "図書館"
];
import FullCalendar from "@fullcalendar/react";
import type { EventDropArg, EventContentArg } from "@fullcalendar/core";
import type { EventResizeDoneArg } from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState, useCallback } from "react";
import { useEffect as useAuthEffect } from "react";
import { format, addDays } from "date-fns";
import { supabase } from "@/lib/supabase";
import { CalendarEvent } from "@/types/event";

// isAdmin propは廃止し、認証状態で判定
;

export default function Calendar() {
  // ポップアップ用state
  const [popup, setPopup] = useState<{ title: string; description: string } | null>(null);
  // イベント追加モーダル用state
  const [addModalOpen, setAddModalOpen] = useState(false);
  type AddFormType = {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    tags: string[];
  };
  const [addForm, setAddForm] = useState<AddFormType>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    tags: [],
  });

  // 入力フォーム変更ハンドラ
  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: value }));
  };

  // タグ選択（追加モーダル用）
  const handleAddFormTagChange = (tag: string) => {
    setAddForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t: string) => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  // イベント追加処理
  const handleAddEvent = async () => {
    if (!addForm.title || !addForm.start_date || !addForm.end_date) {
      alert('タイトル・開始日・終了日は必須です');
      return;
    }
    // end_dateを+1日して送信
    let endDateStr = addForm.end_date;
    try {
      const endDateObj = new Date(addForm.end_date);
      const nextDay = addDays(endDateObj, 1);
      endDateStr = format(nextDay, 'yyyy-MM-dd');
    } catch (e) {
      // フォーマット失敗時はそのまま
    }
    const { error } = await supabase.from('events').insert({
      title: addForm.title,
      description: addForm.description,
      start_date: addForm.start_date,
      end_date: endDateStr,
      tags: addForm.tags,
    });
    if (error) {
      alert('追加に失敗しました');
      return;
    }
    setAddModalOpen(false);
    setAddForm({ title: '', description: '', start_date: '', end_date: '', tags: [] });
    fetchEvents();
  };
  // イベントクリック時にポップアップ表示
  const handleEventClick = (info: any) => {
    setPopup({
      title: info.event.title,
      description: info.event.extendedProps?.description ?? "説明はありません"
    });
  };

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  // 認証状態取得
  useAuthEffect(() => {
    let isMounted = true;

    const syncUserAndRole = async (nextUser: any) => {
      if (!isMounted) return;

      setUser(nextUser ?? null);

      if (nextUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", nextUser.id)
          .single();

        if (!isMounted) return;
        setIsAdmin(profile?.role === "admin");
      } else {
        setIsAdmin(false);
      }
    };

    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await syncUserAndRole(session?.user ?? null);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await syncUserAndRole(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // イベント取得
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("events").select("*");
    if (error) {
      setLoading(false);
      return;
    }
    if (!data) {
      setEvents([]);
      setLoading(false);
      return;
    }
    // FullCalendar用に変換（全て終日イベント、allDay不要）
    const formatted = data.map((e: any) => ({
      id: e.id,
      title: e.title,
      start: e.start_date, // date型文字列
      end: e.end_date,     // date型文字列
      tags: e.tags || [],
      description: e.description || "",
    }));
    setEvents(formatted as any);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // イベント削除
  const handleDelete = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
    fetchEvents();
  };

  // ドラッグ&ドロップ/リサイズ
  const handleEventDrop = async (info: EventDropArg | EventResizeDoneArg) => {
    const { event } = info;
    // FullCalendarのevent.start/endはローカルタイムなので、date-fnsでローカル日付をYYYY-MM-DDに変換
    const toLocalDateString = (d: Date | null) => d ? format(d, "yyyy-MM-dd") : null;
    await supabase
      .from("events")
      .update({
        start_date: toLocalDateString(event.start),
        end_date: toLocalDateString(event.end),
      })
      .eq("id", event.id);
    fetchEvents();
  };

  // 右クリック削除
  const handleEventDidMount = (info: EventContentArg) => {
    if (!isAdmin) return;
    // @ts-ignore
    const el = info.event._def?.ui?.el || info.event.el || undefined;
    if (!el) return;
    el.addEventListener("contextmenu", (e: MouseEvent) => {
      e.preventDefault();
      if (window.confirm("このイベントを削除しますか？")) {
        handleDelete(info.event.id as string);
      }
    });
  };

  // タグ選択チェックボックスのハンドラ
  const handleTagChange = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // 選択されたタグに一致するイベントのみ表示
  const filteredEvents = selectedTags.length === 0
    ? events
    : events.filter(e => e.tags && e.tags.some((t: string) => selectedTags.includes(t)));

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee", padding: 24 }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>学校行事カレンダー</h2>
      {/* 管理者のみイベント追加ボタン */}
      {isAdmin && (
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <button
            onClick={() => setAddModalOpen(true)}
            style={{ padding: "8px 24px", fontSize: 16, borderRadius: 6, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer" }}
          >イベント追加</button>
        </div>
      )}
      <div style={{ marginBottom: 16, textAlign: "center" }}>
        {TAG_OPTIONS.map(tag => (
          <label key={tag} style={{ marginRight: 12, fontSize: 15 }}>
            <input
              type="checkbox"
              checked={selectedTags.includes(tag)}
              onChange={() => handleTagChange(tag)}
              style={{ marginRight: 4 }}
            />
            {tag}
          </label>
        ))}
      </div>
      <div style={{ marginBottom: 16, textAlign: "right" }}>
        {user ? (
          <span style={{ fontSize: 14, color: isAdmin ? '#1976d2' : '#888' }}>
            ログイン中: {user.email} {isAdmin ? '(管理者)' : ''}
          </span>
        ) : (
          <span style={{ fontSize: 14, color: '#888' }}>ログインしていません</span>
        )}
      </div>
      {/* イベント追加モーダル */}
      {addModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={() => setAddModalOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              boxShadow: "0 2px 16px #8888",
              padding: 32,
              minWidth: 320,
              maxWidth: "80vw",
              textAlign: "center",
              position: "relative"
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 16, fontSize: 20 }}>イベント追加</h3>
            <div style={{ marginBottom: 16 }}>
              <input
                type="text"
                name="title"
                placeholder="タイトル"
                value={addForm.title}
                onChange={handleAddFormChange}
                style={{ width: '90%', padding: 8, fontSize: 16, marginBottom: 10, borderRadius: 4, border: '1px solid #ccc' }}
              />
              <br />
              <textarea
                name="description"
                placeholder="説明"
                value={addForm.description}
                onChange={handleAddFormChange}
                style={{ width: '90%', padding: 8, fontSize: 15, minHeight: 60, borderRadius: 4, border: '1px solid #ccc', marginBottom: 10 }}
              />
              <br />
              <input
                type="date"
                name="start_date"
                value={addForm.start_date}
                onChange={handleAddFormChange}
                style={{ marginRight: 8, padding: 6, fontSize: 15, borderRadius: 4, border: '1px solid #ccc' }}
              />
              ～
              <input
                type="date"
                name="end_date"
                value={addForm.end_date}
                onChange={handleAddFormChange}
                style={{ marginLeft: 8, padding: 6, fontSize: 15, borderRadius: 4, border: '1px solid #ccc' }}
              />
              <br />
              <div style={{ margin: '12px 0', textAlign: 'left', fontSize: 15 }}>
                <span style={{ fontWeight: 'bold', marginRight: 8 }}>タグ選択:</span>
                {TAG_OPTIONS.map(tag => (
                  <label key={tag} style={{ marginRight: 12 }}>
                    <input
                      type="checkbox"
                      checked={addForm.tags.includes(tag)}
                      onChange={() => handleAddFormTagChange(tag)}
                      style={{ marginRight: 4 }}
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </div>
            <button
              onClick={handleAddEvent}
              style={{ padding: "8px 24px", fontSize: 16, borderRadius: 6, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer", marginRight: 12 }}
            >追加</button>
            <button
              onClick={() => setAddModalOpen(false)}
              style={{ padding: "8px 24px", fontSize: 16, borderRadius: 6, background: "#888", color: "#fff", border: "none", cursor: "pointer" }}
            >キャンセル</button>
          </div>
        </div>
      )}
      {loading ? (
        <div style={{ textAlign: "center", color: "#888" }}>読み込み中...</div>
      ) : (
        <>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={filteredEvents}
            editable={isAdmin}
            eventDrop={isAdmin ? handleEventDrop : undefined}
            eventResize={isAdmin ? handleEventDrop : undefined}
            eventDidMount={handleEventDidMount}
            eventClick={handleEventClick}
            height="auto"
            locale="ja"
            headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,dayGridWeek,dayGridDay" }}
          />
          {popup && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000
              }}
              onClick={() => setPopup(null)}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  boxShadow: "0 2px 16px #8888",
                  padding: 32,
                  minWidth: 320,
                  maxWidth: "80vw",
                  textAlign: "center",
                  position: "relative"
                }}
                onClick={e => e.stopPropagation()}
              >
                <h3 style={{ marginBottom: 16, fontSize: 22 }}>{popup.title}</h3>
                <div style={{ fontSize: 16, color: "#333", marginBottom: 24, whiteSpace: "pre-wrap" }}>{popup.description || "説明はありません"}</div>
                {isAdmin && (
                  <button
                    onClick={async () => {
                      if (window.confirm("本当にこのイベントを削除しますか？")) {
                        // 対象イベントを特定
                        const event = events.find(e => e.title === popup.title && e.description === popup.description);
                        if (event) {
                          await handleDelete(event.id);
                          setPopup(null);
                        } else {
                          alert("イベントが見つかりませんでした");
                        }
                      }
                    }}
                    style={{
                      padding: "8px 24px",
                      fontSize: 16,
                      borderRadius: 6,
                      background: "#d32f2f",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      marginRight: 12
                    }}
                  >削除</button>
                )}
                <button
                  onClick={() => setPopup(null)}
                  style={{ padding: "8px 24px", fontSize: 16, borderRadius: 6, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer" }}
                >閉じる</button>
              </div>
            </div>
          )}
        </>
      )}
      <p style={{ marginTop: 24, color: "#888", fontSize: 14, textAlign: "center" }}>※ 管理者のみイベント編集・削除・追加が可能です</p>
    </div>
  );
}