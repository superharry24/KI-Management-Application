import React from 'react';

class Page extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            list: [],
            selectedItem: null,
            selectedIndex: null,
            hoveredIndex: null
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    updateData = (data) => {
        this.setState({ list: data });
    }

    fetchData = () => {
        fetch('http://localhost:5000/inventory')
            .then((response) => response.json())
            .then((jsonOutput) => this.updateData(jsonOutput))
            .catch((error) => console.log("**Fetch exception: " + error));
    }

    
    render() {
        const categories = Object.fromEntries(
            (this.state.list?.[1] || []).map(cat => [cat[0], cat])
        );
        return (
            <div style={{ display: "flex", gap: "20px", padding: "10px" }}>

                {/* LEFT SIDE */}
                <div style={{ width: "400px" }}>
                    <h3>Kesher Israel Item Management</h3>

                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: "bold",
                        padding: "5px"
                    }}>
                        <span>Name</span>
                        <span>Current Amount</span>
                    </div>

                    <div
                        style={{
                            border: "1px solid #ccc",
                            height: "50vh",
                            overflowY: "auto"
                        }}
                    >
                        {this.state.list?.[0]?.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    if (this.state.selectedItem === item) {
                                        this.setState({
                                            selectedItem: null,
                                            selectedIndex: null
                                        });
                                    } else {
                                        this.setState({
                                            selectedItem: item,
                                            selectedIndex: index
                                        });
                                    }
                                }}
                                onMouseEnter={() => this.setState({ hoveredIndex: index })}
                                onMouseLeave={() => this.setState({ hoveredIndex: null })}
                                style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "6px 8px",
                                fontSize: "13px",
                                cursor: "pointer",
                                borderBottom: "1px solid #eee",

                                backgroundColor:
                                    this.state.selectedIndex === index
                                        ? "#cce5ff"
                                        : this.state.hoveredIndex === index
                                            ? "#f5f5f5"
                                            : "white"
                            }}
                            >
                                <span>{item[1]}</span>
                                <span>{item[4]}</span>
                            </div>
                            
                        ))}
                        </div>
                        <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
                                <button
                                disabled={!this.state.selectedItem}
                                style={{
                                    flex: 1,
                                    padding: "6px",
                                    cursor: this.state.selectedItem ? "pointer" : "not-allowed",
                                    backgroundColor: this.state.selectedItem ? "#4caf50" : "#ccc",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px"
                                }}
                            >
                                Add stock
                            </button>

                            <button
                                disabled={!this.state.selectedItem}
                                style={{
                                    flex: 1,
                                    padding: "6px",
                                    cursor: this.state.selectedItem ? "pointer" : "not-allowed",
                                    backgroundColor: this.state.selectedItem ? "#f44336" : "#ccc",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px"
                                }}
                            >
                                Remove stock
                            </button>

                            <button
                                disabled={!this.state.selectedItem}
                                style={{
                                    flex: 1,
                                    padding: "6px",
                                    cursor: this.state.selectedItem ? "pointer" : "not-allowed",
                                    backgroundColor: this.state.selectedItem ? "#2196f3" : "#ccc",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px"
                                }}
                            >
                                Edit item
                            </button>
                        
                    </div>
                    <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
    
                    <button
                        style={{
                            flex: 1,
                            padding: "6px",
                            backgroundColor: "#673ab7",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Add new Item
                    </button>

                    <button
                        style={{
                            flex: 1,
                            padding: "6px",
                            backgroundColor: "#607d8b",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Update Log
                    </button>

                </div>
                </div>

                <div style={{
                    flex: 1,
                    border: "1px solid #ccc",
                    padding: "10px",
                    height: "fit-content",
                    minWidth: "300px"
                }}>
                    {this.state.selectedItem ? (
                        <div>
                            <h3>{this.state.selectedItem[1]}</h3>

                            <p><b>Category:</b> {categories[this.state.selectedItem[3]]?.[1]}</p>
                            <p><b>Current Amount:</b> {this.state.selectedItem[4]}</p>
                            <p><b>Order Level:</b> {this.state.selectedItem[5]}</p>
                            <p><b>Unit Size:</b> {this.state.selectedItem[6]}</p>
                            <p><b>Unit Cost:</b> ${this.state.selectedItem[7]}</p>
                            <p><b>Total Cost:</b> ${this.state.selectedItem[8]}</p>
                            <p><b>Location:</b> {this.state.selectedItem[9]}</p>
                            <p><b>Supplier:</b> {this.state.selectedItem[10]}</p>
                            <p><b>Item SKU:</b> {this.state.selectedItem[11]}</p>
                        </div>
                    ) : (
                        <p>Select an item to see details</p>
                    )}
                </div>

            </div>
        );
    }
}

export default Page;