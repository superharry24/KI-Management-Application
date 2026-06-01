import React from 'react';
import SortListModal from "./SortListModal";
import AddItemModal from "./AddItemModal";
import IncreaseItemModal from "./IncreaseItemModal";
import DecreaseItemModal from "./DecreaseItemModal";
import EditItemModal from "./EditItemModal";
class Page extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            list: [],
            selectedItem: null,
            selectedIndex: null,
            hoveredIndex: null,
            userID: 1,

            // SORT STATE
            sortText: "",
            sortField: "Alphabetical",
            sortDirection: "ASC",
            perfectMatch: false,

            // MODAL STATE
            showSortModal: false,
            OpenModal: "none"
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    addItem = async (itemData) => {
        itemData = {
            ...itemData,
            userID: this.state.userID,
            timestamp: new Date().toISOString()
        };

        try {

            const response = await fetch("http://localhost:5000/inventory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(itemData)
            });

            if (!response.ok) {
                throw new Error("Failed to add item");
            }

            const result = await response.json();

            console.log("Item added:", result);

            // Refresh inventory list
            await this.fetchData();
            await this.sortList();

            // Close modal
            this.setState({
                OpenModal: "none",
                perfectMatch: false,
                selectedItem: null,
                selectedIndex: null
            });

        } catch (error) {

            console.log("Add item error:", error);

        }
    };


    editItem = async (itemData) => {
        itemData = {
            ...itemData,
            userID: this.state.userID,
            type: 3,//edit
            item_id: this.state.selectedItem[0],
            timestamp: new Date().toISOString()
        };

        try {

            const response = await fetch("http://localhost:5000/inventory", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(itemData)
            });

            if (!response.ok) {
                throw new Error("Failed to edit item");
            }

            const result = await response.json();

            console.log("Item edited:", result);

            // Refresh inventory list
            await this.fetchData();
            await this.sortList();

            // Close modal
            this.setState({
                OpenModal: "none",
                perfectMatch: false,
                selectedItem: null,
                selectedIndex: null
            });

        } catch (error) {

            console.log("Add item error:", error);

        }
    };

    increaseItem = async (amount) => {
        const itemData = {
            amount: amount.amount,
            userID: this.state.userID,
            type: 1,//adding
            item_id: this.state.selectedItem[0],
            timestamp: new Date().toISOString()
        };

        try {

            const response = await fetch("http://localhost:5000/inventory", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(itemData)
            });

            if (!response.ok) {
                throw new Error("Failed to increase item");
            }

            const result = await response.json();

            console.log("Item increased:", result);

            // Refresh inventory list
            await this.fetchData();
            await this.sortList();

            // Close modal
            this.setState({
                OpenModal: "none"
            });

        } catch (error) {

            console.log("Increase item error:", error);

        }
    };


    decreaseItem = async (amount) => {
        const itemData = {
            amount: amount.amount,
            userID: this.state.userID,
            type: 2,//subtracting
            item_id: this.state.selectedItem[0],
            timestamp: new Date().toISOString()
        };

        try {

            const response = await fetch("http://localhost:5000/inventory", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(itemData)
            });

            if (!response.ok) {
                throw new Error("Failed to increase item");
            }

            const result = await response.json();

            console.log("Item decreased:", result);

            // Refresh inventory list
            await this.fetchData();
            await this.sortList();

            // Close modal
            this.setState({
                OpenModal: "none"
            });

        } catch (error) {

            console.log("Decrease item error:", error);

        }
    };


    updateData = (data) => {
        this.setState({ list: data });
    }

    fetchData = () => {
        return fetch('http://localhost:5000/inventory')
            .then((response) => response.json())
            .then((jsonOutput) => {
                this.updateData(jsonOutput);
                return jsonOutput;
            })
            .catch((error) => {
                console.log("**Fetch exception: " + error);
                return null;
            });
    };

    sortList = async () => {
        this.setState({
            selectedItem: null,
            selectedIndex: null
        });

        const freshData = await this.fetchData();
        if (!freshData || !freshData[0]) return;
        let updatedList = [...freshData[0]];

        // FILTER USING SEARCH TEXT
        if (this.state.sortText.trim() !== "") {

            let filterIndex = 1;

            switch (this.state.sortField) {

                case "Alphabetical":
                    filterIndex = 1;
                    break;

                case "Current Amount":
                    filterIndex = 4;
                    break;

                case "Category":
                    filterIndex = 3;
                    break;

                case "Unit Cost":
                    filterIndex = 7;
                    break;

                case "Location":
                    filterIndex = 9;
                    break;

                case "Supplier":
                    filterIndex = 10;
                    break;

                default:
                    filterIndex = 1;
            }

            updatedList = updatedList.filter((item) => {

                const value = item[filterIndex]
                    ?.toString()
                    .toLowerCase()
                    .trim();

                const search = this.state.sortText
                    .toLowerCase()
                    .trim();

                if (this.state.perfectMatch) {
                    return value === search;
                }

                return value.includes(search);
            });
        }

        // SORT FIELD
        updatedList.sort((a, b) => {

            let valueA;
            let valueB;

            switch (this.state.sortField) {

                case "Alphabetical":
                    valueA = a[1];
                    valueB = b[1];
                    break;

                case "Current Amount":
                    valueA = a[4];
                    valueB = b[4];
                    break;

                case "Category":
                    valueA = a[3];
                    valueB = b[3];
                    break;

                case "Unit Cost":
                    valueA = a[7];
                    valueB = b[7];
                    break;

                case "Location":
                    valueA = a[9];
                    valueB = b[9];
                    break;

                case "Supplier":
                    valueA = a[10];
                    valueB = b[10];
                    break;

                default:
                    valueA = a[1];
                    valueB = b[1];
            }

            if (typeof valueA === "string") {

                const comparison = valueA.localeCompare(valueB);

                return this.state.sortDirection === "ASC"
                    ? comparison
                    : -comparison;
            }
    
            const comparison = valueA - valueB;

            return this.state.sortDirection === "ASC"
                ? comparison
                : -comparison;
        });

    this.setState((prevState) => ({
        list: [
            updatedList,
            prevState.list[1]
        ]
    }));
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

                    {/* SORT BUTTON */}
                    <button
                        onClick={() =>
                            this.setState({
                                showSortModal: true
                            })
                        }
                        style={{
                            width: "100%",
                            marginBottom: "10px",
                            padding: "8px",
                            backgroundColor: "#607d8b",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Sort List
                    </button>

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
                                            selectedIndex: index,
                                            OpenModal: "none"
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
                                onClick={() => this.setState({ OpenModal: "increase" })}
                            >
                                Add stock
                            </button>

                            <button
                                disabled={!this.state.selectedItem}
                                style={{
                                    flex: 1,
                                    padding: "6px",
                                    cursor: this.state.selectedItem ? "pointer" : "not-allowed",
                                    backgroundColor: this.state.selectedItem ? "#f6ff00" : "#ccc",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px"
                                }}
                                onClick={() => this.setState({ OpenModal: "decrease" })}
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
                                onClick={() => this.setState({ OpenModal: "edit" })}
                            >
                                
                                Edit item
                            </button>
                        
                    </div>
                    <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
                        <button
                                disabled={!this.state.selectedItem}
                                style={{
                                    flex: 1,
                                    padding: "6px",
                                    cursor: this.state.selectedItem ? "pointer" : "not-allowed",
                                    backgroundColor: this.state.selectedItem ? "#f32121" : "#ccc",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px"
                                }}
                            >
                                
                                Delete Item
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
                        onClick={() => this.setState({ OpenModal: "add" })}
                    >
                        Add new Item
                    </button>

                    <button
                        style={{
                            flex: 1,
                            padding: "6px",
                            backgroundColor: "#95a01d",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Update Log
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
                        Export List
                    </button>

                </div>
                </div>

                {/* RIGHT SIDE */}
                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    minWidth: "300px"
                }}>

                    {/* ITEM DETAILS PANEL */}
                    <div style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        height: "fit-content"
                    }}>
                        {this.state.selectedItem ? (
                            <div>
                                <h3>{this.state.selectedItem[1]}</h3>

                                <p><b>Category:</b> {this.state.selectedItem[3]}</p>
                                <p><b>Current Amount:</b> {this.state.selectedItem[4]}</p>
                                <p><b>Order Level:</b> {this.state.selectedItem[5]}</p>
                                <p><b>Unit Size:</b> {this.state.selectedItem[6]}</p>
                                <p><b>Unit Cost:</b> ${this.state.selectedItem[7]}</p>                                
                                <p><b>Location:</b> {this.state.selectedItem[9]}</p>
                                <p><b>Supplier:</b> {this.state.selectedItem[10]}</p>
                                <p><b>Item SKU:</b> {this.state.selectedItem[11]}</p>
                                <p><b>Description:</b> {this.state.selectedItem[8]}</p>
                            </div>
                        ) : (
                            <p>Select an item to see details</p>
                        )}
                    </div>

                    {/* Changing MODAL PANEL */}
                    <div style={{
                        border: "1px solid #ccc",
                        padding: "10px"
                    }}>
                        <AddItemModal
                            isOpen={this.state.OpenModal == "add"}
                            onClose={() => this.setState({ OpenModal: "none" })}
                            onSubmit={(data) => {
                                this.addItem(data);
                            }}
                        />
                        <IncreaseItemModal
                            isOpen={this.state.OpenModal == "increase"}
                            onClose={() => this.setState({ OpenModal: "none" })}
                            onSubmit={(data) => {
                                this.increaseItem(data);
                            }}
                        />
                        <DecreaseItemModal
                            isOpen={this.state.OpenModal == "decrease"}
                            onClose={() => this.setState({ OpenModal: "none" })}
                            onSubmit={(data) => {
                                this.decreaseItem(data);
                            }}
                        />
                        <EditItemModal
                            isOpen={this.state.OpenModal == "edit"}
                            item={this.state.selectedItem}
                            onClose={() => this.setState({ OpenModal: "none" })}
                            onSubmit={(data) => {
                                this.editItem(data);
                            }}
                        />
                    </div>

                </div>
                <SortListModal
                    isOpen={this.state.showSortModal}
                    onClose={() =>
                        this.setState({
                            showSortModal: false
                        })
                    }
                    onSubmit={(data) => {
                        this.setState(
                            {
                                sortText: data.searchText,
                                sortField: data.sortBy,
                                sortDirection: data.sortDirection,
                                perfectMatch: data.perfectMatch,
                                showSortModal: false
                            },
                            () => {
                                this.sortList();
                            }
                        );
                    }}
                />
                

            </div>
        );
    }
}

export default Page;