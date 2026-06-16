import React from 'react';
import SortListModal from "../modals/Inventory-modals/SortListModal";
import AddItemModal from "../modals/Inventory-modals/AddItemModal";
import IncreaseItemModal from "../modals/Inventory-modals/IncreaseItemModal";
import DecreaseItemModal from "../modals/Inventory-modals/DecreaseItemModal";
import EditItemModal from "../modals/Inventory-modals/EditItemModal";
import DeleteItemModal from "../modals/Inventory-modals/DeleteItemModal";
import UpdateLog from "../modals/Inventory-modals/UpdateLog";
import ExportListModal from "../modals/Inventory-modals/ExportListModal";
import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {Navigate } from "react-router-dom";
class Inventory extends React.Component {

    constructor(props) {
        super(props);
        const user = JSON.parse(localStorage.getItem("user"));

        this.state = {
            list: [],
            selectedItem: null,
            selectedIndex: null,
            hoveredIndex: null,
            userID: user?.id || 0,
            admin: user?.admin || false,

            // SORT STATE
            sortText: "",
            sortField: "Alphabetical",
            sortDirection: "ASC",
            perfectMatch: false,
            prioritizeLowStock: false,
            lowStockOnly: false,

            // MODAL STATE
            showSortModal: false,
            showUpdateLog: false,
            OpenModal: "none"
        };
    }

    componentDidMount() {
        this.fetchData();
        this.sortList();
    }

    addItem = async (itemData) => {
        itemData = {
            ...itemData,
            userID: this.state.userID,
            timestamp: new Date().toLocaleString()
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
            timestamp: new Date().toLocaleString()
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
            timestamp: new Date().toLocaleString()
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
            timestamp: new Date().toLocaleString()
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

    exportList = async (data) => {
        const format = data.format;
        const list = this.state.list || [];

        const timestamp = new Date().toLocaleString();

        if (format === "PDF") {
            const doc = new jsPDF();

            doc.setFontSize(14);
            doc.text("Inventory List", 14, 15);

            const tableColumn = [
                "Name",
                "Sku",
                "On Hand",
                "Supplier",
                "Quantity to order"
            ];

            const tableRows = list.map(item => [
                item[1],
                item[11],
                item[4],
                item[10]
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 25
            });

            const pageHeight = doc.internal.pageSize.height;

            doc.setFontSize(10);
            doc.text(
                `Generated: ${timestamp}`,
                14,
                pageHeight - 10
            );

            doc.save(`inventory_${Date.now()}.pdf`);
        }
        else if(format === "Excel")
        {
            const list = this.state.list || [];

            const data = list.map(item => ({
                Name: item[1],
                SKU: item[11],
                "On Hand": item[4],
                Supplier: item[10],
                "Amount to order": ""
            }));

            // Create worksheet
            const worksheet = XLSX.utils.json_to_sheet(data);

            // Create workbook
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

            // Convert to binary
            const excelBuffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array"
            });

            // Create blob
            const fileData = new Blob([excelBuffer], {
                type: "application/octet-stream"
            });

            saveAs(fileData, `inventory_${Date.now()}.xlsx`);
        }
    }

