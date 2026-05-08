function LoreList({ lore, onDeleteLore }) {
  if (lore.length === 0) return <p>The archives are empty...</p>;

  return (
    <div>
      <h3>The Archives</h3>
      {lore.map((entry) => (
        <div key={entry.id} style={{ border: "1px solid #444", padding: "15px", marginBottom: "10px", borderRadius: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0 }}>{entry.title}</h4>
            <span style={{ fontSize: "0.7rem", background: "#444", padding: "2px 8px", borderRadius: "10px" }}>
              {entry.category}
            </span>
          </div>
          <p style={{ whiteSpace: "pre-wrap", fontSize: "0.95rem", color: "#ccc" }}>{entry.content}</p>
          <button onClick={() => onDeleteLore(entry.id)} style={{ padding: "4px 8px", fontSize: "0.8rem" }}>
            Delete Entry
          </button>
        </div>
      ))}
    </div>
  );
}

export default LoreList;