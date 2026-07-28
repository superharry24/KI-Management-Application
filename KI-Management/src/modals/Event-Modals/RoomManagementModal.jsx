//Will have a list of all rooms with an edit button next to them, a create room button, and a close button


import React from "react";
import ConfirmPopup from "../ConfirmPopup";
import { json } from "react-router-dom";
import NewRoomModal from "./NewRoomModal";
class RoomManagementModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rooms: [],
            selectedRoom: null,
            open_modal: "none",
            times: []
        };
    }


    componentDidUpdate(prevProps) {
        if (this.props.isOpen && !prevProps.isOpen) {
            this.setState({    
                selectedRoom: null,
                open_modal: "none",
                times: this.props.times
            });
            this.fetchData()
            

        }
    }


    fetchData = async () => {
        try {
            const response = await fetch("http://localhost:5000/events");
            const data = await response.json();

            this.setState({
                rooms: data.rooms || [],                
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
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 99999
                }}
            >
                <div
                    style={{
                        
                        width: "800px",
                        maxWidth: "90vw",
                        height: "700px",
                        maxHeight: "90vh",
                        backgroundColor: "white",
                        borderRadius: "12px",
                        padding: "24px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <h2 style={{ color: "#000000", marginBottom: "20px" }}>
                        Rooms
                    </h2>

                    <div
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            marginBottom: "20px"
                        }}
                    >
                        {/*Headers */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontWeight: "bold",
                                padding: "10px 0",
                                borderBottom: "2px solid #ccc",
                                marginBottom: "5px"
                            }}
                        >
                            <div>Name</div>
                        </div>
                        {/*List */}
                        {this.state.rooms.map((room) => (
                            <div
                                key={room[0]}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderBottom: "1px solid #ddd",
                                    padding: "10px 0"
                                }}
                            >
                                <div>
                                    {room[1]}                                    
                                </div>

                                <div>
                                    <button
                                        onClick={() => this.setState({open_modal: "edit", selectedRoom: room})}
                                        style={{
                                            backgroundColor: "#e4a227",
                                            color: "white",
                                            border: "none",
                                            padding: "8px 16px",
                                            borderRadius: "4px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Edit room
                                    </button>

                                    <button
                                        onClick={() => this.setState({open_modal: "link", selectedRoom: room})}
                                        style={{
                                            backgroundColor: "#3540dc",
                                            color: "white",
                                            border: "none",
                                            padding: "8px 16px",
                                            borderRadius: "4px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Link Rooms
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "10px"
                        }}
                    >
                        

                        <button
                            onClick={() => this.setState({open_modal: "new"})}
                            style={{
                                backgroundColor: "#35dc40",
                                color: "white",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            New Room
                        </button>

                        <button
                            onClick={this.props.onClose}
                            style={{
                                backgroundColor: "#dc3545",
                                color: "white",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            Close
                        </button>
                    </div>
                    <NewRoomModal
                        isOpen={this.state.open_modal === "new"}
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



export default RoomManagementModal;