    deleteItem = async () => {
        const itemData = {
            userID: this.state.userID,
            type: 4,//deactivating
            item_id: this.state.selectedItem[0],
            timestamp: new Date().toLocaleString()
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

            console.log("Item deleted:", result);

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
        if (!freshData) return;
        let updatedList = [...freshData];

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

        if (this.state.lowStockOnly) {
            updatedList = updatedList.filter((item) => {
                return item[4] < item[5];
            });
        }
        

        // SORT FIELD
        updatedList.sort((a, b) => {



            if (this.state.prioritizeLowStock) {
                const aLow = a[4] < a[5];
                const bLow = b[4] < b[5];

                if (aLow !== bLow) {
                    return aLow ? -1 : 1;
                }
            }

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

    this.setState({
        list: updatedList
    });
}

    render() {
        if (this.state.userID === 0) {
            return <Navigate to="/login" replace />;
        }        

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
                        <span>Units on Hand</span>
                    </div>

                    <div
                        style={{
                            border: "1px solid #ccc",
                            height: "50vh",
                            overflowY: "auto"
                        }}
                    >
                        {this.state.list?.map((item, index) => (
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
                                <span>
                                    {item[1]}
                                    {(item[4] < item[5]) && (
                                        <span
                                            style={{
                                                color: "red",
                                                marginLeft: "8px",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            ⚠ Low Stock
                                        </span>
                                    )}
                                </span>
                                <span>{item[4]}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
                                <button
                                disabled={!this.state.selectedItem || !this.state.admin}
                                style={{
                                    flex: 1,
                                    padding: "6px",
                                    cursor: this.state.selectedItem ? "pointer" : "not-allowed",
                                    backgroundColor: (this.state.selectedItem && this.state.admin) ? "#4caf50" : "#ccc",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px"
                                }}
                                onClick={() => this.setState({ OpenModal: "increase" })}
                            >
                                Add stock
                            </button>

                            <button
                                disabled={!this.state.selectedItem || !this.state.admin}
                                style={{
                                    flex: 1,
                                    padding: "6px",
                                    cursor: this.state.selectedItem ? "pointer" : "not-allowed",
                                    backgroundColor: (this.state.selectedItem && this.state.admin) ? "#f6ff00" : "#ccc",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px"
                                }}
                                onClick={() => this.setState({ OpenModal: "decrease" })}
                            >
                                Remove stock
                            </button>

                            <button
                                disabled={!this.state.selectedItem || !this.state.admin}
                                style={{
                                    flex: 1,
                                    padding: "6px",
                                    cursor: this.state.selectedItem ? "pointer" : "not-allowed",
                                    backgroundColor: (this.state.selectedItem && this.state.admin) ? "#2196f3" : "#ccc",
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
                                disabled={!this.state.selectedItem || !this.state.admin}
                                style={{
                                    flex: 1,
                                    padding: "6px",
                                    cursor: this.state.selectedItem ? "pointer" : "not-allowed",
                                    backgroundColor: (this.state.selectedItem && this.state.admin) ? "#f32121" : "#ccc",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px"
                                }}
                                onClick={() => this.setState({ OpenModal: "delete" })}
                            >
                                
                                Delete Item
                            </button>
                        
                    </div>
                    <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
    
                    <button
                        disabled={!this.state.admin}
                        style={{
                            flex: 1,
                            padding: "6px",
                            backgroundColor: this.state.admin ? "#673ab7" : "#ccc",
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
                        onClick={() => this.setState({ showUpdateLog: true })}
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
                        onClick={() => this.setState({ OpenModal: "export" })}
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
                                <p><b>Units on Hand:</b> {this.state.selectedItem[4]}</p>
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
                            item={this.state.selectedItem?.[4]}
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
                        <DeleteItemModal
                            isOpen={this.state.OpenModal == "delete"}
                            item={this.state.selectedItem?.[4]}
                            onClose={() => this.setState({ OpenModal: "none" })}
                            onSubmit={this.deleteItem}
                        />
                        <ExportListModal
                            isOpen={this.state.OpenModal == "export"}
                            onClose={() => this.setState({ OpenModal: "none" })}
                            onSubmit={this.exportList}
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
                                prioritizeLowStock: data.lowStock,
                                lowStockOnly: data.lowStockOnly, 
                                showSortModal: false
                            },
                            () => {
                                this.sortList();
                            }
                        );
                    }}
                />
                <UpdateLog
                    isOpen={this.state.showUpdateLog}
                    onClose={() =>
                        this.setState({
                            showUpdateLog: false
                        })
                    }
                />
                

            </div>
        );
    }
}

export default Inventory;