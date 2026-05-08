function LocationList({ locations, onDeleteLocation }) {
  return (
    <div>
      <h3>Locations</h3>
      {locations.length === 0 && <p>No locations discovered yet...</p>}
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {locations.map((loc) => (
          <div key={loc.id} style={{ border: "1px solid #444", padding: "10px", borderRadius: "5px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{loc.name}</strong>
              <small style={{ color: "#aaa" }}>{loc.type}</small>
            </div>
            <p style={{ fontSize: "0.9rem" }}>{loc.description}</p>
            <button onClick={() => onDeleteLocation(loc.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LocationList;