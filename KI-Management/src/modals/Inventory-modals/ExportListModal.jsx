import React from "react";

class ExportListModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {            
            format: "PDF"
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.isOpen && !prevProps.isOpen) {
            this.setState({
                format: "PDF"
            });
        }
    }



  
    handleSubmit = () => {
        const data = {format: this.state.format,};

        this.props.onSubmit(data);
        this.props.onClose();
                        
    };

    render() {
        if (!this.props.isOpen) return null;

        return (
            <div style={styles.backdrop}>
                <div style={styles.modal}>
                    <h3 style={{ marginTop: 0 }}>Export Current Inventory List? (This uses the same list to the left)</h3>
                    <div>
                        <label>Format</label>

                        <select
                        value={this.state.format}
                        onChange={(e) => this.setState({
                                format: e.target.value
                            })}
                        style={{width: "100%", padding: "8px", marginTop: "4px"}}
                        >
                        <option value="PDF">PDF</option>
                        <option value="Excel">Excel</option>
                        </select>
                    </div>


                    <div style={styles.actions}>
                        <button onClick={this.props.onClose} style={styles.cancel}>
                            Cancel
                        </button>

                        <button onClick={this.handleSubmit} style={styles.submit}>
                            Export
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

export default ExportListModal;