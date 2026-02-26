"use client";
import React from "react";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";

// 仮のメニューデータ（将来的にはDBから取得）
const menuData = [
	{ id: 1, name: "カレーライス", price: 450, category: "rice" },
	{ id: 2, name: "チャーハン", price: 400, category: "rice" },
	{ id: 3, name: "ラーメン", price: 500, category: "noodle" },
	{ id: 4, name: "うどん", price: 420, category: "noodle" },
	{ id: 5, name: "フライドポテト", price: 200, category: "snack" },
	{ id: 6, name: "唐揚げ", price: 300, category: "snack" },
	{ id: 7, name: "お茶", price: 120, category: "drink" },
	{ id: 8, name: "コーヒー", price: 150, category: "drink" },
];

const categories = [
	{ key: "rice", label: "米系" },
	{ key: "noodle", label: "麺類" },
	{ key: "snack", label: "軽食" },
	{ key: "drink", label: "飲み物" },
];

export default function CafeteriaPage() {
	return (
		<>
			<Header />
			<main style={{ padding: "2rem", paddingTop: "3.5rem" }}>
				<h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem", textAlign: "center" }}>食堂メニュー</h1>
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						gap: "2rem",
						justifyContent: "center",
						alignItems: "flex-start",
						marginBottom: "2.5rem",
					}}
				>
					{categories.map((cat) => {
						const items = menuData.filter((item) => item.category === cat.key);
						if (items.length === 0) return null;
						return (
							<section
								key={cat.key}
								style={{
									background: "#f6f8fa",
									border: "1px solid #e0e0e0",
									borderRadius: "12px",
									minWidth: "240px",
									maxWidth: "340px",
									flex: "1 1 260px",
									boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
									padding: "1.2rem 1.1rem 1.1rem 1.1rem",
									display: "flex",
									flexDirection: "column",
									alignItems: "stretch",
								}}
							>
								<h2 style={{ fontSize: "1.15rem", marginBottom: "0.7rem", textAlign: "center", fontWeight: 600 }}>{cat.label}</h2>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "0.7rem",
									}}
								>
									{items.map((item) => (
										<div
											key={item.id}
											style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												background: "#fff",
												border: "1px solid #e0e0e0",
												borderRadius: "8px",
												padding: "0.7rem 1.1rem",
												boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
											}}
										>
											<span style={{ fontSize: "1.05rem", fontWeight: 500 }}>{item.name}</span>
											<span style={{ fontSize: "1.05rem", fontWeight: 500 }}>{item.price}円</span>
										</div>
									))}
								</div>
							</section>
						);
					})}
				</div>
				<div style={{ marginTop: "2rem", color: "#888", textAlign: "center" }}>
					{/* 将来的にモバイルオーダー機能をここに追加したい */}
					<p>※製作者が進化したらモバイルオーダー機能を追加したいなぁ…</p>
				</div>
			</main>
		</>
	);
}
