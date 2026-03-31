
"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Footer() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    if (!window.confirm("強制ログアウトしますか？")) return;
    await signOut();
  };
  return (
    <footer className="footer-responsive">
      {/* レスポンシブ用CSSをインラインで追加 */}
      <style>{`
        .footer-responsive {
          width: 100%;
          background: #f5f5f7;
          color: #444;
          padding: 32px 0 18px 0;
          margin-top: 48px;
          border-top: 1px solid #e0e0e0;
          text-align: center;
          position: relative;
        }
        .footer-links {
          margin-bottom: 12px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 0 8px;
        }
        .footer-link {
          color: #1976d2;
          margin: 0 16px;
          text-decoration: none;
          font-weight: 500;
          font-size: 15px;
        }
        .footer-version {
          position: absolute;
          left: 12px;
          bottom: 8px;
          font-size: 11px;
          color: #888;
          opacity: 0.8;
          background: rgba(255,255,255,0.7);
          border-radius: 4px;
          padding: 1px 6px;
          font-weight: 500;
          z-index: 10;
          transition: left 0.2s, right 0.2s, bottom 0.2s;
        }
        .footer-logout {
          position: absolute;
          right: 12px;
          bottom: 8px;
          background: none;
          border: none;
          color: #bbb;
          font-size: 11px;
          cursor: pointer;
          opacity: 0.5;
          padding: 0;
          z-index: 10;
          text-decoration: underline;
          transition: left 0.2s, right 0.2s, bottom 0.2s;
        }
        @media (max-width: 600px) {
          .footer-links {
            flex-direction: column;
            gap: 4px 0;
          }
          .footer-version {
            position: static;
            display: block;
            margin: 12px auto 0 auto;
            left: unset;
            bottom: unset;
            text-align: center;
          }
          .footer-logout {
            position: static;
            display: block;
            margin: 8px auto 0 auto;
            right: unset;
            bottom: unset;
            text-align: center;
          }
        }
      `}</style>
      <div className="footer-links">
        {/* 外部リンク例 */}
        <a href="https://shukutoku.ed.jp/" target="_blank" rel="noopener noreferrer" className="footer-link">
          学校公式ホームページ
        </a>
        <Link href="/main/read/terms" className="footer-link">
          利用規約
        </Link>
        <Link href="/main/read/privacy" className="footer-link">
          プライバシーポリシー
        </Link>
        <Link href="/main/read/credits" className="footer-link">
          クレジット
        </Link>
        <a href="https://forms.gle/Us1XA89gTS3fpuBn6" target="_blank" rel="noopener noreferrer" className="footer-link">
          フィードバック
        </a>
      </div>
      {/* バージョン表記（小さく・見やすく） */}
      <div className="footer-version" aria-label="バージョン情報">
        β版1.0
      </div>
      <div
        style={{
          fontSize: 20,
          color: '#1565c0',
          fontWeight: 800,
          marginBottom: 12,
          letterSpacing: 2,
          textShadow: '0 2px 8px #b3d1f7',
        }}
      >
        「利他共生」
      </div>
      <div style={{ fontSize: 14, color: '#1976d2', marginBottom: 8, fontWeight: 500 }}>
        「ここでの大抵の不具合は、リロードすれば直る！」
      </div>
      <div style={{ fontSize: 13, color: "#888" }}>
        &copy; {new Date().getFullYear()} 淑徳中学・高等学校ポータル
      </div>
      {/* 強制ログアウトボタン（目立たない・右下 or 下部中央） */}
      <button
        onClick={handleLogout}
        className="footer-logout"
        aria-label="強制ログアウト"
        tabIndex={0}
      >
        強制ログアウト
      </button>
    </footer>
  );
}
