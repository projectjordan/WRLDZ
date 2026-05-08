import { useState } from "react";

function CharacterForm({ onAddCharacter }) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) return;

    onAddCharacter({
      id: Date.now(),
      name,
      bio
    });

    setName("");
    setBio("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Character</h3>

      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <textarea
        placeholder="Bio"
        value={bio}
        onChange={e => setBio(e.target.value)}
      />

      <button type="submit">Add</button>
    </form>
  );
}

export default CharacterForm;