import React from "react";
import ConfirmPopup from "../ConfirmPopup";

class ChangeStatusModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            cur_status: -1,
            open_confirm: "none",
            error: ""
        };
    }


 

    componentDidUpdate(prevProps) {
        if (!prevProps.isOpen && this.props.isOpen && this.props.task) {
            console.log("Status:", this.props.task[12]);
            this.setState({
                id: this.props.task[0],
                cur_status: this.props.task[12],
                open_confirm: "none",
                error: ""
            });
        }
    }

  

    updateStatus = async(status) => {
        try {
            const response = await fetch("http://localhost:5000/tasks", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    task_id: this.state.id,
                    type: 1,
                    status: status
                })
            });

            if (!response.ok) {
                throw new Error("Failed to change status");
            }

            const result = await response.json();
            console.log("status changed:", result);

        } catch (error) {
            console.log("Change Status Error:", error);
            throw error;
        }
        
    }

    

    render() {
        if (!this.props.isOpen) return null;

        return (
            <div style={styles.backdrop}>
                {this.state.cur_status == 0 &&
                (<div><div style={styles.modal}>
                    <h3 style={{ marginTop: 0 }}>Staff must be assigned to this task in order to change the status. This message should not be appearing, please report it if you see it.</h3>         
                    </div>
                    <div style={styles.actions}>
                           
                </div></div>)}

                {this.state.cur_status == 1 &&
                (<div><div style={styles.modal}>
                    <h3 style={{ marginTop: 0 }}>Mark task as "In Progress"?</h3>         
                    </div>
                    <div style={styles.actions}>
                        <button onClick={this.props.onClose} style={styles.cancel}>
                            Cancel
                        </button>

                        <button onClick={() => this.setState({open_confirm: "assigned"})} style={styles.submit}>
                            Confirm
                        </button>    
                </div></div>)}


                {this.state.cur_status == 2 &&
                (<div><div style={styles.modal}>
                    <h3 style={{ marginTop: 0 }}>Mark task as "Complete"?</h3>         
                    </div>
                    <div style={styles.actions}>
                        <button onClick={this.props.onClose} style={styles.cancel}>
                            Cancel
                        </button>

                        <button onClick={() => this.setState({open_confirm: "progress"})} style={styles.submit}>
                            Confirm
                        </button>    
                </div></div>)}

                {this.state.cur_status === 3 &&
                (<div><div style={styles.modal}>
                    <h3 style={{ marginTop: 0 }}>Placeholder</h3>         
                    </div>
                    <div style={styles.actions}>
                        <button onClick={this.props.onClose} style={styles.cancel}>
                            Cancel
                        </button>

                        <button onClick={() => this.setState({open_confirm: "complete"})} style={styles.submit}>
                            Confirm
                        </button>    
                </div></div>)}

                <ConfirmPopup
                    isOpen={this.state.open_confirm === "assigned"}
                    onSubmit={async () => {
                                await this.updateStatus(2);
                                this.props.onClose();
                            }}
                    header= "Change to in progress?"
                    message= "Are you sure you want to mark this task as in progress"
                    onClose={() => this.setState({ open_confirm: "none"})}
                />

                <ConfirmPopup
                    isOpen={this.state.open_confirm === "progress"}
                    onSubmit={async () => {
                                await this.updateStatus(3);
                                this.props.onClose();
                            }}
                    header= "Change to complete?"
                    message= "Are you sure you want to mark this task as complete"
                    onClose={() => this.setState({ open_confirm: "none"})}
                />
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
        background: "#000000",
        color: "white",
        border: "none",
        padding: "6px",
        borderRadius: "4px",
        cursor: "pointer"
    }


};


export default ChangeStatusModal;