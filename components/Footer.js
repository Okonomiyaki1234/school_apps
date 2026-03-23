import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        background: "#f5f5f7",
        color: "#444",
        padding: "32px 0 18px 0",
        marginTop: 48,
        borderTop: "1px solid #e0e0e0",
        textAlign: "center"
      }}
    >
      <div style={{ marginBottom: 12 }}>
        {/* 外部リンク例 */}
        <a href="https://www.example.com" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", margin: "0 16px", textDecoration: "none", fontWeight: 500 }}>
          外部サイト
        </a>
        <Link href="/terms" style={{ color: "#1976d2", margin: "0 16px", textDecoration: "none", fontWeight: 500 }}>
          利用規約
        </Link>
        <Link href="/privacy" style={{ color: "#1976d2", margin: "0 16px", textDecoration: "none", fontWeight: 500 }}>
          プライバシーポリシー
        </Link>
      </div>
      <div style={{ fontSize: 13, color: "#888" }}>
        &copy; {new Date().getFullYear()} 淑徳中学・高等学校ポータル
      </div>
    </footer>
  );
}
