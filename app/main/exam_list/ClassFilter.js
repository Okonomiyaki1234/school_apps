"use client";
import React from 'react';

export default function ClassFilter({ classOptions, selectedClass, onChange }) {
  // selectedClass: "A,B" などカンマ区切り
  const selected = selectedClass ? selectedClass.split(',') : [];

  const handleChange = (className) => {
    let next = [...selected];
    if (next.includes(className)) {
      next = next.filter(c => c !== className);
    } else {
      next.push(className);
    }
    onChange(next);
  };

  const handleReset = () => {
    onChange([]);
  };

  return (
    <form style={{ marginBottom: '1rem' }} onSubmit={e => e.preventDefault()}>
      <span>クラスで絞り込み：</span>
      {classOptions.map((className) => (
        <label key={className} style={{ marginRight: '1em' }}>
          <input
            type="checkbox"
            name="class"
            value={className}
            checked={selected.includes(className)}
            onChange={() => handleChange(className)}
          />
          {className}
        </label>
      ))}
      <button
        type="button"
        onClick={handleReset}
      >リセット</button>
    </form>
  );
}
