import { useState, useEffect } from "react";
import CreateWorldForm from "./components/CreateWorldForm";
import CharacterForm from "./components/CharacterForm";
import LocationForm from "./components/LocationForm";
import LoreForm from "./components/LoreForm";
import StoryForm from "./components/StoryForm";
import "./App.css";

// --- SUB-COMPONENTS ---

const GlobalQuickAdd = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("characters");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
  e.preventDefault();
  if (!name.trim()) return;
  const newEntry = { 
    id: Date.now().toString(), 
    name, 
    description: "", 
    age: "",         // Keep fields consistent
    profession: "",  // Keep fields consistent
    groupIds: [],    // CRITICAL: Ensure this is here
    content: "", 
    type: "General", 
    modules: {} 
  };
  onAdd(type, newEntry);
  setName("");
  onClose();
};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="quick-add-modal card" onClick={e => e.stopPropagation()}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
          <h3 style={{margin:0, color:'var(--accent)'}}>Quick Creator</h3>
          <small>ESC to close</small>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="quick-add-row">
            <select value={type} onChange={(e) => setType(e.target.value)} className="search-input">
              <option value="characters">Character</option>
              <option value="locations">Location</option>
              <option value="lore">Lore</option>
            </select>
            <input 
              autoFocus type="text" placeholder="Entry name..." value={name} 
              onChange={(e) => setName(e.target.value)}
              className="search-input" style={{flex: 1, marginLeft: '10px'}}
            />
          </div>
          <button type="submit" className="expand-btn" style={{width:'100%', marginTop:'15px', background:'var(--accent)', color:'white'}}>Create</button>
        </form>
      </div>
    </div>
  );
};

