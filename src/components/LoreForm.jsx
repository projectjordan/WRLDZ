import { useState } from "react";

function LoreForm({ onAddLore }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("History");
  const [content, setContent] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    onAddLore({
      id: crypto.randomUUID(),
      title,
      category,
      content
    });

    setTitle("");
    setContent("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h3>Create Lore Entry</h3>
      <input
        placeholder="Entry Title (e.g., The Forbidden Forest)"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="History">History</option>
        <option value="Religion">Religion</option>
        <option value="Magic">Magic</option>
        <option value="Culture">Culture</option>
        <option value="Other">Other</option>
      </select>
      <textarea
        placeholder="Write the lore here..."
        value={content}
        rows="5"
        onChange={e => setContent(e.target.value)}
      />
      <button type="submit">Add Lore Entry</button>
    </form>
  );
}

export default LoreForm;