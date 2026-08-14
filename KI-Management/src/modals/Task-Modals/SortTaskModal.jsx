import React, { useState } from "react";

export default function SortTaskModal({
  isOpen,
  onClose,
  onSubmit,
}) {
  const [searchText, setSearchText] = useState("");
  const [sortDirection, setSortDirection] = useState("ASC");
  const [sortBy, setSortBy] = useState("Alphabetical");
  const [includeCompleted, setIncludeCompleted] = useState(true);
  const [prioritizeAssigned, setprioritizeAssigned] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit?.({searchText, sortDirection, sortBy, prioritizeAssigned, includeCompleted,});
  };

  return (
    <div
      style={{position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999}}>
      <div
        style={{width: "400px", backgroundColor: "white", borderRadius: "12px",
          padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.25)"}}
      >
        <h2 style={{ marginBottom: "20px", color: "black"}}>
          Sort & Filter
        </h2>

        {sortBy != "Status" && sortBy != "Priority" &&(<div style={{ marginBottom: "16px" }}>
          <label>Search</label>

          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Enter text..."
            style={{width: "100%", padding: "8px", marginTop: "4px"}}
          />
        </div>)}
            <div style={{ marginTop: "10px" }}>

            <label
                style={{display: "flex", alignItems: "center", gap: "8px", cursor: "pointer"}}
            >
                <input
                    type="checkbox"
                    checked={prioritizeAssigned}
                    onChange={(e) =>
                        setprioritizeAssigned(e.target.checked)
                    }
                />

                Prioritize Assigned To Self

            </label>
            <label
                style={{display: "flex", alignItems: "center", gap: "8px",cursor: "pointer"}}
            >
                <input
                    type="checkbox"
                    checked={includeCompleted}
                    onChange={(e) =>
                        setIncludeCompleted(e.target.checked)
                    }
                />

                Show Completed Tasks

            </label>
        </div>

        <div
          style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px"}}
        >
          <div>
            <label>Direction</label>

            <select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
              style={{width: "100%", padding: "8px", marginTop: "4px"}}
            >
              <option value="ASC">ASC</option>
              <option value="DESC">DESC</option>
            </select>
          </div>

          <div>
            <label>Sort By</label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{width: "100%", padding: "8px", marginTop: "4px"}}
            >
              <option value="Alphabetical">Alphabetical</option>
              <option value="Category">Category</option>
              <option value="Priority">Priority</option>
              <option value="Location">Location</option>
              <option value="Status">Status</option>
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