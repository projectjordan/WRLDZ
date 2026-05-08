import { useState } from "react";

function LocationForm({ onAddLocation }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("City");
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    onAddLocation({
      id: crypto.randomUUID(), // Using the safer ID method
      name,
      type,
      description
    });

    setName("");
    setDescription("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h3>Add Location</h3>
      <input
        placeholder="Location Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="City">City</option>
        <option value="Region">Region</option>
        <option value="Tavern">Tavern</option>
        <option value="Dungeon">Dungeon</option>
        <option value="Landmark">Landmark</option>
      </select>
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <button type="submit">Add Location</button>
    </form>
  );
}

export default LocationForm;