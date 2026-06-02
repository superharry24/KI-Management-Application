import React from "react";

class AddItemModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            itemName: "",
            category: "",
            currentAmount: "",
            orderLevel: "",
            unitSize: "",
            unitCost: "",
            location: "",
            supplier: "",
            sku: "",
            description: "",
            error: ""
        };
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isOpen && this.props.isOpen) {
            this.setState({
                itemName: "",
                category: "",
                currentAmount: "",
                orderLevel: "",
                unitSize: "",
                unitCost: "",
                location: "",
                supplier: "",
                sku: "",
                description: "",
                error: ""
            });
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };


  
    handleSubmit = () => {
            const {itemName, category, currentAmount, orderLevel, unitSize, unitCost, location, supplier, sku, description} = this.state;
            if(itemName == '' || category == '' || currentAmount < 0 || orderLevel < 0 || unitSize == '' || unitCost < 0 || location == '' || supplier == '' || sku == '' || description == '')
            {
                this.setState({
                    error: "Empty Field Detected"
                });
            }
            else
            {
                const data = {
                itemName, category, currentAmount: Number(currentAmount), orderLevel: Number(orderLevel),  unitSize, unitCost: Number(unitCost), location, supplier, sku, description};

                this.props.onSubmit(data);
                this.props.onClose();
            }
            
        };

    render() {
        if (!this.props.isOpen) return null;

        return (
            <div style={styles.backdrop}>
                <div style={styles.modal}>
                    <h3 style={{ marginTop: 0 }}>Add New Item</h3>

                    <div style={styles.form}>
                        <input name="itemName" placeholder="Item Name" onChange={this.handleChange} style={inputStyle} />
                        <input name="category" placeholder="Category" onChange={this.handleChange} style={inputStyle} />
                        <input name="currentAmount" placeholder="Current Amount" onChange={this.handleChange} style={inputStyle} />
                        <input name="orderLevel" placeholder="Order Level" onChange={this.handleChange} style={inputStyle} />
                        <input name="unitSize" placeholder="Unit Size" onChange={this.handleChange} style={inputStyle} />
                        <input name="unitCost" placeholder="Unit Cost" onChange={this.handleChange} style={inputStyle} />
                        <input name="location" placeholder="Location" onChange={this.handleChange} style={inputStyle} />
                        <input name="supplier" placeholder="Supplier" onChange={this.handleChange} style={inputStyle} />
                        <input name="sku" placeholder="SKU" onChange={this.handleChange} style={inputStyle} />
                        <input name="description" placeholder="Description" onChange={this.handleChange} style={inputStyle} />
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
    backdrop: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "10px"
    },
    modal: {
        width: "100%",
        background: "transparent",
        border: "transparent",
        borderRadius: "8px",
        boxShadow: "transparent",
        padding: "12px"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        marginBottom: "10px"
    },
    actions: {
        display: "flex",
        justifyContent: "space-between",
        gap: "8px"
    },
    submit: {
        flex: 1,
        background: "#4caf50",
        color: "white",
        border: "none",
        padding: "6px",
        borderRadius: "4px",
        cursor: "pointer"
    },
    cancel: {
        flex: 1,
        background: "#f44336",
        color: "white",
        border: "none",
        padding: "6px",
        borderRadius: "4px",
        cursor: "pointer"
    }

};

const inputStyle = {
    backgroundColor: "#f0f4ff",
    border: "1px solid #4a90e2",
    borderRadius: "4px",
    padding: "6px",
    color: "#333"
};

export default AddItemModal;