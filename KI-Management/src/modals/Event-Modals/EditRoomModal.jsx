//Name, Max Occupancy, max large items. Decide linked rooms

import React from "react";
import ConfirmPopup from "../ConfirmPopup";

class EditRoomModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roomName: "",
            room_id: "",
            max_occupancy: 0,
            max_large: 0,
            deleting: false,
            error: ""
        };
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isOpen && this.props.isOpen) {
            this.setState({
                roomName: this.props.room[1],
                room_id: this.props.room[0],
                max_occupancy: this.props.room[2],
                max_large: this.props.room[3],
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

    

    editRoom = async (roomData) => {

        try {
            const response = await fetch("http://localhost:5000/room", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(roomData)
            });

            if (!response.ok) {
                throw new Error("Failed to edit room");
            }

            const result = await response.json();
            console.log("room edited:", result);

        } catch (error) {
            console.log("Edit room error:", error);
            throw error;
        }
    };

    deleteRoom = async() => {
        try {
            const response = await fetch("http://localhost:5000/room", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    room_id: this.state.room_id
                })
            });

            if (!response.ok) {
                throw new Error("Failed to delete room");
            }

            const result = await response.json();
            console.log("room deleted:", result);

        } catch (error) {
            console.log("Delele room error:", error);
            throw error;
        }
        
    }

    

  
    handleSubmit = async() => {
            const {room_id, roomName, max_occupancy, max_large} = this.state;
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
                const data = {room_id, name: roomName, large_limit: max_large, capacity: max_occupancy};
                try {await this.editRoom(data);this.props.onClose();
                } catch (e) {this.setState({ error: "Failed to edit room" });}
            }
            
        };

    render() {
        if (!this.props.isOpen) return null;

        return (
            <div style={styles.backdrop}>
                <div style={styles.modal}>
                    <h3 style={{ marginTop: 0 }}>Edit Room</h3>

                    <div style={styles.form}>
                        <div style={styles.field}>
                            <label style = {styles.label}>Room Name:</label>
                            <input name="roomName" placeholder="Room Name" value={this.state.roomName} onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Max Occupancy:</label>
                            <input type="number" name="max_occupancy" placeholder="0" value={this.state.max_occupancy} onChange={this.handleChange} style={inputStyle} />
                        </div>
                        <div style={styles.field}>
                            <label style = {styles.label}>Max Large Items:</label>
                            <input type="number" name="max_large" placeholder="0" value={this.state.max_large} onChange={this.handleChange} style={inputStyle} />
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

                        <button onClick={() => this.setState({ deleting: true })} style={styles.delete}>
                            Delete
                        </button>

                        <button onClick={this.handleSubmit} style={styles.submit}>
                            Submit
                        </button>                        
                    </div>
                </div>

                <ConfirmPopup
                    isOpen={this.state.deleting}
                    onSubmit={async () => {
                                await this.deleteRoom();
                                this.props.onClose();
                            }}
                    header= "Delete Room?"
                    message= "Are you sure you want to delete this room? (This will delete any events tied to this room)"
                    onClose={() => this.setState({ deleting: false })}
                />
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
    cancel: {flex: 1, background: "#000000", color: "white", border: "none", padding: "6px", borderRadius: "4px",
        cursor: "pointer"},
    delete: {flex: 1, background: "#f44336", color: "white", border: "none",
        padding: "6px", borderRadius: "4px", cursor: "pointer"},
    field: {display: "flex", flexDirection: "column", gap: "2px"},
    label: {color: "white", fontSize: "14px", textAlign: "left", marginBottom: "2px"}
    


};

const inputStyle = {backgroundColor: "#f0f4ff", border: "1px solid #4a90e2",
    borderRadius: "4px", padding: "6px", color: "#333"};


export default EditRoomModal;