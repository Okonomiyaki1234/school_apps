"use client";
import React from 'react';

export default function GradeFilter({ gradeOptions, selectedGrade, onChange }) {
  // selectedGrade: "中学1年生,高校2年生" などカンマ区切り
  const selected = selectedGrade ? selectedGrade.split(',') : [];

  const handleChange = (grade) => {
    let next = [...selected];
    if (next.includes(grade)) {
      next = next.filter(g => g !== grade);
    } else {
      next.push(grade);
    }
    onChange(next);
  };

  const handleReset = () => {
    onChange([]);
  };

  return (
    <form style={{ marginBottom: '1rem' }} onSubmit={e => e.preventDefault()}>
      <span>学年で絞り込み：</span>
      {gradeOptions.map((grade) => (
        <label key={grade} style={{ marginRight: '1em' }}>
          <input
            type="checkbox"
            name="grade"
            value={grade}
            checked={selected.includes(grade)}
            onChange={() => handleChange(grade)}
          />
          {grade}
        </label>
      ))}
      <button
        type="button"
        onClick={handleReset}
      >リセット</button>
    </form>
  );
}
