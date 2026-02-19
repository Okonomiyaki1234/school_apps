"use client";
import { useState } from "react";

const weekDays = ["月", "火", "水", "木", "金", "土", "日"];

function getMonthMatrix(year, month) {
	// month: 0-indexed
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);
	const matrix = [];
	let week = [];
	// 月曜始まりに調整
	let startOffset = (firstDay.getDay() + 6) % 7;
	for (let i = 0; i < startOffset; i++) week.push(null);
	for (let d = 1; d <= lastDay.getDate(); d++) {
		week.push(d);
		if (week.length === 7) {
			matrix.push(week);
			week = [];
		}
	}
	while (week.length < 7) week.push(null);
	matrix.push(week);
	return matrix;
}

export default function CalendarPage() {
	const today = new Date();
	const [year, setYear] = useState(today.getFullYear());
	const [month, setMonth] = useState(today.getMonth()); // 0-indexed
	const matrix = getMonthMatrix(year, month);

	const handlePrev = () => {
		if (month === 0) {
			setYear(year - 1);
			setMonth(11);
		} else {
			setMonth(month - 1);
		}
	};
	const handleNext = () => {
		if (month === 11) {
			setYear(year + 1);
			setMonth(0);
		} else {
			setMonth(month + 1);
		}
	};

	return (
		<div style={{ maxWidth: 500, margin: "40px auto", padding: 20, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
			<h2 style={{ textAlign: "center" }}>学校行事カレンダー</h2>
			<div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginBottom: 16 }}>
				<button onClick={handlePrev}>←</button>
				<span style={{ fontWeight: "bold", fontSize: 18 }}>{year}年 {month + 1}月</span>
				<button onClick={handleNext}>→</button>
			</div>
			<table style={{ width: "100%", borderCollapse: "collapse" }}>
				<thead>
					<tr>
						{weekDays.map((d, i) => (
							<th key={d} style={{ padding: 6, background: i >= 5 ? "#f0f8ff" : "#f8f8f8", color: i === 6 ? "#d00" : i === 5 ? "#06c" : "#222" }}>{d}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{matrix.map((week, i) => (
						<tr key={i}>
							{week.map((d, j) => (
								   <td key={j} style={{ height: 60, padding: "4px 4px 8px 4px", textAlign: "left", border: "1px solid #eee", background: d ? "#fff" : "#f9f9f9", color: j === 6 ? "#d00" : j === 5 ? "#06c" : "#222", verticalAlign: "top" }}>
									   <div style={{ minHeight: 18, fontWeight: "bold", fontSize: 15, marginBottom: 2 }}>{d || ""}</div>
									   {/* 行事データなどをここに表示予定 */}
									   <div style={{ fontSize: 13, color: "#333", minHeight: 24 }}>
										   {/* 例: <span>卒業式</span> */}
									   </div>
								   </td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			<p style={{ marginTop: 24, color: "#888", fontSize: 14, textAlign: "center" }}>※ 行事の追加・編集機能は今後実装予定</p>
		</div>
	);
}
