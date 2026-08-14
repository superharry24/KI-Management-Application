
import React from "react";
import ConfirmPopup from "../ConfirmPopup";
import { json } from "react-router-dom";

class LinkRoomsModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            linkedRooms: [],
            unlinkedRooms: [],
            rooms: [],
            room: null,
            selected_room: null,
            open_modal: "none"
        };
    }


    componentDidUpdate(prevProps) {
        if (this.props.isOpen && !prevProps.isOpen) {
            this.setState({
                linkedRooms: [],
                unlinkedRooms: [],
                rooms: this.props.rooms,
                room: this.props.room,
                selected_room: null,
                open_modal: "none"
            }, () => {
                this.fetchData();
            });        
        }
    }


    LinkRoom = async () => {

        try {
            const response = await fetch("http://localhost:5000/overlap", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    room_id: this.state.room[0],
                    other_id: this.state.selected_room[0]
                })
            });

            if (!response.ok) {
                throw new Error("Failed to link room");
            }

            const result = await response.json();
            console.log("rooms linked:", result);

        } catch (error) {
            console.log("Link room error:", error);
            throw error;
        }
    };

    UnlinkRoom = async () => {

        try {
            const response = await fetch("http://localhost:5000/overlap", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    room_id: this.state.room[0],
                    other_id: this.state.selected_room[0]
                })
            });

            if (!response.ok) {
                throw new Error("Failed to unlink room");
            }

            const result = await response.json();
            console.log("rooms unlinked:", result);

        } catch (error) {
            console.log("Unlink room error:", error);
            throw error;
        }
    };
    

    fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/overlap?room=${encodeURIComponent(this.state.room[0])}`)
            const data = await response.json();
            const linked_ids = data.linked;
            const linkedIdSet = new Set(linked_ids.map(Number));

            const linked = this.state.rooms.filter(room =>
                linkedIdSet.has(Number(room[0]))
            );

            const unlinked = this.state.rooms.filter(room =>
                Number(room[0]) !== Number(this.state.room[0]) &&
                !linkedIdSet.has(Number(room[0]))
            );
            this.setState({
                linkedRooms: linked || [],    
                unlinkedRooms: unlinked || [],            
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
                        boxShadow: "0 4px 20px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column"}}>
                    <h2 style={{ color: "#000000", marginBottom: "20px" }}>
                        Current Linked Rooms For {this.props.room[1]}
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
                            <div style={{ flex: 1, textAlign: "center" }}></div>
                            <div style={{ flex: 1, textAlign: "right" }}></div>
                        </div>
                        
                        {/*Linked Room List */}
                        {this.state.linkedRooms.map((room) => (
                            <div
                                key={room[0]}
                                style={{display: "flex", justifyContent: "space-between", alignItems: "center",
                                    borderBottom: "1px solid #ddd", padding: "10px 0"}}
                            >
                                <div style={{flex: 1, textAlign: "left"}}>
                                    {room[1]}                                    
                                </div>
                                <div style={{flex: 1, textAlign: "center"}}>                               
                                </div>

                                <div style={{flex: 1, textAlign: "right"}}>
                                    <button
                                        onClick={() => this.setState({open_modal: "unlink", selected_room: room})}
                                        style={{backgroundColor: "#2727e4", color: "white", border: "none",
                                            padding: "8px 16px", borderRadius: "4px", cursor: "pointer"}}
                                    >
                                        Unlink
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                    <h2 style={{ color: "#000000", marginBottom: "20px" }}>
                        Other Rooms
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
                            <div style={{ flex: 1, textAlign: "center" }}></div>
                            <div style={{ flex: 1, textAlign: "right" }}></div>
                        </div>
                        {/*Other Rooms List */}
                        {this.state.unlinkedRooms.map((room) => (
                            <div
                                key={room[0]}
                                style={{display: "flex", justifyContent: "space-between", alignItems: "center",
                                    borderBottom: "1px solid #ddd", padding: "10px 0"}}
                            >
                                <div style={{flex: 1, textAlign: "left"}}>
                                    {room[1]}                                    
                                </div>
                                <div style={{flex: 1, textAlign: "center"}}>                                 
                                </div>

                                <div style={{flex: 1, textAlign: "right"}}>
                                    <button
                                        onClick={() => this.setState({open_modal: "link", selected_room: room})}
                                        style={{backgroundColor: "#2727e4", color: "white", border: "none",
                                            padding: "8px 16px", borderRadius: "4px", cursor: "pointer"}}
                                    >
                                        Link
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>

                    <div
                        style={{display: "flex", justifyContent: "flex-end", gap: "10px"}}
                    >
                        
                        <button
                            onClick={this.props.onClose}
                            style={{backgroundColor: "#dc3545", color: "white", border: "none",
                                padding: "8px 16px", borderRadius: "4px", cursor: "pointer"}}>
                            Close
                        </button>
                    </div>
                    <ConfirmPopup
                        isOpen={this.state.open_modal == "link"}
                        onSubmit={async () => {
                                    await this.LinkRoom();
                                }}
                        header= "Link Rooms?"
                        message= "Are you sure you want to link these rooms? (The primary room will be unavailable when the linked room is unavailable, and vice versa)"
                        onClose={() => {this.setState({ open_modal: "none" }); this.fetchData()}}
                    />
                    <ConfirmPopup
                        isOpen={this.state.open_modal == "unlink"}
                        onSubmit={async () => {
                                    await this.UnlinkRoom();
                                }}
                        header= "Unink Rooms?"
                        message= "Are you sure you want to unlink these rooms?"
                        onClose={() => {this.setState({ open_modal: "none" }); this.fetchData()}}
                    />
                </div>
                 
            </div>
           
                 
            

        )
    }
}


export default LinkRoomsModal;