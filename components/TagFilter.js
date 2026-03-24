import React from "react";


// タグカテゴリごとにまとめる例
const TAG_CATEGORIES = [
  {
    label: "科目",
    tags: ["数学", "国語", "理科", "社会", "英語", "その他"]
  },
  {
    label: "学年",
    tags: ["中学1年", "中学2年", "中学3年", "高校1年", "高校2年", "高校3年"]
  }
  // 必要に応じてカテゴリ追加
];

export default function TagFilter({ selectedTags, setSelectedTags }) {
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
      {TAG_CATEGORIES.map(category => (
        <div key={category.label} style={{ marginBottom: 8 }}>
          <span style={{ fontWeight: 600, marginRight: 8 }}>{category.label}：</span>
          {category.tags.map(tag => (
            <label key={tag} style={{ marginRight: 8 }}>
              <input
                type="checkbox"
                checked={!!selectedTags.includes(tag)}
                onChange={() => handleChange(tag)}
              />
              {tag}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}
