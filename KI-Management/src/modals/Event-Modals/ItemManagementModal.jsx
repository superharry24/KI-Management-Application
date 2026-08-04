//Columns for both large and small items. List has edit buttons and includes one make button//Will have a list of all rooms with an edit button next to them, a create room button, and a close button

import React from "react";
import ConfirmPopup from "../ConfirmPopup";
import { json } from "react-router-dom";
import NewItemModal from "./NewItemModal";
import EditItemModal from "./EditItemModal";

class ItemManagementModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            smallItems: [],
            largeItems: [],
            selectedItem: null,
            open_modal: "none"
        };
    }


    componentDidUpdate(prevProps) {
        if (this.props.isOpen && !prevProps.isOpen) {
            this.setState({    
                smallItems: [],
                largeItems: [],
                selectedItem: null,
                selectedSize: "none",
                open_modal: "none"
            });
            this.fetchData()
            

        }
    }


    fetchData = async () => {
        try {
            const response = await fetch("http://localhost:5000/table");
            const data = await response.json();

            this.setState({
                largeItems: data.large || [],    
                smallItems: data.small || [],            
            });

        } catch (error) {
            console.log(error);
            return[];
        }
    };
    

    render() {
        if (!this.props.isOpen) return null;

        return (
            <div
                style={{position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999}}>
                <div
                    style={{width: "800px", maxWidth: "90vw", height: "700px", maxHeight: "90vh",
                        backgroundColor: "white", borderRadius: "12px", padding: "24px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.25)", display: "flex",  flexDirection: "column"}}>
                    <h2 style={{ color: "#000000", marginBottom: "20px" }}>
                        Small Items
                    </h2>

                    

                    <div
                        style={{flex: 1, overflowY: "auto", marginBottom: "20px"}}
                    >
                        {/*Headers */}
                        <div
                            style={{display: "flex", justifyContent: "space-between", fontWeight: "bold",
                                padding: "10px 0", borderBottom: "2px solid #ccc", marginBottom: "5px"}}
                        >
                            <div style={{flex: 1, textAlign: "left"}}>Name</div>
                            <div style={{flex: 1, textAlign: "center"}}>Amount</div>
                            <div style={{flex: 1, textAlign: "right"}}></div>
                        </div>
                        {/*Small Item List */}
                        {this.state.smallItems.map((item) => (
                            <div
                                key={item[0]}
                                style={{display: "flex", justifyContent: "space-between", alignItems: "center",
                                    borderBottom: "1px solid #ddd", padding: "10px 0"}}
                            >
                                <div style={{flex: 1, textAlign: "left"}}>
                                    {item[1]}                                    
                                </div>
                                <div style={{flex: 1, textAlign: "center"}}>
                                    {item[2]}                                    
                                </div>

                                <div style={{flex: 1, textAlign: "right"}}>
                                    <button
                                        onClick={() => this.setState({open_modal: "edit", selectedItem: item, selectedSize: "small"})}
                                        style={{backgroundColor: "#e4a227", color: "white", border: "none",
                                            padding: "8px 16px", borderRadius: "4px", cursor: "pointer"}}
                                    >
                                        Edit item
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                    <h2 style={{ color: "#000000", marginBottom: "20px" }}>
                        Large Items
                    </h2>
                    <div
                        style={{flex: 1, overflowY: "auto", marginBottom: "20px"}}
                    >
                        {/*Headers */}
                        <div
                            style={{display: "flex", justifyContent: "space-between", fontWeight: "bold",
                                padding: "10px 0", borderBottom: "2px solid #ccc", marginBottom: "5px"}}
                        >
                            <div style={{ flex: 1, textAlign: "left" }}>Name</div>
                            <div style={{ flex: 1, textAlign: "center" }}>Amount</div>
                            <div style={{ flex: 1, textAlign: "right" }}></div>
                        </div>
                        {/*Large Item List */}
                        {this.state.largeItems.map((item) => (
                            <div
                                key={item[0]}
                                style={{display: "flex", justifyContent: "space-between", alignItems: "center",
                                    borderBottom: "1px solid #ddd", padding: "10px 0"}}
                            >
                                <div style={{flex: 1, textAlign: "left"}}>
                                    {item[1]}                                    
                                </div>
                                <div style={{flex: 1, textAlign: "center"}}>
                                    {item[2]}                                    
                                </div>

                                <div style={{flex: 1, textAlign: "right"}}>
                                    <button
                                        onClick={() => this.setState({open_modal: "edit", selectedItem: item, selectedSize: "small"})}
                                        style={{backgroundColor: "#e4a227", color: "white", border: "none",
                                            padding: "8px 16px", borderRadius: "4px", cursor: "pointer"}}
                                    >
                                        Edit item
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>

                    <div
                        style={{display: "flex",justifyContent: "flex-end", gap: "10px"}}>
                        

                        <button
                            onClick={() => this.setState({open_modal: "new"})}
                            style={{backgroundColor: "#35dc40", color: "white", border: "none",
                                padding: "8px 16px", borderRadius: "4px", cursor: "pointer"}}>
                            New Item
                        </button>

                        <button
                            onClick={this.props.onClose}
                            style={{backgroundColor: "#dc3545", color: "white", border: "none",
                                padding: "8px 16px", borderRadius: "4px", cursor: "pointer"}}>
                            Close
                        </button>
                    </div>
                    <NewItemModal
                        isOpen={this.state.open_modal === "new"}
                        onClose={() => {
                            this.setState({ open_modal: "none" });
                            this.fetchData();
                        }}
                    />

                    <EditItemModal
                        isOpen = {this.state.open_modal === "edit"}
                        item = {this.state.selectedItem}
                        size = {this.state.selectedSize}
                        onClose={() => {
                            this.setState({ open_modal: "none" });
                            this.fetchData();
                        }}
                    />
                </div>
                 
            </div>
           
                 
            

        )
    }
}

const styles = {



};



export default ItemManagementModal;