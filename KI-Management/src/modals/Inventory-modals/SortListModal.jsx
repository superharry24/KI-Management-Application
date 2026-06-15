import React, { useState } from "react";

export default function SortListModal({
  isOpen,
  onClose,
  onSubmit,
}) {
  const [searchText, setSearchText] = useState("");
  const [sortDirection, setSortDirection] = useState("ASC");
  const [sortBy, setSortBy] = useState("Alphabetical");
  const [perfectMatch, setPerfectMatch] = useState(false);
  const [lowStock, setLowStock] = useState(false);
  const [lowStockOnly, setLowStockOnly] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit?.({
      searchText,
      sortDirection,
      sortBy,
      perfectMatch,
      lowStock,
      lowStockOnly,
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
      }}
    >
      <div
        style={{
          width: "400px",
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)"
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Sort & Filter
        </h2>

        <div style={{ marginBottom: "16px" }}>
          <label>Search</label>

          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Enter text..."
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "4px"
            }}
          />
        </div>
            <div style={{ marginTop: "10px" }}>
            <label
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer"
                }}
            >
                <input
                    type="checkbox"
                    checked={perfectMatch}
                    onChange={(e) =>
                        setPerfectMatch(e.target.checked)
                    }
                />

                Perfect Match

            </label>

            <label
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer"
                }}
            >
                <input
                    type="checkbox"
                    checked={lowStock}
                    onChange={(e) =>
                        setLowStock(e.target.checked)
                    }
                />

                Prioritize Low Stock

            </label>
            <label
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer"
                }}
            >
                <input
                    type="checkbox"
                    checked={lowStockOnly}
                    onChange={(e) =>
                        setLowStockOnly(e.target.checked)
                    }
                />

                Only Show Low Stock

            </label>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px"
          }}
        >
          <div>
            <label>Direction</label>

            <select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "4px"
              }}
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
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "4px"
              }}
            >
              <option value="Alphabetical">Alphabetical</option>
              <option value="Current Amount">Units On Hand</option>
              <option value="Category">Category</option>
              <option value="Unit Cost">Unit Cost</option>
              <option value="Location">Location</option>
              <option value="Supplier">Supplier</option>
            </select>
          </div>
        </div>

        <div
          style={{
            marginTop: "24px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px"
          }}
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