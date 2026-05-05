"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AdBanner from "@/components/AdBanner";
import { useAuth } from "@/context/AuthContext";

export default function SchoolHome() {
    const [notices, setNotices] = useState([]);
    const { profile } = useAuth();
    const isParent = !!profile?.isParent;
    useEffect(() => {
        (async () => {
            const { data, error } = await supabase
                .from("notice")
                .select("*")
                .order("created_at", { ascending: false });
            if (!error && Array.isArray(data)) {
                setNotices(data.slice(0, 3));
            }
        })();
    }, []);

        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: '100%',
                minHeight: '100vh',
                background: '#f7f7fa',
                paddingTop: 56
            }}>
                <AdBanner type="vertical" />
                <div style={{ maxWidth: 900, width: '100%', margin: '40px 0', padding: 24, background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #eee', minHeight: 600 }}>
                    {/* 告知ボックス */}
                    <div style={{
                        background: '#e6f7ff',
                        border: '1px solid #b3e0ff',
                        borderRadius: 8,
                        padding: '18px 20px',
                        marginBottom: 28,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 18
                    }}>
                        <span style={{ fontSize: 28, marginRight: 10 }}>🛠️</span>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: 18, color: '#0077b6', marginBottom: 4 }}>Let`s join in Shukutoku Advance!</div>
                            <div style={{ fontSize: 15, color: '#333' }}>
                                アドバンス関係のページなどを拾い集めました。
                            </div>
                        </div>
                    </div>

                    <h1 style={{ fontSize: 32, marginBottom: 24 }}>アドバンスページ（ここは有志的な感じです。）</h1>
                    <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 40 }}>
                        <div style={{ width: 260, height: 180, background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, boxShadow: "0 2px 8px #eee" }}>
                            <span style={{ color: "#888", fontSize: 18 }}>ここに画像が入ります</span>
                        </div>
                    </div>
                    <div style={{ maxWidth: 900, margin: "32px auto 0 auto", padding: 0 }}>
                        <AdBanner type="horizontal" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                                                {/* 保護者はアドバンスサイネージ非表示 */}
                                                {!isParent && (
                                                    <a href="https://studio-delta-six-29.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
                                                            <img src="https://placehold.jp/120x80.png" alt="アドバンスサイネージ" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
                                                            <div>
                                                                <div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>淑徳アドバンス デジタルサイネージ</div>
                                                                <div style={{ fontSize: 15, color: '#444' }}>淑徳アドバンスのサイネージが確認できます。</div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                )}
                                                {/* 保護者は映像視聴非表示 */}
                                                {!isParent && (
                                                    <a href="https://shukutoku-online.com/login" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
                                                            <img src="https://placehold.jp/120x80.png" alt="映像視聴" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
                                                            <div>
                                                                <div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>映像視聴</div>
                                                                <div style={{ fontSize: 15, color: '#444' }}>アドバンスの映像を視聴するサイトにアクセス</div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                )}
                                                {/* 保護者はプログラミング講座ポータル非表示 */}
                                                {!isParent && (
                                                    <a href="https://tech-shukutokuadvance.vercel.app" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
                                                            <img src="https://placehold.jp/120x80.png" alt="プログラミング講座ポータル" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
                                                            <div>
                                                                <div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>プログラミング講座ポータル</div>
                                                                <div style={{ fontSize: 15, color: '#444' }}>アドバンスのプログラミング講座ポータルにアクセス</div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                )}
                        <div style={{ opacity: 0.6, pointerEvents: 'none' }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18 }}>
                                <img src="https://placehold.jp/120x80.png?text=Coming+Soon" alt="Coming Soon" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
                                <div>
                                    <div style={{ fontSize: 20, fontWeight: 600, color: '#888', marginBottom: 6 }}>Coming Soon...</div>
                                    <div style={{ fontSize: 15, color: '#888' }}>新しい機能を準備中です</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ maxWidth: 900, margin: "0 auto 32px auto", padding: 0 }}>
                        <AdBanner type="horizontal" />
                    </div>
                </div>
                <AdBanner type="vertical" />
            </div>
        );
}
