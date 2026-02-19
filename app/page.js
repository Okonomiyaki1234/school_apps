import Link from "next/link";

export default function Home() {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh" }}>
            <h1 style={{ marginBottom: 32 }}>学校行事カレンダー</h1>
            <Link href="/create">
                <button style={{ fontSize: 18, padding: "16px 32px", borderRadius: 8, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 2px 8px #eee" }}>
                    行事カレンダーを見る
                </button>
            </Link>
        </div>
    );
}