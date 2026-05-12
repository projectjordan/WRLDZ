import { useState } from "react";

function StoryForm({ onAddStoryBeat }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [order, setOrder] = useState(1);

 function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    onAddStoryBeat({
      id: crypto.randomUUID(),
      name: title, // Changed from 'title' to 'name' to match the registry
      content,
      order: Number(order)
    });

    setTitle("");
    setContent("");
    setOrder(prev => Number(prev) + 1);
  }
  
  return (
  <form onSubmit={handleSubmit} style={{ 
    marginBottom: "20px", 
    border: "1px solid #8e6060", 
    padding: "15px", 
    borderRadius: "8px",
    width: "100%",      // Force full width
    boxSizing: "border-box" // Prevents padding from breaking the width
  }}>
    <h3>New Story Beat</h3>
    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
      <input
        style={{ flex: 1, padding: "8px" }} // Flex: 1 makes the title take all available space
        placeholder="Beat Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        style={{ width: "80px", padding: "8px" }}
        type="number"
        value={order}
        onChange={e => setOrder(e.target.value)}
      />
    </div>
    <textarea
      placeholder="What happens..."
      value={content}
      rows="6"
      style={{ 
        width: "100%",      // Take up all horizontal space
        padding: "10px", 
        boxSizing: "border-box", 
        fontFamily: "inherit" 
      }}
      onChange={e => setContent(e.target.value)}
    />
    <button type="submit" style={{ marginTop: "10px", width: "100%" }}>
      Add Beat to Timeline
    </button>
  </form>
);
}

export default StoryForm;