const StoryBeat = ({ beat, index, searchQuery, linkRegistry, navigateToEntry, updateEntry, deleteEntry }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const content = beat.content || "";
  const isLong = content.length > 200;

  return (
    <div id={beat.id} className="timeline-item card">
      <div className="timeline-marker" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <small style={{ color: 'var(--accent)', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            BEAT {index + 1}:
          </small>
          {/* ADDED: This allows you to see and edit the Title (name) */}
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
            <EditableRow 
              item={beat} 
              field="name" 
              placeholder="Untitiled Beat"
              searchQuery={searchQuery}
              onSave={(d) => updateEntry('story', beat.id, d)} 
            />
          </h3>
        </div>
        <button className="card-delete" style={{ position: 'static', fontSize: '1rem' }} onClick={() => deleteEntry('story', beat.id)}>×</button>
      </div>

      {!isExpanded && isLong ? (
        <div className="beat-preview" onClick={() => setIsExpanded(true)}>
          <HighlightedText 
            text={content.substring(0, 200) + "..."} 
            highlight={searchQuery} 
            onLinkClick={navigateToEntry} 
          />
          <button className="expand-btn">Read More</button>
        </div>
      ) : (
        <>
          <EditableRow 
            item={beat} 
            field="content" 
            isMultiline={true} 
            searchQuery={searchQuery} 
            linkRegistry={linkRegistry} 
            onLinkClick={navigateToEntry} 
            onSave={(d) => updateEntry('story', beat.id, d)} 
          />
          {isLong && (
            <button className="expand-btn" onClick={() => setIsExpanded(false)}>Show Less</button>
          )}
        </>
      )}
    </div>
  );
};


const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{opacity: 0.3, marginLeft: '8px'}}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const HighlightedText = ({ text, highlight, onLinkClick }) => {
  if (!text) return null;
  // Updated regex to include 'story'
  const linkRegex = /(\[\[(?:char|loc|lore|story):.+?\|.+?\]\])/g;
  
  const renderContent = (content) => {
    if (!highlight.trim()) return content;
    const searchRegex = new RegExp(`(${highlight})`, "gi");
    const searchParts = content.split(searchRegex);
    return searchParts.map((p, i) => 
      searchRegex.test(p) ? <mark key={i} className="search-highlight">{p}</mark> : p
    );
  };

  const parts = text.split(linkRegex);
  return (
    <span>
      {parts.map((part, i) => {
        // Updated match group to include 'story'
        const linkMatch = part.match(/\[\[(char|loc|lore|story):(.+?)\|(.+?)\]\]/);
        if (linkMatch) {
          const [_, type, id, label] = linkMatch;
          return (
            <strong 
              key={i} 
              className={`world-link-tag ${type}`} 
              onClick={(e) => { 
                e.stopPropagation(); 
                onLinkClick(type, id); 
              }} 
              style={{ cursor: 'pointer' }}
            >
              {label}
            </strong>
          );
        }
        return <span key={i}>{renderContent(part)}</span>;
      })}
    </span>
  );
};


const EditableRow = ({ item, onSave, field = "name", isMultiline = false, label = "", searchQuery = "", linkRegistry = [], onLinkClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");
  const [showLinkMenu, setShowLinkMenu] = useState(false);

  // 1. Dynamic Filtering: This ensures the menu shows what you're actually looking for
  const filteredLinks = showLinkMenu 
    ? linkRegistry.filter(link => {
        const parts = value.split('@');
        const lastPart = parts[parts.length - 1].toLowerCase();
        return link.name.toLowerCase().includes(lastPart);
      })
    : [];

useEffect(() => {
    // ONLY set the value to the specific field we asked for.
    // This stops the Title from accidentally showing the Bio text.
    setValue(item[field] || "");
  }, [item, field]);

  const save = () => {
    if (value.trim() !== (item[field] || "")) onSave({ [field]: value });
    setIsEditing(false);
    setShowLinkMenu(false);
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // 2. Open if user types @, keep open while they type search term
    // Only closes if @ is removed
    setShowLinkMenu(newValue.includes('@'));
  };

  const insertLink = (linkable) => {
    // 3. Find the LAST @ to replace it correctly
    const lastAtIndex = value.lastIndexOf('@');
    const prefix = value.slice(0, lastAtIndex); 
    const newValue = `${prefix}[[${linkable.type}:${linkable.id}|${linkable.name}]] `;
    
    setValue(newValue);
    setShowLinkMenu(false);
  };

  return (
    <div className="editable-wrapper">
      {isEditing ? (
        <div className="edit-container" style={{ position: 'relative' }}>
          {isMultiline ? (
            <textarea 
              autoFocus 
              className="edit-input-field" 
              value={value} 
              onChange={handleChange} 
              onBlur={() => setTimeout(save, 250)} 
            />
          ) : (
            <input 
              autoFocus 
              className="edit-input-field" 
              value={value} 
              onChange={handleChange} 
              onBlur={() => setTimeout(save, 250)} 
              onKeyDown={(e) => e.key === 'Enter' && save()} 
            />
          )}

          {/* 4. Only show menu if we actually have matches */}
          {showLinkMenu && filteredLinks.length > 0 && (
            <div className="link-selector-dropdown">
              {filteredLinks.map((linkable) => (
                <div 
                  key={linkable.id} 
                  className="link-option" 
                  onMouseDown={(e) => { e.preventDefault(); insertLink(linkable); }}
                >
                  <span>{linkable.name}</span>
                  <span style={{fontSize:'0.7rem', color:'var(--accent)'}}>{linkable.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="editable-display-trigger" onClick={() => setIsEditing(true)} style={{display:'flex', alignItems:'baseline'}}>
          {label && <span style={{color:'var(--accent)', marginRight:'8px', fontWeight:'600'}}>{label}:</span>}
          <span className="display-text">
            <HighlightedText text={String(value)} highlight={searchQuery} onLinkClick={onLinkClick} />
            {!value && <em style={{ opacity: 0.3 }}>Add {field}...</em>}
          </span>
          <EditIcon />
        </div>
      )}
    </div>
  );
};

const GroupTags = ({ character, allGroups, onAddGroup, onRemoveGroup, onCreateGroup }) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter groups character ISN'T in yet
  const suggestions = allGroups.filter(g => 
    !character.groupIds?.includes(g.id) && 
    g.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      const existing = allGroups.find(g => g.name.toLowerCase() === query.toLowerCase());
      if (existing) {
        onAddGroup(character.id, existing.id);
      } else {
        onCreateGroup(character.id, query.trim());
      }
      setQuery("");
      setShowSuggestions(false);
    }
  };

  return (
    <div className="group-tags-container">
      <div className="tag-list">
        {character.groupIds?.map(gid => {
          const group = allGroups.find(g => g.id === gid);
          return (
            <span key={gid} className="group-tag">
              {group?.name}
              <button onClick={() => onRemoveGroup(character.id, gid)}>×</button>
            </span>
          );
        })}
      </div>
      
      <div style={{position: 'relative'}}>
        <input 
          type="text" 
          placeholder="Assign group..." 
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="search-input tag-input"
        />
        
        {showSuggestions && query && (
          <div className="link-selector-dropdown">
            {suggestions.map(g => (
              <div key={g.id} className="link-option" onMouseDown={() => onAddGroup(character.id, g.id)}>
                {g.name}
              </div>
            ))}
            {!allGroups.find(g => g.name.toLowerCase() === query.toLowerCase()) && (
              <div className="link-option" style={{color: 'var(--accent)'}} onMouseDown={() => onCreateGroup(character.id, query)}>
                + Create "{query}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};



// --- APP ---
function App() {
  const [worlds, setWorlds] = useState(() => JSON.parse(localStorage.getItem("worlds")) || []);
  const [selectedWorldId, setSelectedWorldId] = useState(null);
  const [selectedModule, setSelectedModule] = useState("characters");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [focusedGroupId, setFocusedGroupId] = useState(null);

  const activeWorld = worlds.find(w => w.id === selectedWorldId);

  

  // 1. Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem("worlds", JSON.stringify(worlds));
  }, [worlds]);

  // 2. Keyboard Shortcut Listener (Backslash & Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Escape') {
        setIsQuickAddOpen(false);
        setIsSettingsOpen(false);
      }

      const isTyping = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
      if (e.code === 'Backslash' && !isTyping) {
        e.preventDefault();
        setIsQuickAddOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  // 3. Link Registry (Must be defined before navigateToEntry)
const linkRegistry = activeWorld ? [
    ...activeWorld.data.characters.map(c => ({ id: c.id, name: c.name || "Unnamed", type: 'char' })),
    ...activeWorld.data.locations.map(l => ({ id: l.id, name: l.name || "Unnamed", type: 'loc' })),
    ...activeWorld.data.lore.map(l => ({ id: l.id, name: l.name || "Unnamed", type: 'lore' })),
    // Updated Story Logic:
    ...activeWorld.data.story.map((s, i) => ({ 
      id: s.id, 
      name: s.name || `Beat ${i + 1}`, // Show the title if it exists, otherwise number it
      type: 'story' 
    }))
  ] : [];

  // 4. Navigation Logic
  const navigateToEntry = (type, id) => {
    const moduleMap = { 
      char: 'characters', 
      loc: 'locations', 
      lore: 'lore',
      story: 'story' 
    };

    setSelectedModule(moduleMap[type]);
    setIsSettingsOpen(false);

    // Give React a moment to switch the tab before trying to scroll to the ID
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.borderColor = 'var(--accent)';
        setTimeout(() => el.style.borderColor = 'var(--border)', 2000);
      }
    }, 150);
  };

  // 5. Data Management Functions
 const updateEntry = (category, itemId, updatedData) => {
  setWorlds(prev => prev.map(w => w.id === selectedWorldId ? 
    { 
      ...w, 
      data: { 
        ...w.data, 
        [category]: w.data[category].map(i => 
          i.id === itemId 
            ? { ...i, ...updatedData } // Creates a shallow copy of the item
            : i
        ) 
      } 
    } : w));
};

const addToActiveWorld = (category, item) => {
  setWorlds(prev => prev.map(w => w.id === selectedWorldId ? 
    { ...w, data: { ...w.data, [category]: [...w.data[category], { ...item }] } } : w));
};

  const deleteEntry = (category, itemId) => {
    if (!confirm("Delete this entry?")) return;
    setWorlds(prev => prev.map(w => w.id === selectedWorldId ? 
      { ...w, data: { ...w.data, [category]: w.data[category].filter(i => i.id !== itemId) } } : w));
  };

  const exportActiveWorld = () => {
    if (!activeWorld) return;
    const dataStr = JSON.stringify(activeWorld, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    const fileName = activeWorld.name.replace(/\s+/g, '_').toLowerCase();
    link.href = url;
    link.download = `world_${fileName}.wlrd`;
    link.click();
  };

  const importWorld = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (importedData.id && importedData.name && importedData.data) {
          if (confirm(`Add "${importedData.name}" to your world list?`)) {
            setWorlds(prev => [...prev, importedData]);
            setSelectedWorldId(importedData.id);
          }
        } else {
          alert("Invalid world file.");
        }
      } catch (err) {
        alert("Error reading file.");
      }
    };
    reader.readAsText(file);
  };

const addCharacterToGroup = (charId, groupId) => {
  setWorlds(prev => prev.map(w => w.id === selectedWorldId ? {
    ...w,
    data: {
      ...w.data,
      characters: w.data.characters.map(c => 
        c.id === charId 
          ? { ...c, groupIds: [...(c.groupIds || []), groupId] } // The [...] creates a NEW array
          : c
      )
    }
  } : w));
};

const deleteGroup = (groupId) => {
  setWorlds(prev => prev.map(w => w.id === selectedWorldId ? {
    ...w,
    data: {
      ...w.data,
      // Remove from global groups list
      groups: w.data.groups.filter(g => g.id !== groupId),
      // Remove the ID from all characters
      characters: w.data.characters.map(c => ({
        ...c,
        groupIds: (c.groupIds || []).filter(id => id !== groupId)
      }))
    }
  } : w));
  
  // Return to "All Characters" view since the group no longer exists
  setFocusedGroupId(null);
};

const createGroupAndAssign = (charId, groupName) => {
  const newGroupId = Date.now().toString();
  const newGroup = { id: newGroupId, name: groupName, description: "" };

  setWorlds(prev => prev.map(w => w.id === selectedWorldId ? {
    ...w,
    data: {
      ...w.data,
      groups: [...(w.data.groups || []), newGroup],
      characters: w.data.characters.map(c => 
        c.id === charId ? { ...c, groupIds: [...(c.groupIds || []), newGroupId] } : c
      )
    }
  } : w));
};

const removeCharacterFromGroup = (charId, groupId) => {
  setWorlds(prev => prev.map(w => w.id === selectedWorldId ? {
    ...w,
    data: {
      ...w.data,
      characters: w.data.characters.map(c => 
        c.id === charId ? { ...c, groupIds: c.groupIds.filter(id => id !== groupId) } : c
      )
    }
  } : w));
};

  // 6. Return Statement
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h1>World Builder</h1>
        <CreateWorldForm onAddWorld={(w) => setWorlds(prev => [...prev, { ...w, modules: { characters: true, locations: true, lore: true, story: true }, data: { characters: [], locations: [], lore: [], story: [], groups: [] } }])} />
        <div className="world-list-container">
          {worlds.map(world => (
            <div key={world.id} className={`world-item ${selectedWorldId === world.id ? 'active' : ''}`} onClick={() => setSelectedWorldId(world.id)}>
              <EditableRow item={world} field="name" onSave={(d) => setWorlds(prev => prev.map(w => w.id === world.id ? {...w, ...d} : w))} />
              <button className="card-delete" style={{position:'static', fontSize:'1rem'}} onClick={(e) => { e.stopPropagation(); if(confirm(`Delete ${world.name}?`)) setWorlds(prev => prev.filter(w => w.id !== world.id)); }}>×</button>
            </div>
          ))}
        </div>
      </aside>

      <main className="main-content">
        {!activeWorld ? (
          <div className="empty-state"><h2>Select a world to begin</h2></div>
        ) : (
          <div className="world-view">
            <header className="main-header">
              <div>
                <h2 style={{margin:0}}>{activeWorld.name}</h2>
                <input type="text" placeholder="Search world..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
              </div>
              <div className="module-nav">
                {Object.keys(activeWorld.modules).map(mod => activeWorld.modules[mod] && (
                  <button 
                    key={mod} 
                    onClick={() => { setSelectedModule(mod); setIsSettingsOpen(false); }} 
                    className={selectedModule === mod && !isSettingsOpen ? "active" : ""}
                  >
                    {mod.charAt(0).toUpperCase() + mod.slice(1)}
                  </button>
                ))}
                <button 
                  onClick={() => setIsQuickAddOpen(true)} 
                  style={{ background: 'var(--accent)', color: 'white', fontWeight: 'bold', marginLeft: '10px' }}
                >
                  + QUICK ADD
                </button>
                <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className={isSettingsOpen ? "active" : ""} style={{ marginLeft: '5px' }}>⚙️</button>
              </div>
            </header>

            <div className="pane">
              {isSettingsOpen ? (
                <div className="settings-panel card">
                  <h3>Data Management</h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="module-nav active" onClick={exportActiveWorld}>Export .WLRD</button>
                    <label className="module-nav" style={{cursor:'pointer'}}>
                      Import .WLRD
                      <input type="file" accept=".wlrd" onChange={importWorld} style={{ display: 'none' }} />
                    </label>
                  </div>
                  <hr style={{margin: '20px 0', opacity: 0.2}} />
                  <h3>Active Modules</h3>
                  {Object.keys(activeWorld.modules).map(m => (
                    <div key={m} style={{display:'flex', gap:'20px', marginBottom:'10px', alignItems:'center'}}>
                      <button onClick={() => setWorlds(prev => prev.map(w => w.id === selectedWorldId ? { ...w, modules: { ...w.modules, [m]: !w.modules[m] } } : w))}>
                        {activeWorld.modules[m] ? "ON" : "OFF"}
                      </button>
                      <span style={{textTransform: 'capitalize'}}>{m}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="module-content">
                  {selectedModule === "characters" && (
                    <>
                      <div className="group-filter-bar">
                        <button className={!focusedGroupId ? "active" : ""} onClick={() => setFocusedGroupId(null)}>All Characters</button>
                        {(activeWorld.data.groups || []).map(group => (
                          <button key={group.id} className={focusedGroupId === group.id ? "active-group" : ""} onClick={() => setFocusedGroupId(group.id)}>👥 {group.name}</button>
                        ))}
                      </div>

                      {focusedGroupId && (
  <div className="group-info-header card" style={{borderStyle: 'dashed', marginBottom: '20px'}}>
    <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
        <h2 style={{margin:0, color:'var(--accent)'}}>
          {activeWorld.data.groups.find(g => g.id === focusedGroupId)?.name}
        </h2>
        {/* NEW: Delete Group Button */}
        <button 
          onClick={() => {
            if(confirm("Delete this group? Characters won't be deleted, but they will be removed from this group.")) {
              deleteGroup(focusedGroupId);
            }
          }}
          style={{background: 'rgba(255,0,0,0.1)', color: '#ff4444', border: '1px solid #ff4444', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem'}}
        >
          Delete Group
        </button>
      </div>
      <button onClick={() => setFocusedGroupId(null)} style={{background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer'}}>Close Group View ×</button>
    </div>
    {/* ... rest of the EditableRow for description ... */}
  </div>
)}

                      <CharacterForm onAddCharacter={(c) => addToActiveWorld('characters', c)} />

                      {(() => {
                        const charactersToShow = focusedGroupId 
                          ? activeWorld.data.characters.filter(c => c.groupIds?.includes(focusedGroupId))
                          : activeWorld.data.characters;

                        return (
                          <div className="grid">
                            {charactersToShow.map(char => (
  <div key={char.id} id={char.id} className="card">
    <button className="card-delete" onClick={() => deleteEntry('characters', char.id)}>×</button>
    
    <h3>
      <EditableRow 
        item={char} 
        field="name" 
        searchQuery={searchQuery} 
        onSave={(d) => updateEntry('characters', char.id, d)} 
      />
    </h3>

    <div className="char-meta-row" style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', marginBottom: '10px' }}>
      <div style={{ flex: 1 }}>
        <strong style={{ color: 'var(--accent)' }}>Age:</strong>
        <EditableRow 
          item={char} 
          field="age" 
          onSave={(d) => updateEntry('characters', char.id, d)} 
        />
      </div>
      <div style={{ flex: 2 }}>
        <strong style={{ color: 'var(--accent)' }}>Job:</strong>
        <EditableRow 
          item={char} 
          field="profession" 
          onSave={(d) => updateEntry('characters', char.id, d)} 
        />
      </div>
    </div>

    {/* ... GroupTags ... */}

    <div className="card-bio">
      <EditableRow 
        item={char} 
        field="description" 
        isMultiline={true} 
        searchQuery={searchQuery} 
        linkRegistry={linkRegistry}   // ADD THIS
        onLinkClick={navigateToEntry}  // ADD THIS
        onSave={(d) => updateEntry('characters', char.id, d)} 
      />
    </div>
  </div>
))}
                          </div>
                        );
                      })()}
                    </>
                  )}

                  {selectedModule === "locations" && (
                    <>
                      <LocationForm onAddLocation={(l) => addToActiveWorld('locations', l)} />
                      <div className="grid">
                        {activeWorld.data.locations.map(loc => (
                          <div key={loc.id} id={loc.id} className="card">
                            <button className="card-delete" onClick={() => deleteEntry('locations', loc.id)}>×</button>
                            <EditableRow item={loc} label="Type" field="type" onSave={(d) => updateEntry('locations', loc.id, d)} />
                            <h3><EditableRow item={loc} field="name" searchQuery={searchQuery} linkRegistry={linkRegistry} onLinkClick={navigateToEntry} onSave={(d) => updateEntry('locations', loc.id, d)} /></h3>
                            <div className="card-bio"><EditableRow item={loc} field="description" isMultiline={true} searchQuery={searchQuery} linkRegistry={linkRegistry} onLinkClick={navigateToEntry} onSave={(d) => updateEntry('locations', loc.id, d)} /></div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {selectedModule === "lore" && (
                    <>
                      <LoreForm onAddLore={(l) => addToActiveWorld('lore', l)} />
                      <div className="grid">
                        {activeWorld.data.lore.map(l => (
                          <div key={l.id} id={l.id} className="card">
                            <button className="card-delete" onClick={() => deleteEntry('lore', l.id)}>×</button>
                            <EditableRow item={l} label="Category" field="category" onSave={(d) => updateEntry('lore', l.id, d)} />
                            <h3><EditableRow item={l} field="name" searchQuery={searchQuery} linkRegistry={linkRegistry} onLinkClick={navigateToEntry} onSave={(d) => updateEntry('lore', l.id, d)} /></h3>
                            <div className="card-bio"><EditableRow item={l} field="content" isMultiline={true} searchQuery={searchQuery} linkRegistry={linkRegistry} onLinkClick={navigateToEntry} onSave={(d) => updateEntry('lore', l.id, d)} /></div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {selectedModule === "story" && (
  <>
    <StoryForm onAddStoryBeat={(s) => addToActiveWorld('story', s)} />
    <div className="timeline">
      {activeWorld.data.story.map((beat, i) => (
        <StoryBeat 
          key={beat.id} 
          beat={beat} 
          index={i} 
          searchQuery={searchQuery} 
          linkRegistry={linkRegistry}   // Ensure this is passed
          navigateToEntry={navigateToEntry} 
          updateEntry={updateEntry} 
          deleteEntry={deleteEntry} 
        />
      ))}
    </div>
  </>
)}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <GlobalQuickAdd isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} onAdd={addToActiveWorld} />
    </div>
  );
} // Ends App Component

export default App;