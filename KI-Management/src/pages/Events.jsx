import React from "react";
import { useNavigate, Navigate } from "react-router-dom";

class Events extends React.Component {
    constructor(props) {
        super(props);
        const user = JSON.parse(localStorage.getItem("user"));
        this.dateInput = React.createRef();

        this.state = {
            userID: user?.id || 0,
            admin: user?.admin || false,

            //event info
            events: [],
            rooms: [],
            overlaps: [],
            largeI: [],
            smallI: [],
            largeE: [],
            smallE: [],

            curDate: null,
            viewDate: null,

            openModal: "none"
        }

    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        try {
            const response = await fetch("http://localhost:5000/events");
            const data = await response.json();

            const today = new Date().toISOString().split("T")[0];

            this.setState({
                events: data.events || [],
                rooms: data.rooms || [],
                overlaps: data.overlaps || [],
                largeI: data.large || [],
                smallI: data.small || [],
                largeE: data.large_assign || [],
                smallE: data.small_assign || [],
                curDate: today,
                viewDate: today,
                openModal: "none",
            });
            
            return data.events;

        } catch (error) {
            console.log(error);
            return[];
        }
    };

    render() {
        if (this.state.userID === 0) {
            return <Navigate to="/login" replace />;
        }

        // Example time slots
        const times = [
            "9:00", "9:30", "10:00", "10:30", "11:00",
            "11:30", "12:00", "12:30", "1:00", "1:30", "2:00","2:30",  "3:00", "3:30",
            "4:00", "4:30", "5:00", "5:30", "6:00", "6:30", "7:00", "7:30", "8:00", "8:30", "9:00"
        ];

        return (
            
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "40px"}}>
                <div style={{flexDirection: "row", display: "flex"}}>
                    <button
                            style={{
                                padding: "10px",
                                marginBottom: "12px",
                                cursor: "pointer",
                                backgroundColor: "#5563ff",
                                color: "black",
                                border: "none",
                                borderRadius: "4px",
                                boxSizing: "border-box"
                            }}
                            onClick={() => this.setState({openModal: "rooms"})}
                        >
                            Manage Rooms
                    </button>

                    <button
                            style={{
                                padding: "10px",
                                marginBottom: "12px",
                                cursor: "pointer",
                                backgroundColor: "#3fff1d",
                                color: "black",
                                border: "none",
                                borderRadius: "4px",
                                boxSizing: "border-box"
                            }}
                            onClick={() => this.setState({openModal: "items"})}
                        >
                            Manage Items
                    </button>

                    <button
                            style={{
                                padding: "10px",
                                marginBottom: "12px",
                                cursor: "pointer",
                                backgroundColor: "#ecff1d",
                                color: "black",
                                border: "none",
                                borderRadius: "4px",
                                boxSizing: "border-box"
                            }}
                            onClick={() => this.setState({openModal: "newEvent"})}
                        >
                            New Event
                    </button>
                </div>
                <div style={{position: "relative", width: "100%", marginBottom: "20px",
                        fontSize: "20px", fontWeight: "bold"}}>

                    <div style={{ textAlign: "center" }}>
                        {this.state.viewDate}
                    </div>

                    <div style={{position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
                            width: "30px", height: "30px"}}>
                        <div
                            onClick={() => this.dateInput.current?.showPicker()}
                            style={{position: "absolute", right: 0, top: "50%",
                                transform: "translateY(-50%)", width: 30, height: 30, display: "flex",
                                alignItems: "center", justifyContent: "center", cursor: "pointer"}}
                        >
                            📅
                        </div>

                        <input
                            ref={this.dateInput}
                            type="date"
                            value={this.state.viewDate || ""}
                            onChange={(e) => this.setState({ viewDate: e.target.value })}
                            style={{position: "absolute", opacity: 0, width: 0,
                                height: 0, pointerEvents: "none"}}
                        />
                    </div>
                </div>

                <div
                    style={{border: "1px solid black", padding: "15px", backgroundColor: "#f5f5f5", overflowX: "auto", fontSize: 13}}
                >
                    {/* Header Row */}
                    <div
                        style={{display: "grid", gridTemplateColumns: `50px repeat(${times.length}, 40px)`,
                            fontWeight: "bold", marginBottom: "10px"}}
                    >
                        <div>Room</div>
                        {times.map((time, i) => (
                            <div
                                key={i}
                                style={{textAlign: "center"}}
                            >
                                {time}
                            </div>
                        ))}
                    </div>

                    {/* Room Rows */}
                    {this.state.rooms.map((room, roomIndex) => (
                        <div
                            key={roomIndex}
                            style={{display: "grid", gridTemplateColumns: `150px repeat(${times.length}, 80px)`, marginBottom: "4px"}}
                        >
                            {/* Room Name */}
                            <div
                                style={{display: "flex", alignItems: "center",
                                    paddingLeft: "5px", fontWeight: "bold"}}
                            >
                                {room[1]}
                            </div>

                            {/* Time Cells */}
                            {times.map((time, timeIndex) => {
                                // Leave event condition blank for now
                                const hasEvent = /* condition */ false;

                                return (
                                    <div
                                        key={timeIndex}
                                        style={{height: "40px", border: "1px solid #ccc", backgroundColor: hasEvent ? "red" : "white"}}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}


export default Events;