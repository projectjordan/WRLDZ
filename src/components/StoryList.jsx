function StoryList({ story, onDeleteStoryBeat }) {
  if (story.length === 0) return <p>The timeline is empty. How does it begin?</p>;

  // Sort beats by the 'order' number
  const sortedStory = [...story].sort((a, b) => a.order - b.order);

  return (
    <div className="timeline">
      <h3>The Chronicle</h3>
      <div style={{ position: "relative", borderLeft: "2px solid #444", marginLeft: "10px", paddingLeft: "20px" }}>
        {sortedStory.map((beat) => (
          <div key={beat.id} style={{ marginBottom: "30px", position: "relative" }}>
            {/* The Timeline Dot */}
            <div style={{ 
              position: "absolute", 
              left: "-27px", 
              top: "5px", 
              width: "12px", 
              height: "12px", 
              borderRadius: "50%", 
              background: "#4a90e2" 
            }} />
            
            <div style={{ background: "#9e6f6f", padding: "15px", borderRadius: "8px", border: "1px solid #333" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ color: "#4a90e2" }}>Beat {beat.order}: {beat.title}</strong>
                <button 
                  onClick={() => onDeleteStoryBeat(beat.id)}
                  style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer" }}
                >
                  ✖
                </button>
              </div>
              <p style={{ whiteSpace: "pre-wrap", fontSize: "0.95rem", marginTop: "10px" }}>
                {beat.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoryList;