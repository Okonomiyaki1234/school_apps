"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AdBanner from "@/components/AdBanner";

export default function SchoolHome() {
    const [notices, setNotices] = useState([]);
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
                    <h1 style={{ fontSize: 32, marginBottom: 24 }}>ツール一覧</h1>
                    <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 40 }}>
                        <div style={{ width: 260, height: 180, background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, boxShadow: "0 2px 8px #eee" }}>
                            <span style={{ color: "#888", fontSize: 18 }}>ここに画像が入ります</span>
                        </div>
                    </div>
                    <div style={{ maxWidth: 900, margin: "32px auto 0 auto", padding: 0 }}>
                        <AdBanner type="horizontal" />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                        <a href="https://studio-delta-six-29.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
                                <img src="https://placehold.jp/120x80.png" alt="アドバンス" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
                                <div>
                                    <div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>淑徳アドバンス デジタルサイネージ</div>
                                    <div style={{ fontSize: 15, color: '#444' }}>淑徳アドバンスのサイネージが確認できます。</div>
                                </div>
                            </div>
                        </a>
                        <Link href="/main/cafeteria" style={{ textDecoration: "none" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
                                <img src="https://placehold.jp/120x80.png" alt="食堂" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
                                <div>
                                    <div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>食堂</div>
                                    <div style={{ fontSize: 15, color: '#444' }}>食堂のメニューを確認できます</div>
                                </div>
                            </div>
                        </Link>
                        <Link href="/main/exam_list" style={{ textDecoration: "none" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
                                <img src="https://placehold.jp/120x80.png" alt="試験範囲" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
                                <div>
                                    <div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>試験範囲</div>
                                    <div style={{ fontSize: 15, color: '#444' }}>試験範囲を確認できます</div>
                                </div>
                            </div>
                        </Link>
                        <a href="https://attendance-register-by-watashimori-kohl.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
                                <img src="https://placehold.jp/120x80.png" alt="出欠登録サイト(同製作者による外部サイト)" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
                                <div>
                                    <div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>出欠登録サイト</div>
                                    <div style={{ fontSize: 15, color: '#444' }}>出欠登録を行うことができます。部活等向け。※同製作者による外部サイトです。</div>
                                </div>
                            </div>
                        </a>
                        <a href="https://seat-changer-three.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
                                <img src="https://placehold.jp/120x80.png" alt="席替えツール" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
                                <div>
                                    <div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>席替えツール</div>
                                    <div style={{ fontSize: 15, color: '#444' }}>席替えを簡単に行うことができます。</div>
                                </div>
                            </div>
                        </a>
                        <a href="https://inventory-management-gray-eight.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
                                <img src="https://placehold.jp/120x80.png" alt="在庫管理ツール" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
                                <div>
                                    <div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>在庫管理ツール</div>
                                    <div style={{ fontSize: 15, color: '#444' }}>在庫管理を簡単に行うことができます。</div>
                                </div>
                            </div>
                        </a>
                        <Link href="/main/ads" style={{ textDecoration: "none" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 24, background: '#f7faff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 18, cursor: 'pointer', transition: 'background 0.2s' }}>
                                <img src="https://placehold.jp/120x80.png" alt="広告" style={{ width: 120, height: 80, borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px #eee' }} />
                                <div>
                                    <div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 6 }}>広告</div>
                                    <div style={{ fontSize: 15, color: '#444' }}>広告情報を確認できます</div>
                                </div>
                            </div>
                        </Link>
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
