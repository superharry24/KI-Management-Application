import React from "react";

class EditItemModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            itemName: "",
            category: "",
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
        if (this.props.isOpen && !prevProps.isOpen && this.props.item) {
            this.setState({
                itemName: this.props.item[1],
                category: this.props.item[3],
                orderLevel: this.props.item[5],
                unitSize: this.props.item[6],
                unitCost: this.props.item[7],
                location: this.props.item[9],
                supplier: this.props.item[10],
                sku: this.props.item[11],
                description: this.props.item[8] || "",
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
            const {itemName, category, orderLevel, unitSize, unitCost, location, supplier, sku, description} = this.state;
            if(itemName == '' || category == '' || orderLevel < 0 || unitSize <=0 || unitCost == ''|| location == '' || supplier == '' || sku == '' || description == '')
            {
                this.setState({
                    error: "Empty Field Detected"
                });
            }
            else
            {
                const data = {
                itemName, category, orderLevel: Number(orderLevel), unitSize, unitCost: Number(unitCost), location, supplier, sku, description};

                this.props.onSubmit(data);
                this.props.onClose();
            }
            
        };

    

    render() {
        if (!this.props.isOpen) return null;

        return (
            <div style={styles.backdrop}>
                <div style={styles.modal}>
                    <h3 style={{ marginTop: 0 }}>Edit Current Item</h3>

                    <div style={styles.form}>
                        <div style={styles.field}>
                            <label style = {styles.label}>Item Name:</label>
                            <input name="itemName" placeholder="Item Name" value={this.state.itemName} onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Category:</label>
                            <input name="category" placeholder="Category" value={this.state.category} onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Order Level:</label>
                            <input type="number" name="orderLevel" placeholder="Order Level" value={this.state.orderLevel} onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Unit Size:</label>
                            <input name="unitSize" placeholder="Unit Size" value={this.state.unitSize} onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Unit Cost:</label>
                            <input type="number" name="unitCost" placeholder="Unit Cost" value={this.state.unitCost} onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Location:</label>
                            <input name="location" placeholder="Location" value={this.state.location} onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Supplier:</label>
                            <input name="supplier" placeholder="Supplier" value={this.state.supplier} onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>SKU:</label>
                            <input name="sku" placeholder="SKU" value={this.state.sku} onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Description:</label>
                            <input name="description" placeholder="Description" value={this.state.description} onChange={this.handleChange} style={inputStyle} />
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
    backdrop: {width: "100%", display: "flex", justifyContent: "center", marginTop: "10px"},
    modal: {width: "100%", background: "transparent", border: "transparent",
        borderRadius: "8px", boxShadow: "transparent", padding: "12px"},
    form: {display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px"},
    actions: {display: "flex", justifyContent: "space-between", gap: "8px"},
    submit: {flex: 1, background: "#4caf50", color: "white", border: "none",
        padding: "6px", borderRadius: "4px", cursor: "pointer"},
    cancel: {flex: 1, background: "#f44336", color: "white", border: "none",
        padding: "6px", borderRadius: "4px", cursor: "pointer"},
    field: {display: "flex", flexDirection: "column", gap: "2px"},
    label: {color: "white", fontSize: "14px", textAlign: "left", marginBottom: "2px"}
};

const inputStyle = {backgroundColor: "#f0f4ff", border: "1px solid #4a90e2",
    borderRadius: "4px", padding: "6px", color: "#333"};

export default EditItemModal;