import React, { useState, useEffect } from "react";

export default function SortListModal({
  isOpen,
  onClose,
  onSubmit,
}) {

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("Any");
  const [ID, setID] = useState(-1);
  const [itemSearch, setItemSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
      if (isOpen) { 
        setShowSuggestions(false);
        setItemSearch("");
        setID(-1);
        fetch("http://localhost:5000/inventory")
          .then((response) => response.json())
          .then((data) => setItems(data))
          .catch((err) => console.error(err));         
      }
    }, [isOpen]);

    
  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit?.({
      startDate,
      endDate,
      type: type.toLowerCase(),
      ID
    });
  };

  const matchingItems =
    itemSearch.trim() === ""
      ? []
      : items.filter(
          (item) =>
            item[1] &&
            item[1].toLowerCase().includes(itemSearch.toLowerCase())
      );


      

  
  return (
    <div
      style={{position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999}}
    >
      <div
        style={{width: "400px", backgroundColor: "white", borderRadius: "12px", padding: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)"}}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Sort & Filter
        </h2>
        <div style={{ gridColumn: "1 / span 2", position: "relative" }}>
      <label>Item</label>

      <input
        type="text"
        value={itemSearch}
        onChange={(e) => {
          setItemSearch(e.target.value);
          setShowSuggestions(true);
          setID(-1);
        }}
        placeholder="Start typing an item name..."
        style={{width: "100%", padding: "8px", marginTop: "4px"}}
      />

      {showSuggestions && matchingItems.length > 0 && (
        <div
          style={{position: "absolute", top: "100%", left: 0, right: 0, background: "white",
            border: "1px solid #ccc", maxHeight: "150px", overflowY: "auto", zIndex: 10000}}
        >
          {matchingItems.map((item) => (
                    <div
                      key={item[0]}
                      onClick={() => {
                        setItemSearch(item[1]);
                        setID(item[0]);
                        setShowSuggestions(false);
                      }}
                      style={{padding: "8px", cursor: "pointer"}}
                    >
                      {item[1]}
                    </div>
                  ))}
                </div>
              )}
            </div>


            <div>
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{width: "100%", padding: "8px", marginTop: "4px"}}
              />
            </div>

            <div>
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{width: "100%", padding: "8px", marginTop: "4px"}}
              />
            </div>
        

        <div
          style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px"}}
        >
          

          <div>
            <label>Change Type</label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{width: "100%", padding: "8px", marginTop: "4px"}}
            >
              <option value="any">Any</option>
              <option value="adding">Adding</option>
              <option value="removing">Removing</option>
              <option value="editing">Editing</option>
              <option value="deleting">Deleting</option>
              <option value="creating">Creating</option>
            </select>
          </div>
        </div>

        <div
          style={{marginTop: "24px", display: "flex", justifyContent: "flex-end", gap: "10px"}}
        >
          <button onClick={onClose}>
            Cancel
          </button>

          <button onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}