function CharacterList({ characters, onDeleteCharacter }) {
  return (
    <div>
      <h3>Characters</h3>

      {characters.length === 0 && <p>No characters yet...</p>}

      {characters.map((c) => (
        <div key={c.id} style={{ border: "1px solid gray", margin: "6px", padding: "6px" }}>
          <strong>{c.name}</strong>
          <p>{c.bio}</p>

          <button onClick={() => onDeleteCharacter(c.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default CharacterList