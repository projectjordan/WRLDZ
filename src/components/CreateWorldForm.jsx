import { useState } from "react";

function CreateWorldForm({ onAddWorld }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) return;

    const newWorld = {
      id: Date.now(),
      name,
      description,
      characters: []
    };

    onAddWorld(newWorld);

    setName("");
    setDescription("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create World</h2>

      <input
        type="text"
        placeholder="World Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit">Add World</button>
    </form>
  );
}

export default CreateWorldForm;