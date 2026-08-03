//Name, Max Occupancy, max large items. Decide linked rooms

import React from "react";

class NewRoomModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roomName: "",
            max_occupancy: 0,
            max_large: 0,
            error: ""
        };
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isOpen && this.props.isOpen) {
            this.setState({
                roomName: "",
                max_occupancy: 0,
                max_large: 0,
                error: ""
            });
        }
    }
    

    handleChange = (e) => {
        const { name, value } = e.target;

        this.setState({
            [name]: name === "max_occupancy" || name === "max_large"
                ? Number(value)
                : value
        });
    };

    

    addRoom = async (taskData) => {

        try {
            const response = await fetch("http://localhost:5000/room", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) {
                throw new Error("Failed to create room");
            }

            const result = await response.json();
            console.log("room created:", result);

        } catch (error) {
            console.log("Add room error:", error);
            throw error;
        }
    };

    

  
    handleSubmit = async() => {
            const {roomName, max_occupancy, max_large} = this.state;
            if(roomName == '')
            {
                this.setState({error: "Empty Field Detected"});
            }
            else if(max_occupancy <= 0 || max_large < 0)
            {
                this.setState({error: "Value too low"});
            }
            else
            {
                const data = {name: roomName, large_limit: max_large, capacity: max_occupancy};
                try {await this.addRoom(data);this.props.onClose();
                } catch (e) {this.setState({ error: "Failed to create room" });}
            }
            
        };

    render() {
        if (!this.props.isOpen) return null;

        return (
            <div style={styles.backdrop}>
                <div style={styles.modal}>
                    <h3 style={{ marginTop: 0 }}>Add New Room</h3>

                    <div style={styles.form}>
                        <div style={styles.field}>
                            <label style = {styles.label}>Room Name:</label>
                            <input name="roomName" placeholder="Room Name" onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Max Occupancy:</label>
                            <input type="number" name="max_occupancy" placeholder="0" onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Max Large Items:</label>
                            <input type="number" name="max_large" placeholder="0" onChange={this.handleChange} style={inputStyle} />
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


export default NewRoomModal;