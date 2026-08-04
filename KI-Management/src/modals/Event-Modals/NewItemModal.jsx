//Sets name, amount on hand, and chooses whether item is large or small.
import React from "react";

class NewItemModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            itemName: "",
            amount: 0,
            size: "",
            error: ""
        };
    }


    componentDidUpdate(prevProps) {
        if (!prevProps.isOpen && this.props.isOpen) {
            this.setState({
                itemName: "",
                amount: 0,
                size: "",
                error: ""
            });
        }
    }
    

    handleChange = (e) => {
        const { name, value } = e.target;

        this.setState({
            [name]: name === "amount"
                ? Number(value)
                : value
        });
    };

    

    addItem = async (itemData) => {
        if(this.state.size == "small")
        {
            try {
                const response = await fetch("http://localhost:5000/chair", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(itemData)
                });

                if (!response.ok) {
                    throw new Error("Failed to create small item");
                }

                const result = await response.json();
                console.log("small item created:", result);

            } catch (error) {
                console.log("Add small item error:", error);
                throw error;
            }
        }
        else if(this.state.size == "large")
        {
            try {
                const response = await fetch("http://localhost:5000/table", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(itemData)
                });

                if (!response.ok) {
                    throw new Error("Failed to create large item");
                }

                const result = await response.json();
                console.log("large item created:", result);

            } catch (error) {
                console.log("Add large item error:", error);
                throw error;
            }
        }
    };

    

  
    handleSubmit = async() => {
            const {itemName, amount} = this.state;
            if(itemName == '' || this.state.size == "")
            {
                this.setState({error: "Empty Field Detected"});
            }
            else if(amount <= 0)
            {
                this.setState({error: "Value too low"});
            }
            else
            {
                const data = {name: itemName, amount};
                try {await this.addItem(data);this.props.onClose();
                } catch (e) {this.setState({ error: "Failed to create item" });}
            }
            
        };

    render() {
        if (!this.props.isOpen) return null;

        return (
            <div style={styles.backdrop}>
                <div style={styles.modal}>
                    <h3 style={{ marginTop: 0 }}>Add New Item</h3>

                    <div style={styles.form}>
                        <div style={styles.field}>
                            <label style = {styles.label}>Item Name:</label>
                            <input name="itemName" placeholder="Item Name" onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Current Amount:</label>
                            <input type="number" name="amount" placeholder="0" onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Item Size:</label>
                            <select
                                name="size"
                                value={this.state.size}
                                onChange={this.handleChange}
                                style={{width: "100%", padding: "8px", marginTop: "4px", backgroundColor: "white",
                                    color: "black", border: "1px solid #ccc", borderRadius: "4px"}}>
                                <option value={""}></option>
                                <option value={"small"}>Small</option>
                                <option value={"large"}>Large</option>
                            </select>
                        </div>
                        
                    </div>

                    {this.state.error && (
                        <div style={{ color: "red", marginBottom: "8px" }}>
                            {this.state.error}
                        </div>
                    )}
                    <div style={styles.actions}>
                        <button onClick={this.props.onClose} style={styles.cancel}>
                            Cancel
                        </button>

                        <button onClick={this.handleSubmit} style={styles.submit}>
                            Submit
                        </button>                        
                    </div>
                </div>
            </div>
        );
    }
}

const styles = {
    backdrop: {position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center",
        alignItems: "center", zIndex: 1000},
    modal: {width: "450px", maxWidth: "90%", backgroundColor: "#2f2f2f", borderRadius: "8px",
        padding: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.3)"},
    form: {display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px"},
    actions: {display: "flex", justifyContent: "space-between", gap: "8px"},
    submit: {flex: 1, background: "#4caf50", color: "white", border: "none", padding: "6px", borderRadius: "4px",
        cursor: "pointer"},
    cancel: {flex: 1, background: "#f44336", color: "white", border: "none",
        padding: "6px", borderRadius: "4px", cursor: "pointer"},
    field: {display: "flex", flexDirection: "column", gap: "2px"},
    label: {color: "white", fontSize: "14px", textAlign: "left", marginBottom: "2px"}
    


};

const inputStyle = {backgroundColor: "#f0f4ff", border: "1px solid #4a90e2",
    borderRadius: "4px", padding: "6px", color: "#333"};


export default NewItemModal;