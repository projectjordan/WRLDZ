import { useState } from "react";

const CharacterForm = ({ onAddCharacter }) => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState(""); // NEW
  const [profession, setProfession] = useState(""); // NEW

const handleSubmit = (e) => {
  e.preventDefault();
  if (!name.trim()) return;

  onAddCharacter({ 
    id: crypto.randomUUID().toString(), // Ensure a unique ID
    name, 
    description: bio, 
    age, 
    profession, 
    groupIds: [] // This must be a literal empty array here
  });

  // Reset form
  setName("");
  setBio("");
  setAge("");
  setProfession("");
};

  return (
    <form onSubmit={handleSubmit} className="card form-container">
      <input type="text" placeholder="Character Name" value={name} onChange={(e) => setName(e.target.value)} />
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <input type="text" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} style={{ flex: 1 }} />
        <input type="text" placeholder="Profession" value={profession} onChange={(e) => setProfession(e.target.value)} style={{ flex: 2 }} />
      </div>
      <textarea placeholder="Biography/Description" value={bio} onChange={(e) => setBio(e.target.value)} />
      <button type="submit">Add Character</button>
    </form>
  );
};

export default CharacterForm;