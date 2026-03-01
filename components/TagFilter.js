import React from "react";

const TAGS = [
  "数学",
  "国語",
  "理科",
  "社会",
  "英語",
  "その他"
];

export default function TagFilter({ selectedTags, setSelectedTags, userId }) {
  function handleChange(tag) {
    let newTags;
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter(t => t !== tag);
    } else {
      newTags = [...selectedTags, tag];
    }
    setSelectedTags(newTags);
  }

  return (
    <div>
      {TAGS.map(tag => (
        <label key={tag} style={{marginRight:8}}>
          <input
            type="checkbox"
            checked={!!selectedTags.includes(tag)}
            onChange={() => handleChange(tag)}
          />
          {tag}
        </label>
      ))}
    </div>
  );
}
