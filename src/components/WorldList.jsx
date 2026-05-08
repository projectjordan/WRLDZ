function WorldList({ worlds, onSelectWorld, onDeleteWorld }) {
  
  const handleDeleteClick = (e, world) => {
    e.stopPropagation(); // Prevents the world from being selected
    
    // Confirmation Pop-up
    const confirmed = window.confirm(
      `Are you sure you want to delete "${world.name}"? This will erase all characters, locations, and lore permanently.`
    );
    
    if (confirmed) {
      onDeleteWorld(world.id);
    }
  };

  return (
    <div>
      <h2>Your Worlds</h2>

      {worlds.length === 0 && <p>No worlds yet...</p>}

      {worlds.map((world) => (
        <div key={world.id} style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0" }}>
          
          {/* THE WORLD CARD */}
          <div
            onClick={() => onSelectWorld(world.id)}
            style={{
              flex: 1, // Takes up remaining space
              cursor: "pointer",
              border: "1px solid #444",
              borderRadius: "8px",
              padding: "15px",
              backgroundColor: "#bc9393",
              transition: "border-color 0.2s"
            }}
          >
            <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem" }}>{world.name}</h3>
            <p style={{ margin: "0", opacity: 0.7, fontSize: "0.8rem" }}>
              {world.description.substring(0, 50)}{world.description.length > 50 ? "..." : ""}
            </p>
          </div>

          {/* THE EXTERNAL DELETE BUTTON */}
          <button
            onClick={(e) => handleDeleteClick(e, world)}
            title="Delete World"
            style={{
              background: "#333",
              color: "#ff4d4d",
              border: "1px solid #444",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              flexShrink: 0 // Prevents button from squishing
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default WorldList;