import React from "react";

class DecreaseItemModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: "",
            amount: 0
        };
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isOpen && this.props.isOpen) {
            this.setState({
                amount: 0,
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
            const {amount} = this.state;
            const numAmount = Number(amount);
            if (isNaN(numAmount)) {
                this.setState({
                    error: "Please enter a valid number"
                });
            }
            else if(numAmount == 0)
            {
                this.setState({
                    error: "Cannot change by zero"
                });
            }
            else if(numAmount < 0)
            {
                this.setState({
                    error: "Cannot input negative number"
                });
            }
            else
            {
                const data = {amount: numAmount,};

                this.props.onSubmit(data);
                this.props.onClose();
            }
            
        };

    render() {
        if (!this.props.isOpen) return null;

        return (
            <div style={styles.backdrop}>
                <div style={styles.modal}>
                    <h3 style={{ marginTop: 0 }}>Decrease Item Amount</h3>

                    <div style={styles.form}>
                        <input
                        type="number"
                        name="amount"
                        value={this.state.amount}
                        onChange={this.handleChange}
                        style={inputStyle}
                    />
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

export default DecreaseItemModal;